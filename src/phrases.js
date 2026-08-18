import { buildPhraseCatalog } from "./data.js";
import {
  applyThemePreference,
  getSettings,
  onSettingsChange,
  setStorageUser,
  safeLocalReturnPath,
  updateSettings,
  watchSystemTheme,
} from "./store.js";
import {
  speechRecognitionSupported,
  setAmbientPlayback,
  speakText,
  startSpeechPractice,
  stopAudio,
  stopSpeechPractice,
  syncAmbientFromSettings,
} from "./audio.js?v=20260818-audio";
import {
  getStudentClient,
  getStudentSession,
  loadUserSettings,
  saveUserSettings,
} from "./supabase.js";
import { applyLanguageMode, languageModeFromSettings, uiText } from "./i18n.js";
import { celebrate, installPlayfulInteractions } from "./effects.js";

const LEGACY_ACTIVITY_KEY = "teh_phrase_activity_v1";
const ACTIVITY_KEY_PREFIX = "teh_phrase_activity_v2";
const ANONYMOUS_ACTIVITY_KEY = `${ACTIVITY_KEY_PREFIX}:anonymous`;
const DEFAULT_CATEGORY = "everyday expressions";
const PHRASE_PAGE_SIZE = 24;
const CATEGORY_RULES = [
  ["feelings", /feeling|annoy|frustrat|angry|nervous|stress|irritat|mood|hate|interest|prefer|preference|wish|hope/i],
  ["food & daily life", /food|restaurant|takeout|coffee|tea|order|lunch|dinner|breakfast|bath|weather|alcohol|drink|taste/i],
  ["sports & hobbies", /sport|soccer|golf|team|winning|\bwin\b|scor|first half|second half/i],
  ["work & learning", /work|learning|skill|behalf|broadcast|stream|technology|connected|meeting|attend/i],
  ["travel & places", /travel|position|movement|hometown|city|street|location|transport|driv|highway|car\b/i],
  ["time & change", /time|change|experience|already|yet|continuation|unexpected|used to/i],
  ["describing things", /sparkle|sparkly|glitter|glittery|shiny|description/i],
  ["grammar", /grammar|tense|pastquestions|past questions|present|perfect|either|neither|both|modal|possibility|comparison|compare|builder|preposition|supposed|wouldlike|choice/i],
  ["conversation", /conversation|reaction|response|repl(?:y|ies)|question|clarif|dialogue|agree|opinion|tell|daily|hear|heard|though|turntaking|gratitude|unavoidable|intention|reasonwith|cantbehelped|nuance/i],
];

let catalog = [];
let activity = {};
let activityStorageKey = null;
let activeActivityUserId = null;
let activeCategory = "all";
let activeLibraryKind = "phrase";
let searchText = "";
let activeRecognitionId = null;
let visiblePhraseLimit = PHRASE_PAGE_SIZE;

const routeParams = new URLSearchParams(window.location.search);
const returnPath = safeLocalReturnPath(routeParams.get("return"), "/");

function currentPhrasePath() {
  const url = new URL(window.location.href);
  ["code", "error", "error_code", "error_description"].forEach((key) => url.searchParams.delete(key));
  return `${url.pathname}${url.search}${url.hash}`;
}

function element(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (String(options.className || "").split(/\s+/).includes("jp")) {
    node.setAttribute("lang", "ja");
  }
  if (options.text !== undefined) node.textContent = String(options.text);
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([name, value]) => {
      if (value !== undefined && value !== null) node.setAttribute(name, String(value));
    });
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child) node.append(child);
  }
  return node;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function activityKeyFor(userId) {
  return userId
    ? `${ACTIVITY_KEY_PREFIX}:user:${encodeURIComponent(String(userId))}`
    : ANONYMOUS_ACTIVITY_KEY;
}

