import {
  fetchCurriculumItems,
  fetchCurriculumLevels,
  fetchCurriculumProgress,
  saveCurriculumProgress,
  toggleCurriculumFavorite,
} from "./curriculum-api.js?v=20260905-hub1";
import {
  applyStudentFeatureVisibility,
  featureAllowed,
  loadStudentAccess,
  renderStudentAccessBoundary,
} from "./student-visibility.js?v=20260905-hub1";
import {
  playAnswerFeedback,
  playCompletionSound,
  speakText,
  stopAudio,
} from "./audio.js?v=20260905-natural1";
import {
  applyThemePreference,
  getSettings,
  onSettingsChange,
  setStorageUser,
  updateSettings,
  watchSystemTheme,
} from "./store.js?v=20260905-release5";
import { loadUserSettings, saveUserSettings } from "./supabase.js?v=20260905-release5";
import { applyLanguageMode, languageModeFromSettings, uiText } from "./i18n.js?v=20260905-release5";

const CATEGORY_ORDER = Object.freeze(["words", "phrases", "phonics"]);
const CATEGORY_CONFIG = Object.freeze({
  words: Object.freeze({
    feature: "show_words",
    icon: "🍎",
    labelEn: "Words",
    labelJa: "単語",
    accent: "var(--learn-words)",
    soft: "var(--learn-words-soft)",
    reviewModes: Object.freeze([
      Object.freeze({ value: "flash", en: "Flash · word → meaning", ja: "フラッシュ・単語 → 意味" }),
      Object.freeze({ value: "reverse", en: "Reverse · meaning → word", ja: "逆引き・意味 → 単語" }),
      Object.freeze({ value: "audio-choice", en: "Audio · listen and choose", ja: "音声・聞いて選ぶ" }),
      Object.freeze({ value: "text-choice", en: "Quiz · four choices", ja: "クイズ・4択" }),
    ]),
  }),
  phrases: Object.freeze({
    feature: "show_phrases",
    icon: "💬",
    labelEn: "Phrases",
    labelJa: "フレーズ",
    accent: "var(--learn-phrases)",
    soft: "var(--learn-phrases-soft)",
    reviewModes: Object.freeze([
      Object.freeze({ value: "flash", en: "Flash · phrase → meaning", ja: "フラッシュ・フレーズ → 意味" }),
      Object.freeze({ value: "reverse", en: "Reverse · situation → phrase", ja: "逆引き・場面 → フレーズ" }),
      Object.freeze({ value: "audio-choice", en: "Audio · listen and choose", ja: "音声・聞いて選ぶ" }),
      Object.freeze({ value: "text-choice", en: "Quiz · four choices", ja: "クイズ・4択" }),
    ]),
  }),
  phonics: Object.freeze({
    feature: "show_phonics",
    icon: "🔤",
    labelEn: "Phonics",
    labelJa: "フォニックス",
    accent: "var(--learn-phonics)",
    soft: "var(--learn-phonics-soft)",
    reviewModes: Object.freeze([
      Object.freeze({ value: "flash", en: "Flash · sound → examples", ja: "フラッシュ・音 → 例" }),
      Object.freeze({ value: "reverse", en: "Reverse · example → sound", ja: "逆引き・例 → 音" }),
      Object.freeze({ value: "audio-choice", en: "Audio · listen and choose", ja: "音声・聞いて選ぶ" }),
      Object.freeze({ value: "text-choice", en: "Quiz · four choices", ja: "クイズ・4択" }),
    ]),
  }),
});

const STATUS_LABELS = Object.freeze({
  not_started: Object.freeze(["Not started", "未学習"]),
  learning: Object.freeze(["Learning", "学習中"]),
  reviewed: Object.freeze(["Reviewed", "復習済み"]),
  mastered: Object.freeze(["Mastered", "習得済み"]),
});

const RATING_LABELS = Object.freeze({
  hard: Object.freeze(["Hard", "難しい"]),
  good: Object.freeze(["Good", "できた"]),
  easy: Object.freeze(["Easy", "簡単"]),
});

const RATING_STATUS = Object.freeze({ hard: "learning", good: "reviewed", easy: "mastered" });
const PHONICS_CHOICE_FALLBACKS = Object.freeze([
  "/m/", "/s/", "/æ/", "/ɪ/", "/eɪ/", "/iː/", "/oʊ/", "/aɪ/",
  "/ʃ/", "/tʃ/", "/θ/", "silent e", "consonant blend", "word stress",
]);

const state = {
  access: null,
  userId: null,
  category: null,
  level: null,
  levels: [],
  items: [],
  progress: new Map(),
  favorites: new Set(),
  filter: "all",
  search: "",
  progressEnabled: false,
  loadingToken: 0,
  ready: false,
  reviewQueue: [],
  reviewIndex: 0,
  reviewMode: null,
  reviewRevealed: false,
  reviewSelectedChoice: null,
  reviewChoiceCorrect: null,
  reviewCompleted: false,
};

const refs = {
  app: document.querySelector("#learnApp"),
  categoryTabs: document.querySelector("#categoryTabs"),
  libraryPanel: document.querySelector("#libraryPanel"),
  levelGrid: document.querySelector("#levelGrid"),
  levelAccessCount: document.querySelector("#levelAccessCount"),
  levelOverview: document.querySelector("#levelOverview"),
  levelIcon: document.querySelector("#levelIcon"),
  levelKicker: document.querySelector("#levelKicker"),
  levelTitle: document.querySelector("#levelTitle"),
  levelDescription: document.querySelector("#levelDescription"),
  levelProgressWrap: document.querySelector("#levelProgressWrap"),
  levelProgressBar: document.querySelector("#levelProgressBar"),
  levelProgressLabel: document.querySelector("#levelProgressLabel"),
  reviewLevelButton: document.querySelector("#reviewLevelButton"),
  libraryToolbar: document.querySelector("#libraryToolbar"),
  librarySearch: document.querySelector("#librarySearch"),
  libraryFilters: document.querySelector("#libraryFilters"),
  libraryState: document.querySelector("#libraryState"),
  itemGrid: document.querySelector("#itemGrid"),
  resultCount: document.querySelector("#resultCount"),
  openLevelCount: document.querySelector("#openLevelCount"),
  itemCount: document.querySelector("#itemCount"),
  dueCount: document.querySelector("#dueCount"),
  reviewDialog: document.querySelector("#reviewDialog"),
  closeReviewButton: document.querySelector("#closeReviewButton"),
  reviewKicker: document.querySelector("#reviewKicker"),
  reviewTitle: document.querySelector("#reviewTitle"),
  reviewProgressBar: document.querySelector("#reviewProgressBar"),
  reviewCounter: document.querySelector("#reviewCounter"),
  reviewMode: document.querySelector("#reviewMode"),
  reviewCard: document.querySelector("#reviewCard"),
  reviewKeyHint: document.querySelector("#reviewKeyHint"),
  toast: document.querySelector("#learnToast"),
};

function element(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = String(options.text);
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([name, value]) => {
      if (value !== undefined && value !== null) node.setAttribute(name, String(value));
    });
  }
  const list = Array.isArray(children) ? children : [children];
  list.filter(Boolean).forEach((child) => node.append(child));
  return node;
}

function languageMode() {
  return languageModeFromSettings(getSettings());
}

function text(en, ja) {
  return uiText(en, ja, languageMode());
}

