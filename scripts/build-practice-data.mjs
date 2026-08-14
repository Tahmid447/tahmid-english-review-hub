import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { legacyAdditions, notionDraftCurriculum } from "../src/data/curriculum.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.join(root, "src", "data");
const visualManifest = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "visual-question-manifest.json"), "utf8"),
);
const visualQuestionsByLesson = new Map();
for (const visual of visualManifest.questions || []) {
  const lessonQuestions = visualQuestionsByLesson.get(visual.lessonId) || [];
  lessonQuestions.push(visual);
  visualQuestionsByLesson.set(visual.lessonId, lessonQuestions);
}

const choice = (phrases, correctIndex, field = "en") => {
  const offsets = [0, 1, Math.ceil(phrases.length / 3), Math.ceil((phrases.length * 2) / 3)];
  return offsets.map((offset, position) => {
    const item = phrases[(correctIndex + offset) % phrases.length];
    return { id: String.fromCharCode(97 + position), en: item[field], jp: item[field === "en" ? "jp" : "en"] };
  });
};

const visualChoice = (phrases, visual, field = "en") => {
  const requested = Array.isArray(visual.distractorIndexes)
    ? [visual.phraseIndex, ...visual.distractorIndexes]
    : null;
  if (!requested || requested.length !== 4 || new Set(requested).size !== 4) {
    return choice(phrases, visual.phraseIndex, field);
  }
  return requested.map((phraseIndex, position) => {
    const item = phrases[phraseIndex];
    if (!item) throw new Error(`${visual.lessonId} visual ${visual.slot} has an invalid distractor index.`);
    return {
      id: String.fromCharCode(97 + position),
      en: item[field],
      jp: item[field === "en" ? "jp" : "en"],
    };
  });
};

const reviewedVisualGuidance = (visual) => {
  const guidance = visual.reviewedGuidance;
  if (!guidance || !guidance.hintEn || !guidance.hintJa || !guidance.evidenceEn || !guidance.evidenceJa) {
    throw new Error(`${visual.lessonId} visual ${visual.slot} is missing reviewed bilingual guidance.`);
  }
  if (!Array.isArray(guidance.reasons) || guidance.reasons.length !== 3) {
    throw new Error(`${visual.lessonId} visual ${visual.slot} needs three reviewed distractor reasons.`);
  }
  return guidance;
};

const visualHint = (visual, japanese = false) => {
  const guidance = reviewedVisualGuidance(visual);
  return japanese ? guidance.hintJa : guidance.hintEn;
};

const visualExplanation = (visual, target, choices, japanese = false) => {
  const guidance = reviewedVisualGuidance(visual);
  const distractors = choices.slice(1);
  const reasons = new Map(guidance.reasons.map((reason) => [reason.choice, reason]));
  for (const distractor of distractors) {
    if (!reasons.has(distractor.en)) {
      throw new Error(
        `${visual.lessonId} visual ${visual.slot} has no reviewed reason for distractor “${distractor.en}”.`,
      );
    }
  }
  if (japanese) {
    return `正解は「${target.en}」（${target.jp}）です。${guidance.evidenceJa} `+
      distractors
        .map(({ en }) => `「${en}」はこの場面とは一致しません。${reasons.get(en).ja}。`)
        .join(" ");
  }
  return `“${target.en}” is correct. ${guidance.evidenceEn} `+
    distractors
      .map(({ en }) => `“${en}” does not fit because ${reasons.get(en).en}.`)
      .join(" ");
};

const stableShuffle = (items) =>
  items
    .map((value, index) => ({ value, key: (index * 7 + 3) % items.length }))
    .sort((a, b) => a.key - b.key)
    .map(({ value }) => value);

const words = (sentence) =>
  sentence
    .replace(/[.?!]/g, "")
    .split(/\s+/)
    .filter(Boolean);

