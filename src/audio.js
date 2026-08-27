import { NATURAL_SPEECH_URL, SUPABASE_ANON_KEY } from "./config.js";
import { AMBIENT_TRACK_KEYS, getSettings, normalizeAnswerText } from "./store.js";

const AUDIO_CACHE_LIMIT = 24;
const remoteAudioCache = new Map();
let activeAudio = null;
let activeRequest = null;
let requestGeneration = 0;
let activeRecognition = null;
let activeRecognitionFinish = null;
let feedbackAudioContext = null;
let ambientAudioElement = null;
let ambientTrackKey = null;
let ambientDucked = false;
let ambientGestureHandler = null;
let ambientLastError = "";
let ambientPromptFadeTimer = null;
let ambientPromptHideTimer = null;
const AMBIENT_PROMPT_VISIBLE_MS = 4200;
const AMBIENT_PROMPT_FADE_MS = 650;

export const AMBIENT_MUSIC_LICENSE = Object.freeze({
  artist: "Kevin MacLeod",
  website: "https://incompetech.com/",
  name: "Creative Commons Attribution 4.0 International",
  url: "https://creativecommons.org/licenses/by/4.0/",
});

const licensedTrack = (track) => Object.freeze({
  ...track,
  artist: AMBIENT_MUSIC_LICENSE.artist,
  license: AMBIENT_MUSIC_LICENSE.name,
  licenseUrl: AMBIENT_MUSIC_LICENSE.url,
  sourceUrl: `https://incompetech.com/music/royalty-free/index.html?isrc=${track.isrc}`,
});

