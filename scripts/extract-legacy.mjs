import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonsRoot = path.join(root, "legacy-site", "lessons");
const output = path.join(root, "src", "data", "legacy-lessons.json");

function extractObject(source, declaration) {
  const start = source.indexOf(declaration);
  if (start < 0) throw new Error(`Missing ${declaration}`);
  const brace = source.indexOf("{", start);
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = brace; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return vm.runInNewContext(`(${source.slice(brace, index + 1)})`);
      }
    }
  }
  throw new Error(`Unclosed object after ${declaration}`);
}

const descriptions = {
  "2026-06-28": {
    titleGeneral: "Café Talk & Polite Answers",
    titleTakiwaki: "Polite Conversation Review",
    summaryJa: "丁寧な注文、How about you?、Did の質問、「仕方ない」の自然な英語を復習します。",
  },
  "2026-06-29": {
    titleGeneral: "What Did You Hear? Reactions & Position",
    titleTakiwaki: "Heard, Reactions & Position",
    summaryJa: "I heard の使い分け、自然なリアクション、位置表現を復習します。",
  },
  "2026-06-30": {
    titleGeneral: "Feelings, Preferences & Match Talk",
    titleTakiwaki: "Feelings, Prefer & Sports English",
    summaryJa: "annoyed / annoying、prefer、比較、試合で使う英語を復習します。",
  },
  "2026-07-04": {
    titleGeneral: "Everyday English: When Life Happens",
    titleTakiwaki: "Daily Life Survival English",
    summaryJa: "actually、avoid、事故、感謝、might / may など日常で役立つ英語を復習します。",
  },
  "2026-07-05": {
    titleGeneral: "Natural Reactions & Everyday Choices",
    titleTakiwaki: "Reactions, Reasons & Choices",
    summaryJa: "自然なリアクション、理由、選択、日常会話の組み立てを復習します。",
  },
  "2026-07-06": {
    titleGeneral: "Connected Speech & Useful Conversation",
    titleTakiwaki: "July 6 Complete Review",
    summaryJa: "7月6日の語彙・文法・会話をPart 1・Part 2で総復習します。",
  },
};

const questionCorrections = {
  "june-30:q5": {
    explanation: {
      en: "“I’m stressed out” is natural when you feel tired, pressured, and mentally overwhelmed.",
      jp: "疲れ・プレッシャー・ストレスで気持ちに余裕がない時は “I’m stressed out.” が自然です。",
    },
  },
  "june-30:q22": {
    accepted: [
      "It's easier to play golf in summer than in winter",
      "It is easier to play golf in summer than in winter",
    ],
  },
  "july-04:q6": {
    hint: {
      en: "“Came up” means something unexpected happened.",
      jp: "came up は「急なことが起きた」という意味で使えます。",
    },
  },
  "july-04:q11": {
    situationQuote: {
      en: "Someone thinks you are doing something special, but you are doing nothing special.",
    },
  },
  "july-04:q14": {
    hint: {
      en: "A noun names a person, place, thing, or idea.",
      jp: "名詞は、人・場所・もの・考えなどの名前を表します。",
    },
  },
  "july-04:q19": {
    hint: {
      en: "With a form of be, always usually comes after the verb.",
      jp: "be動詞の後に always を置くのが基本です。",
    },
    explanation: {
      en: "With the verb be: I am always tired. With action verbs: I always eat breakfast.",
      jp: "be動詞なら I am always tired. 一般動詞なら I always eat breakfast. です。",
    },
  },
  "july-05:q16": {
    hint: {
      en: "“I’ve got to” is a common conversational form of “I have to.”",
      jp: "“I’ve got to” は会話で「〜しなければならない」を表します。",
    },
  },
  "july-06:q22": {
    explanation: {
      en: "“On my behalf” means someone does something for you or represents you.",
      jp: "“on my behalf” は「私の代わりに / 私を代表して」という意味です。",
    },
  },
  "july-06:q25": {
    prompt: {
      en: "Part 2 Match: Match each nuance word with its Japanese meaning.",
      jp: "Part 2 マッチ：各ニュアンス単語と日本語の意味を合わせましょう。",
    },
  },
};

function applyQuestionCorrection(directory, question) {
  const correction = questionCorrections[`${directory}:${question.id}`];
  if (!correction) return question;
  return {
    ...question,
    ...correction,
  };
}

const directories = fs
  .readdirSync(lessonsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const lessons = directories.map((directory) => {
  const file = path.join(lessonsRoot, directory, "index.html");
  const source = fs.readFileSync(file, "utf8");
  const quizData = extractObject(source, "const quizData =");
  const lessonDate = quizData.lessonId;
  const info = descriptions[lessonDate] || {};
  return {
    id: directory,
    lessonDate,
    title: info.titleGeneral || quizData.title,
    takiTitle: info.titleTakiwaki || quizData.title,
    summary: quizData.subtitle || "",
    summaryJa: info.summaryJa || quizData.jpSubtitle || "",
    status: "published",
    audience: "both",
    sourceType: "legacy_zip",
    sourcePath: `legacy-site/lessons/${directory}/index.html`,
    contentVersion: 1,
    categoryLabels: quizData.categoryLabels || {},
    originalQuestionCount: quizData.questions.length,
    questions: quizData.questions.map((rawQuestion, index) => {
      const question = applyQuestionCorrection(directory, rawQuestion);
      return {
      ...question,
      id: `${directory}-original-${question.id || index + 1}`,
      legacyId: question.id || String(index + 1),
      section: "Original Review",
      isOriginal: true,
    };
    }),
  };
});

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(lessons, null, 2)}\n`);

const total = lessons.reduce((sum, lesson) => sum + lesson.originalQuestionCount, 0);
console.log(`Extracted ${lessons.length} lessons and ${total} original questions.`);
if (total !== 143) {
  throw new Error(`Expected 143 original questions, found ${total}`);
}
