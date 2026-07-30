import { NATURAL_SPEECH_URL, SUPABASE_ANON_KEY } from "./config.js";
import { getSettings, normalizeAnswerText } from "./store.js";

const AUDIO_CACHE_LIMIT = 24;
const remoteAudioCache = new Map();
let activeAudio = null;
let activeRequest = null;
let requestGeneration = 0;
let activeRecognition = null;
let activeRecognitionFinish = null;
let feedbackAudioContext = null;

const report = (callback, phase, messageEn, messageJa, extra = {}) => {
  if (typeof callback === "function") {
    callback({ phase, messageEn, messageJa, ...extra });
  }
};

const cacheAudio = (key, source) => {
  if (remoteAudioCache.has(key)) {
    URL.revokeObjectURL(remoteAudioCache.get(key));
    remoteAudioCache.delete(key);
  }
  remoteAudioCache.set(key, source);
  while (remoteAudioCache.size > AUDIO_CACHE_LIMIT) {
    const [oldestKey, oldestSource] = remoteAudioCache.entries().next().value;
    URL.revokeObjectURL(oldestSource);
    remoteAudioCache.delete(oldestKey);
  }
};

const cancelPlayingAudio = () => {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.removeAttribute("src");
    activeAudio.load();
    activeAudio = null;
  }
};

export function stopAudio() {
  requestGeneration += 1;
  if (activeRequest) {
    activeRequest.abort();
    activeRequest = null;
  }
  if (typeof window !== "undefined") cancelPlayingAudio();
}

const playBlobSource = (source, onStatus, token, rate = 1) => new Promise((resolve, reject) => {
  if (token !== requestGeneration) {
    resolve({ played: false, cancelled: true });
    return;
  }
  cancelPlayingAudio();
  const audio = new Audio(source);
  audio.playbackRate = [0.5, 1, 1.5].includes(Number(rate)) ? Number(rate) : 1;
  audio.preservesPitch = true;
  activeAudio = audio;
  audio.onplaying = () => report(
    onStatus,
    "playing",
    `Playing natural voice at ${audio.playbackRate}×…`,
    `自然な音声を${audio.playbackRate}倍速で再生中です。`,
    { source: "edge", rate: audio.playbackRate },
  );
  audio.onended = () => {
    if (activeAudio === audio) activeAudio = null;
    report(onStatus, "ready", "Ready to play again.", "もう一度再生できます。", { source: "edge" });
    resolve({ played: true, source: "edge" });
  };
  audio.onerror = () => {
    if (activeAudio === audio) activeAudio = null;
    reject(new Error("The natural audio could not be played."));
  };
  audio.play().catch(reject);
});

const looksJapanese = (text) => /[\u3040-\u30ff\u3400-\u9fff]/u.test(text);