export const AMBIENT_TRACKS = Object.freeze({
  calm_focus: licensedTrack({ name: "Clear Air", nameJa: "クリア・エア", description: "Gentle guitar and piano for calm focus", descriptionJa: "穏やかな集中に合うギターとピアノ", asset: "/assets/audio/ambient/clear-air.m4a", isrc: "USUAN1100626" }),
  lofi_study: licensedTrack({ name: "Study And Relax", nameJa: "スタディ・アンド・リラックス", description: "Warm, laid-back jazz for steady study", descriptionJa: "落ち着いて学べる、温かなスロージャズ", asset: "/assets/audio/ambient/study-and-relax.m4a", isrc: "USUAN1900030" }),
  quiet_morning: licensedTrack({ name: "Windswept", nameJa: "ウィンドスウェプト", description: "Peaceful guitar and strings for a fresh start", descriptionJa: "気持ちよく始められるギターとストリングス", asset: "/assets/audio/ambient/windswept.m4a", isrc: "USUAN1100757" }),
  night_focus: licensedTrack({ name: "Night on the Docks – Piano", nameJa: "夜の埠頭・ピアノ", description: "Smooth piano for quiet evening study", descriptionJa: "夜の静かな学習に合うスムーズなピアノ", asset: "/assets/audio/ambient/night-on-the-docks-piano.m4a", isrc: "USUAN1100135" }),
  rainy_desk: licensedTrack({ name: "Dream Culture", nameJa: "ドリーム・カルチャー", description: "Dreamlike piano with a light, steady pulse", descriptionJa: "軽いリズムと夢のようなピアノ", asset: "/assets/audio/ambient/dream-culture.m4a", isrc: "USUAN1300046" }),
});

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
  duckAmbient(false);
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
  audio.volume = Math.max(0, Math.min(1, Number(getSettings().voiceVolume ?? 1)));
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
    duckAmbient(false);
    reject(error instanceof Error ? error : new Error("The natural audio could not be played."));
  };
  audio.onerror = () => fail(new Error("The natural audio could not be decoded."));
  audio.onended = () => {
    if (settled) return;
    settled = true;
    if (activeAudio === audio) activeAudio = null;
    duckAmbient(false);
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
    duckAmbient(true);
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
  if (!settings.voiceEnabled) {
    report(onStatus, "error", "Voice is off. Turn it on in audio settings.", "ボイスがオフです。音声設定でオンにしてください。");
    return { played: false, reason: "voice-off" };
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

const audioContextConstructor = () => (typeof window !== "undefined"
  ? (window.AudioContext || window.webkitAudioContext)
  : null);

const sfxNotes = Object.freeze({
  click: Object.freeze([
    Object.freeze({ frequency: 440, offset: 0, duration: 0.065, gain: 0.046, type: "sine" }),
    Object.freeze({ frequency: 659.25, offset: 0.012, duration: 0.06, gain: 0.024, type: "triangle" }),
  ]),
  correct: Object.freeze([
    Object.freeze({ frequency: 523.25, offset: 0, duration: 0.25, gain: 0.078, type: "sine" }),
    Object.freeze({ frequency: 659.25, offset: 0.105, duration: 0.3, gain: 0.072, type: "sine" }),
    Object.freeze({ frequency: 783.99, offset: 0.21, duration: 0.34, gain: 0.066, type: "sine" }),
    Object.freeze({ frequency: 1046.5, offset: 0.235, duration: 0.31, gain: 0.024, type: "triangle" }),
  ]),
  retry: Object.freeze([
    Object.freeze({ frequency: 392, offset: 0, duration: 0.22, gain: 0.058, type: "sine" }),
    Object.freeze({ frequency: 349.23, offset: 0.12, duration: 0.24, gain: 0.052, type: "triangle" }),
    Object.freeze({ frequency: 440, offset: 0.25, duration: 0.28, gain: 0.032, type: "sine" }),
  ]),
  completion: Object.freeze([
    Object.freeze({ frequency: 392, offset: 0, duration: 0.26, gain: 0.062, type: "sine" }),
    Object.freeze({ frequency: 523.25, offset: 0.12, duration: 0.34, gain: 0.07, type: "sine" }),
    Object.freeze({ frequency: 659.25, offset: 0.25, duration: 0.4, gain: 0.068, type: "sine" }),
    Object.freeze({ frequency: 783.99, offset: 0.39, duration: 0.46, gain: 0.052, type: "triangle" }),
  ]),
});

export function playInterfaceSound(kind = "click") {
  const settings = getSettings();
  if (!settings.sfxEnabled) return { played: false, reason: "sfx-off" };
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
    const notes = sfxNotes[kind] || sfxNotes.click;
    const volume = Math.max(0, Math.min(1, Number(settings.sfxVolume ?? 0.34)));

    notes.forEach(({ frequency, offset, duration, gain: noteGain, type }) => {
      const oscillator = feedbackAudioContext.createOscillator();
      const gain = feedbackAudioContext.createGain();
      const noteStart = startAt + offset;
      const noteEnd = noteStart + duration;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, noteGain * volume), noteStart + Math.min(0.018, duration / 4));
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
      oscillator.connect(gain);
      gain.connect(feedbackAudioContext.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.01);
    });
    if (typeof document !== "undefined") {
      document.documentElement.dataset.sfxLast = kind;
      document.documentElement.dataset.sfxNoteCount = String(notes.length);
    }
    return { played: true };
  } catch (error) {
    return { played: false, reason: "unavailable", error };
  }
}

export const playAnswerFeedback = (correct) => playInterfaceSound(correct ? "correct" : "retry");
export const playCompletionSound = () => playInterfaceSound("completion");

const ambientTargetVolume = (settings = getSettings()) => {
  const volume = Math.max(0, Math.min(0.4, Number(settings.ambientVolume ?? 0.18)));
  return ambientDucked ? volume * 0.24 : volume;
};

const publishAmbientState = (state, settings = getSettings()) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.ambientState = state;
  document.documentElement.dataset.ambientTrack = ambientTrackKey || settings.ambientTrack || "calm_focus";
  document.documentElement.dataset.ambientNodeCount = "0";
  document.documentElement.dataset.ambientSource = ambientTrackKey
    ? AMBIENT_TRACKS[ambientTrackKey]?.asset || ""
    : "";
};

const setAmbientVolume = (settings = getSettings()) => {
  if (!ambientAudioElement) return;
  ambientAudioElement.volume = settings.ambientEnabled ? ambientTargetVolume(settings) : 0;
};

export function duckAmbient(active) {
  ambientDucked = Boolean(active);
  setAmbientVolume();
}

