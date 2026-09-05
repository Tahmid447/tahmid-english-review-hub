const SVG_NS = "http://www.w3.org/2000/svg";
const CURRICULUM_CATEGORIES = new Set(["words", "phrases", "phonics"]);

const EARLY_WORD_MOTIFS = Object.freeze({
  book: "object:book",
  pen: "object:pen",
  desk: "furniture:desk",
  chair: "furniture:chair",
  bag: "object:bag",
  door: "architecture:door",
  window: "architecture:window",
  teacher: "person:teacher",
  student: "person:student",
  lesson: "object:lesson",
  red: "swatch:red",
  blue: "swatch:blue",
  yellow: "swatch:yellow",
  green: "swatch:green",
  black: "swatch:black",
  white: "swatch:white",
  circle: "shape:circle",
  square: "shape:square",
  star: "shape:star",
  line: "shape:line",
  mother: "person:mother",
  father: "person:father",
  sister: "person:sister",
  brother: "person:brother",
  grandmother: "person:grandmother",
  grandfather: "person:grandfather",
  baby: "person:baby",
  friend: "person:friend",
  boy: "person:boy",
  girl: "person:girl",
  head: "body:head",
  face: "body:face",
  eye: "body:eye",
  ear: "body:ear",
  nose: "body:nose",
  mouth: "body:mouth",
  hand: "body:hand",
  foot: "body:foot",
  arm: "body:arm",
  leg: "body:leg",
  rice: "food:rice",
  bread: "food:bread",
  egg: "food:egg",
  milk: "food:milk",
  water: "food:water",
  apple: "food:apple",
  banana: "food:banana",
  chicken: "food:chicken",
  fish: "food:fish",
  soup: "food:soup",
  house: "home:house",
  room: "home:room",
  kitchen: "home:kitchen",
  bathroom: "home:bathroom",
  bedroom: "home:bedroom",
  bed: "home:bed",
  table: "home:table",
  lamp: "home:lamp",
  key: "home:key",
  clock: "home:clock",
  dog: "animal:dog",
  cat: "animal:cat",
  bird: "animal:bird",
  rabbit: "animal:rabbit",
  horse: "animal:horse",
  cow: "animal:cow",
  sheep: "animal:sheep",
  pig: "animal:pig",
  lion: "animal:lion",
  elephant: "animal:elephant",
  run: "action:run",
  walk: "action:walk",
  jump: "action:jump",
  sit: "action:sit",
  stand: "action:stand",
  open: "action:open",
  close: "action:close",
  read: "action:read",
  write: "action:write",
  listen: "action:listen",
  happy: "emotion:happy",
  sad: "emotion:sad",
  tired: "emotion:tired",
  angry: "emotion:angry",
  scared: "emotion:scared",
  excited: "emotion:excited",
  hungry: "emotion:hungry",
  thirsty: "emotion:thirsty",
  sick: "emotion:sick",
  fine: "emotion:fine",
  sunny: "weather:sunny",
  rainy: "weather:rainy",
  cloudy: "weather:cloudy",
  windy: "weather:windy",
  hot: "weather:hot",
  cold: "weather:cold",
  sky: "weather:sky",
  sun: "weather:sun",
  moon: "weather:moon",
  snow: "weather:snow",
  morning: "time:morning",
  afternoon: "time:afternoon",
  evening: "time:evening",
  night: "time:night",
  today: "time:today",
  tomorrow: "time:tomorrow",
  yesterday: "time:yesterday",
  early: "time:early",
  late: "time:late",
  busy: "time:busy",
  school: "place:school",
  park: "place:park",
  station: "place:station",
  store: "place:store",
  hospital: "place:hospital",
  library: "place:library",
  restaurant: "place:restaurant",
  bank: "place:bank",
  "post office": "place:post-office",
  playground: "place:playground",
});

const LATER_TOPIC_FAMILIES = Object.freeze({
  clothing: "garment",
  "transport-and-travel": "transport",
  "chores-and-practical-actions": "practical",
  communication: "communication",
  "study-skills": "study",
  work: "work",
  health: "health",
  "shopping-and-money": "commerce",
  relationships: "connection",
  "useful-adjectives": "attribute",
  "plans-and-logistics": "route",
  technology: "technology",
  environment: "environment",
  "nuanced-emotions": "emotion",
  "critical-thinking": "thinking",
  "business-and-projects": "business",
  "travel-details": "travel",
  "high-utility-verbs": "motion",
  "precise-adjectives": "precision",
  "advanced-communication": "communication",
});

const PHRASE_SCENES = Object.freeze([
  [/(?:hi\b|meet|thank|greet|introduction)/i, "greeting"],
  [/(?:hungry|water|cheese|ordered|food|full|smell)/i, "food"],
  [/(?:help|try|know|time|mean|clarif|catch the last|say that)/i, "question"],
  [/(?:shop|price|blue|take it|exchange|charge)/i, "shopping"],
  [/(?:station|far from|across from|lost|platform|seat|nearby|check in)/i, "directions"],
  [/(?:rain|weather|weekend|inside)/i, "weather"],
  [/(?:feel well|throat|break|feeling better)/i, "health"],
  [/(?:school|page|notebook|test|work together)/i, "school"],
  [/(?:meeting|deadline|friday|work|scope|professional|handled)/i, "work"],
  [/(?:idea|opinion|perspective|takeaway|argument|point|explanation)/i, "idea"],
  [/(?:agree|compromise|flexible|convinced|differently)/i, "agreement"],
  [/(?:happened|turned out|laugh|stressful|looking back|experience)/i, "story"],
  [/(?:progress|improve|consistent|step at a time|success|respond)/i, "growth"],
]);