function contentObject(item) {
  if (item?.content && typeof item.content === "object" && !Array.isArray(item.content)) return item.content;
  if (typeof item?.content !== "string") return {};
  try {
    const parsed = JSON.parse(item.content);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function apiData(result, fallback) {
  return result?.data ?? fallback;
}

function visibleCategories(access = state.access) {
  return CATEGORY_ORDER.filter((category) => featureAllowed(access, CATEGORY_CONFIG[category].feature));
}

function parseRoute() {
  const url = new URL(window.location.href);
  const queryValue = String(url.searchParams.get("category") || "").toLowerCase();
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const pathCategory = path === "/words" ? "words" : path === "/phonics" ? "phonics" : null;
  const category = CATEGORY_ORDER.includes(queryValue) ? queryValue : pathCategory;
  const categoryWasRequested = Boolean(url.searchParams.has("category") || pathCategory);
  const invalidCategory = url.searchParams.has("category") && !CATEGORY_ORDER.includes(queryValue);
  const levelRaw = url.searchParams.get("level");
  const levelNumber = Number(levelRaw);
  const level = Number.isInteger(levelNumber) && levelNumber >= 1 && levelNumber <= 32 ? levelNumber : null;
  return {
    category,
    categoryWasRequested,
    invalidCategory,
    level,
    levelWasRequested: levelRaw !== null,
    invalidLevel: levelRaw !== null && level === null,
    itemId: String(url.searchParams.get("item") || "").trim() || null,
  };
}

function categoryUrl(category, level = null, itemId = null) {
  const url = new URL(window.location.href);
  url.pathname = category === "words" ? "/words" : category === "phonics" ? "/phonics" : "/learn";
  url.search = "";
  if (category === "phrases") url.searchParams.set("category", "phrases");
  if (Number.isInteger(level)) url.searchParams.set("level", String(level));
  if (itemId) url.searchParams.set("item", itemId);
  return `${url.pathname}${url.search}${url.hash}`;
}

function updateRoute(category, level, { replace = false, itemId = null } = {}) {
  const next = categoryUrl(category, level, itemId);
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;
  window.history[replace ? "replaceState" : "pushState"]({ category, level }, "", next);
}

function showToast(messageEn, messageJa = "") {
  if (!refs.toast) return;
  refs.toast.textContent = text(messageEn, messageJa);
  refs.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => refs.toast.classList.remove("is-visible"), 3500);
}

function setStateView({ icon = "✦", titleEn, titleJa, bodyEn, bodyJa, action = null } = {}) {
  refs.itemGrid.hidden = true;
  refs.libraryState.hidden = false;
  refs.libraryState.replaceChildren();
  refs.libraryState.append(
    element("span", { className: "learn-state-icon", text: icon, attrs: { "aria-hidden": "true" } }),
    element("h2", { text: text(titleEn, titleJa) }),
    element("p", { text: text(bodyEn, bodyJa) }),
  );
  if (action) refs.libraryState.append(action);
}

function setLoadingView() {
  refs.itemGrid.hidden = true;
  refs.libraryState.hidden = false;
  refs.libraryState.replaceChildren(
    element("div", { className: "learn-loader", attrs: { "aria-hidden": "true" } }, [
      element("span"), element("span"), element("span"),
    ]),
    element("h2", { text: text("Opening your library…", "教材ライブラリを準備しています…") }),
    element("p", { text: text("Checking the levels shared with you.", "あなたに公開されたレベルを確認しています。") }),
  );
  refs.libraryPanel?.setAttribute("aria-busy", "true");
}

function setCategoryTheme() {
  const config = CATEGORY_CONFIG[state.category] || CATEGORY_CONFIG.words;
  document.body.style.setProperty("--category-accent", config.accent);
  document.body.style.setProperty("--category-soft", config.soft);
  document.title = `${config.labelEn} · Learning Library · Tahmid English Club`;
}

function renderCategoryTabs() {
  const available = new Set(visibleCategories());
  const tabs = [...refs.categoryTabs.querySelectorAll("[data-category]")];
  tabs.forEach((tab) => {
    const category = tab.dataset.category;
    const hidden = Boolean(state.access?.authenticated) && !available.has(category);
    const active = category === state.category && !hidden;
    tab.dataset.studentHidden = String(hidden);
    tab.setAttribute("aria-hidden", String(hidden));
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  const activeTab = tabs.find((tab) => tab.dataset.category === state.category);
  if (activeTab && refs.libraryPanel) {
    refs.libraryPanel.setAttribute("aria-labelledby", activeTab.id);
  }
}

function itemProgress(itemId) {
  return state.progress.get(String(itemId)) || {
    item_id: String(itemId),
    status: "not_started",
    self_rating: null,
    review_count: 0,
    last_reviewed_at: null,
    next_review_at: null,
  };
}

function isCompleted(progress) {
  return progress?.status === "reviewed" || progress?.status === "mastered";
}

function isDue(progress) {
  if (!progress?.next_review_at) return false;
  const due = new Date(progress.next_review_at).getTime();
  return Number.isFinite(due) && due <= Date.now();
}

function itemsForLevel(level = state.level) {
  return state.items.filter((item) => Number(item.level) === Number(level));
}

function accessibleLevels() {
  const values = new Set();
  state.levels.forEach((entry) => values.add(Number(entry.level)));
  state.items.forEach((entry) => values.add(Number(entry.level)));
  return [...values].filter((value) => Number.isInteger(value) && value >= 1 && value <= 32).sort((a, b) => a - b);
}

function levelProgress(level) {
  const items = itemsForLevel(level);
  if (!items.length || !state.progressEnabled) return { percent: 0, completed: 0, started: 0, total: items.length };
  const completed = items.filter((item) => isCompleted(itemProgress(item.id))).length;
  const started = items.filter((item) => itemProgress(item.id).status !== "not_started").length;
  return {
    percent: Math.round((completed / items.length) * 100),
    completed,
    started,
    total: items.length,
  };
}

function levelMeta(level = state.level) {
  return state.levels.find((entry) => Number(entry.level) === Number(level)) || null;
}

function renderSummary() {
  const levels = accessibleLevels();
  refs.openLevelCount.textContent = String(levels.length);
  refs.itemCount.textContent = String(state.items.length);
  refs.dueCount.textContent = state.progressEnabled
    ? String(state.items.filter((item) => isDue(itemProgress(item.id))).length)
    : "—";
  refs.levelAccessCount.textContent = text(`${levels.length} open`, `${levels.length}件利用可能`);
}

function renderLevelGrid() {
  const accessible = new Set(accessibleLevels());
  refs.levelGrid.replaceChildren();
  for (let level = 1; level <= 32; level += 1) {
    const open = accessible.has(level);
    const progress = levelProgress(level);
    const current = level === state.level;
    const button = element("button", {
      className: `learn-level-button${progress.percent === 100 ? " is-complete" : progress.started ? " is-started" : ""}`,
      text: level,
      attrs: {
        type: "button",
        disabled: open ? null : "",
        "aria-current": String(current),
        "aria-label": open
          ? text(`Level ${level}, open${progress.percent ? `, ${progress.percent}% complete` : ""}`, `レベル${level}、利用可能${progress.percent ? `、${progress.percent}%完了` : ""}`)
          : text(`Level ${level}, locked`, `レベル${level}、ロック中`),
        title: open ? text(`Open Level ${level}`, `レベル${level}を開く`) : text("Locked by your learning plan", "学習プランでロックされています"),
      },
    });
    button.style.setProperty("--level-progress", String(progress.percent / 100));
    if (!open) button.append(element("span", { className: "lock-mark", text: "🔒", attrs: { "aria-hidden": "true" } }));
    if (open) {
      button.addEventListener("click", () => {
        if (state.level === level) return;
        state.level = level;
        state.filter = "all";
        state.search = "";
        refs.librarySearch.value = "";
        updateRoute(state.category, level);
        renderAll();
        refs.levelOverview?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    refs.levelGrid.append(button);
  }
  window.requestAnimationFrame(() => {
    refs.levelGrid.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  });
}

function renderLevelOverview() {
  const accessible = new Set(accessibleLevels());
  const open = Number.isInteger(state.level) && accessible.has(state.level);
  const config = CATEGORY_CONFIG[state.category] || CATEGORY_CONFIG.words;
  const meta = levelMeta();
  const progress = levelProgress(state.level);
  refs.levelIcon.textContent = open ? (meta?.icon || config.icon) : "🔒";
  refs.levelKicker.textContent = Number.isInteger(state.level)
    ? text(`LEVEL ${state.level} · ${config.labelEn.toUpperCase()}`, `レベル${state.level}・${config.labelJa}`)
    : text("CHOOSE A LEVEL", "レベルを選ぶ");
  refs.levelTitle.textContent = open
    ? text(meta?.title_en || `Level ${state.level} · ${config.labelEn}`, meta?.title_ja || `レベル${state.level}・${config.labelJa}`)
    : Number.isInteger(state.level)
      ? text(`Level ${state.level} is locked`, `レベル${state.level}はロック中です`)
      : text("Choose an open level", "利用可能なレベルを選んでください");
  refs.levelDescription.textContent = open
    ? text(meta?.description_en || "Practise with clear examples and natural audio.", meta?.description_ja || "分かりやすい例と自然な音声で練習します。")
    : Number.isInteger(state.level)
      ? text("This level is not currently shared with your account.", "このレベルは現在、あなたのアカウントには公開されていません。")
      : text("Your learning items will appear here.", "学習項目がここに表示されます。");
  refs.levelProgressWrap.hidden = !open || !state.progressEnabled;
  refs.levelProgressBar.style.width = `${progress.percent}%`;
  const track = refs.levelProgressBar.parentElement;
  track?.setAttribute("aria-valuenow", String(progress.percent));
  refs.levelProgressLabel.textContent = text(`${progress.percent}% · ${progress.completed}/${progress.total}`, `${progress.percent}%・${progress.completed}/${progress.total}`);
  refs.reviewLevelButton.disabled = !open || !itemsForLevel().length;
}

function searchableText(item) {
  const content = contentObject(item);
  const values = [item.title_en, item.title_ja, item.category, ...(Array.isArray(item.tags) ? item.tags : [])];
  Object.values(content).forEach((value) => {
    if (Array.isArray(value)) values.push(...value);
    else if (value != null && typeof value !== "object") values.push(value);
  });
  return values.join(" ").normalize("NFKC").toLocaleLowerCase();
}

function visibleLevelItems() {
  const query = state.search.trim().normalize("NFKC").toLocaleLowerCase();
  return itemsForLevel().filter((item) => {
    if (query && !searchableText(item).includes(query)) return false;
    if (state.filter === "favorites" && !state.favorites.has(String(item.id))) return false;
    const progress = itemProgress(item.id);
    if (state.filter === "due" && !isDue(progress)) return false;
    if (state.filter === "learning" && progress.status !== "learning") return false;
    return true;
  });
}

function renderFilters() {
  refs.libraryFilters.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  refs.libraryFilters.querySelectorAll("[data-progress-filter]").forEach((button) => {
    button.hidden = !state.progressEnabled;
  });
}

function addDetail(container, labelEn, labelJa, values, { mistake = false, contentLanguage = "" } = {}) {
  const list = (Array.isArray(values) ? values : [values]).filter((value) => value !== undefined && value !== null && String(value).trim());
  if (!list.length) return;
  const detail = element("dl", { className: `learn-detail${mistake ? " is-mistake" : ""}` });
  if (contentLanguage === "ja") detail.dataset.contentJa = "";
  detail.append(element("dt", { text: text(labelEn, labelJa) }));
  list.forEach((value, index) => {
    const dd = element("dd", { text: String(value).replaceAll("_", " ") });
    if (index > 0 || /Japanese|日本語/.test(labelEn + labelJa)) dd.dataset.contentJa = "";
    detail.append(dd);
  });
  container.append(detail);
}

function topicLabel(item, content) {
  const raw = String(content.topic || item.tags?.[0] || CATEGORY_CONFIG[state.category]?.labelEn || "Learning");
  return raw.replaceAll("-", " ");
}

function cardPrimary(item, content) {
  if (state.category === "words") return content.word || item.title_en || "Word";
  if (state.category === "phrases") return content.phrase || item.title_en || "Phrase";
  return content.phonicsTarget || item.title_en || "Phonics";
}

function cardJapanese(item, content) {
  if (state.category === "words" || state.category === "phrases") return content.japanese || item.title_ja || "";
  return content.japaneseHint || item.title_ja || "";
}

function audioText(item) {
  const content = contentObject(item);
  if (state.category === "words") return content.word || item.title_en || "";
  if (state.category === "phrases") return content.phrase || item.title_en || "";
  return content.practiceSentence || content.practiceWords?.join(", ") || content.examples?.join(", ") || content.phonicsTarget || item.title_en || "";
}

function audioSamples(item) {
  const content = contentObject(item);
  if (state.category === "words") return [
    { value: "primary", labelEn: "Word", labelJa: "単語", text: content.word || item.title_en || "" },
    { value: "example", labelEn: "Example sentence", labelJa: "例文", text: content.exampleSentence || "" },
  ].filter((sample) => sample.text);
  if (state.category === "phrases") return [
    { value: "primary", labelEn: "Phrase", labelJa: "フレーズ", text: content.phrase || item.title_en || "" },
    { value: "dialogue", labelEn: "Mini dialogue", labelJa: "ミニ会話", text: content.exampleDialogue || "" },
  ].filter((sample) => sample.text);
  return [
    {
      value: "examples",
      labelEn: "Sound examples",
      labelJa: "音の例",
      text: Array.isArray(content.examples) ? content.examples.join(", ").replaceAll("_", " ") : content.examples || "",
    },
    {
      value: "words",
      labelEn: "Practice words",
      labelJa: "練習語",
      text: Array.isArray(content.practiceWords) ? content.practiceWords.join(", ").replaceAll("_", " ") : content.practiceWords || "",
    },
    { value: "sentence", labelEn: "Practice sentence", labelJa: "練習文", text: content.practiceSentence || "" },
  ].filter((sample) => sample.text);
}

function itemVoiceNames(item) {
  const content = contentObject(item);
  return {
    us: String(content.audioUSVoice || "Ava"),
    gb: String(content.audioUKVoice || "Libby"),
  };
}

function renderCardDetails(body, item, content) {
  if (state.category === "words") {
    addDetail(body, "Kana guide", "カナ目安", content.kanaReading, { contentLanguage: "ja" });
    addDetail(body, "Pronunciation tip", "発音のポイント", content.pronunciationHint);
    addDetail(body, "Example", "例文", [content.exampleSentence, content.exampleJapanese]);
    addDetail(body, "Watch out", "よくある間違い", content.commonMistake, { mistake: true });
    return;
  }
  if (state.category === "phrases") {
    addDetail(body, "Situation", "使う場面", content.situation, { contentLanguage: "ja" });
    addDetail(body, "Natural usage", "自然な使い方", content.naturalUsage, { contentLanguage: "ja" });
    addDetail(body, "Mini dialogue", "ミニ会話", content.exampleDialogue);
    addDetail(body, "Watch out", "よくある間違い", content.commonMistake, { mistake: true, contentLanguage: "ja" });
    return;
  }
  addDetail(body, "Target sound", "練習する音", content.sound);
  addDetail(body, "Examples", "音の例", Array.isArray(content.examples) ? content.examples.join(" · ") : content.examples);
  addDetail(body, "Japanese sound guide", "日本語ガイド", content.japaneseHint, { contentLanguage: "ja" });
  addDetail(body, "Mouth & voice", "口と声のポイント", content.mouthTip);
  addDetail(body, "Practice words", "練習語", Array.isArray(content.practiceWords) ? content.practiceWords.join(" · ") : content.practiceWords);
  addDetail(body, "Practice sentence", "練習文", content.practiceSentence);
}

function progressLabel(progress) {
  const status = STATUS_LABELS[progress.status] || STATUS_LABELS.not_started;
  const rating = RATING_LABELS[progress.self_rating];
  return rating
    ? text(`${status[0]} · ${rating[0]}`, `${status[1]}・${rating[1]}`)
    : text(status[0], status[1]);
}

function relativeDueLabel(progress) {
  if (!progress?.next_review_at) return "";
  const value = new Date(progress.next_review_at);
  if (!Number.isFinite(value.getTime())) return "";
  if (isDue(progress)) return text("Ready to review now", "今が復習のタイミングです");
  const days = Math.max(1, Math.ceil((value.getTime() - Date.now()) / 86400000));
  return text(`Next review in ${days} day${days === 1 ? "" : "s"}`, `次の復習まで${days}日`);
}

async function playCardAudio(item, voice, statusNode, buttonNodes = [], spokenText = audioText(item), activeButton = null) {
  buttonNodes.forEach((button) => {
    button.disabled = true;
    if (button === activeButton) button.setAttribute("aria-busy", "true");
  });
  let result;
  try {
    result = await speakText(spokenText, {
      voice,
      rate: getSettings().playbackRate,
      onStatus: (status) => {
        statusNode.dataset.phase = status.phase || "ready";
        statusNode.dataset.source = status.source || "";
        statusNode.textContent = text(status.messageEn || "", status.messageJa || "");
      },
    });
    return result;
  } catch {
    statusNode.dataset.phase = "error";
    statusNode.textContent = text("Voice could not be played. Please try again.", "音声を再生できませんでした。もう一度お試しください。");
    return { played: false, reason: "unexpected-audio-error" };
  } finally {
    buttonNodes.forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    });
  }
}

function audioGlyph() {
  return element("span", { className: "learn-audio-glyph", attrs: { "aria-hidden": "true" } }, [
    element("i"),
    element("i"),
    element("i"),
  ]);
}

function createAudioBlock(item) {
  const block = element("div", { className: "learn-audio-block" });
  const samples = audioSamples(item);
  const chooser = element("label", { className: "learn-audio-sample" });
  chooser.append(element("span", { text: text("Listen to", "再生する内容") }));
  const sampleSelect = element("select", { attrs: { "aria-label": text("Choose what to hear", "再生する内容を選ぶ") } });
  samples.forEach((sample) => sampleSelect.append(element("option", {
    text: text(sample.labelEn, sample.labelJa),
    attrs: { value: sample.value },
  })));
  chooser.append(sampleSelect);
  const row = element("div", { className: "learn-audio-buttons" });
  const voices = itemVoiceNames(item);
  const usButton = element("button", {
    className: "learn-audio-button",
    attrs: { type: "button", "aria-label": text(`Play ${cardPrimary(item, contentObject(item))} with US ${voices.us}`, `US ${voices.us}で${cardPrimary(item, contentObject(item))}を再生`) },
  }, [audioGlyph(), element("span", { text: `US · ${voices.us}` })]);
  const ukButton = element("button", {
    className: "learn-audio-button",
    attrs: { type: "button", "aria-label": text(`Play ${cardPrimary(item, contentObject(item))} with UK ${voices.gb}`, `UK ${voices.gb}で${cardPrimary(item, contentObject(item))}を再生`) },
  }, [audioGlyph(), element("span", { text: `UK · ${voices.gb}` })]);
  const status = element("p", {
    className: "learn-audio-status",
    text: text("Choose a voice to listen.", "音声を選んで再生してください。"),
    attrs: { role: "status", "aria-live": "polite" },
  });
  const buttons = [usButton, ukButton];
  const selectedText = () => samples.find((sample) => sample.value === sampleSelect.value)?.text || audioText(item);
  const updateLabels = () => {
    const sample = samples.find((candidate) => candidate.value === sampleSelect.value) || samples[0];
    usButton.setAttribute("aria-label", text(`Play ${sample?.labelEn || "item"} with US ${voices.us}`, `US ${voices.us}で${sample?.labelJa || "教材"}を再生`));
    ukButton.setAttribute("aria-label", text(`Play ${sample?.labelEn || "item"} with UK ${voices.gb}`, `UK ${voices.gb}で${sample?.labelJa || "教材"}を再生`));
  };
  sampleSelect.addEventListener("change", updateLabels);
  updateLabels();
  usButton.addEventListener("click", () => playCardAudio(item, "us", status, buttons, selectedText(), usButton));
  ukButton.addEventListener("click", () => playCardAudio(item, "gb", status, buttons, selectedText(), ukButton));
  row.append(usButton, ukButton);
  block.append(chooser, row, status);
  return block;
}

async function saveRating(itemId, rating, { fromReview = false } = {}) {
  if (!state.access?.authenticated) {
    showToast("Sign in on the Review Hub to save your progress.", "進捗を保存するにはReview Hubでログインしてください。");
    return false;
  }
  if (!state.progressEnabled) {
    showToast("Progress saving is not included in your current learning plan.", "現在の学習プランでは進捗保存を利用できません。");
    return false;
  }
  const result = await saveCurriculumProgress(itemId, {
    status: RATING_STATUS[rating],
    selfRating: rating,
  });
  if (result?.error || !result?.data) {
    showToast("We could not save that rating. Please try again.", "評価を保存できませんでした。もう一度お試しください。");
    return false;
  }
  const previous = itemProgress(itemId);
  const saved = {
    ...previous,
    ...result.data,
    item_id: result.data.item_id || itemId,
    status: result.data.status || RATING_STATUS[rating],
    self_rating: result.data.self_rating || rating,
  };
  state.progress.set(String(itemId), saved);
  renderSummary();
  renderLevelGrid();
  renderLevelOverview();
  if (!fromReview) renderItems();
  return true;
}

async function toggleFavorite(itemId, nextFavorite) {
  if (!state.access?.authenticated) {
    showToast("Sign in on the Review Hub to save favorites.", "お気に入りを保存するにはReview Hubでログインしてください。");
    return false;
  }
  const result = await toggleCurriculumFavorite(itemId, nextFavorite);
  if (result?.error || result?.data !== nextFavorite) {
    showToast("We could not update that favorite. Please try again.", "お気に入りを更新できませんでした。もう一度お試しください。");
    return false;
  }
  if (nextFavorite) state.favorites.add(String(itemId));
  else state.favorites.delete(String(itemId));
  renderItems();
  showToast(nextFavorite ? "Saved to favorites." : "Removed from favorites.", nextFavorite ? "お気に入りに保存しました。" : "お気に入りから削除しました。");
  return true;
}

function createProgressFooter(item) {
  const progress = itemProgress(item.id);
  const footer = element("div", { className: "learn-card-progress" });
  if (!state.access?.authenticated) {
    footer.append(element("span", { className: "learn-status-pill", text: text("Preview", "プレビュー"), attrs: { "data-status": "not_started" } }));
    footer.append(element("small", { text: text("Sign in to save progress", "ログインすると進捗を保存できます") }));
    return footer;
  }
  if (!state.progressEnabled) {
    footer.append(element("span", { className: "learn-status-pill", text: text("Practice anytime", "いつでも練習"), attrs: { "data-status": "not_started" } }));
    return footer;
  }
  const status = element("span", {
    className: "learn-status-pill",
    text: progressLabel(progress),
    attrs: { "data-status": progress.status, title: relativeDueLabel(progress) || undefined },
  });
  const rating = element("div", { className: "learn-card-rating", attrs: { role: "group", "aria-label": text("Rate this item", "この項目を評価") } });
  Object.keys(RATING_LABELS).forEach((value) => {
    const label = RATING_LABELS[value];
    const button = element("button", {
      text: text(label[0], label[1]),
      attrs: { type: "button", "aria-pressed": String(progress.self_rating === value) },
    });
    button.addEventListener("click", async () => {
      [...rating.querySelectorAll("button")].forEach((control) => { control.disabled = true; });
      const saved = await saveRating(item.id, value);
      if (!saved && rating.isConnected) {
        [...rating.querySelectorAll("button")].forEach((control) => { control.disabled = false; });
      }
    });
    rating.append(button);
  });
  footer.append(status, rating);
  return footer;
}

function domId(value) {
  return `curriculum-${String(value).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function createItemCard(item) {
  const content = contentObject(item);
  const card = element("article", {
    className: "learn-card",
    attrs: { id: domId(item.id), "data-category": state.category, tabindex: "-1" },
  });
  const head = element("header", { className: "learn-card-head" });
  const title = element("div", { className: "learn-card-title" }, [
    element("small", { text: `${topicLabel(item, content)} · ${text(`Level ${item.level}`, `レベル${item.level}`)}` }),
    element("h3", { text: cardPrimary(item, content) }),
  ]);
  const japanese = cardJapanese(item, content);
  if (japanese) title.append(element("p", { className: "learn-card-ja", text: japanese, attrs: { lang: "ja", "data-content-ja": "" } }));
  const favorite = state.favorites.has(String(item.id));
  const favoriteButton = element("button", {
    className: "learn-favorite-button",
    text: favorite ? "♥" : "♡",
    attrs: {
      type: "button",
      "aria-pressed": String(favorite),
      "aria-label": favorite ? text("Remove from favorites", "お気に入りから削除") : text("Save to favorites", "お気に入りに保存"),
      title: state.access?.authenticated ? undefined : text("Sign in to save favorites", "ログインするとお気に入りを保存できます"),
    },
  });
  favoriteButton.addEventListener("click", async () => {
    favoriteButton.disabled = true;
    const changed = await toggleFavorite(item.id, !favorite);
    if (!changed && favoriteButton.isConnected) favoriteButton.disabled = false;
  });
  head.append(
    element("span", {
      className: "learn-card-icon",
      text: content.imageType === "emoji" || item.icon || content.icon
        ? (item.icon || content.icon || CATEGORY_CONFIG[state.category].icon)
        : CATEGORY_CONFIG[state.category].icon,
      attrs: { "aria-hidden": "true" },
    }),
    title,
    favoriteButton,
  );
  const body = element("div", { className: "learn-card-body" });
  renderCardDetails(body, item, content);
  const chips = element("ul", { className: "learn-chip-list", attrs: { "aria-label": text("Item details", "項目情報") } });
  (Array.isArray(item.tags) ? item.tags : []).forEach((tag) => chips.append(element("li", { text: String(tag).replaceAll("-", " ") })));
  if (item.required_plan && item.required_plan !== "free") chips.append(element("li", { className: "learn-plan-pill", text: String(item.required_plan) }));
  if (item.is_preview) chips.append(element("li", { text: text("Preview", "プレビュー") }));
  if (chips.childElementCount) body.append(chips);
  card.append(head, body, createAudioBlock(item), createProgressFooter(item));
  return card;
}

function renderItems() {
  refs.libraryPanel?.removeAttribute("aria-busy");
  renderFilters();
  const accessible = new Set(accessibleLevels());
  if (!Number.isInteger(state.level) || !accessible.has(state.level)) {
    refs.resultCount.textContent = "";
    setStateView({
      icon: "🔒",
      titleEn: Number.isInteger(state.level) ? `Level ${state.level} is not available` : "No open level yet",
      titleJa: Number.isInteger(state.level) ? `レベル${state.level}は利用できません` : "利用可能なレベルはまだありません",
      bodyEn: "Choose one of the open levels. Your teacher can update this learning path at any time.",
      bodyJa: "利用可能なレベルを選んでください。学習ステップは担当の先生がいつでも変更できます。",
    });
    return;
  }
  const allAtLevel = itemsForLevel();
  if (!allAtLevel.length) {
    refs.resultCount.textContent = "";
    setStateView({
      icon: "📚",
      titleEn: "This level is being prepared",
      titleJa: "このレベルは準備中です",
      bodyEn: "There are no learning items in this level yet. Please check again later.",
      bodyJa: "このレベルにはまだ学習項目がありません。しばらくしてからもう一度ご確認ください。",
    });
    return;
  }
  const items = visibleLevelItems();
  refs.resultCount.textContent = text(`${items.length} of ${allAtLevel.length} items`, `${allAtLevel.length}件中${items.length}件`);
  if (!items.length) {
    const reset = element("button", { text: text("Clear filters", "絞り込みを解除"), attrs: { type: "button" } });
    reset.addEventListener("click", () => {
      state.filter = "all";
      state.search = "";
      refs.librarySearch.value = "";
      renderItems();
    });
    setStateView({
      icon: state.filter === "favorites" ? "♡" : "⌕",
      titleEn: "No matching items",
      titleJa: "該当する項目がありません",
      bodyEn: state.filter === "favorites" ? "Save an item with the heart button, then find it here." : "Try another search or clear the current filter.",
      bodyJa: state.filter === "favorites" ? "ハートボタンで保存すると、ここに表示されます。" : "別の検索語を試すか、絞り込みを解除してください。",
      action: reset,
    });
    return;
  }
  refs.libraryState.hidden = true;
  refs.itemGrid.hidden = false;
  refs.itemGrid.replaceChildren(...items.map(createItemCard));
}

function renderAll() {
  setCategoryTheme();
  renderCategoryTabs();
  renderSummary();
  renderLevelGrid();
  renderLevelOverview();
  renderItems();
}

function normalizeProgress(payload) {
  const rows = Array.isArray(payload?.progress) ? payload.progress : [];
  const favorites = Array.isArray(payload?.favorites) ? payload.favorites : [];
  state.progress = new Map(rows.filter((row) => row?.item_id).map((row) => [String(row.item_id), row]));
  state.favorites = new Set(favorites.filter((row) => row?.item_id).map((row) => String(row.item_id)));
}

function errorAction(category) {
  const retry = element("button", { text: text("Try again", "もう一度試す"), attrs: { type: "button" } });
  retry.addEventListener("click", () => loadCategory(category, parseRoute()));
  return retry;
}

async function loadCategory(category, route = parseRoute(), { updateUrl = false } = {}) {
  if (!CATEGORY_CONFIG[category] || !featureAllowed(state.access, CATEGORY_CONFIG[category].feature)) return;
  const token = ++state.loadingToken;
  const categoryChanged = state.category !== category;
  state.category = category;
  if (categoryChanged) {
    state.filter = "all";
    state.search = "";
    refs.librarySearch.value = "";
  }
  setCategoryTheme();
  renderCategoryTabs();
  setLoadingView();
  const [levelsResult, itemsResult] = await Promise.all([
    fetchCurriculumLevels(category),
    fetchCurriculumItems({ category }),
  ]);
  if (token !== state.loadingToken) return;
  if (levelsResult?.error || itemsResult?.error) {
    state.levels = [];
    state.items = [];
    renderSummary();
    renderLevelGrid();
    renderLevelOverview();
    setStateView({
      icon: "↻",
      titleEn: "We could not open the library",
      titleJa: "教材ライブラリを開けませんでした",
      bodyEn: "Check your connection, then try again. Your access settings have not changed.",
      bodyJa: "通信状況を確認して、もう一度お試しください。アクセス設定は変更されていません。",
      action: errorAction(category),
    });
    return;
  }
  state.levels = Array.isArray(apiData(levelsResult, [])) ? apiData(levelsResult, []) : [];
  state.items = Array.isArray(apiData(itemsResult, [])) ? apiData(itemsResult, []) : [];
  const available = accessibleLevels();
  const requestedLevel = route?.level;
  if (requestedLevel) state.level = requestedLevel;
  else if (!available.includes(state.level)) state.level = available[0] || null;
  if ((!route?.levelWasRequested || route?.invalidLevel) && state.level) updateRoute(category, state.level, { replace: !updateUrl });
  else if (updateUrl) updateRoute(category, state.level);
  renderAll();
  if (!available.length) {
    const migrationPending = levelsResult?.reason === "migration-unavailable" || itemsResult?.reason === "migration-unavailable";
    setStateView({
      icon: migrationPending ? "🛠️" : "🔒",
      titleEn: migrationPending ? "Your new library is nearly ready" : "No levels are shared here yet",
      titleJa: migrationPending ? "新しい教材ライブラリを準備しています" : "公開中のレベルはまだありません",
      bodyEn: migrationPending
        ? "The learning library is being connected. Please check again soon."
        : state.access?.authenticated
          ? "Your teacher can open a level when it is right for your learning plan."
          : "Preview items are not available right now. Sign in on the Review Hub if you already have an account.",
      bodyJa: migrationPending
        ? "教材ライブラリを接続中です。しばらくしてからもう一度ご確認ください。"
        : state.access?.authenticated
          ? "学習プランに合わせて、担当の先生がレベルを公開します。"
          : "現在プレビュー教材を利用できません。アカウントをお持ちの場合はReview Hubでログインしてください。",
    });
    return;
  }
  if (route?.itemId && state.items.some((item) => String(item.id) === route.itemId)) {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(domId(route.itemId));
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.focus({ preventScroll: true });
    });
  }
}

function stableHash(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableShuffle(values, seed) {
  return values
    .map((value, index) => ({ value, score: stableHash(`${seed}:${index}:${value.identity}`) }))
    .sort((left, right) => left.score - right.score)
    .map(({ value }) => value);
}

function uniqueChoices(values) {
  const seen = new Set();
  return values.filter((option) => {
    const normalized = String(option.label || "").normalize("NFKC").trim().toLocaleLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function accessibleChoicePool(item) {
  const ordered = [...itemsForLevel(), ...state.items];
  const seen = new Set();
  return ordered.filter((candidate) => {
    const id = String(candidate?.id || "");
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return id !== String(item.id);
  });
}

function itemChoiceLabel(item, mode) {
  const content = contentObject(item);
  if (state.category === "words") {
    return mode === "audio-choice"
      ? content.japanese || item.title_ja || ""
      : content.word || item.title_en || "";
  }
  if (state.category === "phrases") {
    return mode === "audio-choice"
      ? content.japanese || item.title_ja || ""
      : content.phrase || item.title_en || "";
  }
  return content.phonicsTarget || item.title_en || content.sound || "";
}

function buildReviewChoices(item, mode) {
  const content = contentObject(item);
  if (state.category === "phonics") {
    const examples = Array.isArray(content.examples) ? content.examples.map((value) => String(value).replaceAll("_", " ")) : [];
    const practiceWords = Array.isArray(content.practiceWords) ? content.practiceWords.map(String) : [];
    const correct = examples[0] || content.practiceSentence || content.phonicsTarget || item.title_en || "—";
    if (mode === "text-choice") {
      const correctLabel = content.sound || content.phonicsTarget || item.title_en || "—";
      const otherSounds = accessibleChoicePool(item).map((candidate) => {
        const candidateContent = contentObject(candidate);
        return candidateContent.sound || candidateContent.phonicsTarget || candidate.title_en || "";
      });
      const options = uniqueChoices([correctLabel, ...otherSounds, ...PHONICS_CHOICE_FALLBACKS].map((label) => ({
        identity: `phonics-sound:${String(label).normalize("NFKC").trim().toLocaleLowerCase()}`,
        label: String(label),
      })));
      const correctOption = options.find((option) => option.label.normalize("NFKC") === String(correctLabel).normalize("NFKC")) || options[0];
      return {
        options: stableShuffle([correctOption, ...options.filter((option) => option !== correctOption).slice(0, 3)], `${item.id}:${mode}`),
        correctIdentity: correctOption?.identity,
        correctLabel: correctOption?.label || correctLabel,
        spokenText: correct,
        // A whole word can legitimately contain several taught sounds (for
        // example, "sit" includes /s/, /ɪ/, and /t/). Ask against the named
        // lesson focus so only one sound description is defensible.
        promptText: content.phonicsTarget || item.title_en || "—",
      };
    }
    let candidates;
    candidates = [...examples, ...practiceWords];
    const options = uniqueChoices(candidates.map((label, index) => ({
      identity: `phonics:${String(label).normalize("NFKC")}:${index}`,
      label: String(label).replaceAll("_", " "),
    })));
    const correctOption = options.find((option) => option.label.normalize("NFKC") === String(correct).replaceAll("_", " ").normalize("NFKC")) || options[0];
    return {
      options: stableShuffle([correctOption, ...options.filter((option) => option !== correctOption).slice(0, 3)], `${item.id}:${mode}`),
      correctIdentity: correctOption?.identity,
      correctLabel: correctOption?.label || correct,
      spokenText: mode === "audio-choice" ? correct : audioText(item),
    };
  }

  const correctLabel = itemChoiceLabel(item, mode);
  const correct = { identity: String(item.id), label: correctLabel };
  const distractors = accessibleChoicePool(item).map((candidate) => ({
    identity: String(candidate.id),
    label: itemChoiceLabel(candidate, mode),
  }));
  const options = uniqueChoices([correct, ...distractors]);
  const correctOption = options.find((option) => option.identity === String(item.id)) || correct;
  return {
    options: stableShuffle([correctOption, ...options.filter((option) => option.identity !== correctOption.identity).slice(0, 3)], `${item.id}:${mode}`),
    correctIdentity: correctOption.identity,
    correctLabel: correctOption.label,
    spokenText: audioText(item),
  };
}

function reviewPrompt(item, mode) {
  const content = contentObject(item);
  const choiceMode = mode === "audio-choice" || mode === "text-choice";
  if (state.category === "words") {
    if (mode === "reverse") return {
      kind: "reveal",
      labelEn: "Say the English word",
      labelJa: "英語の単語を言ってみよう",
      prompt: content.japanese || item.title_ja || "—",
      answer: content.word || item.title_en || "—",
      detail: content.exampleSentence || content.pronunciationHint || "",
    };
    if (choiceMode) {
      const choices = buildReviewChoices(item, mode);
      return {
        kind: "choice",
        labelEn: mode === "audio-choice" ? "Listen, then choose the meaning" : "Choose the matching word",
        labelJa: mode === "audio-choice" ? "聞いて、意味を選ぼう" : "意味に合う単語を選ぼう",
        prompt: mode === "audio-choice" ? "♫" : content.japanese || item.title_ja || "—",
        subprompt: mode === "audio-choice" ? text("Play either voice, then choose one answer.", "音声を再生して、答えを1つ選んでください。") : "",
        answer: `${content.word || item.title_en || "—"} — ${content.japanese || item.title_ja || "—"}`,
        detail: content.exampleSentence || content.pronunciationHint || "",
        choices,
      };
    }
    return {
      kind: "reveal",
      labelEn: "Recall the meaning",
      labelJa: "意味を思い出そう",
      prompt: content.word || item.title_en || "—",
      subprompt: content.kanaReading || "",
      answer: content.japanese || item.title_ja || "—",
      detail: content.exampleSentence || content.commonMistake || "",
    };
  }
  if (state.category === "phrases") {
    if (mode === "reverse") return {
      kind: "reveal",
      labelEn: "What would you say?",
      labelJa: "何と言いますか？",
      prompt: content.situation || "—",
      answer: content.phrase || item.title_en || "—",
      detail: content.exampleDialogue || content.naturalUsage || "",
    };
    if (choiceMode) {
      const choices = buildReviewChoices(item, mode);
      return {
        kind: "choice",
        labelEn: mode === "audio-choice" ? "Listen, then choose the meaning" : "Choose the phrase for this situation",
        labelJa: mode === "audio-choice" ? "聞いて、意味を選ぼう" : "この場面に合うフレーズを選ぼう",
        prompt: mode === "audio-choice" ? "♫" : content.situation || "—",
        subprompt: mode === "audio-choice" ? text("Play either voice, then choose one answer.", "音声を再生して、答えを1つ選んでください。") : "",
        answer: content.phrase || item.title_en || "—",
        detail: content.japanese || item.title_ja || content.exampleDialogue || "",
        choices,
      };
    }
    return {
      kind: "reveal",
      labelEn: "Recall the natural meaning",
      labelJa: "自然な意味を思い出そう",
      prompt: content.phrase || item.title_en || "—",
      answer: content.japanese || item.title_ja || "—",
      detail: content.situation || content.naturalUsage || "",
    };
  }
  if (mode === "reverse") return {
    kind: "reveal",
    labelEn: "Recall the sound pattern",
    labelJa: "音のパターンを思い出そう",
    prompt: (Array.isArray(content.examples) ? content.examples[0] : content.practiceSentence) || "—",
    answer: content.sound || content.phonicsTarget || "—",
    detail: content.phonicsTarget || content.mouthTip || "",
  };
  if (choiceMode) {
    const choices = buildReviewChoices(item, mode);
    return {
      kind: "choice",
      labelEn: mode === "audio-choice" ? "Listen, then choose the word you heard" : "Match the sound to this phonics focus",
      labelJa: mode === "audio-choice" ? "聞こえた語を選ぼう" : "このフォニックス項目に合う音を選ぼう",
      prompt: mode === "audio-choice" ? "♫" : choices.promptText || (Array.isArray(content.examples) ? content.examples[0] : "—"),
      subprompt: mode === "audio-choice" ? text("Play either voice, then choose one answer.", "音声を再生して、答えを1つ選んでください。") : "",
      answer: choices.correctLabel,
      detail: content.phonicsTarget || content.mouthTip || "",
      choices,
    };
  }
  return {
    kind: "reveal",
    labelEn: "Think of matching examples",
    labelJa: "当てはまる例を考えよう",
    prompt: content.sound || item.title_en || "—",
    answer: Array.isArray(content.examples) ? content.examples.join(" · ").replaceAll("_", " ") : content.examples || "—",
    detail: content.mouthTip || content.practiceSentence || "",
  };
}

function reviewAudioButtons(item, spokenText = audioText(item)) {
  const row = element("div", { className: "learn-review-audio" });
  const status = element("p", { className: "learn-audio-status", attrs: { role: "status", "aria-live": "polite" } });
  const voices = itemVoiceNames(item);
  const us = element("button", { className: "learn-audio-button", attrs: { type: "button", "aria-label": text(`Play with US ${voices.us}`, `US ${voices.us}で再生`) } }, [audioGlyph(), element("span", { text: `US · ${voices.us}` })]);
  const uk = element("button", { className: "learn-audio-button", attrs: { type: "button", "aria-label": text(`Play with UK ${voices.gb}`, `UK ${voices.gb}で再生`) } }, [audioGlyph(), element("span", { text: `UK · ${voices.gb}` })]);
  const buttons = [us, uk];
  us.addEventListener("click", () => playCardAudio(item, "us", status, buttons, spokenText, us));
  uk.addEventListener("click", () => playCardAudio(item, "gb", status, buttons, spokenText, uk));
  row.append(us, uk);
  return [row, status];
}

function nextReviewItem() {
  stopAudio();
  if (state.reviewIndex >= state.reviewQueue.length - 1) {
    state.reviewCompleted = true;
    void playCompletionSound();
  } else {
    state.reviewIndex += 1;
    state.reviewRevealed = false;
    state.reviewSelectedChoice = null;
    state.reviewChoiceCorrect = null;
  }
  renderReview();
  window.requestAnimationFrame(() => refs.reviewCard.querySelector(
    state.reviewCompleted ? ".learn-review-completion" : ".learn-review-prompt",
  )?.focus());
}

function renderReviewComplete() {
  refs.reviewProgressBar.style.width = "100%";
  refs.reviewCounter.textContent = text(`${state.reviewQueue.length} of ${state.reviewQueue.length}`, `${state.reviewQueue.length}/${state.reviewQueue.length}`);
  refs.reviewCard.replaceChildren(
    element("p", { className: "learn-review-prompt-label", text: text("REVIEW COMPLETE", "復習完了") }),
    element("p", { className: "learn-review-prompt", text: "✓", attrs: { "aria-hidden": "true", tabindex: "-1" } }),
    element("div", { className: "learn-review-answer learn-review-completion", attrs: { tabindex: "-1" } }, [
      element("strong", { text: text("Nice work. You finished this set.", "お疲れさまでした。このセットは完了です。") }),
      element("p", { text: text("Come back when an item is due, or practise the level again anytime.", "復習時期になったら戻るか、いつでもこのレベルを練習できます。") }),
    ]),
    element("div", { className: "learn-review-actions" }, [
      (() => {
        const close = element("button", { className: "learn-next-button", text: text("Return to the library", "ライブラリに戻る"), attrs: { type: "button" } });
        close.addEventListener("click", () => refs.reviewDialog.close());
        return close;
      })(),
    ]),
  );
}

function renderReview() {
  if (state.reviewCompleted) {
    renderReviewComplete();
    return;
  }
  const item = state.reviewQueue[state.reviewIndex];
  if (!item) return;
  const config = CATEGORY_CONFIG[state.category];
  const prompt = reviewPrompt(item, state.reviewMode);
  const percent = Math.round(((state.reviewIndex + 1) / state.reviewQueue.length) * 100);
  refs.reviewKicker.textContent = text(`LEVEL ${state.level} · ${config.labelEn.toUpperCase()}`, `レベル${state.level}・${config.labelJa}`);
  refs.reviewTitle.textContent = text(`${config.labelEn} review`, `${config.labelJa}の復習`);
  refs.reviewProgressBar.style.width = `${percent}%`;
  refs.reviewCounter.textContent = text(`${state.reviewIndex + 1} of ${state.reviewQueue.length}`, `${state.reviewIndex + 1}/${state.reviewQueue.length}`);
  refs.reviewCard.replaceChildren();
  refs.reviewCard.append(
    element("p", { className: "learn-review-prompt-label", text: text(prompt.labelEn, prompt.labelJa) }),
    element("p", { className: "learn-review-prompt", text: prompt.prompt, attrs: { tabindex: "-1" } }),
  );
  if (prompt.subprompt) refs.reviewCard.append(element("p", { className: "learn-review-subprompt", text: prompt.subprompt }));
  const canPlayAnswer = state.reviewMode === "flash"
    || state.reviewMode === "audio-choice"
    || state.reviewRevealed;
  const [audioButtons, audioStatus] = reviewAudioButtons(item, prompt.choices?.spokenText || audioText(item));
  audioButtons.hidden = !canPlayAnswer;
  audioStatus.hidden = !canPlayAnswer;
  refs.reviewCard.append(audioButtons, audioStatus);
  if (prompt.kind === "choice") {
    const choiceGrid = element("div", {
      className: "learn-choice-grid",
      attrs: { role: "group", "aria-label": text("Choose one answer", "答えを1つ選んでください") },
    });
    prompt.choices.options.forEach((option, index) => {
      const selected = state.reviewSelectedChoice === option.identity;
      const correct = option.identity === prompt.choices.correctIdentity;
      const result = state.reviewRevealed
        ? correct ? "correct" : selected ? "wrong" : "neutral"
        : "pending";
      const button = element("button", {
        className: "learn-choice-button",
        attrs: {
          type: "button",
          "aria-pressed": String(selected),
          "data-result": result,
          disabled: state.reviewRevealed ? "" : null,
        },
      }, [
        element("span", { className: "learn-choice-number", text: String(index + 1), attrs: { "aria-hidden": "true" } }),
        element("span", { text: option.label }),
      ]);
      button.addEventListener("click", () => {
        if (state.reviewRevealed) return;
        state.reviewSelectedChoice = option.identity;
        state.reviewChoiceCorrect = correct;
        state.reviewRevealed = true;
        void playAnswerFeedback(correct);
        renderReview();
        window.requestAnimationFrame(() => refs.reviewCard.querySelector(".learn-choice-feedback")?.focus());
      });
      choiceGrid.append(button);
    });
    refs.reviewCard.append(choiceGrid);
    if (state.reviewRevealed) {
      refs.reviewCard.append(element("p", {
        className: `learn-choice-feedback ${state.reviewChoiceCorrect ? "is-correct" : "is-wrong"}`,
        text: state.reviewChoiceCorrect
          ? text("Correct — nicely noticed.", "正解です。よく聞き分けました。")
          : text(`Not quite. The answer is “${prompt.choices.correctLabel}”.`, `惜しいです。答えは「${prompt.choices.correctLabel}」です。`),
        attrs: { role: "status", tabindex: "-1" },
      }));
    }
  }
  const answer = element("div", { className: "learn-review-answer", attrs: { hidden: state.reviewRevealed ? null : "", tabindex: "-1" } }, [
    element("strong", { text: prompt.answer }),
    prompt.detail ? element("p", { text: prompt.detail }) : null,
  ]);
  const actions = element("div", { className: "learn-review-actions" });
  if (!state.reviewRevealed && prompt.kind !== "choice") {
    const reveal = element("button", { className: "learn-reveal-button", text: text("Reveal answer", "答えを見る"), attrs: { type: "button" } });
    reveal.addEventListener("click", () => {
      state.reviewRevealed = true;
      renderReview();
      window.requestAnimationFrame(() => refs.reviewCard.querySelector(".learn-review-answer")?.focus());
    });
    actions.append(reveal);
  } else if (!state.reviewRevealed) {
    actions.append(element("p", { className: "learn-review-choice-help", text: text("Choose an answer above to continue.", "上から答えを1つ選んでください。") }));
  } else if (state.access?.authenticated && state.progressEnabled) {
    const rating = element("div", { className: "learn-review-rating", attrs: { role: "group", "aria-label": text("How did that feel?", "難しさはどうでしたか？") } });
    [
      ["hard", "1", "+1 day", "+1日"],
      ["good", "2", "+3 days", "+3日"],
      ["easy", "3", "+7 days", "+7日"],
    ].forEach(([value, key, scheduleEn, scheduleJa]) => {
      const labels = RATING_LABELS[value];
      const button = element("button", { className: "learn-rating-button", attrs: { type: "button", "data-rating": value } }, [
        element("span", { text: `${key} · ${text(labels[0], labels[1])}` }),
        element("small", { text: text(scheduleEn, scheduleJa) }),
      ]);
      button.addEventListener("click", async () => {
        rating.querySelectorAll("button").forEach((control) => { control.disabled = true; });
        if (await saveRating(item.id, value, { fromReview: true })) nextReviewItem();
        else rating.querySelectorAll("button").forEach((control) => { control.disabled = false; });
      });
      rating.append(button);
    });
    actions.append(rating);
  } else {
    const next = element("button", { className: "learn-next-button", text: text("Next item", "次の項目へ"), attrs: { type: "button" } });
    next.addEventListener("click", nextReviewItem);
    actions.append(next);
  }
  refs.reviewCard.append(answer, actions);
  refs.reviewKeyHint.textContent = prompt.kind === "choice" && !state.reviewRevealed
    ? text("Keyboard: 1–4 to choose an answer", "キーボード：1〜4で答えを選択")
    : !state.reviewRevealed
      ? text("Keyboard: Space to reveal", "キーボード：Spaceで答えを見る")
      : state.access?.authenticated && state.progressEnabled
        ? text("Keyboard: 1 Hard · 2 Good · 3 Easy", "キーボード：1 難しい・2 できた・3 簡単")
        : text("Choose Next item when you are ready.", "準備ができたら「次の項目へ」を選んでください。");
}

function openReview() {
  const queue = visibleLevelItems();
  if (!queue.length) {
    showToast("There are no items in the current view to review.", "現在の表示には復習できる項目がありません。");
    return;
  }
  const config = CATEGORY_CONFIG[state.category];
  state.reviewQueue = [...queue];
  state.reviewIndex = 0;
  state.reviewMode = config.reviewModes[0].value;
  state.reviewRevealed = false;
  state.reviewSelectedChoice = null;
  state.reviewChoiceCorrect = null;
  state.reviewCompleted = false;
  refs.reviewMode.replaceChildren(...config.reviewModes.map((mode) => element("option", { text: text(mode.en, mode.ja), attrs: { value: mode.value } })));
  refs.reviewMode.value = state.reviewMode;
  renderReview();
  if (typeof refs.reviewDialog.showModal === "function") refs.reviewDialog.showModal();
  else refs.reviewDialog.setAttribute("open", "");
}

function applySettings(settings = getSettings(), { rerender = true } = {}) {
  const language = languageModeFromSettings(settings);
  applyLanguageMode(language);
  applyThemePreference(settings.theme);
  const languageToggle = document.querySelector("#languageToggle");
  const themeToggle = document.querySelector("#themeToggle");
  const voiceToggle = document.querySelector("#voiceToggle");
  const voiceSelect = document.querySelector("#voiceSelect");
  const playbackRate = document.querySelector("#playbackRate");
  if (languageToggle) languageToggle.value = language;
  if (themeToggle) themeToggle.value = settings.theme || "light";
  if (voiceSelect) voiceSelect.value = settings.voice === "gb" ? "gb" : "us";
  if (playbackRate) playbackRate.value = String(settings.playbackRate || 1);
  if (voiceToggle) {
    voiceToggle.textContent = settings.voiceEnabled !== false ? text("Voice on", "音声オン") : text("Voice off", "音声オフ");
    voiceToggle.setAttribute("aria-pressed", String(settings.voiceEnabled !== false));
  }
  if (rerender && state.ready && state.category) {
    renderAll();
    if (refs.reviewDialog?.open) renderReview();
  }
}

function updateAndSyncSettings(patch) {
  const settings = updateSettings(patch);
  if (state.userId) saveUserSettings(settings, { expectedUserId: state.userId }).catch(() => {});
  return settings;
}

function bindSettings() {
  document.querySelector("#languageToggle")?.addEventListener("change", (event) => {
    updateAndSyncSettings({ languageMode: event.currentTarget.value, showJapanese: event.currentTarget.value !== "en" });
  });
  document.querySelector("#themeToggle")?.addEventListener("change", (event) => {
    updateAndSyncSettings({ theme: event.currentTarget.value });
  });
  document.querySelector("#voiceSelect")?.addEventListener("change", (event) => {
    updateAndSyncSettings({ voice: event.currentTarget.value === "gb" ? "gb" : "us" });
  });
  document.querySelector("#playbackRate")?.addEventListener("change", (event) => {
    updateAndSyncSettings({ playbackRate: Number(event.currentTarget.value) });
  });
  document.querySelector("#voiceToggle")?.addEventListener("click", () => {
    const enabled = getSettings().voiceEnabled === false;
    if (!enabled) stopAudio();
    updateAndSyncSettings({ voiceEnabled: enabled });
  });
  onSettingsChange((settings) => applySettings(settings));
  watchSystemTheme(() => applyThemePreference(getSettings().theme));
}

function bindLibraryControls() {
  refs.categoryTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-category]");
    if (!tab || tab.dataset.studentHidden === "true") return;
    const category = tab.dataset.category;
    if (category === state.category) return;
    updateRoute(category, null);
    loadCategory(category, parseRoute());
  });
  refs.categoryTabs.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...refs.categoryTabs.querySelectorAll('[role="tab"]')].filter((tab) => tab.dataset.studentHidden !== "true");
    const current = tabs.indexOf(document.activeElement);
    if (current < 0 || !tabs.length) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  });
  refs.librarySearch.addEventListener("input", () => {
    state.search = refs.librarySearch.value;
    renderItems();
  });
  refs.libraryFilters.addEventListener("click", (event) => {
    const control = event.target.closest("[data-filter]");
    if (!control || control.hidden) return;
    state.filter = control.dataset.filter;
    renderItems();
  });
  refs.reviewLevelButton.addEventListener("click", openReview);
  refs.closeReviewButton.addEventListener("click", () => refs.reviewDialog.close());
  refs.reviewDialog.addEventListener("close", () => {
    stopAudio();
    if (state.ready) renderAll();
  });
  refs.reviewDialog.addEventListener("cancel", stopAudio);
  refs.reviewMode.addEventListener("change", () => {
    state.reviewMode = refs.reviewMode.value;
    state.reviewRevealed = false;
    state.reviewSelectedChoice = null;
    state.reviewChoiceCorrect = null;
    stopAudio();
    renderReview();
  });
  refs.reviewDialog.addEventListener("keydown", (event) => {
    if (!refs.reviewDialog.open || state.reviewCompleted) return;
    const targetTag = event.target?.tagName;
    const currentPrompt = reviewPrompt(state.reviewQueue[state.reviewIndex], state.reviewMode);
    if (currentPrompt.kind === "choice" && !state.reviewRevealed && ["1", "2", "3", "4"].includes(event.key) && !["SELECT", "INPUT", "TEXTAREA"].includes(targetTag)) {
      event.preventDefault();
      refs.reviewCard.querySelectorAll(".learn-choice-button")[Number(event.key) - 1]?.click();
      return;
    }
    if (currentPrompt.kind !== "choice" && event.key === " " && !["BUTTON", "SELECT", "INPUT", "TEXTAREA"].includes(targetTag)) {
      event.preventDefault();
      if (!state.reviewRevealed) {
        state.reviewRevealed = true;
        renderReview();
      }
      return;
    }
    if (state.reviewRevealed && state.access?.authenticated && state.progressEnabled && ["1", "2", "3"].includes(event.key)) {
      event.preventDefault();
      const rating = { 1: "hard", 2: "good", 3: "easy" }[event.key];
      refs.reviewCard.querySelector(`[data-rating="${rating}"]`)?.click();
    }
  });
  window.addEventListener("popstate", () => routePage({ replaceInvalid: false }));
}

function accessBoundaryFor(category, paused = false) {
  renderStudentAccessBoundary(document.querySelector("#main"), paused ? {
    title: "Your Review Hub access is paused.",
    titleJa: "Review Hubの利用は一時停止中です。",
    detail: "No learning library content is being shared with this account right now.",
    detailJa: "現在、このアカウントには教材ライブラリが公開されていません。",
  } : {
    title: `The ${CATEGORY_CONFIG[category]?.labelEn || "learning"} library is not in your plan.`,
    titleJa: `この${CATEGORY_CONFIG[category]?.labelJa || "教材"}ライブラリは現在のプランに含まれていません。`,
    detail: "Your teacher can change which learning categories appear in your Review Hub.",
    detailJa: "表示する学習カテゴリーは、担当の先生が変更できます。",
  });
}

async function routePage({ replaceInvalid = true } = {}) {
  const route = parseRoute();
  const categories = visibleCategories();
  if (!categories.length) {
    accessBoundaryFor("words", state.access?.settings?.account_enabled === false);
    return;
  }
  if (route.categoryWasRequested && route.category && !categories.includes(route.category) && state.access?.authenticated) {
    accessBoundaryFor(route.category);
    return;
  }
  const category = route.category && categories.includes(route.category) ? route.category : categories[0];
  if (route.invalidCategory && replaceInvalid) updateRoute(category, null, { replace: true });
  await loadCategory(category, route);
}

async function syncRemoteSettings() {
  if (!state.userId) return;
  const remote = await loadUserSettings(state.userId);
  if (remote?.loaded && remote.settings) updateSettings(remote.settings);
  else if (remote?.reason === "not-found") await saveUserSettings(getSettings(), { expectedUserId: state.userId });
}

async function initialise() {
  bindSettings();
  bindLibraryControls();
  applySettings(getSettings(), { rerender: false });
  const access = await loadStudentAccess({ refresh: true });
  state.access = access;
  state.userId = access.session?.user?.id ? String(access.session.user.id) : null;
  state.progressEnabled = Boolean(access.authenticated && featureAllowed(access, "show_progress"));
  setStorageUser(state.userId);
  applyStudentFeatureVisibility(access);
  await syncRemoteSettings();
  applySettings(getSettings(), { rerender: false });
  if (!visibleCategories().length) {
    accessBoundaryFor("words", access.settings?.account_enabled === false);
    return;
  }
  const progressResult = await fetchCurriculumProgress();
  if (!progressResult?.error) normalizeProgress(apiData(progressResult, { progress: [], favorites: [] }));
  state.ready = true;
  await routePage();
}

initialise().catch(() => {
  document.documentElement.dataset.studentAccess = "error";
  setStateView({
    icon: "↻",
    titleEn: "We could not open the library",
    titleJa: "教材ライブラリを開けませんでした",
    bodyEn: "Return to the Review Hub, check your connection, and try again.",
    bodyJa: "Review Hubに戻り、通信状況を確認してもう一度お試しください。",
    action: (() => {
      const link = element("a", { text: text("Back to Review Hub", "Review Hubへ戻る"), attrs: { href: "/" } });
      return link;
    })(),
  });
});