const ensureAmbientAudio = (trackKey, settings = getSettings()) => {
  const normalizedKey = AMBIENT_TRACK_KEYS.includes(trackKey) ? trackKey : "calm_focus";
  const track = AMBIENT_TRACKS[normalizedKey];
  if (typeof Audio === "undefined" || !track?.asset) return null;
  if (ambientAudioElement && ambientTrackKey === normalizedKey) {
    setAmbientVolume(settings);
    return ambientAudioElement;
  }
  if (ambientAudioElement) {
    ambientAudioElement.pause();
    ambientAudioElement.removeAttribute?.("src");
    ambientAudioElement.load?.();
    ambientAudioElement.remove?.();
  }
  const audio = new Audio(track.asset);
  audio.id = "studyMusicPlayer";
  audio.hidden = true;
  audio.setAttribute?.("aria-hidden", "true");
  audio.loop = true;
  audio.preload = "metadata";
  audio.playsInline = true;
  audio.onplaying = () => {
    ambientLastError = "";
    publishAmbientState("playing", settings);
    updateAmbientStartPrompt({ played: true }, settings);
  };
  audio.onwaiting = () => publishAmbientState("loading", settings);
  audio.onstalled = () => publishAmbientState("loading", settings);
  audio.onerror = () => {
    ambientLastError = `Unable to play ${track.name}.`;
    publishAmbientState("unavailable", settings);
  };
  ambientAudioElement = audio;
  ambientTrackKey = normalizedKey;
  if (typeof document !== "undefined") document.body?.append?.(audio);
  setAmbientVolume(settings);
  return audio;
};

function ambientStartPrompt() {
  if (typeof document === "undefined") return null;
  let prompt = document.querySelector("#musicStartChip,#ambientStartPrompt");
  if (!prompt) {
    prompt = document.createElement("button");
    prompt.id = "ambientStartPrompt";
    prompt.className = "music-start-chip";
    prompt.type = "button";
    prompt.innerHTML = `<span class="music-start-icon" aria-hidden="true">♫</span><span><strong>Begin with music / BGMと一緒に始める</strong><small>One tap enables browser audio / 一度タップして再生</small></span>`;
    prompt.hidden = true;
    document.body?.append(prompt);
  }
  prompt.setAttribute("aria-label", "Begin with study music / BGMと一緒に始める");
  if (prompt.dataset.ambientBound !== "true") {
    prompt.dataset.ambientBound = "true";
    prompt.addEventListener("click", async () => {
      prompt.dataset.ambientDismissed = "true";
      clearTimeout(ambientPromptFadeTimer);
      clearTimeout(ambientPromptHideTimer);
      const latest = getSettings();
      const result = await setAmbientPlayback(true, { ...latest, userGesture: true });
      updateAmbientStartPrompt(result, latest);
    });
  }
  return prompt;
}

function updateAmbientStartPrompt(result, settings = getSettings()) {
  const prompt = ambientStartPrompt();
  if (!prompt) return;
  const shouldOffer = settings.ambientEnabled
    && result?.played !== true
    && result?.reason === "gesture-required"
    && prompt.dataset.ambientDismissed !== "true";
  clearTimeout(ambientPromptFadeTimer);
  clearTimeout(ambientPromptHideTimer);
  if (!shouldOffer) {
    prompt.classList.remove("is-presented", "is-leaving");
    prompt.hidden = true;
    return;
  }
  prompt.hidden = false;
  prompt.classList.remove("is-leaving");
  prompt.classList.add("is-presented");
  ambientPromptFadeTimer = setTimeout(() => {
    prompt.classList.add("is-leaving");
    ambientPromptHideTimer = setTimeout(() => {
      prompt.hidden = true;
      prompt.classList.remove("is-presented", "is-leaving");
      prompt.dataset.ambientDismissed = "true";
    }, AMBIENT_PROMPT_FADE_MS);
  }, AMBIENT_PROMPT_VISIBLE_MS);
}