const legacyDialogueContexts = {
  "june-28": {
    en: "A: I’d like a coffee, please. What can A ask the other person next?",
    jp: "A：「コーヒーをお願いします。」続けて相手の希望を聞くなら？",
  },
  "june-29": {
    en: "A: Have you heard of the new restaurant?\nB: ...",
    jp: "A：「新しいレストランの名前、聞いたことある？」\nB：…",
  },
  "june-30": {
    en: "A: How do you feel about that loud sound?\nB: ...",
    jp: "A：「あの大きな音、どう感じる？」\nB：…",
  },
  "july-04": {
    en: "A: What do you do when you’re too tired to drive safely?\nB: ...",
    jp: "A：「疲れて安全に運転できない時はどうする？」\nB：…",
  },
  "july-05": {
    en: "A: Do you want to go out tonight?\nB: ...",
    jp: "A：「今夜、出かけたい？」\nB：…",
  },
  "july-06": {
    en: "A: This part is a little abstract.\nB: ...",
    jp: "A：「この部分は少し抽象的です。」\nB：…",
  },
};

const draftDialogueContexts = {
  "july-07": ["A: You couldn’t attend the meeting. What happened?\nB: ...", "A：「会議に出席できなかったのですね。どうなりましたか？」\nB：…"],
  "july-11": ["A: Was the computer connected yesterday?\nB: ...", "A：「昨日、そのパソコンは接続されていましたか？」\nB：…"],
  "july-12": ["A: Is that bag new?\nB: ...", "A：「その鞄は新しいですか？」\nB：…"],
  "july-13": ["A: How does the week feel on Monday?\nB: ...", "A：「月曜日は一週間がどう感じますか？」\nB：…"],
  "july-18": ["A: Can you drive?\nB: ...", "A：「運転できますか？」\nB：…"],
  "july-19": ["A: Where are you now?\nB: ...", "A：「今どこにいますか？」\nB：…"],
  "july-22": ["A: You don’t like yakiniku, right?\nB: ...", "A：「焼肉が好きじゃないんですよね？」\nB：…"],
  "july-23": ["A: What did you order for lunch?\nB: ...", "A：「昼食に何を注文しましたか？」\nB：…"],
  "july-25": ["Situation: You hear a sound in the next room. What do you call out?", "場面：隣の部屋から音が聞こえました。何と呼びかけますか？"],
  "july-26": ["A: Why didn’t you eat with us?\nB: ...", "A：「どうして一緒に食べなかったの？」\nB：…"],
  "july-27": ["A: Do you know this neighbourhood well?\nB: ...", "A：「この辺りをよく知っていますか？」\nB：…"],
};

const legacyDialogueChoiceOverrides = {
  "july-05": [
    { id: "a", en: "I’d rather stay home tonight.", jp: "今夜は家にいたいです。" },
    { id: "b", en: "I finished it yesterday.", jp: "昨日それを終えました。" },
    { id: "c", en: "It’s on the table.", jp: "テーブルの上にあります。" },
    { id: "d", en: "The train leaves at seven.", jp: "電車は7時に出ます。" },
  ],
};

const draftDialogueChoiceOverrides = {
  "july-07": [
    { id: "a", en: "My phone died, so I couldn’t call anyone.", jp: "携帯の充電が切れて、誰にも連絡できませんでした。" },
    { id: "b", en: "Please bring it tomorrow.", jp: "明日それを持ってきてください。" },
    { id: "c", en: "I’m good at cooking.", jp: "料理が得意です。" },
    { id: "d", en: "Where will she come from?", jp: "彼女はどこから来ますか？" },
  ],
  "july-11": [
    { id: "a", en: "Yes, it was.", jp: "はい、接続されていました。" },
    { id: "b", en: "Yes, it does.", jp: "はい、そうします。" },
    { id: "c", en: "No, I didn’t.", jp: "いいえ、しませんでした。" },
    { id: "d", en: "I’ll connect it yesterday.", jp: "昨日それを接続します。" },
  ],
  "july-18": [
    { id: "a", en: "Yes, I can. I have a driver’s license.", jp: "はい、できます。運転免許を持っています。" },
    { id: "b", en: "Yes, I do drive yesterday.", jp: "はい、昨日運転します。" },
    { id: "c", en: "No, I haven’t a license.", jp: "いいえ、免許を持っていません。" },
    { id: "d", en: "I’m supposed at ten.", jp: "10時に予定されています。" },
  ],
};

