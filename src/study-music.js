import {
  AMBIENT_TRACKS,
  ambientPlaybackStatus,
  setAmbientPlayback,
  syncAmbientFromSettings,
} from "./audio.js?v=20260906-studio1";
import { getSettings, onSettingsChange, updateSettings } from "./store.js?v=20260906-studio1";
import { installPlayfulInteractions } from "./effects.js?v=20260906-studio1";

const trackOptions = Object.entries(AMBIENT_TRACKS).map(([key, track]) => (
  `<option value="${key}">${track.name}</option>`
)).join("");

const statusCopy = (settings = getSettings()) => {
  const status = ambientPlaybackStatus();
  if (!settings.ambientEnabled) return ["Music off", "BGMオフ"];
  if (status.contextState === "playing") return ["Playing", "再生中"];
  if (status.error) return ["Playback unavailable", "再生できません"];
  return ["Tap once to start", "一度タップして再生"];
};

function applyControlCopy(node, english, japanese) {
  if (!node) return;
  if (document.body.dataset.page === "teacher") {
    // Keep both values available to Teacher Studio's language switcher even
    // after asynchronous playback events replace the visible text.
    node.dataset.teacherEn = english;
    node.dataset.teacherJa = japanese;
    node.textContent = document.documentElement.lang === "ja" ? japanese : english;
  } else {
    node.textContent = `${english} / ${japanese}`;
  }
}

function renderControls(root) {
  root.classList.add("study-music-controls");
  root.innerHTML = `
    <button class="quiet-btn study-music-toggle" type="button" data-study-music-toggle aria-pressed="true">Music On / BGMオン</button>
    <label class="voice-select study-music-track"><span data-teacher-en="Study music" data-teacher-ja="学習BGM">Study music / 学習BGM</span><select data-study-music-track aria-label="Study music track" data-teacher-aria-en="Study music track" data-teacher-aria-ja="学習BGMの曲">${trackOptions}</select></label>
    <label class="voice-select study-music-volume"><span data-teacher-en="Music level" data-teacher-ja="BGM音量">Music level / BGM音量</span><input data-study-music-volume type="range" min="0" max="40" step="1" aria-label="Study music volume" data-teacher-aria-en="Study music volume" data-teacher-aria-ja="学習BGMの音量"></label>
    <span class="study-music-status" data-study-music-status role="status" aria-live="polite"></span>
  `;
}

function applyControls(root, settings = getSettings()) {
  const toggle = root.querySelector("[data-study-music-toggle]");
  const track = root.querySelector("[data-study-music-track]");
  const volume = root.querySelector("[data-study-music-volume]");
  const status = root.querySelector("[data-study-music-status]");
  if (toggle) {
    applyControlCopy(toggle, settings.ambientEnabled ? "Music On" : "Music Off", settings.ambientEnabled ? "BGMオン" : "BGMオフ");
    toggle.setAttribute("aria-pressed", String(settings.ambientEnabled));
  }
  if (track) track.value = settings.ambientTrack || "calm_focus";
  if (volume) volume.value = String(Math.round((settings.ambientVolume ?? 0.18) * 100));
  applyControlCopy(status, ...statusCopy(settings));
  if (document.body.dataset.page === "teacher") {
    root.querySelectorAll("[data-teacher-en][data-teacher-ja]").forEach((node) => {
      applyControlCopy(node, node.dataset.teacherEn, node.dataset.teacherJa);
    });
    root.querySelectorAll("[data-teacher-aria-en][data-teacher-aria-ja]").forEach((node) => {
      node.setAttribute("aria-label", document.documentElement.lang === "ja" ? node.dataset.teacherAriaJa : node.dataset.teacherAriaEn);
    });
  }
}

async function refreshPlayback(root, settings, userGesture = false) {
  const result = await setAmbientPlayback(settings.ambientEnabled, { ...settings, userGesture });
  applyControls(root, settings);
  return result;
}

function bindControls(root) {
  renderControls(root);
  applyControls(root);
  root.querySelector("[data-study-music-toggle]")?.addEventListener("click", async () => {
    const settings = updateSettings({ ambientEnabled: !getSettings().ambientEnabled });
    await refreshPlayback(root, settings, true);
  });
  root.querySelector("[data-study-music-track]")?.addEventListener("change", async (event) => {
    const settings = updateSettings({ ambientTrack: event.currentTarget.value });
    await refreshPlayback(root, settings, true);
  });
  root.querySelector("[data-study-music-volume]")?.addEventListener("input", async (event) => {
    const settings = updateSettings({ ambientVolume: Number(event.currentTarget.value) / 100 });
    await refreshPlayback(root, settings, true);
  });
  ["playing", "pause", "error", "waiting", "canplay"].forEach((eventName) => {
    document.addEventListener(eventName, () => applyControls(root), true);
  });
}

const roots = [...document.querySelectorAll("[data-study-music-controls]")];
roots.forEach(bindControls);
onSettingsChange((settings) => roots.forEach((root) => applyControls(root, settings)));
void syncAmbientFromSettings().finally(() => roots.forEach((root) => applyControls(root)));
installPlayfulInteractions();