export async function setAmbientPlayback(enabled, options = {}) {
  const settings = { ...getSettings(), ...options, ambientEnabled: Boolean(enabled) };
  if (!enabled) {
    disarmAmbientGestureStart();
    setAmbientVolume(settings);
    ambientAudioElement?.pause();
    publishAmbientState("off", settings);
    const result = { played: false, reason: "ambient-off" };
    updateAmbientStartPrompt(result, settings);
    return result;
  }
  if (typeof Audio === "undefined") {
    publishAmbientState("unsupported", settings);
    return { played: false, reason: "unsupported" };
  }
  try {
    const audio = ensureAmbientAudio(settings.ambientTrack, settings);
    if (!audio) throw new Error("Ambient audio is unavailable in this browser.");
    if (audio.paused !== false) await audio.play();
    setAmbientVolume(settings);
    disarmAmbientGestureStart();
    publishAmbientState("playing", settings);
    const result = { played: true, track: ambientTrackKey, source: AMBIENT_TRACKS[ambientTrackKey]?.asset };
    updateAmbientStartPrompt(result, settings);
    return result;
  } catch (error) {
    if (error?.name === "NotAllowedError") {
      armAmbientGestureStart();
      publishAmbientState("waiting-for-gesture", settings);
      const result = { played: false, reason: "gesture-required", error };
      updateAmbientStartPrompt(result, settings);
      return result;
    }
    ambientLastError = error?.message || String(error);
    publishAmbientState("unavailable", settings);
    const result = { played: false, reason: "unavailable", error };
    updateAmbientStartPrompt(result, settings);
    return result;
  }
}

function disarmAmbientGestureStart() {
  if (!ambientGestureHandler || typeof window === "undefined") return;
  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.removeEventListener(eventName, ambientGestureHandler, true);
  });
  ambientGestureHandler = null;
}

function armAmbientGestureStart() {
  if (ambientGestureHandler || typeof window === "undefined") return;
  publishAmbientState("waiting-for-gesture");
  ambientGestureHandler = async () => {
    const latest = getSettings();
    if (!latest.ambientEnabled) {
      disarmAmbientGestureStart();
      return;
    }
    const result = await setAmbientPlayback(true, { ...latest, userGesture: true });
    if (result.played) disarmAmbientGestureStart();
  };
  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, ambientGestureHandler, { capture: true, passive: true });
  });
}

export function ambientPlaybackStatus() {
  return Object.freeze({
    enabled: getSettings().ambientEnabled,
    contextState: !ambientAudioElement ? "not-created" : ambientAudioElement.paused === false ? "playing" : "paused",
    track: ambientTrackKey,
    source: ambientTrackKey ? AMBIENT_TRACKS[ambientTrackKey]?.asset : null,
    nodeCount: 0,
    gain: ambientAudioElement?.volume ?? 0,
    readyState: ambientAudioElement?.readyState ?? 0,
    currentTime: ambientAudioElement?.currentTime ?? 0,
    duration: Number.isFinite(ambientAudioElement?.duration) ? ambientAudioElement.duration : null,
    paused: ambientAudioElement?.paused ?? true,
    error: ambientLastError,
    waitingForGesture: Boolean(ambientGestureHandler),
  });
}

export function syncAmbientFromSettings({ userGesture = false } = {}) {
  const settings = getSettings();
  if (!settings.ambientEnabled) {
    disarmAmbientGestureStart();
    setAmbientVolume(settings);
    ambientAudioElement?.pause();
    const result = { played: false, reason: "ambient-off" };
    updateAmbientStartPrompt(result, settings);
    return Promise.resolve(result);
  }
  // Try immediately. Browsers that allow media continuation will resume as
  // soon as the new page loads; browsers that require a fresh interaction are
  // handled by setAmbientPlayback's one-time gesture listener.
  return setAmbientPlayback(true, { ...settings, userGesture });
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

const alignSpeechWords = (expectedWords, actualWords) => {
  const rows = expectedWords.length + 1;
  const columns = actualWords.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(columns).fill(0));
  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let column = 0; column < columns; column += 1) matrix[0][column] = column;
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + (expectedWords[row - 1] === actualWords[column - 1] ? 0 : 1),
      );
    }
  }
  const operations = [];
  let row = expectedWords.length;
  let column = actualWords.length;
  while (row > 0 || column > 0) {
    if (
      row > 0
      && column > 0
      && expectedWords[row - 1] === actualWords[column - 1]
      && matrix[row][column] === matrix[row - 1][column - 1]
    ) {
      operations.unshift({ type: "match", expected: expectedWords[row - 1], heard: actualWords[column - 1] });
      row -= 1;
      column -= 1;
    } else if (row > 0 && column > 0 && matrix[row][column] === matrix[row - 1][column - 1] + 1) {
      operations.unshift({ type: "substitute", expected: expectedWords[row - 1], heard: actualWords[column - 1] });
      row -= 1;
      column -= 1;
    } else if (row > 0 && matrix[row][column] === matrix[row - 1][column] + 1) {
      operations.unshift({ type: "missing", expected: expectedWords[row - 1], heard: "" });
      row -= 1;
    } else {
      operations.unshift({ type: "unexpected", expected: "", heard: actualWords[column - 1] });
      column -= 1;
    }
  }
  return operations;
};