const TONES = Object.freeze(["coral", "amber", "mint", "sky", "iris", "rose"]);
const SWATCHES = Object.freeze({
  red: "#df5548",
  blue: "#3976cf",
  yellow: "#f5bd3d",
  green: "#3f9b6d",
  black: "#26343d",
  white: "#fffdf5",
});

function safeObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function normalise(value) {
  return String(value || "").normalize("NFKC").trim().toLocaleLowerCase();
}

function stableHash(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function compactLabel(value, fallback = "EN") {
  const words = String(value || "").match(/[A-Za-z]+/g) || [];
  if (!words.length) return fallback;
  if (words.length > 1) return words.slice(0, 3).map((word) => word[0]).join("").toUpperCase();
  return words[0].slice(0, 3).toUpperCase();
}

function phraseScene(value) {
  const match = PHRASE_SCENES.find(([pattern]) => pattern.test(value));
  return match?.[1] || "conversation";
}

function phonicsLabel(content) {
  const sound = String(content.sound || "")
    .replaceAll("/", "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(" ");
  if (sound && sound.length <= 13) return sound;
  const target = String(content.phonicsTarget || "");
  const namedFocus = target.match(/\b(?:schwa|stress|rhythm|linking|silent e|short [aeiou]|long [aeiou]|diphthong|digraphs?|blends?)\b/i)?.[0];
  if (namedFocus) return namedFocus.toUpperCase().slice(0, 12);
  const focus = target.match(/(?:\b[a-z]{1,3}\b(?:\s*(?:,|and)\s*)?){1,4}/i)?.[0];
  const cleanedFocus = focus?.replace(/\band\b/gi, " ").replace(/[,\s]+/g, " ").trim().toUpperCase();
  return cleanedFocus || compactLabel(target, "ABC");
}

function resolvedCategory(item, category) {
  if (CURRICULUM_CATEGORIES.has(category)) return category;
  if (CURRICULUM_CATEGORIES.has(item?.curriculum_category)) return item.curriculum_category;
  if (CURRICULUM_CATEGORIES.has(item?.type)) return item.type;
  const id = String(item?.id || "");
  if (id.startsWith("word-")) return "words";
  if (id.startsWith("phrase-")) return "phrases";
  if (id.startsWith("phonics-")) return "phonics";
  return "words";
}

export function visualSpecFor(item, requestedCategory) {
  const content = { ...safeObject(item?.content), ...safeObject(item) };
  const category = resolvedCategory(item, requestedCategory);
  const id = String(item?.id || content.id || `${category}-visual`);
  const level = Math.max(1, Math.min(32, Number(item?.level || content.level) || 1));
  const seed = stableHash(id);
  const tone = TONES[seed % TONES.length];

  if (category === "words") {
    const word = normalise(content.word || item?.title_en || id.replace(/^word-l\d+-/, ""));
    const exactMotif = EARLY_WORD_MOTIFS[word];
    const topic = normalise(content.topic || content.category || item?.tags?.[0]);
    const [family, variant] = exactMotif
      ? exactMotif.split(":")
      : [LATER_TOPIC_FAMILIES[topic] || "concept", word || "word"];
    return Object.freeze({
      id,
      category,
      level,
      family,
      variant,
      label: compactLabel(word, "W"),
      tone,
      seed,
      confidence: exactMotif ? "exact" : LATER_TOPIC_FAMILIES[topic] ? "topic" : "concept",
      source: "original-inline-svg",
      visualKey: `${id}:${family}:${variant}`,
    });
  }

  if (category === "phrases") {
    const phrase = String(content.phrase || item?.title_en || "Conversation");
    const context = `${phrase} ${(item?.tags || content.tags || []).join(" ")}`;
    return Object.freeze({
      id,
      category,
      level,
      family: "dialogue",
      variant: phraseScene(context),
      label: "SAY",
      tone,
      seed,
      confidence: "scene",
      source: "original-inline-svg",
      visualKey: `${id}:dialogue:${phraseScene(context)}`,
    });
  }

  const focus = phonicsLabel(content);
  return Object.freeze({
    id,
    category,
    level,
    family: "phonics",
    variant: level <= 4 ? "consonant" : level <= 10 ? "short-vowel" : level <= 20 ? "blend" : level <= 30 ? "spelling" : "rhythm",
    label: focus,
    tone,
    seed,
    confidence: "sound-diagram",
    source: "original-inline-svg",
    visualKey: `${id}:phonics:${focus}`,
  });
}

function node(tag, attrs = {}, children = []) {
  return { tag, attrs, children: (Array.isArray(children) ? children : [children]).filter((child) => child !== null && child !== undefined) };
}

const rect = (x, y, width, height, rx, className, attrs = {}) => node("rect", { x, y, width, height, rx, class: className, ...attrs });
const circle = (cx, cy, r, className, attrs = {}) => node("circle", { cx, cy, r, class: className, ...attrs });
const path = (d, className, attrs = {}) => node("path", { d, class: className, ...attrs });
const line = (x1, y1, x2, y2, className, attrs = {}) => node("line", { x1, y1, x2, y2, class: className, ...attrs });
const polygon = (points, className, attrs = {}) => node("polygon", { points, class: className, ...attrs });
const group = (children, attrs = {}) => node("g", attrs, children);
const textNode = (x, y, value, className, attrs = {}) => node("text", { x, y, class: className, ...attrs }, [String(value)]);

function labelTile(label, { x = 99, y = 92, width = 47 } = {}) {
  return [
    rect(x, y, width, 20, 10, "visual-label-tile"),
    textNode(x + width / 2, y + 14, label, "visual-label", { "text-anchor": "middle" }),
  ];
}

function personFigure(x, y, scale = 1, variant = "person") {
  const children = [
    circle(x, y, 11 * scale, "visual-skin"),
    path(`M ${x - 9 * scale} ${y - 5 * scale} Q ${x} ${y - 18 * scale} ${x + 10 * scale} ${y - 5 * scale}`, "visual-hair"),
    path(`M ${x - 19 * scale} ${y + 35 * scale} Q ${x - 18 * scale} ${y + 13 * scale} ${x} ${y + 12 * scale} Q ${x + 18 * scale} ${y + 13 * scale} ${x + 19 * scale} ${y + 35 * scale} Z`, "visual-primary"),
    line(x - 3 * scale, y + 1 * scale, x + 3 * scale, y + 1 * scale, "visual-face-line"),
  ];
  if (/grand/.test(variant)) {
    children.push(path(`M ${x - 8 * scale} ${y - 1 * scale} Q ${x - 4 * scale} ${y - 5 * scale} ${x} ${y - 1 * scale} Q ${x + 4 * scale} ${y - 5 * scale} ${x + 8 * scale} ${y - 1 * scale}`, "visual-line"));
  }
  if (variant === "teacher") children.push(line(x + 12, y + 17, x + 30, y - 4, "visual-pointer"));
  return group(children, { class: "visual-person" });
}

function objectArt(variant) {
  if (variant === "book") return [
    path("M31 33 Q52 26 78 38 V92 Q53 81 31 88 Z", "visual-primary"),
    path("M129 33 Q108 26 82 38 V92 Q107 81 129 88 Z", "visual-secondary"),
    line(80, 38, 80, 93, "visual-line"),
    path("M39 43 Q55 38 70 43 M90 43 Q106 38 121 43", "visual-paper-line"),
  ];
  if (variant === "pen") return [
    group([
      rect(59, 20, 18, 76, 9, "visual-primary"),
      polygon("59,88 77,88 68,109", "visual-tip"),
      rect(59, 20, 18, 18, 8, "visual-secondary"),
      line(63, 43, 73, 43, "visual-line"),
    ], { transform: "rotate(43 68 64)" }),
    path("M35 94 Q78 108 126 91", "visual-paper-line"),
  ];
  if (variant === "bag") return [
    rect(41, 42, 78, 62, 18, "visual-primary"),
    path("M61 45 V36 Q61 20 80 20 Q99 20 99 36 V45", "visual-line"),
    rect(48, 58, 64, 8, 4, "visual-secondary"),
    circle(80, 77, 8, "visual-highlight"),
  ];
  return [
    rect(34, 29, 92, 67, 12, "visual-board"),
    line(48, 82, 112, 82, "visual-paper-line"),
    textNode(80, 66, "A B C", "visual-board-text", { "text-anchor": "middle" }),
    rect(63, 96, 34, 6, 3, "visual-secondary"),
  ];
}

function furnitureArt(variant) {
  if (variant === "chair") return [
    rect(48, 27, 48, 51, 10, "visual-secondary"),
    rect(45, 70, 70, 15, 7, "visual-primary"),
    line(54, 83, 48, 107, "visual-line"),
    line(106, 83, 112, 107, "visual-line"),
  ];
  return [
    rect(29, 46, 102, 17, 7, "visual-primary"),
    rect(38, 61, 10, 46, 4, "visual-secondary"),
    rect(112, 61, 10, 46, 4, "visual-secondary"),
    rect(49, 68, 62, 25, 7, "visual-soft"),
    circle(103, 81, 3, "visual-highlight"),
  ];
}

function architectureArt(variant) {
  if (variant === "window") return [
    rect(38, 19, 84, 86, 13, "visual-frame"),
    rect(47, 28, 66, 68, 7, "visual-sky"),
    line(80, 29, 80, 96, "visual-frame-line"),
    line(47, 62, 113, 62, "visual-frame-line"),
    circle(98, 43, 8, "visual-sun"),
  ];
  return [
    rect(46, 17, 68, 94, 10, "visual-frame"),
    rect(55, 27, 50, 84, 7, "visual-primary"),
    circle(94, 70, 4, "visual-highlight"),
    path("M42 111 H118", "visual-line"),
  ];
}

function swatchArt(variant) {
  const color = SWATCHES[variant] || SWATCHES.red;
  return [
    circle(80, 58, 36, "visual-swatch-shadow"),
    circle(80, 54, 34, "visual-swatch", { fill: color }),
    path("M58 43 Q72 27 94 35", "visual-swatch-shine"),
    ...labelTile(variant.slice(0, 1).toUpperCase(), { x: 100, y: 91, width: 31 }),
  ];
}

function shapeArt(variant) {
  const art = [];
  if (variant === "circle") art.push(circle(72, 58, 33, "visual-primary"));
  if (variant === "square") art.push(rect(41, 27, 66, 66, 10, "visual-primary"));
  if (variant === "star") art.push(polygon("80,18 91,45 121,47 98,66 105,96 80,79 55,96 62,66 39,47 69,45", "visual-highlight"));
  if (variant === "line") art.push(path("M35 78 Q67 26 125 52", "visual-thick-line"));
  art.push(...labelTile(variant.slice(0, 2).toUpperCase()));
  return art;
}

function peopleArt(variant) {
  if (variant === "teacher") return [
    rect(82, 21, 55, 50, 8, "visual-board"),
    textNode(109, 53, "ABC", "visual-board-text", { "text-anchor": "middle" }),
    personFigure(48, 52, 0.9, variant),
  ];
  if (variant === "student") return [
    personFigure(58, 48, 0.86, variant),
    path("M88 69 Q107 63 126 71 V102 Q107 94 88 99 Z", "visual-secondary"),
    line(107, 70, 107, 99, "visual-line"),
  ];
  const child = /baby/.test(variant) ? 0.55 : /sister|brother|boy|girl/.test(variant) ? 0.72 : 0.9;
  const adultVariant = /grand/.test(variant) ? variant : "person";
  return [
    personFigure(57, 49, adultVariant.includes("grand") ? 0.94 : 0.88, adultVariant),
    personFigure(105, 61, child, variant),
    path("M45 103 Q80 92 119 103", "visual-ground-line"),
  ];
}

function bodyArt(variant) {
  const points = {
    head: [79, 29], face: [79, 33], eye: [72, 30], ear: [92, 34], nose: [80, 35], mouth: [80, 42],
    hand: [44, 75], foot: [68, 106], arm: [54, 65], leg: [91, 91],
  };
  const [hx, hy] = points[variant] || points.face;
  return [
    circle(80, 32, 19, "visual-skin"),
    path("M65 21 Q80 6 96 22", "visual-hair"),
    circle(73, 30, 2, "visual-ink-fill"),
    circle(87, 30, 2, "visual-ink-fill"),
    path("M75 41 Q80 45 86 40", "visual-face-line"),
    path("M63 55 Q80 48 97 55 L104 87 H91 L94 111 H82 L80 84 L77 111 H65 L68 87 H55 Z", "visual-primary"),
    line(61, 59, 43, 78, "visual-limb"),
    line(99, 59, 117, 78, "visual-limb"),
    circle(hx, hy, 10, "visual-focus-ring"),
  ];
}

function foodArt(variant) {
  if (variant === "apple") return [
    path("M80 40 Q62 24 49 42 Q35 61 50 88 Q63 108 80 96 Q97 108 110 88 Q125 61 111 42 Q98 24 80 40 Z", "visual-primary"),
    path("M80 40 Q78 25 89 16", "visual-line"),
    path("M87 20 Q104 14 106 28 Q94 31 87 20", "visual-leaf"),
  ];
  if (variant === "banana") return [
    path("M42 35 Q55 92 119 68 Q100 104 61 98 Q34 89 32 52 Z", "visual-highlight"),
    path("M41 35 L50 29", "visual-line"),
  ];
  if (variant === "fish") return [
    path("M39 61 Q68 27 112 58 Q69 96 39 61 Z", "visual-primary"),
    polygon("112,58 135,38 132,81", "visual-secondary"),
    circle(61, 54, 3, "visual-ink-fill"),
  ];
  if (variant === "egg") return [
    path("M80 18 Q49 18 43 66 Q39 102 80 103 Q121 102 117 66 Q111 18 80 18 Z", "visual-paper"),
    circle(80, 66, 22, "visual-highlight"),
  ];
  if (variant === "water" || variant === "milk") return [
    path("M53 24 H107 L100 102 H60 Z", "visual-glass"),
    path("M58 55 H102 L98 98 H62 Z", variant === "water" ? "visual-water" : "visual-paper"),
    path("M60 50 Q72 45 82 51 Q92 57 102 50", "visual-line"),
  ];
  if (variant === "bread") return [
    path("M41 53 Q38 27 65 23 Q80 12 95 23 Q122 27 119 53 V99 H41 Z", "visual-bread"),
    path("M60 47 Q66 35 72 47 M85 45 Q91 33 98 45", "visual-bread-line"),
  ];
  return [
    path("M35 54 H125 Q120 101 80 105 Q40 101 35 54 Z", "visual-bowl"),
    path("M38 55 Q57 43 79 55 Q101 66 122 54", "visual-food-fill"),
    variant === "soup" ? path("M55 37 Q48 27 56 18 M79 37 Q72 27 80 18 M103 37 Q96 27 104 18", "visual-steam") : null,
    ...labelTile(compactLabel(variant, "FOOD"), { x: 101, y: 89, width: 39 }),
  ];
}

function homeArt(variant) {
  if (["bed", "bedroom"].includes(variant)) return [
    rect(30, 58, 101, 35, 9, "visual-primary"),
    rect(38, 45, 42, 22, 10, "visual-paper"),
    line(34, 91, 34, 108, "visual-line"),
    line(126, 91, 126, 108, "visual-line"),
  ];
  if (variant === "lamp") return [
    polygon("59,52 101,52 91,21 69,21", "visual-highlight"),
    line(80, 52, 80, 97, "visual-line"),
    path("M58 101 Q80 88 102 101", "visual-primary"),
    circle(80, 18, 5, "visual-sun"),
  ];
  if (variant === "key") return [
    circle(55, 53, 21, "visual-highlight"),
    circle(55, 53, 8, "visual-bg-hole"),
    path("M72 66 L111 98 L122 87 M102 91 L112 80", "visual-thick-line"),
  ];
  if (variant === "clock") return [
    circle(80, 61, 39, "visual-paper"),
    circle(80, 61, 34, "visual-clock-face"),
    line(80, 61, 80, 39, "visual-clock-hand"),
    line(80, 61, 99, 72, "visual-clock-hand"),
    circle(80, 61, 4, "visual-primary"),
  ];
  if (variant === "table") return furnitureArt("desk");
  return [
    polygon("27,57 80,15 133,57", "visual-roof"),
    rect(39, 54, 82, 55, 7, "visual-paper"),
    rect(69, 70, 24, 39, 5, "visual-primary"),
    rect(48, 67, 15, 16, 3, "visual-sky"),
    rect(98, 67, 15, 16, 3, "visual-sky"),
    ...labelTile(compactLabel(variant, "HOME"), { x: 102, y: 91, width: 38 }),
  ];
}

function animalArt(variant) {
  const longEars = variant === "rabbit";
  const roundEars = ["bear", "cow", "sheep", "pig"].includes(variant);
  const children = [
    longEars ? rect(51, 10, 17, 39, 9, "visual-secondary", { transform: "rotate(-10 59 30)" }) : circle(54, 38, roundEars ? 15 : 12, "visual-secondary"),
    longEars ? rect(92, 10, 17, 39, 9, "visual-secondary", { transform: "rotate(10 101 30)" }) : circle(106, 38, roundEars ? 15 : 12, "visual-secondary"),
    circle(80, 62, variant === "lion" ? 45 : 39, variant === "lion" ? "visual-mane" : "visual-primary"),
    variant === "lion" ? circle(80, 63, 31, "visual-highlight") : null,
    circle(66, 57, 3, "visual-ink-fill"),
    circle(94, 57, 3, "visual-ink-fill"),
    path("M72 73 Q80 80 88 73", "visual-face-line"),
    circle(80, 68, 5, "visual-nose"),
  ];
  if (variant === "bird") children.push(polygon("101,67 126,76 101,81", "visual-highlight"));
  if (variant === "elephant") children.push(path("M80 67 Q76 90 88 104 Q97 94 90 68", "visual-secondary"));
  if (variant === "cow") children.push(path("M65 39 L57 26 M95 39 L103 26", "visual-horn"));
  return children;
}

function actionArt(variant) {
  const running = ["run", "walk", "jump"].includes(variant);
  const seated = variant === "sit";
  const figure = [
    circle(75, 28, 11, "visual-skin"),
    line(75, 40, seated ? 70 : 78, 72, "visual-limb"),
    line(75, 49, running ? 48 : 55, running ? 62 : 55, "visual-limb"),
    line(76, 49, running ? 102 : 101, running ? 40 : 57, "visual-limb"),
    line(seated ? 70 : 78, 72, seated ? 94 : running ? 105 : 67, seated ? 75 : 96, "visual-limb"),
    line(seated ? 94 : 78, seated ? 75 : 72, seated ? 95 : running ? 53 : 91, seated ? 100 : 99, "visual-limb"),
  ];
  if (["open", "close"].includes(variant)) figure.push(rect(105, 31, 27, 65, 5, "visual-primary"), circle(111, 65, 2, "visual-highlight"));
  if (variant === "read") figure.push(path("M92 51 Q108 44 124 52 V82 Q108 76 92 81 Z", "visual-paper"), line(108, 51, 108, 80, "visual-line"));
  if (variant === "write") figure.push(line(95, 44, 121, 72, "visual-pointer"), path("M89 77 H133", "visual-paper-line"));
  if (variant === "listen") figure.push(path("M101 27 Q124 37 105 54 M111 20 Q144 38 116 64", "visual-sound-wave"));
  return [group(figure), path("M32 105 Q80 97 132 105", "visual-ground-line")];
}

function emotionArt(variant) {
  const mouth = variant === "sad" ? "M61 81 Q80 65 99 81" : variant === "angry" ? "M64 78 L96 78" : variant === "scared" ? null : "M59 70 Q80 94 101 70";
  const art = [
    circle(80, 60, 44, "visual-face"),
    circle(65, 53, variant === "scared" ? 5 : 3, "visual-ink-fill"),
    circle(95, 53, variant === "scared" ? 5 : 3, "visual-ink-fill"),
    mouth ? path(mouth, "visual-face-line") : circle(80, 77, 9, "visual-mouth-fill"),
  ];
  if (variant === "angry") art.push(line(57, 43, 70, 48, "visual-face-line"), line(103, 43, 90, 48, "visual-face-line"));
  if (variant === "tired") art.push(path("M55 49 Q65 57 75 49 M85 49 Q95 57 105 49", "visual-face-line"));
  if (variant === "excited") art.push(path("M43 31 L34 20 M117 31 L127 20", "visual-highlight-line"));
  if (variant === "hungry") art.push(circle(122, 92, 18, "visual-paper"), circle(122, 92, 9, "visual-food-fill"));
  if (variant === "thirsty") art.push(path("M113 75 H137 L133 108 H117 Z", "visual-water"));
  if (variant === "sick") art.push(rect(112, 73, 10, 35, 5, "visual-paper"), circle(117, 101, 8, "visual-secondary"));
  if (variant === "fine") art.push(path("M111 88 L120 97 L138 77", "visual-check"));
  return art;
}

function cloud(x = 57, y = 48) {
  return path(`M${x} ${y + 28} H${x + 62} Q${x + 74} ${y + 28} ${x + 73} ${y + 18} Q${x + 72} ${y + 7} ${x + 59} ${y + 9} Q${x + 54} ${y - 4} ${x + 38} ${y} Q${x + 25} ${y - 1} ${x + 22} ${y + 13} Q${x + 5} ${y + 10} ${x} ${y + 20} Q${x - 3} ${y + 28} ${x} ${y + 28} Z`, "visual-cloud");
}

function weatherArt(variant) {
  if (["sunny", "sun", "hot"].includes(variant)) return [
    circle(80, 57, 28, "visual-sun"),
    path("M80 15 V4 M80 110 V99 M38 57 H25 M135 57 H122 M49 27 L39 17 M111 27 L121 17 M49 88 L39 98 M111 88 L121 98", "visual-sun-ray"),
  ];
  if (variant === "moon" || variant === "night") return [
    circle(74, 57, 34, "visual-moon"),
    circle(90, 45, 33, "visual-bg-hole"),
    circle(117, 28, 3, "visual-star"),
    circle(127, 61, 2, "visual-star"),
  ];
  const art = [cloud()];
  if (variant === "rainy") art.push(path("M70 82 L64 98 M91 82 L85 98 M112 82 L106 98", "visual-rain"));
  if (variant === "snow" || variant === "cold") art.push(textNode(80, 104, "*  *  *", "visual-snow", { "text-anchor": "middle" }));
  if (variant === "windy") art.push(path("M26 88 Q55 74 83 88 Q104 98 130 82 M39 101 Q63 92 82 102", "visual-sound-wave"));
  if (variant === "sky") art.push(circle(118, 28, 12, "visual-sun"));
  return art;
}

function timeArt(variant) {
  if (["today", "tomorrow", "yesterday"].includes(variant)) {
    const number = variant === "yesterday" ? "-1" : variant === "tomorrow" ? "+1" : "0";
    return [
      rect(38, 25, 84, 79, 13, "visual-paper"),
      rect(38, 25, 84, 22, 13, "visual-primary"),
      line(57, 18, 57, 35, "visual-calendar-ring"),
      line(103, 18, 103, 35, "visual-calendar-ring"),
      textNode(80, 82, number, "visual-time-text", { "text-anchor": "middle" }),
    ];
  }
  if (["morning", "afternoon", "evening", "night"].includes(variant)) {
    const position = { morning: [48, 75], afternoon: [80, 36], evening: [112, 75], night: [80, 43] }[variant];
    return [
      path("M28 94 Q80 28 132 94", "visual-horizon"),
      circle(position[0], position[1], 17, variant === "night" ? "visual-moon" : "visual-sun"),
      line(26, 95, 134, 95, "visual-ground-line"),
      ...labelTile(compactLabel(variant), { x: 101, y: 91, width: 40 }),
    ];
  }
  return homeArt("clock");
}

function placeArt(variant) {
  if (variant === "park") return [
    circle(62, 45, 25, "visual-leaf"),
    circle(90, 39, 28, "visual-leaf"),
    rect(72, 54, 12, 48, 5, "visual-tree-trunk"),
    path("M24 104 Q76 88 137 104", "visual-ground-line"),
  ];
  if (variant === "playground") return [
    line(44, 28, 44, 103, "visual-line"), line(44, 28, 92, 28, "visual-line"), line(92, 28, 92, 103, "visual-line"),
    line(60, 29, 60, 64, "visual-line"), line(78, 29, 78, 64, "visual-line"), path("M56 64 Q69 83 82 64", "visual-primary"),
    path("M106 35 L136 101 H94 Z", "visual-secondary"),
  ];
  const signs = { school: "ABC", station: "STN", store: "SHOP", hospital: "+", library: "BOOK", restaurant: "EAT", bank: "BANK", "post-office": "POST" };
  return [
    rect(31, 34, 98, 75, 8, "visual-building"),
    rect(44, 48, 72, 22, 7, "visual-primary"),
    textNode(80, 63, signs[variant] || compactLabel(variant), "visual-sign-text", { "text-anchor": "middle" }),
    rect(46, 80, 18, 29, 4, "visual-sky"),
    rect(71, 80, 18, 29, 4, "visual-sky"),
    rect(97, 80, 18, 29, 4, "visual-secondary"),
  ];
}

function abstractArt(family, variant, label) {
  if (family === "garment") return [
    path("M52 31 L70 20 Q80 31 90 20 L108 31 L124 55 L107 68 L100 55 V105 H60 V55 L53 68 L36 55 Z", "visual-primary"),
    ...labelTile(label),
  ];
  if (family === "transport" || family === "travel") return [
    rect(32, 55, 96, 37, 13, "visual-primary"),
    rect(49, 39, 55, 24, 10, "visual-secondary"),
    circle(53, 94, 12, "visual-wheel"), circle(108, 94, 12, "visual-wheel"),
    path("M25 108 H137", "visual-ground-line"),
    ...labelTile(label),
  ];
  if (family === "technology") return [
    rect(39, 17, 82, 88, 14, "visual-device"),
    rect(47, 28, 66, 58, 8, "visual-sky"),
    circle(80, 95, 4, "visual-primary"),
    textNode(80, 65, label, "visual-device-text", { "text-anchor": "middle" }),
  ];
  if (family === "health") return [
    circle(80, 61, 43, "visual-paper"),
    rect(72, 33, 16, 57, 5, "visual-primary"),
    rect(52, 53, 56, 17, 5, "visual-primary"),
    ...labelTile(label),
  ];
  if (family === "commerce") return [
    circle(65, 68, 31, "visual-highlight"),
    circle(89, 51, 30, "visual-primary"),
    textNode(89, 62, "$", "visual-coin-text", { "text-anchor": "middle" }),
    ...labelTile(label),
  ];
  if (family === "environment") return [
    path("M38 91 Q42 25 123 20 Q118 91 57 101 Q82 72 104 43 Q69 62 38 91 Z", "visual-leaf"),
    path("M49 94 Q78 62 108 36", "visual-leaf-line"),
    ...labelTile(label),
  ];
  if (family === "emotion") return emotionArt(variant);
  if (family === "communication") return dialogueArt("conversation", label);
  if (family === "connection") return [
    circle(48, 57, 18, "visual-primary"), circle(112, 57, 18, "visual-secondary"),
    path("M61 68 Q80 94 99 68", "visual-connection"),
    path("M63 46 Q80 26 97 46", "visual-connection"),
    ...labelTile(label),
  ];
  if (family === "business" || family === "work") return [
    rect(31, 27, 98, 76, 12, "visual-paper"),
    rect(46, 70, 13, 20, 4, "visual-secondary"),
    rect(70, 54, 13, 36, 4, "visual-primary"),
    rect(94, 39, 13, 51, 4, "visual-highlight"),
    path("M44 48 Q72 35 113 25", "visual-chart-line"),
    ...labelTile(label),
  ];
  if (family === "route" || family === "motion" || family === "practical") return [
    circle(39, 88, 9, "visual-secondary"), circle(121, 34, 9, "visual-primary"),
    path("M48 85 Q70 77 64 61 Q57 44 80 41 Q101 37 112 35", "visual-route-line"),
    polygon("107,27 128,33 114,47", "visual-primary"),
    ...labelTile(label),
  ];
  if (family === "study" || family === "thinking") return [
    path("M29 39 Q51 29 77 41 V96 Q52 84 29 90 Z", "visual-primary"),
    path("M131 39 Q109 29 83 41 V96 Q108 84 131 90 Z", "visual-secondary"),
    line(80, 41, 80, 97, "visual-line"),
    circle(112, 24, 12, "visual-highlight"),
    textNode(112, 29, "?", "visual-question", { "text-anchor": "middle" }),
  ];
  if (family === "attribute" || family === "precision") return [
    path("M39 88 A43 43 0 0 1 121 88", "visual-gauge"),
    line(80, 87, 107, 50, "visual-gauge-hand"),
    circle(80, 87, 7, "visual-primary"),
    path("M47 86 L47 78 M60 58 L55 51 M80 45 V36 M100 58 L106 51 M113 86 L113 78", "visual-gauge-ticks"),
    ...labelTile(label),
  ];
  return [
    circle(80, 59, 38, "visual-primary"),
    path("M62 57 L75 70 L101 43", "visual-check"),
    ...labelTile(label),
  ];
}

function sceneSymbol(variant) {
  if (variant === "greeting") return [path("M105 45 Q116 31 129 39 M110 50 L133 49", "visual-highlight-line")];
  if (variant === "food") return [circle(119, 44, 11, "visual-paper"), circle(119, 44, 5, "visual-food-fill")];
  if (variant === "question") return [textNode(119, 50, "?", "visual-question", { "text-anchor": "middle" })];
  if (variant === "shopping") return [rect(107, 34, 24, 22, 5, "visual-highlight"), path("M112 35 Q112 25 119 25 Q126 25 126 35", "visual-line")];
  if (variant === "directions") return [path("M106 43 H132 M124 34 L133 43 L124 52", "visual-highlight-line")];
  if (variant === "weather") return [cloud(99, 20)];
  if (variant === "health") return [rect(115, 27, 8, 28, 3, "visual-highlight"), rect(105, 37, 28, 8, 3, "visual-highlight")];
  if (variant === "school") return [path("M105 31 Q118 25 132 32 V53 Q118 48 105 53 Z", "visual-paper"), line(119, 31, 119, 53, "visual-line")];
  if (variant === "work") return [path("M106 53 L114 41 L121 47 L131 31", "visual-chart-line")];
  if (variant === "idea") return [circle(119, 37, 11, "visual-highlight"), rect(114, 48, 10, 7, 3, "visual-secondary")];
  if (variant === "agreement") return [path("M104 43 Q112 31 121 42 Q130 31 137 43 Q124 57 121 59 Q117 56 104 43", "visual-highlight")];
  if (variant === "story") return [path("M106 48 Q118 24 132 45 Q122 56 109 58", "visual-secondary")];
  if (variant === "growth") return [path("M119 55 V31 M119 39 Q107 28 102 38 Q108 47 119 45 M119 36 Q129 24 136 34 Q131 44 119 44", "visual-leaf-line")];
  return [path("M106 38 H132 M106 47 H126", "visual-paper-line")];
}

function dialogueArt(variant, label) {
  return [
    path("M25 18 H101 Q111 18 111 28 V61 Q111 71 101 71 H63 L49 84 L51 71 H25 Q15 71 15 61 V28 Q15 18 25 18 Z", "visual-speech-bubble"),
    path("M33 34 H92 M33 46 H82 M33 58 H69", "visual-speech-line"),
    personFigure(43, 86, 0.55, "speaker"),
    personFigure(82, 86, 0.55, "listener"),
    ...sceneSymbol(variant),
    ...labelTile(label, { x: 107, y: 90, width: 34 }),
  ];
}

function phonicsArt(spec) {
  return [
    path("M25 62 Q38 34 63 40 Q78 44 82 57 Q71 65 60 64 Q45 64 25 62 Z", "visual-lips"),
    path("M31 61 Q49 52 75 59 Q56 73 31 61 Z", "visual-mouth-fill"),
    path("M89 44 Q105 58 89 72 M101 35 Q128 58 101 81 M115 27 Q150 58 115 91", "visual-sound-wave"),
    rect(25, 84, 84, 26, 12, "visual-phonics-label-tile"),
    textNode(67, 102, spec.label, "visual-phonics-label", { "text-anchor": "middle" }),
    spec.variant === "rhythm" ? path("M119 92 Q127 78 135 92 Q143 106 151 92", "visual-rhythm") : null,
  ];
}

function motifArt(spec) {
  const { family, variant, label } = spec;
  if (family === "object") return objectArt(variant);
  if (family === "furniture") return furnitureArt(variant);
  if (family === "architecture") return architectureArt(variant);
  if (family === "swatch") return swatchArt(variant);
  if (family === "shape") return shapeArt(variant);
  if (family === "person") return peopleArt(variant);
  if (family === "body") return bodyArt(variant);
  if (family === "food") return foodArt(variant);
  if (family === "home") return homeArt(variant);
  if (family === "animal") return animalArt(variant);
  if (family === "action") return actionArt(variant);
  if (family === "emotion") return emotionArt(variant);
  if (family === "weather") return weatherArt(variant);
  if (family === "time") return timeArt(variant);
  if (family === "place") return placeArt(variant);
  if (family === "dialogue") return dialogueArt(variant, label);
  if (family === "phonics") return phonicsArt(spec);
  return abstractArt(family, variant, label);
}

export function curriculumVisualTree(item, category) {
  const spec = visualSpecFor(item, category);
  return node("svg", {
    viewBox: "0 0 160 120",
    xmlns: SVG_NS,
    role: "presentation",
    focusable: "false",
    "aria-hidden": "true",
    "data-generated-art": "tahmid-original",
    "data-visual-id": spec.id,
  }, [
    rect(2, 2, 156, 116, 24, "visual-canvas"),
    circle(138, 20, 18 + (spec.seed % 7), "visual-orbit"),
    path("M8 101 Q48 85 81 102 Q114 118 152 96 V118 H8 Z", "visual-ground"),
    group(motifArt(spec), { class: "visual-motif", "data-family": spec.family, "data-variant": spec.variant }),
  ]);
}

function escapeMarkup(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function serializeTree(tree) {
  if (typeof tree === "string") return escapeMarkup(tree);
  const attrs = Object.entries(tree.attrs || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([name, value]) => ` ${name}="${escapeMarkup(value)}"`)
    .join("");
  const children = (tree.children || []).map(serializeTree).join("");
  return `<${tree.tag}${attrs}>${children}</${tree.tag}>`;
}

export function curriculumVisualMarkup(item, category) {
  return serializeTree(curriculumVisualTree(item, category));
}

function createSvgElement(tree, documentRef) {
  if (typeof tree === "string") return documentRef.createTextNode(tree);
  const element = documentRef.createElementNS(SVG_NS, tree.tag);
  Object.entries(tree.attrs || {}).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== false) element.setAttribute(name, String(value));
  });
  (tree.children || []).forEach((child) => element.append(createSvgElement(child, documentRef)));
  return element;
}