const makeIncorrectSentence = (sentence) => {
  const withoutContractedBe = sentence
    .replace(/\b(I|you|he|she|it|we|they)(?:’re|'re|’m|'m)\b/i, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (withoutContractedBe !== sentence.trim()) return withoutContractedBe;

  const brokenNegativeModal = sentence.replace(/\bwon(?:’t|'t)\b/i, "won");
  if (brokenNegativeModal !== sentence) return brokenNegativeModal;

  const withoutAuxiliary = sentence
    .replace(
      /\b(?:is|are|was|were|have|has|had|do|does|did|will|would|can|could|should|might|must|isn’t|aren’t|wasn’t|weren’t|haven’t|hasn’t|hadn’t|don’t|doesn’t|didn’t|won’t|wouldn’t|can’t|couldn’t|shouldn’t)\b/i,
      "",
    )
    .replace(/\s+([?.!,])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (withoutAuxiliary !== sentence.trim()) return withoutAuxiliary;

  const wrongAgreement = sentence.replace(
    /^(No one|Everyone|Someone|Anyone|He|She|It)\s+([A-Za-z]+)s\b/,
    (_, subject, verb) => `${subject} ${verb}`,
  );
  if (wrongAgreement !== sentence) return wrongAgreement;

  const withoutArticle = sentence
    .replace(/\b(?:a|an|the)\b/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (withoutArticle !== sentence.trim()) return withoutArticle;

  return `${sentence.replace(/[.!?]+$/, "")} yesterday now.`;
};

const phraseHint = (phrase) => ({
  en: `Focus on the ${phrase?.topic || "lesson"} meaning. Look for the sentence that expresses “${phrase?.jp || "the target meaning"}”.`,
  jp: phrase?.note || `「${phrase?.jp || "目標の意味"}」を表す英文と、${phrase?.topic || "今回の表現"}の形に注目しましょう。`,
});

const phraseExplanation = (phrase) => ({
  en: `“${phrase?.en || "The model sentence"}” means “${phrase?.jp || "the target meaning"}”. This is the lesson model for ${phrase?.topic || "this language point"}.`,
  jp: `「${phrase?.en || "この英文"}」は「${phrase?.jp || "目標の意味"}」という意味です。${phrase?.note || `${phrase?.topic || "今回の表現"}の形と使う場面を一緒に確認しましょう。`}`,
});

const base = (id, format, section, phrase) => {
  const hint = phraseHint(phrase);
  const explanation = phraseExplanation(phrase);
  return ({
  id,
  format,
  type: format,
  section,
  topic: phrase?.topic || "review",
  isOriginal: false,
  hint: hint.en,
  hintJa: hint.jp,
  explanation: explanation.en,
  explanationJa: explanation.jp,
  });
};

function makeLegacyQuestions(lessonId, phrases) {
  const section = "Listen & Speak";
  const get = (index) => phrases[index % phrases.length];
  const result = [];

  [0, 1].forEach((index) => {
    const target = get(index);
    const options = choice(phrases, index);
    result.push({
      ...base(`${lessonId}-extra-listen-choice-${index + 1}`, "listenChoice", section, target),
      prompt: "Listen and choose the sentence you hear.",
      promptJa: "音声を聞いて、聞こえた英文を選んでください。",
      audioText: target.en,
      choices: options,
      correct: "a",
      explanation: `The sentence in the audio is “${target.en}”. Listen for the complete phrase, not just one familiar word.`,
      explanationJa: `音声の英文は「${target.en}」です。知っている単語一つだけでなく、文全体を聞き取りましょう。`,
    });
  });

  [2, 3].forEach((index) => {
    const target = get(index);
    result.push({
      ...base(`${lessonId}-extra-dictation-${index - 1}`, "listenType", section, target),
      prompt: "Type the complete sentence you hear.",
      promptJa: "聞こえた英文をそのまま入力してください。",
      audioText: target.en,
      accepted: [target.en],
      explanation: `The complete sentence is “${target.en}”. Compare articles, auxiliaries and verb endings when you check your answer.`,
      explanationJa: `全文は「${target.en}」です。答え合わせでは冠詞・助動詞・動詞の語尾まで確認しましょう。`,
    });
  });

  [4, 5].forEach((index) => {
    const target = get(index);
    result.push({
      ...base(`${lessonId}-extra-speaking-${index - 3}`, "speaking", section, target),
      prompt: "Listen, then say the sentence naturally.",
      promptJa: "音声を聞いてから、自然に言ってみましょう。",
      speakText: target.en,
      speakJa: target.jp,
      explanation: `Model: “${target.en}” (${target.jp}). Practise the whole thought as one natural phrase.`,
      explanationJa: `お手本は「${target.en}」（${target.jp}）です。意味のまとまりとして自然に言う練習をしましょう。`,
    });
  });

  const fifthListening = get(6);
  result.push({
    ...base(`${lessonId}-extra-dictation-3`, "listenType", section, fifthListening),
    prompt: "Type the complete sentence you hear.",
    promptJa: "聞こえた英文をそのまま入力してください。",
    audioText: fifthListening.en,
    accepted: [fifthListening.en],
    explanation: `The complete sentence is “${fifthListening.en}”. Listen for every short grammar word as well as the key expression.`,
    explanationJa: `全文は「${fifthListening.en}」です。中心表現だけでなく、短い文法語まで聞き取りましょう。`,
  });

  [0, 3, 7].forEach((index, offset) => {
    const target = get(index);
    result.push({
      ...base(`${lessonId}-extra-speaking-${offset + 3}`, "speaking", section, target),
      prompt: "Say the sentence naturally, then try once more without looking.",
      promptJa: "自然に言ってから、英文を見ずにもう一度話してみましょう。",
      speakText: target.en,
      speakJa: target.jp,
      explanation: `Model: “${target.en}” (${target.jp}). Connect the complete message naturally; the second attempt checks independent recall.`,
      explanationJa: `お手本は「${target.en}」（${target.jp}）です。文全体を自然につなげ、2回目は見ずに思い出して言いましょう。`,
    });
  });

  const truth = get(6);
  result.push({
    ...base(`${lessonId}-extra-true-false`, "truefalse", "Use It", truth),
    prompt: `“${truth.en}” means “${truth.jp}”.`,
    promptJa: `「${truth.en}」は「${truth.jp}」という意味です。`,
    correct: true,
    explanation: `True. “${truth.en}” means “${truth.jp}”.`,
    explanationJa: `正解はTrueです。「${truth.en}」は「${truth.jp}」という意味です。`,
  });

  const orderTarget = get(7);
  result.push({
    ...base(`${lessonId}-extra-order`, "order", "Use It", orderTarget),
    prompt: `Put the words in order: ${orderTarget.jp}`,
    promptJa: `語順を並べましょう：${orderTarget.jp}`,
    words: stableShuffle(words(orderTarget.en)),
    correctWords: words(orderTarget.en),
    explanation: `Correct order: “${orderTarget.en}”. Keep the subject, verb and remaining information in that order.`,
    explanationJa: `正しい語順は「${orderTarget.en}」です。主語・動詞・残りの情報の順を確認しましょう。`,
  });

  result.push({
    ...base(`${lessonId}-extra-matching`, "matching", "Use It", get(0)),
    prompt: "Match each English phrase with its natural Japanese meaning.",
    promptJa: "英文と自然な日本語を組み合わせてください。",
    pairs: phrases.slice(0, 6).map(({ en, jp, topic }) => ({ en, jp, cat: topic })),
    explanation: "Each English phrase has one Japanese partner with the same meaning. Recheck the complete phrase when two items share a similar word.",
    explanationJa: "各英文には、同じ意味の日本語が一つずつあります。似た単語がある時も、表現全体の意味で確認しましょう。",
  });

  const categories = [...new Set(phrases.map(({ topic }) => topic))].slice(0, 2);
  const sortingItems = phrases
    .filter(({ topic }) => categories.includes(topic))
    .slice(0, 6)
    .map(({ en, topic }) => [en, topic]);
  result.push({
    ...base(`${lessonId}-extra-sorting`, "sorting", "Use It", get(1)),
    prompt: "Sort each phrase by its language purpose.",
    promptJa: "各表現を目的別に分類してください。",
    categories,
    items: sortingItems,
    explanation: `The categories describe language purpose: ${categories.join(", ")}. Sort by what each complete phrase does in conversation.`,
    explanationJa: `分類は「${categories.join("・")}」です。単語一つではなく、会話でその表現が果たす役割で分けましょう。`,
  });

  const dialogue = get(1);
  const dialogueContext = legacyDialogueContexts[lessonId] || {
    en: `A: ${get(0).en}\nB: ...`,
    jp: `A: ${get(0).jp}\nB: …`,
  };
  result.push({
    ...base(`${lessonId}-extra-dialogue`, "dialogue", "Use It", dialogue),
    prompt: "Choose the most natural next line in the conversation.",
    promptJa: "会話の次に続く最も自然な一文を選んでください。",
    context: dialogueContext.en,
    contextJa: dialogueContext.jp,
    choices: legacyDialogueChoiceOverrides[lessonId] || choice(phrases, 1),
    correct: "a",
    explanation: `“${(legacyDialogueChoiceOverrides[lessonId]?.[0] || dialogue).en}” responds directly and naturally to the previous line.`,
    explanationJa: `「${(legacyDialogueChoiceOverrides[lessonId]?.[0] || dialogue).en}」は、直前の発言に直接答える自然な一文です。`,
  });

  const translation = get(2);
  result.push({
    ...base(`${lessonId}-extra-translation`, "translation", "Use It", translation),
    prompt: `Translate into English: ${translation.jp}`,
    promptJa: `英語にしてください：${translation.jp}`,
    accepted: [translation.en],
    explanation: `A natural translation is “${translation.en}”. It expresses “${translation.jp}” with the lesson’s ${translation.topic} pattern.`,
    explanationJa: `自然な英訳は「${translation.en}」です。「${translation.jp}」を今回の${translation.topic}表現で伝えています。`,
  });

  const situation = get(3);
  result.push({
    ...base(`${lessonId}-extra-situation`, "situation", "Use It", situation),
    prompt: `Which sentence best expresses this meaning: ${situation.jp}`,
    promptJa: `「${situation.jp}」に最も合う英文はどれですか？`,
    choices: choice(phrases, 3),
    correct: "a",
    explanation: `“${situation.en}” directly expresses “${situation.jp}”. The other choices describe different situations.`,
    explanationJa: `「${situation.en}」が「${situation.jp}」を直接表します。他の選択肢は別の場面を表しています。`,
  });

  const visualQuestions = visualQuestionsByLesson.get(lessonId) || [];
  if (visualQuestions.length !== 5) {
    throw new Error(`${lessonId} needs exactly five visual-question briefs; found ${visualQuestions.length}`);
  }
  visualQuestions
    .sort((left, right) => left.slot - right.slot)
    .forEach((visual) => {
      const target = get(visual.phraseIndex);
      const choices = visualChoice(phrases, visual);
      result.push({
        ...base(`${lessonId}-extra-visual-${visual.slot}`, "situation", "See It", target),
        prompt: "Which sentence best matches the illustration?",
        promptJa: "イラストの場面に最も合う英文を選んでください。",
        choices,
        correct: "a",
        image: visual.asset,
        imageAlt: visual.imageAlt,
        visualAssetId: `${lessonId}-${String(visual.slot).padStart(2, "0")}`,
        hint: visualHint(visual),
        hintJa: visualHint(visual, true),
        explanation: visualExplanation(visual, target, choices),
        explanationJa: visualExplanation(visual, target, choices, true),
      });
    });

  const listeningCount = result.filter(({ format }) => ["listenChoice", "listenType"].includes(format)).length;
  const speakingCount = result.filter(({ format }) => format === "speaking").length;
  const visualCount = result.filter(({ image }) => Boolean(image)).length;
  if (listeningCount < 5 || speakingCount < 5 || visualCount < 5) {
    throw new Error(
      `${lessonId} skill minimums not met (visual ${visualCount}, listening ${listeningCount}, speaking ${speakingCount})`,
    );
  }

  return result;
}

function makeDraftQuestions(lesson) {
  const phrases = lesson.phrases;
  const get = (index) => phrases[index % phrases.length];
  const result = [];

  [0, 1, 2, 3].forEach((index) => {
    const target = get(index);
    result.push({
      ...base(`${lesson.id}-draft-choice-${index + 1}`, "mcq", "Understand", target),
      prompt: `Choose the English sentence that means: ${target.jp}`,
      promptJa: `「${target.jp}」に合う英文を選んでください。`,
      choices: choice(phrases, index),
      correct: "a",
      explanation: `“${target.en}” is the sentence that means “${target.jp}”. Check the complete meaning before choosing.`,
      explanationJa: `「${target.en}」が「${target.jp}」を表す英文です。単語一つではなく文全体の意味で選びましょう。`,
    });
  });

  [4, 5].forEach((index, offset) => {
    const target = get(index);
    const displayedMeaning = offset === 0 ? target.jp : get(index + 1).jp;
    result.push({
      ...base(`${lesson.id}-draft-true-false-${offset + 1}`, "truefalse", "Understand", target),
      prompt: `“${target.en}” means “${displayedMeaning}”.`,
      promptJa: `「${target.en}」は「${displayedMeaning}」という意味です。`,
      correct: offset === 0,
      explanation: offset === 0
        ? `True. “${target.en}” means “${target.jp}”.`
        : `False. “${target.en}” means “${target.jp}”, not “${displayedMeaning}”.`,
      explanationJa: offset === 0
        ? `正解はTrueです。「${target.en}」は「${target.jp}」という意味です。`
        : `正解はFalseです。「${target.en}」は「${target.jp}」であり、「${displayedMeaning}」ではありません。`,
    });
  });

  [6, 7].forEach((index, offset) => {
    const target = get(index);
    result.push({
      ...base(`${lesson.id}-draft-typed-${offset + 1}`, "translation", "Build It", target),
      prompt: `Translate into English: ${target.jp}`,
      promptJa: `英語にしてください：${target.jp}`,
      accepted: [target.en],
      explanation: `A natural translation is “${target.en}”. It expresses “${target.jp}” with the lesson’s ${target.topic} pattern.`,
      explanationJa: `自然な英訳は「${target.en}」です。「${target.jp}」を今回の${target.topic}表現で伝えています。`,
    });
  });

  [8, 9].forEach((index, offset) => {
    const target = get(index);
    result.push({
      ...base(`${lesson.id}-draft-order-${offset + 1}`, "order", "Build It", target),
      prompt: `Put the words in order: ${target.jp}`,
      promptJa: `語順を並べましょう：${target.jp}`,
      words: stableShuffle(words(target.en)),
      correctWords: words(target.en),
      explanation: `Correct order: “${target.en}”. Build the sentence around the ${target.topic} pattern.`,
      explanationJa: `正しい語順は「${target.en}」です。${target.topic}の形を中心に文を組み立てます。`,
    });
  });

  result.push({
    ...base(`${lesson.id}-draft-matching`, "matching", "Build It", get(0)),
    prompt: "Match the English and Japanese.",
    promptJa: "英語と日本語を組み合わせてください。",
    pairs: phrases.slice(0, 6).map(({ en, jp, topic }) => ({ en, jp, cat: topic })),
    explanation: "Each English phrase has exactly one Japanese meaning. Match the whole message rather than isolated words.",
    explanationJa: "各英文に対応する日本語は一つです。単語だけではなく、表現全体の意味で組み合わせましょう。",
  });

  const categories = [...new Set(phrases.map(({ topic }) => topic))].slice(0, 3);
  result.push({
    ...base(`${lesson.id}-draft-sorting`, "sorting", "Build It", get(1)),
    prompt: "Sort the phrases by topic.",
    promptJa: "表現をトピック別に分類してください。",
    categories,
    items: phrases
      .filter(({ topic }) => categories.includes(topic))
      .slice(0, 9)
      .map(({ en, topic }) => [en, topic]),
    explanation: `Sort by the purpose of the complete phrase. The available topics are ${categories.join(", ")}.`,
    explanationJa: `英文全体の目的で分類します。今回の分類は「${categories.join("・")}」です。`,
  });

  [0, 3, 6].forEach((index, offset) => {
    const target = get(index);
    result.push({
      ...base(`${lesson.id}-draft-listen-choice-${offset + 1}`, "listenChoice", "Listen", target),
      prompt: "Listen and choose the sentence.",
      promptJa: "音声を聞いて英文を選んでください。",
      audioText: target.en,
      choices: choice(phrases, index),
      correct: "a",
      explanation: `The sentence in the audio is “${target.en}”. Listen through to the end before choosing.`,
      explanationJa: `音声の英文は「${target.en}」です。最後まで聞いてから選びましょう。`,
    });
  });

  [1, 4, 7].forEach((index, offset) => {
    const target = get(index);
    result.push({
      ...base(`${lesson.id}-draft-dictation-${offset + 1}`, "listenType", "Listen", target),
      prompt: "Type the complete sentence you hear.",
      promptJa: "聞こえた英文を入力してください。",
      audioText: target.en,
      accepted: [target.en],
      explanation: `The complete sentence is “${target.en}”. Check every small word as well as the main vocabulary.`,
      explanationJa: `全文は「${target.en}」です。中心の単語だけでなく、短い機能語も確認しましょう。`,
    });
  });

  [2, 5, 8].forEach((index, offset) => {
    const target = get(index);
    result.push({
      ...base(`${lesson.id}-draft-speaking-${offset + 1}`, "speaking", "Speak", target),
      prompt: "Listen, then speak.",
      promptJa: "聞いてから話してみましょう。",
      speakText: target.en,
      speakJa: target.jp,
      explanation: `Model: “${target.en}” (${target.jp}). Say it as one connected message, then compare with the model.`,
      explanationJa: `お手本は「${target.en}」（${target.jp}）です。一つの意味のまとまりとして話し、お手本と比べましょう。`,
    });
  });

  [9, 10].forEach((index, offset) => {
    const target = get(index);
    result.push({
      ...base(`${lesson.id}-draft-speaking-${offset + 4}`, "speaking", "Speak", target),
      prompt: "Say the sentence naturally, then try it once without looking.",
      promptJa: "自然に言ってから、英文を見ずにもう一度話してみましょう。",
      speakText: target.en,
      speakJa: target.jp,
      explanation: `Model: “${target.en}” (${target.jp}). The second attempt checks whether you can recall the whole phrase independently.`,
      explanationJa: `お手本は「${target.en}」（${target.jp}）です。2回目は英文を見ずに、表現全体を思い出せるか確認します。`,
    });
  });

  result.push({
    ...base(`${lesson.id}-draft-dialogue`, "dialogue", "Use It", get(9)),
    prompt: "Choose the most natural next line.",
    promptJa: "会話の次の一文を選んでください。",
    context: draftDialogueContexts[lesson.id]?.[0] || `A: ${get(8).en}\nB: ...`,
    contextJa: draftDialogueContexts[lesson.id]?.[1] || `A: ${get(8).jp}\nB: …`,
    choices: draftDialogueChoiceOverrides[lesson.id] || choice(phrases, 9),
    correct: "a",
    explanation: `“${(draftDialogueChoiceOverrides[lesson.id]?.[0] || get(9)).en}” answers the previous speaker directly and keeps the conversation coherent.`,
    explanationJa: `「${(draftDialogueChoiceOverrides[lesson.id]?.[0] || get(9)).en}」は直前の発言に直接答え、会話の流れが自然につながります。`,
  });

  const mistakeTarget = get(10);
  result.push({
    ...base(`${lesson.id}-draft-mistake`, "mistake", "Use It", mistakeTarget),
    prompt: "Correct the sentence.",
    promptJa: "英文を自然な形に直してください。",
    wrongSentence: makeIncorrectSentence(mistakeTarget.en),
    accepted: [mistakeTarget.en],
    explanation: `Correct sentence: “${mistakeTarget.en}”. Compare it with the incorrect version and restore the missing or incorrect grammar word.`,
    explanationJa: `正しい英文は「${mistakeTarget.en}」です。誤文と比べ、抜けた語や誤った文法部分を直しましょう。`,
  });

  const situation = get(11);
  result.push({
    ...base(`${lesson.id}-draft-situation`, "situation", "Use It", situation),
    prompt: `Which sentence would you use when you want to say: ${situation.jp}`,
    promptJa: `「${situation.jp}」と言いたい時、どの英文を使いますか？`,
    choices: choice(phrases, 11),
    correct: "a",
    explanation: `“${situation.en}” directly expresses “${situation.jp}”. The other choices answer different situations.`,
    explanationJa: `「${situation.en}」が「${situation.jp}」を直接表します。他の選択肢は別の場面に使う表現です。`,
  });

  const visualQuestions = visualQuestionsByLesson.get(lesson.id) || [];
  if (visualQuestions.length !== 5) {
    throw new Error(`${lesson.id} needs exactly five visual-question briefs; found ${visualQuestions.length}`);
  }

  visualQuestions
    .sort((left, right) => left.slot - right.slot)
    .forEach((visual) => {
      const target = get(visual.phraseIndex);
      const choices = visualChoice(phrases, visual);
      result.push({
        ...base(`${lesson.id}-draft-visual-${visual.slot}`, "situation", "See It", target),
        prompt: "Which sentence best matches the illustration?",
        promptJa: "イラストの場面に最も合う英文を選んでください。",
        choices,
        correct: "a",
        image: visual.asset,
        imageAlt: visual.imageAlt,
        visualAssetId: `${lesson.id}-${String(visual.slot).padStart(2, "0")}`,
        hint: visualHint(visual),
        hintJa: visualHint(visual, true),
        explanation: visualExplanation(visual, target, choices),
        explanationJa: visualExplanation(visual, target, choices, true),
      });
    });

  const listeningCount = result.filter(({ format }) => ["listenChoice", "listenType"].includes(format)).length;
  const speakingCount = result.filter(({ format }) => format === "speaking").length;
  const visualCount = result.filter(({ image }) => Boolean(image)).length;
  if (listeningCount < 5 || speakingCount < 5 || visualCount < 5) {
    throw new Error(
      `${lesson.id} skill minimums not met (visual ${visualCount}, listening ${listeningCount}, speaking ${speakingCount})`,
    );
  }
  return result;
}

const additions = Object.fromEntries(
  Object.entries(legacyAdditions).map(([lessonId, phrases]) => [
    lessonId,
    makeLegacyQuestions(lessonId, phrases),
  ]),
);

const drafts = notionDraftCurriculum.map((lesson) => ({
  ...lesson,
  sourceType: "notion",
  sourceUpdatedAt: null,
  contentVersion: 1,
  status: "draft",
  questions: makeDraftQuestions(lesson),
}));

fs.mkdirSync(dataRoot, { recursive: true });
fs.writeFileSync(path.join(dataRoot, "legacy-additions.json"), `${JSON.stringify(additions, null, 2)}\n`);
fs.writeFileSync(path.join(dataRoot, "notion-drafts.json"), `${JSON.stringify(drafts, null, 2)}\n`);

const addedCount = Object.values(additions).flat().length;
const draftCount = drafts.reduce((sum, lesson) => sum + lesson.questions.length, 0);
console.log(`Generated ${addedCount} legacy additions and ${draftCount} draft questions.`);