const shortPracticeChunks = (target) => {
  const words = String(target || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= 3) return words.join(" ");
  const chunks = [];
  for (let index = 0; index < words.length; index += 3) {
    chunks.push(words.slice(index, index + 3).join(" "));
  }
  return chunks.join(" / ");
};

export const speechComparison = (target, heard) => {
  const expected = normalizeAnswerText(target);
  const actual = normalizeAnswerText(heard);
  if (!expected || !actual) return {
    similarity: 0,
    missing: expected ? expected.split(" ") : [],
    unexpected: actual ? actual.split(" ") : [],
    substitutions: [],
    matchedWords: 0,
    expectedWordCount: expected ? expected.split(" ").length : 0,
    heardWordCount: actual ? actual.split(" ").length : 0,
    exactWords: false,
    targetText: String(target || "").trim(),
    heardText: String(heard || "").trim(),
    practiceChunks: shortPracticeChunks(target),
  };
  const charMatch = 1 - (editDistance(expected, actual) / Math.max(expected.length, actual.length));
  const expectedWords = expected.split(" ");
  const actualWords = actual.split(" ");
  const operations = alignSpeechWords(expectedWords, actualWords);
  const matchedWords = operations.filter(({ type }) => type === "match").length;
  const missing = operations.filter(({ type }) => type === "missing").map(({ expected: word }) => word);
  const unexpected = operations.filter(({ type }) => type === "unexpected").map(({ heard: word }) => word);
  const substitutions = operations
    .filter(({ type }) => type === "substitute")
    .map(({ expected: expectedWord, heard: heardWord }) => ({ expected: expectedWord, heard: heardWord }));
  const wordMatch = matchedWords / Math.max(expectedWords.length, actualWords.length);
  const exactWords = expected === actual;
  const rawSimilarity = Math.max(0, Math.min(1, charMatch * 0.4 + wordMatch * 0.6));
  return {
    similarity: exactWords ? 1 : Math.min(rawSimilarity, 0.82),
    missing,
    unexpected,
    substitutions,
    matchedWords,
    expectedWordCount: expectedWords.length,
    heardWordCount: actualWords.length,
    exactWords,
    targetText: String(target || "").trim(),
    heardText: String(heard || "").trim(),
    practiceChunks: shortPracticeChunks(target),
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
  if (comparison && !comparison.exactWords) {
    const substitutions = comparison.substitutions || [];
    const missing = comparison.missing || [];
    const unexpected = comparison.unexpected || [];
    const matchRatio = comparison.matchedWords / Math.max(1, comparison.expectedWordCount);
    const differentSentence = comparison.matchedWords === 0
      || matchRatio < 0.35
      || (score < 0.42 && substitutions.length + missing.length + unexpected.length >= 3);
    if (differentSentence) {
      return {
        band: "different-sentence",
        matched: false,
        similarity: score,
        messageEn: "That was recognized as a different sentence. Listen once, then copy the target in short parts.",
        messageJa: "別の文として認識されました。お手本を一度聞き、短く区切って目標文をまねしましょう。",
        ...comparison,
      };
    }
    if (substitutions.length === 1 && missing.length === 0 && unexpected.length === 0) {
      const [{ expected: expectedWord, heard: heardWord }] = substitutions;
      return {
        band: "word-mismatch",
        matched: false,
        similarity: score,
        messageEn: `Almost there — one word was different. I heard “${heardWord}”; use “${expectedWord}”.`,
        messageJa: `あと少しです。1語だけ違いました。「${heardWord}」と認識されましたが、「${expectedWord}」と言いましょう。`,
        ...comparison,
      };
    }
    const differenceCount = substitutions.length + missing.length + unexpected.length;
    return {
      band: "sentence-mismatch",
      matched: false,
      similarity: score,
      messageEn: `${differenceCount} parts need attention. Compare what was heard with the target, then practise the short chunks below.`,
      messageJa: `${differenceCount}か所を確認しましょう。認識された文と目標文を比べ、下の短い区切りで練習してください。`,
      ...comparison,
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