export function createCurriculumVisual(item, category, documentRef = globalThis.document) {
  if (!documentRef?.createElementNS) throw new TypeError("A DOM document is required to create a curriculum visual.");
  const spec = visualSpecFor(item, category);
  const element = createSvgElement(curriculumVisualTree(item, category), documentRef);
  element.dataset.visualFamily = spec.family;
  element.dataset.visualTone = spec.tone;
  return element;
}

function itemFromCard(card) {
  const category = resolvedCategory({ id: card.id }, card.dataset.category);
  const title = card.querySelector(".learn-card-title h3")?.textContent?.trim() || "";
  const topic = card.querySelector(".learn-card-title small")?.textContent?.split("·")[0]?.trim() || "";
  const id = card.id.replace(/^curriculum-/, "") || `${category}-${normalise(title).replace(/[^a-z0-9]+/g, "-")}`;
  const level = Number(id.match(/-l(\d{2})-/)?.[1] || id.match(/-l(\d{2})$/)?.[1] || 1);
  const base = { id, level, title_en: title, tags: topic ? [normalise(topic).replaceAll(" ", "-")] : [] };
  if (category === "words") base.word = title;
  if (category === "phrases") base.phrase = title;
  if (category === "phonics") base.phonicsTarget = title;
  return { item: base, category };
}