export async function speakText(text, { voice, language, onStatus } = {}) {
  const cleanText = String(text ?? "").trim();
  const settings = getSettings();
  const voiceCode = language === "ja" || (!language && looksJapanese(cleanText))
    ? "ja"
    : (voice === "gb" || (!voice && settings.voice === "gb") ? "gb" : "us");
  if (!cleanText) {
    report(onStatus, "error", "There is no sentence to play.", "再生する英文がありません。");
    return { played: false, reason: "empty" };
  }
  if (!settings.sound) {
    report(onStatus, "error", "Sound is off. Turn it on in the header.", "音声がオフです。ヘッダーでオンにしてください。");
    return { played: false, reason: "sound-off" };
  }

  stopAudio();
  const token = requestGeneration;
  const cacheKey = `${voiceCode}:${cleanText.normalize("NFKC").toLocaleLowerCase()}`;
  try {
    let source = remoteAudioCache.get(cacheKey);
    if (!source && NATURAL_SPEECH_URL && SUPABASE_ANON_KEY && typeof fetch === "function") {
      const voiceName = voiceCode === "ja" ? "Nanami" : voiceCode === "gb" ? "Libby" : "Ava";
      report(
        onStatus,
        "loading",
        `Preparing ${voiceName} natural voice…`,
        `${voiceName}の自然な音声を準備中です。`,
        { source: "edge", voice: voiceCode },
      );
      const controller = new AbortController();
      activeRequest = controller;
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(NATURAL_SPEECH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ text: cleanText, accent: voiceCode }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Natural speech request failed (${response.status}).`);
        const blob = await response.blob();
        if (!blob.type.startsWith("audio/")) throw new Error("Natural speech returned an invalid audio file.");
        source = URL.createObjectURL(blob);
        cacheAudio(cacheKey, source);
      } finally {
        clearTimeout(timeout);
        if (activeRequest === controller) activeRequest = null;
      }
    }
    if (source && token === requestGeneration) {
      return await playBlobSource(source, onStatus, token, settings.playbackRate);
    }
  } catch (error) {
    if (error?.name === "AbortError" && token !== requestGeneration) {
      return { played: false, cancelled: true };
    }
    report(
      onStatus,
      "error",
      "Natural voice is temporarily unavailable. No computer voice will be used. Please try again.",
      "自然な音声を一時的に利用できません。機械音声には切り替えません。もう一度お試しください。",
      { error: error?.message || String(error) },
    );
  }
  return { played: false, reason: "natural-voice-unavailable" };
}

export function playAnswerFeedback(correct) {
  if (!getSettings().sound) return { played: false, reason: "sound-off" };
  const AudioContext = typeof window !== "undefined"
    ? (window.AudioContext || window.webkitAudioContext)
    : null;
  if (!AudioContext) return { played: false, reason: "unsupported" };

  try {
    feedbackAudioContext ||= new AudioContext();
    if (feedbackAudioContext.state === "suspended") {
      feedbackAudioContext.resume().catch(() => {});
    }
    const startAt = feedbackAudioContext.currentTime + 0.01;
    const notes = correct
      ? [
        { frequency: 659, offset: 0, duration: 0.1 },
        { frequency: 880, offset: 0.1, duration: 0.1 },
        { frequency: 1318, offset: 0.2, duration: 0.16 },
      ]
      : [
        { frequency: 270, offset: 0, duration: 0.15 },
        { frequency: 180, offset: 0.14, duration: 0.2 },
      ];

    notes.forEach(({ frequency, offset, duration }) => {
      const oscillator = feedbackAudioContext.createOscillator();
      const gain = feedbackAudioContext.createGain();
      const noteStart = startAt + offset;
      const noteEnd = noteStart + duration;
      oscillator.type = correct ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(correct ? 0.075 : 0.065, noteStart + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
      oscillator.connect(gain);
      gain.connect(feedbackAudioContext.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.01);
    });
    return { played: true };
  } catch (error) {
    return { played: false, reason: "unavailable", error };
  }
}

const editDistance = (left, right) => {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const previous = row[rightIndex];
      row[rightIndex] = Math.min(
        row[rightIndex] + 1,
        row[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = previous;
    }
  }
  return row[right.length];
};

const speechSimilarity = (target, heard) => {
  const expected = normalizeAnswerText(target);
  const actual = normalizeAnswerText(heard);
  if (!expected || !actual) return 0;
  const charMatch = 1 - (editDistance(expected, actual) / Math.max(expected.length, actual.length));
  const expectedWords = expected.split(" ");
  const remainingWords = actual.split(" ");
  let matchedWords = 0;
  expectedWords.forEach((word) => {
    const matchIndex = remainingWords.indexOf(word);
    if (matchIndex >= 0) {
      matchedWords += 1;
      remainingWords.splice(matchIndex, 1);
    }
  });
  const wordMatch = matchedWords / Math.max(expectedWords.length, actual.split(" ").length);
  return Math.max(0, Math.min(1, charMatch * 0.68 + wordMatch * 0.32));
};

const SPEAKING_FEEDBACK = Object.freeze({
  excellent: Object.freeze([
    Object.freeze({
      messageEn: "Excellent — clear, accurate, and natural.",
      messageJa: "とても自然で、正確にはっきり言えました。",
    }),
    Object.freeze({
      messageEn: "Beautifully spoken. Your pronunciation was easy to follow.",
      messageJa: "きれいに言えました。とても聞き取りやすい発音です。",
    }),
    Object.freeze({
      messageEn: "Strong work — the sentence sounded smooth and confident.",
      messageJa: "よくできました。なめらかで自信のある言い方でした。",
    }),
  ]),
  good: Object.freeze([
    Object.freeze({
      messageEn: "Good job — it was easy to understand. Try once more for rhythm.",
      messageJa: "しっかり伝わっています。もう一度リズムも意識してみましょう。",
    }),
    Object.freeze({
      messageEn: "Nicely done. One more relaxed try will make it even smoother.",
      messageJa: "よくできました。力を抜いてもう一度言うと、さらに自然になります。",
    }),
    Object.freeze({
      messageEn: "That came through clearly. Now connect the words a little more.",
      messageJa: "はっきり伝わりました。次は単語を少しつなげて言ってみましょう。",
    }),
  ]),
  "keep-going": Object.freeze([
    Object.freeze({
      messageEn: "Nice try. Listen again, then say it slowly in small parts.",
      messageJa: "よい挑戦です。もう一度聞いて、短く区切りながらゆっくり言ってみましょう。",
    }),
    Object.freeze({
      messageEn: "Keep going. Copy the model one short phrase at a time.",
      messageJa: "その調子です。お手本を短いフレーズごとにまねしてみましょう。",
    }),
    Object.freeze({
      messageEn: "A good start. Slow down and give each key word a little more space.",
      messageJa: "よいスタートです。少しゆっくり、重要な単語を丁寧に言ってみましょう。",
    }),
  ]),
});

export function speakingFeedbackForSimilarity(similarity, random = Math.random) {
  const score = Number.isFinite(Number(similarity))
    ? Math.max(0, Math.min(1, Number(similarity)))
    : 0;
  const band = score >= 0.88 ? "excellent" : score >= 0.68 ? "good" : "keep-going";
  const choices = SPEAKING_FEEDBACK[band];
  const randomValue = Number(random?.());
  const safeRandom = Number.isFinite(randomValue)
    ? Math.max(0, Math.min(0.999999, randomValue))
    : 0;
  const message = choices[Math.floor(safeRandom * choices.length)] || choices[0];
  return {
    band,
    matched: band !== "keep-going",
    similarity: score,
    ...message,
  };
}

export function speechRecognitionSupported() {
  return typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function stopSpeechPractice() {
  if (activeRecognition) {
    try {
      activeRecognition.abort();
    } catch {
      // Recognition may already have stopped.
    }
  }
  if (activeRecognitionFinish) {
    activeRecognitionFinish({
      transcript: "",
      band: "cancelled",
      matched: false,
      messageEn: "Speaking practice stopped.",
      messageJa: "発話練習を停止しました。",
    });
  }
  activeRecognition = null;
  activeRecognitionFinish = null;
}

export function startSpeechPractice(target, { voice, onStatus } = {}) {
  const expected = String(target ?? "").trim();
  if (!expected) {
    return Promise.resolve({
      transcript: "",
      band: "unavailable",
      matched: false,
      messageEn: "There is no speaking target.",
      messageJa: "発話する英文がありません。",
    });
  }
  if (!speechRecognitionSupported()) {
    const result = {
      transcript: "",
      band: "unavailable",
      matched: false,
      messageEn: "Speech recognition is not available in this browser.",
      messageJa: "このブラウザでは音声認識を利用できません。",
    };
    report(onStatus, "error", result.messageEn, result.messageJa, result);
    return Promise.resolve(result);
  }

  stopSpeechPractice();
  return new Promise((resolve) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (activeRecognition === recognition) activeRecognition = null;
      if (activeRecognitionFinish === finish) activeRecognitionFinish = null;
      resolve(result);
    };
    activeRecognition = recognition;
    activeRecognitionFinish = finish;
    recognition.lang = voice === "gb" || (!voice && getSettings().voice === "gb") ? "en-GB" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    recognition.onstart = () => report(
      onStatus,
      "listening",
      "Listening… Say the English sentence.",
      "聞いています… 英文を話してください。",
    );
    recognition.onresult = (event) => {
      const alternatives = Array.from(event.results?.[0] || [], (item) => ({
        transcript: item.transcript,
        similarity: speechSimilarity(expected, item.transcript),
      })).sort((left, right) => right.similarity - left.similarity);
      const best = alternatives[0] || { transcript: "", similarity: 0 };
      const feedback = speakingFeedbackForSimilarity(best.similarity);
      const result = { transcript: best.transcript, ...feedback };
      report(onStatus, "result", result.messageEn, result.messageJa, result);
      finish(result);
    };
    recognition.onerror = (event) => {
      const denied = event.error === "not-allowed" || event.error === "service-not-allowed";
      const result = {
        transcript: "",
        band: "unavailable",
        matched: false,
        messageEn: denied
          ? "Microphone access is blocked. Allow it in this site’s browser settings."
          : "I could not hear that clearly. Please try again.",
        messageJa: denied
          ? "マイクが拒否されています。ブラウザのサイト設定で許可してください。"
          : "うまく聞き取れませんでした。もう一度お試しください。",
        error: event.error,
      };
      report(onStatus, "error", result.messageEn, result.messageJa, result);
      finish(result);
    };
    recognition.onend = () => {
      if (!settled) {
        const result = {
          transcript: "",
          band: "keep-going",
          matched: false,
          messageEn: "Nothing was captured. Press the microphone and try again.",
          messageJa: "音声を確認できませんでした。マイクを押してもう一度お試しください。",
        };
        report(onStatus, "ready", result.messageEn, result.messageJa, result);
        finish(result);
      }
    };
    try {
      recognition.start();
    } catch (error) {
      const result = {
        transcript: "",
        band: "unavailable",
        matched: false,
        messageEn: "The microphone is already busy. Please wait and try again.",
        messageJa: "マイクを使用中です。少し待ってからもう一度お試しください。",
        error: error?.message || String(error),
      };
      report(onStatus, "error", result.messageEn, result.messageJa, result);
      finish(result);
    }
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    stopAudio();
    stopSpeechPractice();
    remoteAudioCache.forEach((source) => URL.revokeObjectURL(source));
    remoteAudioCache.clear();
  });
}