function readActivity(storageKey) {
  try {
    const current = storageKey ? localStorage.getItem(storageKey) : null;
    const legacyAnonymous = storageKey === ANONYMOUS_ACTIVITY_KEY && current === null
      ? localStorage.getItem(LEGACY_ACTIVITY_KEY)
      : null;
    const parsed = JSON.parse(current ?? legacyAnonymous ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveActivity() {
  if (!activityStorageKey) return;
  try {
    localStorage.setItem(activityStorageKey, JSON.stringify(activity));
  } catch {
    showToast("This browser could not save the phrase history.");
  }
}

function activateActivityScope(session) {
  activeActivityUserId = session?.user?.id ? String(session.user.id) : null;
  activityStorageKey = activityKeyFor(activeActivityUserId);
  activity = readActivity(activityStorageKey);
  // Copy an old unscoped cache only into the explicitly anonymous scope.
  if (!activeActivityUserId) saveActivity();
}

async function prepareActivityScope() {
  let session;
  try {
    session = normaliseSession(await getStudentSession());
  } catch {
    // Fail closed: never show anonymous or another account's cache when identity is unresolved.
    activityStorageKey = null;
    activeActivityUserId = null;
    activity = {};
    return null;
  }

  activateActivityScope(session);
  return session;
}

async function syncRemoteSettings(session) {
  const expectedUserId = session?.user?.id ? String(session.user.id) : null;
  if (!expectedUserId) return true;
  const remote = await loadUserSettings(expectedUserId);
  if (expectedUserId !== activeActivityUserId) return false;
  if (remote.loaded && remote.settings) {
    updateSettings(remote.settings);
  } else if (remote.reason === "not-found") {
    await saveUserSettings(getSettings(), { expectedUserId });
  }
  const confirmedSession = normaliseSession(await getStudentSession());
  const confirmedUserId = confirmedSession?.user?.id ? String(confirmedSession.user.id) : null;
  return expectedUserId === activeActivityUserId && confirmedUserId === expectedUserId;
}

async function refreshActivityScope(sessionValue) {
  const session = normaliseSession(sessionValue);
  const nextUserId = session?.user?.id ? String(session.user.id) : null;
  if (nextUserId === activeActivityUserId && activityStorageKey) return;

  // Clear and rerender from the new scope before any remote request completes.
  setStorageUser(nextUserId);
  activateActivityScope(session);
  applySettings(getSettings());
  renderFilters();
  renderPhrases();
  const settingsReady = await syncRemoteSettings(session);
  if (!settingsReady || nextUserId !== activeActivityUserId) return;
  applySettings(getSettings());
  renderFilters();
  renderPhrases();
  await mergeRemoteActivity(session);
  if (nextUserId !== activeActivityUserId) return;
  renderFilters();
  renderPhrases();
}

function bindActivityScopeChanges() {
  const client = getStudentClient();
  client?.auth?.onAuthStateChange?.((_event, session) => {
    void refreshActivityScope(session);
  });
}

function phraseId(phrase) {
  if (phrase.id) return String(phrase.id);
  const source = `${phrase.lessonId || "lesson"}:${phrase.en || ""}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${phrase.lessonId || "phrase"}-${(hash >>> 0).toString(36)}`;
}

function categoryFor(phrase) {
  const source = [
    phrase.category,
    phrase.topic,
    phrase.note,
    phrase.en,
    phrase.jp,
  ].filter(Boolean).join(" ");
  const match = CATEGORY_RULES.find(([, rule]) => rule.test(source));
  return match ? match[0] : DEFAULT_CATEGORY;
}

function isSafeLibraryPhrase(phrase) {
  const english = String(phrase.en || "").trim();
  const japanese = String(phrase.jp || "").trim();
  if (!english || !japanese) return false;
  if (
    /^聞こえた英文をそのまま入力してください[。.]?$/.test(japanese)
    || /^文を組み立てましょう[：:]/.test(japanese)
    || /^語順を並べましょう[：:]/.test(japanese)
  ) {
    return false;
  }
  if (/\s(?:\/|[-–—])\s/.test(english)) return false;
  if (/^(?:top|bottom)\s+(?:left|right)\.?$/i.test(english)) return false;

  return true;
}

function compactNote(value, maximum = 120) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maximum) return text;
  const shortened = text.slice(0, maximum - 1).replace(/\s+\S*$/, "");
  return `${shortened || text.slice(0, maximum - 1)}…`;
}

function usageSceneFor(phrase, category) {
  const topic = String(phrase.topic || "").toLowerCase();
  const english = String(phrase.en || "").toLowerCase();
  const source = `${topic} ${english}`;
  const rules = [
    [/clarif|learning|say that again|what do you mean|example/, "Use this when you need someone to repeat or explain something more clearly.", "聞き取れなかった時や、説明をもっと具体的にしてほしい時に使います。"],
    [/behalf/, "Use this when someone acts, replies, or speaks for another person or group.", "誰かの代わりに返信・発言・行動する場面で使います。"],
    [/restaurant|takeout|polite orders|wouldlike|coffee|tea|menu|to go|for here/, "Use this when ordering or speaking politely in a café or restaurant.", "カフェやレストランで、丁寧に注文・確認する時に使います。"],
    [/gratitude|my pleasure|no problem|no worries|you’re welcome|don’t mention/, "Use this as a natural response to thanks, help, or a small apology.", "感謝された時や、軽い謝罪にやさしく返す時に使います。"],
    [/reaction|opinion|exactly|for real|makes sense|good point|so true/, "Use this to show agreement, understanding, or a strong reaction.", "相手に同意したり、納得・共感をはっきり示す時に使います。"],
    [/decision|choice|prefer|preference|rather|think about it/, "Use this when discussing a choice, preference, or decision.", "選択肢・好み・決断について話す時に使います。"],
    [/unavoidable|cantbehelped|came up|no choice|nothing we can do/, "Use this when plans change or a situation cannot be avoided.", "急な事情で予定が変わった時や、仕方のない状況を説明する時に使います。"],
    [/intention|on purpose/, "Use this when asking whether an action was intentional.", "行動がわざとかどうかを確認・説明する時に使います。"],
    [/feeling|nuance|annoy|frustrat|irritat|stress|tired/, "Use this to describe your present feeling and its intensity.", "今の気持ちや、その感情の強さを伝える時に使います。"],
    [/sport|winning|\bwin\b|golf|soccer|scored/, "Use this when talking about a match, a prediction, or a sports result.", "試合の予想・勝敗・得点について話す時に使います。"],
    [/\bhear|heard/, "Use this when explaining what you heard or how much you know about a topic.", "聞こえた音や、話題・名前をどの程度知っているか伝える時に使います。"],
    [/position|top-right|left|right/, "Use this when giving a clear position or screen-location instruction.", "画面や図の位置を具体的に案内する時に使います。"],
    [/instagram|comments|works at/, "Use this when saying where you found information or where someone works.", "情報を見つけた場所や勤務先を説明する時に使います。"],
    [/danger|highway|crash/, "Use this in a casual conversation about a serious risk or imagined danger.", "危険な状況や「もし〜なら」という想像を話す時に使います。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(source));
  if (match) return { en: match[1], jp: match[2] };

  const fallbacks = {
    conversation: {
      en: "Use this as a natural response or follow-up in everyday conversation.",
      jp: "日常会話で自然に返事をしたり、会話を続けたりする時に使います。",
    },
    grammar: {
      en: "Use this when you want to apply the lesson pattern in a complete sentence.",
      jp: "学んだ文法パターンを、実際の一文として使う時に役立ちます。",
    },
    feelings: {
      en: "Use this when sharing a feeling, preference, or personal reaction.",
      jp: "気持ち・好み・自分の反応を相手に伝える時に使います。",
    },
    "food & daily life": {
      en: "Use this in an everyday conversation about food, plans, or routines.",
      jp: "食事・予定・日課など、身近な話題を話す時に使います。",
    },
    "sports & hobbies": {
      en: "Use this when chatting about sports, interests, or free-time activities.",
      jp: "スポーツ・興味・趣味について会話する時に使います。",
    },
    "work & learning": {
      en: "Use this in a lesson, meeting, or practical work conversation.",
      jp: "レッスン・会議・仕事上のやり取りで使います。",
    },
    "travel & places": {
      en: "Use this when talking about movement, transport, or a location.",
      jp: "移動・交通・場所について説明する時に使います。",
    },
    "time & change": {
      en: "Use this when describing an experience or a change over time.",
      jp: "経験や、時間とともに起きる変化を説明する時に使います。",
    },
    "describing things": {
      en: "Use this when describing how a person, object, or situation looks or feels.",
      jp: "人・物・状況の見た目や印象を説明する時に使います。",
    },
  };
  return fallbacks[category] || {
    en: "Use this as a complete, reusable chunk in everyday conversation.",
    jp: "日常会話で、そのまま使える一つのまとまりとして覚えましょう。",
  };
}

function grammarNoteFor(phrase) {
  const english = String(phrase.en || "").trim();
  const lower = english.toLowerCase();
  const stored = compactNote(phrase.note);
  const grammarStored = /(?:原形|過去|現在完了|比較級|ing|be動詞|一般動詞|前置詞|語順|文末|\+|did|might|would|than|because)/i.test(stored)
    ? stored
    : "";
  const rules = [
    [/^if\b.+,\s*i[’']d\b/, "Pattern: If + past form, would + base verb. It imagines an unreal or unlikely result.", "形は「If + 過去形, would + 動詞の原形」。現実とは違う想像を表します。"],
    [/\bi[’']ve got to\b/, "“I’ve got to + verb” is a conversational way to say “I have to + verb.”", "「I’ve got to + 動詞」は、会話で「〜しなければならない」を表します。"],
    [/\b(?:i|we|you|they)[’']?ve\b|\b(?:he|she|it) has\b/, "Present perfect: have/has + past participle connects an earlier experience or result to now.", "現在完了は「have / has + 過去分詞」。過去の経験・結果を今につなげます。"],
    [/\b(?:didn[’']t|did)\b/, "After did or didn’t, use the base form of the main verb.", "did / didn’t の後ろは、動詞の原形を使います。"],
    [/^(?:can|could) you\b/i, "Modal request: Can/Could + you + base verb. “Could” usually sounds softer.", "依頼の形は「Can / Could + you + 動詞の原形」。Could の方がやわらかく聞こえます。"],
    [/^(?:can|could) i\b/i, "Polite request: Can/Could + I + base verb.", "丁寧な依頼は「Can / Could + I + 動詞の原形」です。"],
    [/\bwould you like\b|\bwhat would you like\b/, "“Would you like + noun/to + verb?” makes a polite offer or question.", "「Would you like + 名詞 / to + 動詞」は、丁寧な提案・質問です。"],
    [/\bi[’']d like\b/, "“I’d like + noun” is the polite form of “I want + noun.”", "「I’d like + 名詞」は、「〜が欲しい」を丁寧に言う形です。"],
    [/\bi[’']d rather\b/, "“Would rather + base verb” expresses a preference in the current situation.", "「would rather + 動詞の原形」で、その場での好みを表します。"],
    [/\bmight\b/, "A modal is followed by a base verb or adjective phrase; “might” shows uncertain possibility.", "might の後ろは動詞の原形、または形容詞句。確実ではない可能性を表します。"],
    [/\b(?:better|easier|harder|more|less)\b.+\bthan\b/, "Comparative form + than shows the difference between two things.", "「比較級 + than」で、二つのものの違いを比べます。"],
    [/\bbecause\b/, "“Because + clause” adds the reason for the first idea.", "「because + 文」で、前の内容の理由を付け加えます。"],
    [/\bavoid\s+\w+ing\b/, "After “avoid,” use a noun or an -ing form, not “to + verb.”", "avoid の後ろは名詞または動詞の ing 形を使い、to + 動詞にはしません。"],
    [/\bprefer\b/, "Use “prefer A or B?” for a choice, and “prefer A to B” for a direct comparison.", "選択なら「prefer A or B」、直接比較なら「prefer A to B」を使います。"],
    [/\b(?:annoyed|frustrated|irritated|stressed|tired|interested)\b/, "Be + -ed adjective describes the person’s feeling or state.", "「be動詞 + -ed形容詞」は、人の気持ち・状態を表します。"],
    [/\b(?:annoying|interesting)\b/, "An -ing adjective describes the person or thing that causes the feeling.", "「-ing形容詞」は、その気持ちを起こさせる人・物・状況を表します。"],
    [/\bi[’']m\s+\w+ing\b/, "Be + verb-ing describes an action or situation in progress now.", "「be動詞 + 動詞ing」で、今進行中の動作・状況を表します。"],
    [/\bon (?:my|your|his|her|our|their) behalf\b|\bon behalf of\b/, "“On behalf of + person/group” is a fixed prepositional pattern.", "「on behalf of + 人・組織」は、「〜を代表して」という決まった形です。"],
    [/\bon purpose\b/, "“On purpose” works as an adverbial phrase meaning intentionally.", "「on purpose」は副詞句で、「わざと」を表します。"],
    [/\bthough[.!?]?$/i, "Sentence-final “though” adds a soft contrast: “..., though.”", "文末の though は、「〜だけどね」と対比をやわらかく加えます。"],
    [/\bhear(?:d)? (?:of|about)\b/, "Use “hear of” for knowing that something exists; use “hear about” for information or news.", "存在を知っているなら hear of、内容・ニュースを聞くなら hear about を使います。"],
    [/\bit can[’']t be helped\b/, "Modal passive pattern: can’t + be + past participle.", "助動詞の受け身は「can’t + be + 過去分詞」です。"],
    [/^there[’']s nothing\b/, "“There is + nothing + clause” says that no possible action exists.", "「There is + nothing + 文」で、「できることが何もない」と表します。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(lower));
  if (match) {
    return {
      en: match[1],
      jp: grammarStored || match[2],
    };
  }
  return {
    en: "This is a fixed conversational chunk; keep its word order when you reuse it.",
    jp: grammarStored || "会話で使う決まったまとまりなので、語順ごと覚えると自然です。",
  };
}

function vocabularyNoteFor(phrase) {
  const english = String(phrase.en || "").trim();
  const lower = english.toLowerCase();
  const rules = [
    [/\bon (?:my|your|his|her|our|their) behalf\b|\bon behalf of\b/, "“On behalf of” means acting for or representing someone.", "on behalf of は「〜の代わりに／〜を代表して」という意味です。"],
    [/\bactually\b/, "“Actually” introduces a correction, contrast, or more honest detail.", "actually は「実は／実際は」。訂正や本音を加える時に使います。"],
    [/\bwould rather\b/, "“Rather” marks the option you prefer in that situation.", "rather は、その場で「こちらの方がいい」という好みを表します。"],
    [/\bthough\b/, "Sentence-final “though” means “but” with a softer conversational tone.", "文末の though は、「〜だけどね」というやわらかいニュアンスです。"],
    [/\bappreciate\b/, "“Appreciate” expresses warm or strong thanks for an action.", "appreciate は、相手の行動に対する深い感謝を表します。"],
    [/\bmy pleasure\b/, "“My pleasure” is a warm, slightly polished reply to thanks.", "My pleasure. は、丁寧であたたかい「どういたしまして」です。"],
    [/\bno worries\b/, "“No worries” reassures someone that there is no problem.", "No worries. は「気にしないで／大丈夫」というやさしい返事です。"],
    [/\bno problem\b/, "“No problem” is a casual reply after a small favor or apology.", "No problem. は、軽いお願い・謝罪へのカジュアルな返事です。"],
    [/\bdon[’']t mention it\b/, "“Don’t mention it” means that thanks are unnecessary.", "Don’t mention it. は「お礼なんていいよ」という意味です。"],
    [/\bcome up\b/, "“Come up” can mean that an unexpected matter happened.", "come up は、急な用事・事情が「起きる」という意味でも使います。"],
    [/\bunavoidable\b/, "“Unavoidable” means impossible to prevent.", "unavoidable は「避けられない／やむを得ない」という意味です。"],
    [/\bon purpose\b/, "“On purpose” means intentionally, not by accident.", "on purpose は「わざと」。by accident「うっかり」と対照的です。"],
    [/\bno choice\b/, "“No choice” means there is no acceptable alternative.", "no choice は「他に選べる方法がない」という意味です。"],
    [/\bmight\b/, "“Might” shows a possibility that is not certain.", "might は「〜かもしれない」という不確かな可能性を表します。"],
    [/\bstressed out\b/, "“Stressed out” means mentally tired or overwhelmed by pressure.", "stressed out は、ストレスや負担で気持ちに余裕がない状態です。"],
    [/\bfrustrated\b/, "“Frustrated” is the feeling when something will not work as you want.", "frustrated は、思い通りにいかず「もどかしい」気持ちです。"],
    [/\birritated\b/, "“Irritated” is usually stronger and sharper than “annoyed.”", "irritated は annoyed より強く、はっきりした不快感です。"],
    [/\bannoyed\b/, "“Annoyed” describes a person who feels bothered.", "annoyed は、何かにイライラさせられている人の気持ちです。"],
    [/\bannoying\b/, "“Annoying” describes the thing or person causing irritation.", "annoying は、イライラの原因になる物・人・状況を表します。"],
    [/\bprefer\b/, "“Prefer” means to like one option more than another.", "prefer は「〜の方を好む」という意味です。"],
    [/\bhear(?:d)? of\b/, "“Hear of” means to know the name or existence of something.", "hear of は、名前・存在を聞いたことがあるという意味です。"],
    [/\bhear(?:d)? about\b/, "“Hear about” means to receive information or news about a topic.", "hear about は、話題・出来事の内容を聞くという意味です。"],
    [/\bhear(?:d)? it\b/, "With “hear it,” “it” is the sound or words that reached your ears.", "hear it の it は、実際に耳に入った音・言葉を指します。"],
    [/\bexactly\b/, "“Exactly” shows strong agreement: “That is precisely right.”", "Exactly. は「まさにその通り」と強く同意する表現です。"],
    [/\bfor real\b/, "“For real” is informal and can mean “seriously” or “that’s true.”", "For real. はカジュアルな「マジで／本当に」です。"],
    [/\bmakes sense\b/, "“Make sense” means to be logical or understandable.", "make sense は「筋が通る／理解できる」という意味です。"],
    [/\bgood point\b/, "A “good point” is a useful or convincing observation.", "good point は「よい指摘／納得できる点」です。"],
    [/\binstead\b/, "“Instead” introduces the replacement choice.", "instead は「その代わりに」。別の選択を示します。"],
    [/\breason with\b/, "“Reason with” means to talk calmly and try to persuade someone.", "reason with は、落ち着いて話し、相手を説得しようとすることです。"],
    [/\bcan[’']t be helped\b/, "“Can’t be helped” means the situation cannot be changed.", "can’t be helped は「仕方がない／変えられない」という意味です。"],
    [/\bto go\b/, "In food service, “to go” means for takeaway.", "飲食店の to go は「持ち帰りで」という意味です。"],
    [/\bfor here\b/, "In food service, “for here” means eating or drinking inside.", "飲食店の for here は「店内で」という意味です。"],
    [/\binterested\b/, "“Interested” describes the person who feels interest.", "interested は、興味を持っている人の気持ちを表します。"],
    [/\binteresting\b/, "“Interesting” describes the thing that creates interest.", "interesting は、興味を引く物・話・出来事を表します。"],
    [/\bexpected\b/, "“Expected” refers to what you thought would happen.", "expected は「予想していた／期待していた」という意味です。"],
    [/\bfirst half\b/, "“First half” is the period before halftime in a match.", "first half は試合の「前半」です。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(lower));
  if (match) {
    return {
      en: match[1],
      jp: match[2],
    };
  }

  const keyChunk = english
    .replace(/[.!?]+$/g, "")
    .split(/\s+/)
    .slice(0, 6)
    .join(" ");
  return {
    en: `Key chunk: “${keyChunk}”. Learn these words together, not one word at a time.`,
    jp: `「${keyChunk}」を一語ずつではなく、一つのまとまりとして覚えましょう。`,
  };
}

function learningDetailsFor(phrase) {
  const category = categoryFor(phrase);
  return {
    scene: usageSceneFor(phrase, category),
    grammar: grammarNoteFor(phrase),
    vocabulary: vocabularyNoteFor(phrase),
  };
}

function categoryLabel(category) {
  const language = settingsLanguage(getSettings());
  if (category === "all") {
    const labels = {
      word: ["All words", "すべての単語"],
      pattern: ["All sentence patterns", "すべての文型パターン"],
      phrase: ["All phrases", "すべてのフレーズ"],
    }[activeLibraryKind] || ["All phrases", "すべてのフレーズ"];
    return uiText(labels[0], labels[1], language);
  }
  if (category === "favorites") return uiText("★ Favorites", "★ お気に入り", language);
  const english = category
    .split(" ")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  const japanese = {
    feelings: "気持ち",
    "food & daily life": "食事・日常",
    "sports & hobbies": "スポーツ・趣味",
    "work & learning": "仕事・学習",
    "travel & places": "旅行・場所",
    "time & change": "時間・変化",
    "describing things": "表現・描写",
    grammar: "文法",
    conversation: "会話",
    [DEFAULT_CATEGORY]: "日常表現",
  }[category] || english;
  return uiText(english, japanese, language);
}

function settingsLanguage(settings) {
  return languageModeFromSettings(settings);
}

function settingsSound(settings) {
  if (typeof settings.voiceEnabled === "boolean") return settings.voiceEnabled;
  if (typeof settings.sound === "boolean") return settings.sound;
  if (typeof settings.soundEnabled === "boolean") return settings.soundEnabled;
  return true;
}

function updateAndSyncSettings(patch) {
  const settings = updateSettings(patch);
  if (activeActivityUserId) {
    saveUserSettings(settings, { expectedUserId: activeActivityUserId }).catch(() => {});
  }
  return settings;
}

function applySettings(settings = getSettings()) {
  const language = settingsLanguage(settings);
  const sound = settingsSound(settings);
  applyLanguageMode(language);
  const languageToggle = document.querySelector("#languageToggle");
  const voiceToggle = document.querySelector("#voiceToggle");
  const sfxToggle = document.querySelector("#sfxToggle");
  const ambientToggle = document.querySelector("#ambientToggle");
  const ambientTrack = document.querySelector("#ambientTrack");
  const voiceSelect = document.querySelector("#voiceSelect");
  const playbackRate = document.querySelector("#playbackRate");
  const themeToggle = document.querySelector("#themeToggle");
  if (languageToggle) languageToggle.value = language;
  if (voiceToggle) {
    voiceToggle.textContent = sound
      ? uiText("Voice On", "ボイス オン", language)
      : uiText("Voice Off", "ボイス オフ", language);
    voiceToggle.setAttribute("aria-pressed", String(sound));
  }
  if (sfxToggle) {
    sfxToggle.textContent = settings.sfxEnabled
      ? uiText("SFX On", "効果音 オン", language)
      : uiText("SFX Off", "効果音 オフ", language);
    sfxToggle.setAttribute("aria-pressed", String(settings.sfxEnabled));
  }
  if (ambientToggle) {
    ambientToggle.textContent = settings.ambientEnabled
      ? uiText("Ambient On", "環境音 オン", language)
      : uiText("Ambient Off", "環境音 オフ", language);
    ambientToggle.setAttribute("aria-pressed", String(settings.ambientEnabled));
  }
  if (ambientTrack) ambientTrack.value = settings.ambientTrack || "calm_focus";
  if (voiceSelect) voiceSelect.value = settings.voice || "us";
  if (playbackRate) playbackRate.value = String(settings.playbackRate || 1);
  if (themeToggle) themeToggle.value = settings.theme || "light";
  applyThemePreference(settings.theme);
}

function bindSettings() {
  const mobileSettingsToggle = document.querySelector("#mobileSettingsToggle");
  const settingsControls = document.querySelector("#siteSettingsControls");
  mobileSettingsToggle?.addEventListener("click", () => {
    const expanded = mobileSettingsToggle.getAttribute("aria-expanded") === "true";
    mobileSettingsToggle.setAttribute("aria-expanded", String(!expanded));
    settingsControls?.classList.toggle("mobile-open", !expanded);
  });
  document.querySelector("#languageToggle")?.addEventListener("change", (event) => {
    const next = event.currentTarget.value;
    updateAndSyncSettings({
      showJapanese: next !== "en",
      languageMode: next,
    });
  });
  document.querySelector("#voiceToggle")?.addEventListener("click", () => {
    const next = !settingsSound(getSettings());
    if (!next) stopAudio();
    updateAndSyncSettings({ voiceEnabled: next });
  });
  document.querySelector("#sfxToggle")?.addEventListener("click", () => {
    updateAndSyncSettings({ sfxEnabled: !getSettings().sfxEnabled });
  });
  document.querySelector("#ambientToggle")?.addEventListener("click", async () => {
    const next = !getSettings().ambientEnabled;
    const settings = updateAndSyncSettings({ ambientEnabled: next });
    await setAmbientPlayback(next, { ...settings, userGesture: true });
  });
  document.querySelector("#ambientTrack")?.addEventListener("change", async (event) => {
    const settings = updateAndSyncSettings({ ambientTrack: event.currentTarget.value });
    if (settings.ambientEnabled) await setAmbientPlayback(true, { ...settings, userGesture: true });
  });
  document.querySelector("#voiceSelect")?.addEventListener("change", (event) => {
    updateAndSyncSettings({ voice: event.currentTarget.value === "gb" ? "gb" : "us" });
  });
  document.querySelector("#playbackRate")?.addEventListener("change", (event) => {
    updateAndSyncSettings({ playbackRate: Number(event.currentTarget.value) });
  });
  document.querySelector("#themeToggle")?.addEventListener("change", (event) => {
    updateAndSyncSettings({ theme: event.currentTarget.value });
  });
  onSettingsChange((settings) => {
    applySettings(settings);
    if (catalog.length) {
      renderFilters();
      renderPhrases();
    }
  });
  applySettings();
  syncAmbientFromSettings();
  watchSystemTheme(() => applyThemePreference(getSettings().theme));
}

installPlayfulInteractions();

function normaliseSession(value) {
  if (!value) return null;
  return value.session || value.data?.session || (value.user ? value : null);
}

async function mergeRemoteActivity(session) {
  try {
    const client = getStudentClient();
    if (!session?.user || !client) return;
    const expectedUserId = String(session.user.id);
    if (expectedUserId !== activeActivityUserId) return;
    const result = await client
      .from("review_phrase_activity")
      .select("*")
      .eq("user_id", session.user.id)
      .limit(1000);
    if (result.error || !Array.isArray(result.data)) return;
    if (expectedUserId !== activeActivityUserId) return;
    result.data.forEach((record) => {
      const id = record.phrase_id || record.phraseId;
      if (!id) return;
      const local = activity[id] || {};
      activity[id] = {
        count: Math.max(
          Number(local.count || 0),
          Number(record.practice_count ?? record.practiceCount ?? 0),
        ),
        lastDate: [local.lastDate, record.last_practiced_at, record.lastPracticedAt]
          .filter(Boolean)
          .sort((a, b) => new Date(b) - new Date(a))[0] || null,
        favorite: Boolean(local.favorite || record.is_favorite || record.isFavorite),
      };
    });
    saveActivity();
  } catch {
    // The public phrase library remains fully usable with local activity.
  }
}

async function syncRemoteActivity(id) {
  try {
    const session = normaliseSession(await getStudentSession());
    const client = getStudentClient();
    if (
      !session?.user
      || !client
      || String(session.user.id) !== activeActivityUserId
    ) return;
    const record = activity[id] || {};
    await client.from("review_phrase_activity").upsert({
      user_id: session.user.id,
      phrase_id: id,
      practice_count: Number(record.count || 0),
      last_practiced_at: record.lastDate || null,
      is_favorite: Boolean(record.favorite),
    }, { onConflict: "user_id,phrase_id" });
  } catch {
    // Local history has already been saved; online sync can retry next time.
  }
}

function recordPractice(id) {
  const previous = activity[id] || {};
  activity[id] = {
    ...previous,
    count: Number(previous.count || 0) + 1,
    lastDate: new Date().toISOString(),
    favorite: Boolean(previous.favorite),
  };
  saveActivity();
  void syncRemoteActivity(id);
}

function toggleFavorite(id) {
  const previous = activity[id] || {};
  activity[id] = {
    ...previous,
    count: Number(previous.count || 0),
    lastDate: previous.lastDate || null,
    favorite: !previous.favorite,
  };
  saveActivity();
  void syncRemoteActivity(id);
  renderPhrases();
}

function formatLastDate(value) {
  const language = settingsLanguage(getSettings());
  if (!value) return uiText("Not practised yet", "未練習", language);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return uiText("Practised before", "練習済み", language);
  const formatted = new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  return uiText(`Last: ${formatted}`, `最終：${formatted}`, language);
}

function feedbackText(status) {
  if (!status) return "";
  if (typeof status === "string") return status;
  const english = status.messageEn || status.message || status.state || "";
  const japanese = status.messageJa || "";
  const language = settingsLanguage(getSettings());
  if (language === "bilingual" && english && japanese) return `${english}\n${japanese}`;
  return uiText(english, japanese, language);
}

async function listenToPhrase(phrase, voiceCode, button, statusNode, language = "en") {
  const interfaceLanguage = settingsLanguage(getSettings());
  if (!settingsSound(getSettings())) {
    showToast(uiText("Turn Sound On to hear this phrase.", "音声を聞くには「音声オン」にしてください。", interfaceLanguage));
    return;
  }
  const accent = language === "ja" ? "Japanese" : voiceCode === "gb" ? "UK" : "US";
  const spokenText = language === "ja" ? phrase.jp : phrase.en;
  stopSpeechPractice?.();
  activeRecognitionId = null;
  button.disabled = true;
  statusNode.textContent = uiText(
    `Preparing the ${accent} voice…`,
    `${language === "ja" ? "日本語" : accent}の自然音声を準備中です…`,
    interfaceLanguage,
  );
  try {
    const result = await speakText(spokenText, {
      voice: voiceCode,
      language,
      onStatus: (status) => {
        const message = feedbackText(status);
        if (message) statusNode.textContent = message;
      },
    });
    if (result?.played) {
      recordPractice(phrase.id);
      statusNode.textContent = uiText(
        `${accent} audio played. Compare both accents or say it yourself.`,
        `${language === "ja" ? "日本語" : accent}の音声を再生しました。英語音声を聞き比べたり、自分で言ったりしてみましょう。`,
        interfaceLanguage,
      );
      updateCardStats(phrase.id);
    } else if (!result?.cancelled) {
      statusNode.textContent = uiText("Audio is temporarily unavailable. Please try again.", "音声を一時的に利用できません。もう一度お試しください。", interfaceLanguage);
    }
  } catch (error) {
    statusNode.textContent = error?.message || uiText("Audio is temporarily unavailable. Please try again.", "音声を一時的に利用できません。もう一度お試しください。", interfaceLanguage);
  } finally {
    button.disabled = false;
  }
}

async function practiseSpeaking(phrase, button, statusNode) {
  if (activeRecognitionId === phrase.id) {
    stopSpeechPractice?.();
    activeRecognitionId = null;
    button.classList.remove("listening");
    button.textContent = uiText("Speak", "話す", settingsLanguage(getSettings()));
    statusNode.textContent = "Speaking practice stopped.";
    return;
  }

  stopAudio();
  stopSpeechPractice?.();
  activeRecognitionId = phrase.id;
  button.classList.add("listening");
  button.textContent = "Stop";
  statusNode.textContent = "Listening… Say the complete sentence naturally.";
  try {
    const result = await startSpeechPractice(phrase.en, {
      onStatus: (status) => {
        const message = feedbackText(status);
        if (message) statusNode.textContent = message;
      },
    });
    if (result?.transcript) {
      const messageEn = result.messageEn
        || (result.band === "natural"
          ? "Natural and clear."
          : result.band === "close"
            ? "Very close. Try it once more for a smoother rhythm."
            : "Good attempt. Listen again, then repeat the full sentence.");
      const messageJa = result.messageJa || "もう一度お手本を聞いて、英文全体を練習しましょう。";
      const interfaceLanguage = settingsLanguage(getSettings());
      statusNode.textContent = interfaceLanguage === "bilingual"
        ? `${messageEn} Heard: “${result.transcript}”\n${messageJa} 認識した音声：「${result.transcript}」`
        : uiText(
          `${messageEn} Heard: “${result.transcript}”`,
          `${messageJa} 認識した音声：「${result.transcript}」`,
          interfaceLanguage,
        );
      recordPractice(phrase.id);
      updateCardStats(phrase.id);
      if (["excellent", "good", "natural", "close"].includes(result.band)) {
        celebrate(button.closest(".phrase-card") || button, { speaking: true });
      }
    }
  } catch (error) {
    statusNode.textContent = error?.message
      || "Speaking practice is unavailable in this browser. You can still listen and repeat.";
  } finally {
    if (activeRecognitionId === phrase.id) activeRecognitionId = null;
    button.classList.remove("listening");
    button.textContent = uiText("Speak", "話す", settingsLanguage(getSettings()));
  }
}

function updateCardStats(id) {
  const node = document.querySelector(`[data-phrase-stats="${CSS.escape(id)}"]`);
  if (!node) return;
  const record = activity[id] || {};
  node.textContent = uiText(
    `${Number(record.count || 0)} practices · ${formatLastDate(record.lastDate)}`,
    `練習 ${Number(record.count || 0)}回 · ${formatLastDate(record.lastDate)}`,
    settingsLanguage(getSettings()),
  );
}

function createLearningItem(labelEn, labelJp, detail) {
  return element("section", { className: "phrase-learning-item" }, [
    element("h3", {
      className: "phrase-learning-label",
      text: uiText(labelEn, labelJp, settingsLanguage(getSettings())),
    }),
    element("p", { className: "phrase-learning-text", text: detail.en }),
    element("p", { className: "phrase-learning-text phrase-learning-jp jp", text: detail.jp }),
  ]);
}

function createPhraseCard(phrase) {
  const id = phrase.id;
  const record = activity[id] || {};
  const sourceDate = phrase.lessonDate
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
      .format(new Date(`${String(phrase.lessonDate).slice(0, 10)}T12:00:00`))
    : "";
  const category = categoryFor(phrase);
  const learning = phrase.learning || learningDetailsFor(phrase);
  const language = settingsLanguage(getSettings());
  const isPattern = phrase.libraryKind === "pattern";
  const displayEnglish = isPattern && phrase.pattern ? phrase.pattern : phrase.en;

  const favorite = element("button", {
    className: `favorite${record.favorite ? " active" : ""}`,
    text: record.favorite
      ? uiText("★ Saved", "★ 保存済み", language)
      : uiText("☆ Save", "☆ 保存", language),
    attrs: {
      type: "button",
      "aria-pressed": String(Boolean(record.favorite)),
      "aria-label": `${record.favorite ? "Remove" : "Add"} ${phrase.en} ${record.favorite ? "from" : "to"} favorites`,
    },
  });
  favorite.addEventListener("click", () => toggleFavorite(id));

  const status = element("p", {
    className: "phrase-note phrase-speaking-status",
    text: "",
    attrs: { role: "status", "aria-live": "polite" },
  });
  const listenUs = element("button", {
    className: "phrase-audio-btn",
    text: "US · Ava",
    attrs: {
      type: "button",
      "data-voice": "us",
      "aria-label": `Play ${phrase.en} with a US accent`,
    },
  });
  const listenGb = element("button", {
    className: "phrase-audio-btn",
    text: "UK · Libby",
    attrs: {
      type: "button",
      "data-voice": "gb",
      "aria-label": `Play ${phrase.en} with a UK accent`,
    },
  });
  const listenJa = element("button", {
    className: "phrase-audio-btn jp",
    text: "JP · Nanami",
    attrs: {
      type: "button",
      "data-voice": "ja",
      "aria-label": `日本語の意味を自然な日本語音声で再生：${phrase.jp}`,
    },
  });
  const speak = element("button", {
    className: "mic-btn",
    text: speechRecognitionSupported()
      ? uiText("Speak", "話す", language)
      : uiText("Speaking unavailable", "発話認識は利用できません", language),
    attrs: {
      type: "button",
      disabled: speechRecognitionSupported() ? null : "",
      title: speechRecognitionSupported()
        ? uiText("Practise with speech recognition", "音声認識で発話練習", language)
        : uiText("Speech recognition is unavailable in this browser. You can still use the audio buttons.", "このブラウザでは音声認識を利用できません。音声再生は引き続き利用できます。", language),
      "aria-label": speechRecognitionSupported()
        ? `Practise saying ${phrase.en}`
        : uiText(`Speaking practice unavailable for ${phrase.en}`, `${phrase.en}の発話練習はこのブラウザでは利用できません`, language),
    },
  });
  listenUs.addEventListener("click", () => void listenToPhrase(phrase, "us", listenUs, status));
  listenGb.addEventListener("click", () => void listenToPhrase(phrase, "gb", listenGb, status));
  listenJa.addEventListener("click", () => void listenToPhrase(phrase, "ja", listenJa, status, "ja"));
  speak.addEventListener("click", () => void practiseSpeaking(phrase, speak, status));

  const lessonLink = element("a", {
    className: "phrase-source-link",
    attrs: {
      href: phrase.lessonId
        ? `/lesson.html?${new URLSearchParams({
            id: phrase.lessonId,
            return: currentPhrasePath(),
          }).toString()}`
        : returnPath,
    },
    text: [phrase.lessonTitle || "English Review", sourceDate].filter(Boolean).join(" · "),
  });
  const source = element("p", { className: "phrase-note" }, [
    element("span", { text: uiText("From: ", "出典：", language) }),
    lessonLink,
  ]);
  const stats = element("p", {
    className: "phrase-note",
    text: uiText(
      `${Number(record.count || 0)} practices · ${formatLastDate(record.lastDate)}`,
      `練習 ${Number(record.count || 0)}回 · ${formatLastDate(record.lastDate)}`,
      language,
    ),
    attrs: { "data-phrase-stats": id },
  });

  return element("article", {
    className: "phrase-card",
    attrs: { "data-category": category, "data-phrase-id": id },
  }, [
    element("div", { className: "phrase-card-top" }, [
      element("div", {}, [
        element("span", { className: "lesson-date", text: categoryLabel(category) }),
        element("h2", { text: displayEnglish }),
      ]),
      favorite,
    ]),
    isPattern && displayEnglish !== phrase.en
      ? element("p", {
          className: "phrase-note",
          text: uiText(`Example: ${phrase.en}`, `例文：${phrase.en}`, language),
        })
      : null,
    element("p", { className: "jp", text: phrase.jp || "" }),
    element("div", {
      className: "phrase-learning",
      attrs: { "aria-label": `Usage guide for ${phrase.en}` },
    }, [
      createLearningItem("Usage scene", "使う場面", learning.scene),
      createLearningItem("Grammar", "文法", learning.grammar),
      createLearningItem("Vocabulary", "語彙", learning.vocabulary),
    ]),
    source,
    stats,
    element("div", { className: "phrase-actions" }, [
      element("div", {
        className: "phrase-audio-group",
        attrs: {
          role: "group",
          "aria-label": `Choose a playback accent for ${phrase.en}`,
        },
      }, [listenUs, listenGb, listenJa]),
      speak,
    ]),
    status,
  ]);
}

function filteredCatalog() {
  const query = searchText.trim().toLocaleLowerCase();
  return catalog.filter((phrase) => {
    if ((phrase.libraryKind || "phrase") !== activeLibraryKind) return false;
    const record = activity[phrase.id] || {};
    const matchesCategory = activeCategory === "all"
      || (activeCategory === "favorites" && record.favorite)
      || categoryFor(phrase) === activeCategory;
    if (!matchesCategory) return false;
    if (!query) return true;
    return [
      phrase.en,
      phrase.jp,
      phrase.note,
      phrase.topic,
      phrase.lessonTitle,
      phrase.learning?.scene?.en,
      phrase.learning?.scene?.jp,
      phrase.learning?.grammar?.en,
      phrase.learning?.grammar?.jp,
      phrase.learning?.vocabulary?.en,
      phrase.learning?.vocabulary?.jp,
    ].some((value) => String(value || "").toLocaleLowerCase().includes(query));
  });
}

function renderPhrases() {
  const grid = document.querySelector("#phraseGrid");
  if (!grid) return;
  const phrases = filteredCatalog();
  const visiblePhrases = phrases.slice(0, visiblePhraseLimit);
  const results = document.querySelector("#phraseResults");
  if (results) {
    const noun = activeLibraryKind === "word"
      ? "word"
      : activeLibraryKind === "pattern"
        ? "sentence pattern"
        : "phrase";
    results.textContent = uiText(
      `${visiblePhrases.length} of ${phrases.length} ${phrases.length === 1 ? noun : `${noun}s`} shown.`,
      `${phrases.length}${activeLibraryKind === "word" ? "語" : activeLibraryKind === "pattern" ? "文型" : "フレーズ"}中${visiblePhrases.length}件を表示しています。`,
      settingsLanguage(getSettings()),
    );
  }
  grid.replaceChildren();
  const loadMoreArea = document.querySelector("#phraseLoadMoreArea");
  const loadMore = document.querySelector("#phraseLoadMore");
  const loadMoreStatus = document.querySelector("#phraseLoadMoreStatus");
  if (!phrases.length) {
    if (loadMoreArea) loadMoreArea.hidden = true;
    if (loadMoreStatus) loadMoreStatus.textContent = "";
    grid.append(element("article", { className: "phrase-card" }, [
      element("h2", {
        text: activeCategory === "favorites"
          ? uiText("No saved phrases yet", "保存したフレーズはまだありません", settingsLanguage(getSettings()))
          : uiText("No phrase matches your search", "検索に合うフレーズがありません", settingsLanguage(getSettings())),
      }),
      element("p", {
        text: activeCategory === "favorites"
          ? uiText("Use the ☆ Save button to build your personal list.", "☆ 保存ボタンで自分のリストを作れます。", settingsLanguage(getSettings()))
          : uiText("Try a shorter English or Japanese search.", "英語または日本語の検索語を短くしてみてください。", settingsLanguage(getSettings())),
      }),
      element("p", {
        className: "jp",
        text: activeCategory === "favorites"
          ? "☆ Save ボタンでお気に入り表現を追加できます。"
          : "検索語を短くして、もう一度お試しください。",
      }),
    ]));
    return;
  }
  visiblePhrases.forEach((phrase) => grid.append(createPhraseCard(phrase)));
  const remaining = Math.max(0, phrases.length - visiblePhrases.length);
  if (loadMoreArea) loadMoreArea.hidden = remaining === 0;
  if (loadMore) loadMore.textContent = uiText(
    `Load ${Math.min(PHRASE_PAGE_SIZE, remaining)} more`,
    `さらに${Math.min(PHRASE_PAGE_SIZE, remaining)}件を表示`,
    settingsLanguage(getSettings()),
  );
  if (loadMoreStatus) loadMoreStatus.textContent = uiText(
    `Showing ${visiblePhrases.length} of ${phrases.length}.`,
    `${phrases.length}件中${visiblePhrases.length}件を表示。`,
    settingsLanguage(getSettings()),
  );
}

function resetPhrasePage() {
  visiblePhraseLimit = PHRASE_PAGE_SIZE;
}

function bindLoadMore() {
  document.querySelector("#phraseLoadMore")?.addEventListener("click", () => {
    const previousCount = Math.min(visiblePhraseLimit, filteredCatalog().length);
    visiblePhraseLimit += PHRASE_PAGE_SIZE;
    renderPhrases();
    document.querySelectorAll("#phraseGrid .phrase-card")[previousCount]?.querySelector(
      "button, a, input, select, textarea",
    )?.focus();
  });
}

function bindLibraryTabs() {
  document.querySelectorAll("[data-library-kind]").forEach((button) => {
    button.addEventListener("click", () => {
      activeLibraryKind = ["phrase", "word", "pattern"].includes(button.dataset.libraryKind)
        ? button.dataset.libraryKind
        : "phrase";
      activeCategory = "all";
      resetPhrasePage();
      document.querySelectorAll("[data-library-kind]").forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      renderFilters();
      renderPhrases();
    });
  });
  document.querySelector(".library-tabs[role='tablist']")?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...event.currentTarget.querySelectorAll("[role='tab']")];
    const currentIndex = Math.max(0, tabs.indexOf(document.activeElement));
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    tabs[nextIndex]?.click();
    tabs[nextIndex]?.focus();
  });
}

function renderFilters() {
  const container = document.querySelector("#phraseFilters");
  if (!container) return;
  const available = new Set(catalog.map(categoryFor));
  const categories = ["all", "favorites", ...CATEGORY_RULES
    .map(([category]) => category)
    .filter((category) => available.has(category))];
  if (available.has(DEFAULT_CATEGORY)) categories.push(DEFAULT_CATEGORY);
  container.replaceChildren();
  categories.forEach((category) => {
    const button = element("button", {
      className: `filter-chip${activeCategory === category ? " active" : ""}`,
      text: categoryLabel(category),
      attrs: {
        type: "button",
        "data-filter": category,
        "aria-pressed": String(activeCategory === category),
      },
    });
    button.addEventListener("click", () => {
      activeCategory = category;
      resetPhrasePage();
      renderFilters();
      renderPhrases();
    });
    container.append(button);
  });
}

function bindSearch() {
  const search = document.querySelector("#phraseSearch");
  search?.addEventListener("input", () => {
    searchText = search.value;
    resetPhrasePage();
    renderPhrases();
  });
}

async function initialise() {
  document.querySelectorAll(".phrase-return-link").forEach((link) => {
    link.href = returnPath;
  });
  let session = await prepareActivityScope();
  setStorageUser(activeActivityUserId);
  if (!(await syncRemoteSettings(session))) {
    session = normaliseSession(await getStudentSession());
    activateActivityScope(session);
    setStorageUser(activeActivityUserId);
    await syncRemoteSettings(session);
  }
  bindSettings();
  bindSearch();
  bindLibraryTabs();
  bindLoadMore();
  const phrases = await buildPhraseCatalog();
  catalog = (Array.isArray(phrases) ? phrases : [])
    .filter((phrase) => phrase && phrase.en)
    .filter((phrase) => phrase.status !== "draft" && phrase.lessonStatus !== "draft")
    // Historical Takiwaki-only material stays protected until its audience is
    // explicitly migrated into the common learner catalogue.
    .filter((phrase) => phrase.audience !== "takiwaki")
    .filter(isSafeLibraryPhrase)
    .map((phrase) => ({
      ...phrase,
      id: phraseId(phrase),
      libraryKind: ["phrase", "word", "pattern"].includes(phrase.libraryKind)
        ? phrase.libraryKind
        : "phrase",
      learning: learningDetailsFor(phrase),
    }))
    .sort((a, b) => {
      const dateDifference = new Date(b.lessonDate || 0) - new Date(a.lessonDate || 0);
      return dateDifference || String(a.en).localeCompare(String(b.en));
    });

  await mergeRemoteActivity(session);
  renderFilters();
  renderPhrases();
  bindActivityScopeChanges();
}

initialise().catch((error) => {
  console.error(error);
  const grid = document.querySelector("#phraseGrid");
  grid?.replaceChildren(element("article", { className: "phrase-card" }, [
    element("h2", { text: "The phrase library could not be loaded." }),
    element("p", { text: "Please refresh the page and try again." }),
    element("p", { className: "jp", text: "ページを更新して、もう一度お試しください。" }),
  ]));
  showToast("The phrase library is temporarily unavailable.");
});
