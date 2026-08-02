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

export const normalizePlaybackRate = (rate) => (
  [0.5, 1, 1.5].includes(Number(rate)) ? Number(rate) : 1
);

const JAPANESE_CHARACTER = /[\u3040-\u30ff\u3400-\u9fff]/u;
const ENGLISH_CHARACTER = /[A-Za-z]/u;

/**
 * Break mixed Japanese/English copy into voice-safe runs.
 *
 * A Japanese explanation often includes a reusable English phrase, for example:
 *   注文するときは “I’d like pasta, please.” が丁寧で自然です。
 * Sending the whole sentence to the Japanese voice makes the model phrase hard to
 * understand, so the phrase is handed to the selected English voice instead.
 */
export function splitSpeechSegments(text, defaultLanguage = "en") {
  const value = String(text ?? "").trim();
  if (!value) return [];

  const rawTokens = value.match(/[\u3040-\u30ff\u3400-\u9fff]+|[A-Za-z]+(?:[’'][A-Za-z]+)*|[^A-Za-z\u3040-\u30ff\u3400-\u9fff]+/gu) || [value];
  const tagged = rawTokens.map((token) => ({
    text: token,
    language: JAPANESE_CHARACTER.test(token)
      ? "ja"
      : ENGLISH_CHARACTER.test(token) ? "en" : "",
  }));

  tagged.forEach((token, index) => {
    if (token.language) return;
    const previous = [...tagged.slice(0, index)].reverse().find((candidate) => candidate.language)?.language;
    const next = tagged.slice(index + 1).find((candidate) => candidate.language)?.language;
    token.language = previous || next || (defaultLanguage === "ja" ? "ja" : "en");
  });

  const segments = [];
  tagged.forEach((token) => {
    const last = segments.at(-1);
    if (last?.language === token.language) last.text += token.text;
    else segments.push({ text: token.text, language: token.language });
  });
  return segments
    .map((segment) => ({ ...segment, text: segment.text.trim() }))
    .filter((segment) => segment.text && (JAPANESE_CHARACTER.test(segment.text) || ENGLISH_CHARACTER.test(segment.text)));
}

const playBlobSource = (source, onStatus, token, rate = 1, { finalSegment = true } = {}) => new Promise((resolve, reject) => {
  if (token !== requestGeneration) {
    resolve({ played: false, cancelled: true });
    return;
  }
  cancelPlayingAudio();
  const audio = new Audio(source);
  audio.preload = "auto";
  const playbackRate = normalizePlaybackRate(rate);
  const applyPlaybackRate = () => {
    audio.defaultPlaybackRate = playbackRate;
    audio.playbackRate = playbackRate;
    audio.preservesPitch = true;
    audio.webkitPreservesPitch = true;
  };
  applyPlaybackRate();
  activeAudio = audio;
  audio.onplaying = () => report(
    onStatus,
    "playing",
    `Playing natural voice at ${playbackRate}×…`,
    `自然な音声を${playbackRate}倍速で再生中です。`,
    { source: "edge", rate: playbackRate },
  );
  let settled = false;
  const fail = (error) => {
    if (settled) return;
    settled = true;
    if (activeAudio === audio) activeAudio = null;
    reject(error instanceof Error ? error : new Error("The natural audio could not be played."));
  };
  audio.onerror = () => fail(new Error("The natural audio could not be decoded."));
  audio.onended = () => {
    if (settled) return;
    settled = true;
    if (activeAudio === audio) activeAudio = null;
    if (finalSegment) {
      report(onStatus, "ready", "Ready to play again.", "もう一度再生できます。", { source: "edge", rate: playbackRate });
    }
    resolve({ played: true, source: "edge", rate: playbackRate });
  };
  const readyTimeout = setTimeout(() => {
    if (audio.readyState < 2) fail(new Error("The natural audio took too long to load."));
  }, 8000);
  const begin = () => {
    clearTimeout(readyTimeout);
    if (token !== requestGeneration) {
      settled = true;
      resolve({ played: false, cancelled: true });
      return;
    }
    // Some mobile browsers restore the default rate after metadata loads.
    // Reapplying it immediately before play keeps 0.5× and 1.5× reliable.
    applyPlaybackRate();
    audio.play().catch(fail);
  };
  audio.addEventListener("loadedmetadata", applyPlaybackRate, { once: true });
  if (audio.readyState >= 2) begin();
  else audio.addEventListener("canplay", begin, { once: true });
  audio.load();
});

const looksJapanese = (text) => JAPANESE_CHARACTER.test(text);

export async function speakText(text, { voice, language, rate, onStatus } = {}) {
  const cleanText = String(text ?? "").trim();
  const settings = getSettings();
  const defaultVoiceCode = language === "ja" || (!language && looksJapanese(cleanText))
    ? "ja"
    : (voice === "gb" || (!voice && settings.voice === "gb") ? "gb" : "us");
  const englishVoiceCode = voice === "gb" || (!voice && settings.voice === "gb") ? "gb" : "us";
  const playbackRate = normalizePlaybackRate(rate ?? settings.playbackRate);
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
  const segments = splitSpeechSegments(cleanText, defaultVoiceCode === "ja" ? "ja" : "en")
    .map((segment) => ({
      ...segment,
      voiceCode: segment.language === "ja" ? "ja" : englishVoiceCode,
    }));
  let playedSegments = 0;
  try {
    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
      const segment = segments[segmentIndex];
      const { voiceCode } = segment;
      const cacheKey = `${voiceCode}:${segment.text.normalize("NFKC").toLocaleLowerCase()}`;
      let source = remoteAudioCache.get(cacheKey);
      if (!source && NATURAL_SPEECH_URL && SUPABASE_ANON_KEY && typeof fetch === "function") {
        const voiceName = voiceCode === "ja" ? "Nanami" : voiceCode === "gb" ? "Libby" : "Ava";
        report(
          onStatus,
          "loading",
          `Preparing ${voiceName} natural voice…`,
          `${voiceName}の自然な音声を準備中です。`,
          { source: "edge", voice: voiceCode, rate: playbackRate },
        );
        let lastError;
        for (let attempt = 0; attempt < 2 && !source; attempt += 1) {
          const controller = new AbortController();
          activeRequest = controller;
          const timeout = setTimeout(() => controller.abort(), attempt === 0 ? 12000 : 16000);
          try {
            const response = await fetch(NATURAL_SPEECH_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ text: segment.text, accent: voiceCode }),
              signal: controller.signal,
              cache: "no-store",
            });
            if (!response.ok) throw new Error(`Natural speech request failed (${response.status}).`);
            const blob = await response.blob();
            if (!blob.type.startsWith("audio/") || blob.size < 128) {
              throw new Error("Natural speech returned an invalid audio file.");
            }
            source = URL.createObjectURL(blob);
            cacheAudio(cacheKey, source);
          } catch (error) {
            lastError = error;
            if (error?.name === "AbortError" && token !== requestGeneration) throw error;
            if (attempt === 0) {
              report(onStatus, "loading", "Trying the natural voice again…", "自然な音声をもう一度準備しています。", { source: "edge" });
            }
          } finally {
            clearTimeout(timeout);
            if (activeRequest === controller) activeRequest = null;
          }
        }
        if (!source && lastError) throw lastError;
      }
      if (source && token === requestGeneration) {
        const result = await playBlobSource(source, onStatus, token, playbackRate, {
          finalSegment: segmentIndex === segments.length - 1,
        });
        if (result.cancelled) return result;
        if (result.played) playedSegments += 1;
      }
    }
    if (playedSegments) return {
      played: true,
      source: "edge",
      rate: playbackRate,
      segments: segments.map(({ text: segmentText, language: segmentLanguage, voiceCode }) => ({
        text: segmentText,
        language: segmentLanguage,
        voice: voiceCode,
      })),
    };
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
  return { played: false, reason: "natural-voice-unavailable", rate: playbackRate };
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

const speechComparison = (target, heard) => {
  const expected = normalizeAnswerText(target);
  const actual = normalizeAnswerText(heard);
  if (!expected || !actual) return { similarity: 0, missing: [], unexpected: [], exactWords: false };
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
  const actualWords = actual.split(" ");
  const missing = expectedWords.filter((word) => !actualWords.includes(word));
  const unexpected = actualWords.filter((word) => !expectedWords.includes(word));
  const exactWords = missing.length === 0
    && unexpected.length === 0
    && expectedWords.length === actualWords.length;
  const rawSimilarity = Math.max(0, Math.min(1, charMatch * 0.58 + wordMatch * 0.42));
  return {
    similarity: exactWords ? rawSimilarity : Math.min(rawSimilarity, 0.76),
    missing,
    unexpected,
    exactWords,
  };
};

const speechSimilarity = (target, heard) => speechComparison(target, heard).similarity;

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

export function speakingFeedbackForSimilarity(similarity, random = Math.random, comparison = null) {
  const score = Number.isFinite(Number(similarity))
    ? Math.max(0, Math.min(1, Number(similarity)))
    : 0;
  if (comparison && !comparison.exactWords && (comparison.missing.length || comparison.unexpected.length)) {
    const expectedWord = comparison.missing[0] || "the target word";
    const heardWord = comparison.unexpected[0] || "a different word";
    return {
      band: "word-mismatch",
      matched: false,
      similarity: score,
      messageEn: `Close, but one word changed. Say “${expectedWord}”, not “${heardWord}”.`,
      messageJa: `惜しいです。ただし単語が違います。「${heardWord}」ではなく「${expectedWord}」と言いましょう。`,
    };
  }
  const band = score >= 0.9 ? "excellent" : score >= 0.68 ? "good" : "keep-going";
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

export function speakingFeedbackForTranscript(target, heard, random = Math.random) {
  const comparison = speechComparison(target, heard);
  return {
    transcript: String(heard || ""),
    ...speakingFeedbackForSimilarity(comparison.similarity, random, comparison),
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
        ...speechComparison(expected, item.transcript),
      })).sort((left, right) => right.similarity - left.similarity);
      const best = alternatives[0] || { transcript: "", similarity: 0, missing: [], unexpected: [], exactWords: false };
      const feedback = speakingFeedbackForSimilarity(best.similarity, Math.random, best);
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