export function enhanceCurriculumCard(card) {
  if (!card?.matches?.(".learn-card") || card.dataset.curriculumVisual === "ready") return false;
  const host = card.querySelector(".learn-card-icon");
  if (!host) return false;
  const { item, category } = itemFromCard(card);
  const spec = visualSpecFor(item, category);
  host.replaceChildren(createCurriculumVisual(item, category, host.ownerDocument));
  host.classList.add("curriculum-visual");
  host.dataset.visualSource = spec.source;
  host.dataset.visualFamily = spec.family;
  host.dataset.visualTone = spec.tone;
  card.classList.add("has-curriculum-visual");
  card.dataset.curriculumVisual = "ready";
  card.dataset.visualKey = spec.visualKey;
  return true;
}

function scanCurriculumCards(root) {
  if (root?.matches?.(".learn-card")) enhanceCurriculumCard(root);
  root?.querySelectorAll?.(".learn-card").forEach(enhanceCurriculumCard);
}

export function installCurriculumVisuals(root = globalThis.document) {
  if (!root?.querySelectorAll) return () => {};
  scanCurriculumCards(root);
  const documentRef = root.nodeType === 9 ? root : root.ownerDocument;
  const Observer = documentRef?.defaultView?.MutationObserver || globalThis.MutationObserver;
  if (!Observer) return () => {};
  const observer = new Observer((records) => {
    records.forEach((record) => record.addedNodes.forEach((added) => {
      if (added.nodeType === 1) scanCurriculumCards(added);
    }));
  });
  observer.observe(root.nodeType === 9 ? root.documentElement : root, { childList: true, subtree: true });
  return () => observer.disconnect();
}

if (typeof document !== "undefined") {
  const start = () => installCurriculumVisuals(document);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
}

export const curriculumVisualMetadata = Object.freeze({
  author: "Tahmid English Review Hub",
  assetType: "original deterministic inline SVG",
  externalAssets: 0,
  earlyWordMotifCount: Object.keys(EARLY_WORD_MOTIFS).length,
});
