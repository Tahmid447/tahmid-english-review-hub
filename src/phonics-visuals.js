// Original teaching diagrams. No stock art, emoji or external SVG markup.
// The same small drawing primitives express different articulation, spelling,
// timing and linking relationships; every level has its own teaching model.
const C = Object.freeze({ ink: "#183e3b", muted: "#53716b", paper: "#fffdf6", panel: "#ffffff", line: "#cbded6", teal: "#167f78", mint: "#e0f3e9", coral: "#d96d56", blush: "#ffe4d8", gold: "#a56715", cream: "#fff0c7", blue: "#406dc4", lilac: "#e9e8fb" });
const n = (tag, attrs = {}, children = []) => ({ tag, attrs, children: (Array.isArray(children) ? children : [children]).filter((child) => child !== undefined && child !== null) });
const rect = (x, y, width, height, fill = C.panel, rx = 18) => n("rect", { x, y, width, height, rx, fill });
const path = (d, stroke = C.ink, width = 3, fill = "none", extra = {}) => n("path", { d, fill, stroke, "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round", ...extra });
const text = (x, y, value, size = 24, fill = C.ink, weight = 650, extra = {}) => n("text", { x, y, fill, "font-size": size, "font-weight": weight, "text-anchor": "middle", "font-family": "Arial, sans-serif", ...extra }, String(value));
const group = (x, y, children, scale = 1) => n("g", { transform: `translate(${x} ${y}) scale(${scale})` }, children);
const circle = (cx, cy, r, fill = C.teal) => n("circle", { cx, cy, r, fill });
const arrow = (x1, y1, x2, y2, color = C.teal) => [
  path(`M${x1} ${y1} L${x2} ${y2}`, color, 3),
  path(`M${x2 - 8} ${y2 - 6} L${x2} ${y2} L${x2 - 8} ${y2 + 6}`, color, 3),
];
const label = (x, y, value, fill = C.mint, color = C.teal, width = 180) => [rect(x - width / 2, y - 24, width, 36, fill, 12), text(x, y, value, 18, color)];

const LEVELS = [
  ["First sounds", "最初の子音", "Closed lips send m through the nose; a narrow tongue channel sends s through the mouth.", "mは唇を閉じて鼻へ、sは舌の細いすき間から口へ息を通します。"],
  ["Tongue or lips?", "舌と唇の使い分け", "N touches the upper ridge and uses nasal airflow. B closes and releases both lips with voice.", "nは上の歯ぐきに舌先をつけ鼻へ息を通し、bは唇を閉じて声と一緒に開きます。"],
  ["Same lips, add voice", "唇は同じ、声を加える", "Upper teeth touch the lower lip for fan and van. Only van adds vocal vibration.", "fanとvanは上の歯を下唇に当て、vanだけ喉を震わせます。"],
  ["Light · right", "lとrの舌の位置", "For l, the tongue tip touches the upper ridge. For r, the tongue lifts without touching it.", "lは舌先を上の歯ぐきにつけ、rは上につけず舌を持ち上げます。"],
  ["Short a · /æ/", "短いa", "Cat uses a low front tongue and an open, slightly spread mouth.", "catの母音は舌を前方の低い位置に置き、口を大きく横にも開きます。"],
  ["Short i · /ɪ/", "短いi", "Sit has a short relaxed high-front vowel. Seat holds a higher, tenser vowel longer.", "sitは前方の高い舌を緩めた短い音。seatはより高い舌で長く響かせます。"],
  ["Hot: two accents", "hotのUS・UKの音", "Common US hot has a low unrounded vowel; common UK hot has a low rounded vowel.", "一般的なUSのhotは唇を丸めない低い母音、UKでは唇を丸める低い母音です。"],
  ["Short e · /e, ɛ/", "短いe", "Bed uses a mid-front tongue. Keep the sound short and do not glide toward ee.", "bedは舌を前方の中ほどに置き、イーへ滑らせず短い音を出します。"],
  ["Short u · /ʌ/", "短いu", "Sun uses a relaxed central vowel with unrounded lips. The tongue stays lower than for oo.", "sunは唇を丸めず、舌を中央の低めの位置に置く、力を抜いた母音です。"],
  ["Blend · finish", "音をつなぎ、止める", "The sounds in map connect into one word; the final p ends cleanly without an extra vowel.", "mapの3音を1語につなぎ、最後のpの後に余分な母音を足さず止めます。"],
  ["Move straight to l", "子音からlへつなぐ", "The starts of blue, clap and flag keep both consonants together with no extra vowel between them.", "blue、clap、flagは最初の2つの子音の間に母音を入れずつなぎます。"],
  ["Move straight to r", "子音からrへつなぐ", "Brown, crab and frog move from the first consonant directly into English r.", "brown、crab、frogは最初の子音から英語のrへ直接つなぎます。"],
  ["Two · three consonants", "2つ・3つの子音", "Spin begins with two consonants; street begins with three. All connect before the vowel.", "spinは2子音、streetは3子音で始まり、母音が出るまでをつなげます。"],
  ["Flow · stop and flow", "息を流す・止めて流す", "Ship begins with continuous airflow. Chip briefly stops the air before releasing it.", "shipは息を続けて出し、chipは一度空気を止めてから出します。"],
  ["Tongue between teeth", "舌先を歯の間へ", "Think and this both place the tongue tip between the teeth. This adds voice.", "thinkもthisも舌先を歯の間に軽く置き、thisでは声を加えます。"],
  ["Lips · teeth · nose", "唇・歯・鼻", "When rounds the lips, phone uses teeth and lower lip, and sing sends air through the nose with the back of the tongue raised.", "whenは唇を丸め、phoneは歯と下唇を使い、singは舌の奥を上げ鼻へ息を通します。"],
  ["cap → cape", "無音eでaの音が変わる", "Adding a silent e changes cap to cape. The vowel changes; the final e is not a separate sound.", "capに無音のeを足すとcapeになり、母音の音が変わります。最後のeは読みません。"],
  ["bit → bite", "無音eでiの音が変わる", "Adding silent e changes the short vowel in bit to the gliding vowel in bite.", "bitに無音のeを足すと、biteの滑らかに動く母音へ変わります。"],
  ["hop → hope", "無音eでoの音が変わる", "Hop has a short vowel. Hope has a gliding long-o vowel and a silent final e.", "hopの短い母音が、hopeでは滑らかに動く母音になり、最後のeは読みません。"],
  ["cub → cube", "無音eとu・e", "Cub becomes cube with silent e. These is another silent-e pattern with a long ee vowel.", "cubに無音eを足すとcubeになります。theseも最後のeを読まず長いイーになる形です。"],
  ["ai + ay · one sound", "aiとayで同じ母音", "The different vowel spellings in rain and day produce the same gliding vowel.", "rainのaiとdayのayは、つづりが異なっても同じ滑らかに動く母音です。"],
  ["ee + ea · one sound", "eeとeaで同じ母音", "Green and leaf use the long ee vowel; the tongue is high and forward.", "greenとleafは長いイーの音で、舌を前方の高い位置に置きます。"],
  ["oa + ow · one sound", "oaとowで同じ母音", "Boat and snow share the long-o glide. Lips become more rounded as the sound moves.", "boatとsnowは同じ長いoの音で、音が動くとともに唇がより丸くなります。"],
  ["oo · two sounds", "ooには2つの音", "Fool and pool use a longer tenser vowel. Full and pull use a shorter relaxed vowel.", "foolとpoolは長く張りのある母音、fullとpullは短く力を抜いた母音です。"],
  ["Hear the r", "rの違いを聞く", "US car connects the vowel to a raised or bunched tongue for r. Common UK car ends with the vowel when no vowel follows.", "USのcarは母音から舌を上げたrへつなぎ、一般的なUKでは次に母音がなければ母音で終わります。"],
  ["er · ir · ur", "異なるつづりで似た音", "Her, bird and turn share a stressed central vowel: r-coloured in US English, usually non-rhotic in UK English.", "her、bird、turnは似た強勢のある中央母音で、USはrの響き、UKは通常rを伴わない音です。"],
  ["oi · oy: one glide", "oi・oyの母音の動き", "Coin and boy move from rounded lips to a relaxed high-front finish within one syllable.", "coinとboyは1音節の中で、丸い唇から前方の高い母音へ滑らかに動きます。"],
  ["ou · ow: one glide", "ou・owの母音の動き", "House and cow move from an open mouth toward rounded lips within one syllable.", "houseとcowは1音節の中で、大きく開いた口から丸い唇へ滑らかに動きます。"],
  ["Spelling ≠ sound", "文字と音は1対1ではない", "Cat, kite and back share k; city uses s; giant and bridge share j. Listen as well as looking at spelling.", "cat・kite・backはkの音、cityはs、giant・bridgeはjの音。つづりと一緒に音を確認します。"],
  ["Endings: count the beats", "語尾の音節を数える", "Cats and dogs keep one beat. Buses adds a beat. Washed and played keep one beat; wanted adds a beat.", "catsとdogsは1音節、busesは1音節増えます。washedとplayedは1音節、wantedは1音節増えます。"],
  ["One strong beat", "強い音節をひとつ", "Banana puts stress on the middle syllable. The surrounding syllables use a weak relaxed schwa.", "bananaは真ん中の音節を強くし、前後の音節を力の抜けた弱い母音にします。"],
  ["Link · keep the beat", "つなげてリズムを作る", "Pick it up links final consonants to the next vowel. Important words carry the beats while short grammar words stay light.", "pick it upは語末の子音を次の母音につなげ、大切な語を強く、短い機能語は弱くします。"],
];
export const PHONICS_VISUAL_LEVELS = Object.freeze(LEVELS.map(([titleEn, titleJa, altEn, altJa], index) => Object.freeze({ level: index + 1, titleEn, titleJa, altEn, altJa, kind: "original-phonics-diagram", author: "Tahmid English Club", license: "Project-owned original artwork" })));

const levelOf = (item) => Number(item?.level || item?.content?.level || String(item?.id || "").match(/l(\d+)/)?.[1]) || 1;
export function phonicsVisualMetadata(item) { return PHONICS_VISUAL_LEVELS[Math.max(0, Math.min(31, levelOf(item) - 1))]; }

function mouth(mode, { voiced = false, nasal = false, title = "", example = "" } = {}) {
  const tongue = {
    l: "M82 149 Q114 151 140 137 Q163 124 177 102 Q184 94 188 103 Q174 143 146 159 Q104 169 82 149Z",
    n: "M82 149 Q114 151 140 137 Q163 124 177 102 Q184 94 188 103 Q174 143 146 159 Q104 169 82 149Z",
    r: "M82 149 Q112 158 133 138 Q147 114 165 124 Q177 141 156 156 Q113 172 82 149Z",
    th: "M80 149 Q135 137 177 128 Q201 122 223 131 Q225 138 210 140 Q143 158 80 149Z",
    ng: "M82 149 Q81 100 109 94 Q126 92 139 128 Q156 148 194 145 Q154 171 82 149Z",
    sh: "M82 149 Q121 135 147 114 Q168 106 185 119 Q181 135 170 147 Q132 169 82 149Z",
    ch: "M82 149 Q125 145 150 116 Q169 95 186 104 Q180 139 161 153 Q121 168 82 149Z",
  }[mode] || "M82 149 Q111 138 149 144 Q176 143 195 135 Q193 157 153 164 Q109 166 82 149Z";
  return [
    text(130, 31, title, 28),
    path("M48 186 C21 151 25 95 66 67 Q116 32 174 65 L203 80 L224 89 L205 104 L214 116 L204 130 Q188 183 135 196 L94 199", C.line, 3, C.blush),
    path("M71 112 Q124 75 190 103 L198 130 Q167 168 83 153 Z", C.ink, 2, C.panel),
    n("rect", { x: 183, y: 103, width: 16, height: 22, rx: 3, fill: C.paper, stroke: C.line, "stroke-width": 2 }),
    path(tongue, C.coral, 2, C.coral),
    ...(mode === "f" ? [path("M197 124 Q217 111 205 103", C.coral, 7)] : []),
    ...(mode === "m" || mode === "b" ? [path("M202 107 Q217 116 203 125", C.coral, 8)] : []),
    ...(mode === "w" ? [n("ellipse", { cx: 213, cy: 116, rx: 8, ry: 14, fill: C.paper, stroke: C.coral, "stroke-width": 5 })] : []),
    nasal ? path("M105 128 Q112 78 161 77 L222 85", C.teal, 4, "none", { "stroke-dasharray": "5 7" })
      : path(mode === "ch" || mode === "b" ? "M206 118 L240 118" : "M145 128 Q189 120 242 117", C.teal, 4, "none", { "stroke-dasharray": "5 7" }),
    ...(voiced ? [path("M53 144 q-13 -9 0 -18 q13 -9 0 -18", C.blue, 4), path("M41 147 q-15 -15 0 -30", C.blue, 3)] : []),
    text(130, 231, example, 28, C.teal),
  ];
}

function articulationPair(left, right) {
  return [rect(24, 69, 284, 280), rect(332, 69, 284, 280), group(37, 76, mouth(...left)), group(345, 76, mouth(...right))];
}

function vowelDiagram(level) {
  const spec = {
    5: { sound: "/æ/", word: "cat", x: 147, y: 260, openness: 30, round: false, cue: "LOW · FRONT", contrast: "cat  /  cut", color: C.coral },
    6: { sound: "/ɪ/", word: "sit", x: 133, y: 143, openness: 13, round: false, cue: "HIGH · RELAXED", contrast: "sit  /  seat", color: C.teal },
    8: { sound: "/e, ɛ/", word: "bed", x: 130, y: 197, openness: 21, round: false, cue: "MID · FRONT", contrast: "pen  /  pin", color: C.blue },
    9: { sound: "/ʌ/", word: "sun", x: 199, y: 235, openness: 24, round: false, cue: "CENTRAL · RELAXED", contrast: "cup  /  cap", color: C.gold },
  }[level];
  return [
    rect(24, 76, 316, 271), rect(357, 76, 259, 271),
    text(181, 107, "TONGUE POSITION", 17, C.muted),
    path("M86 132 L277 132 L251 276 L152 276 Z", C.line, 3),
    path("M119 201 L264 201", C.line, 2, "none", { "stroke-dasharray": "4 5" }),
    text(91, 301, "front", 17, C.muted), text(273, 301, "back", 17, C.muted),
    circle(spec.x, spec.y, 17, spec.color), text(spec.x, spec.y + 7, "●", 16, C.panel),
    text(486, 122, spec.sound, 35),
    n("ellipse", { cx: 486, cy: 187, rx: 69, ry: spec.openness + 15, fill: C.blush, stroke: C.coral, "stroke-width": 6 }),
    n("ellipse", { cx: 486, cy: 187, rx: 48, ry: spec.openness, fill: "#774940" }),
    text(486, 269, spec.word, 43, spec.color),
    text(486, 308, spec.contrast, 22),
    ...label(320, 376, spec.cue, C.mint, C.teal, 280),
  ];
}

function accentVowel() {
  return [
    rect(24, 78, 284, 265), rect(332, 78, 284, 265),
    ...label(166, 116, "US · /ɑ/", C.mint, C.teal, 190), ...label(474, 116, "UK · /ɒ/", C.lilac, C.blue, 190),
    n("ellipse", { cx: 166, cy: 199, rx: 66, ry: 48, fill: C.blush, stroke: C.coral, "stroke-width": 7 }),
    n("ellipse", { cx: 166, cy: 199, rx: 45, ry: 34, fill: "#774940" }),
    n("ellipse", { cx: 474, cy: 199, rx: 42, ry: 48, fill: C.blush, stroke: C.coral, "stroke-width": 12 }),
    n("ellipse", { cx: 474, cy: 199, rx: 24, ry: 30, fill: "#774940" }),
    text(166, 295, "hot", 43, C.teal), text(474, 295, "hot", 43, C.blue),
    text(166, 378, "OPEN", 18, C.muted), text(474, 378, "ROUNDED", 18, C.muted),
  ];
}

function wordParts(x, y, parts, { size = 42, gap = 0 } = {}) {
  let cursor = x;
  return parts.map(([value, focus = false, silent = false]) => {
    const width = value.length * size * 0.57 + gap;
    const result = group(cursor + width / 2, y, [
      ...(focus ? [rect(-width / 2 - 4, -size + 5, width + 8, size + 12, C.mint, 9)] : []),
      text(0, 0, value, size, silent ? C.muted : focus ? C.teal : C.ink, silent ? 450 : 700),
      ...(silent ? [path(`M${-width / 2} -5 L${width / 2} ${-size + 9}`, C.coral, 3)] : []),
    ]);
    cursor += width;
    return result;
  });
}

function blend(level) {
  const spec = {
    10: { sounds: ["m", "a", "p"], result: "map", words: ["tap", "win", "red"], cue: "ONE WORD · CLEAN FINISH", finish: true },
    11: { sounds: ["b", "l"], result: "blue", words: ["clap", "flag", "sleep"], cue: "NO EXTRA VOWEL" },
    12: { sounds: ["b", "r"], result: "brown", words: ["crab", "frog", "tree"], cue: "NO EXTRA VOWEL" },
    13: { sounds: ["s", "t", "r"], result: "street", words: ["spin", "stop", "swim"], cue: "KEEP ALL THREE TOGETHER" },
  }[level];
  const start = 320 - spec.sounds.length * 62;
  return [
    rect(24, 78, 592, 272),
    ...spec.sounds.flatMap((sound, index) => [rect(start + index * 124 + 7, 105, 100, 81, index === 1 && level === 10 ? C.cream : C.mint, 16), text(start + index * 124 + 57, 161, sound, 47, index === 1 && level === 10 ? C.gold : C.teal)]),
    path(`M${start + 50} 198 Q320 239 ${start + (spec.sounds.length - 1) * 124 + 62} 198`, C.teal, 4),
    text(320, 276, spec.result, 52),
    ...(spec.finish ? [path("M391 237 L391 282", C.coral, 5)] : []),
    text(320, 325, spec.words.join("     ·     "), 26, C.muted),
    text(320, 379, spec.cue, 18, C.teal),
  ];
}

function silentE(level) {
  const spec = {
    17: ["c", "a", "p", "/æ/", "/eɪ/", "mad → made"],
    18: ["b", "i", "t", "/ɪ/", "/aɪ/", "kit → kite"],
    19: ["h", "o", "p", "short o", "long o", "not → note"],
    20: ["c", "u", "b", "/ʌ/", "/juː/", "these → /iː/"],
  }[level];
  return [
    rect(24, 78, 592, 274),
    ...wordParts(74, 196, [[spec[0]], [spec[1], true], [spec[2]]], { size: 56 }),
    ...arrow(280, 180, 334, 180),
    ...wordParts(375, 196, [[spec[0]], [spec[1], true], [spec[2]], ["e", false, true]], { size: 56 }),
    path("M489 131 Q464 88 422 125", C.gold, 3),
    text(172, 259, spec[3], 29, C.muted), text(456, 259, spec[4], 29, C.teal),
    text(320, 325, spec[5], 26),
    ...label(320, 379, "FINAL e IS SILENT HERE", C.cream, C.gold, 310),
  ];
}

function vowelTeams(level) {
  const spec = {
    21: { teams: ["ai", "ay"], words: [[["r"], ["ai", true], ["n"]], [["d"], ["ay", true]]], sound: "/eɪ/", cue: "rain · day · train · play" },
    22: { teams: ["ee", "ea"], words: [[["gr"], ["ee", true], ["n"]], [["l"], ["ea", true], ["f"]]], sound: "/iː/", cue: "green · leaf · sleep · team" },
    23: { teams: ["oa", "ow"], words: [[["b"], ["oa", true], ["t"]], [["sn"], ["ow", true]]], sound: "long o", cue: "US /oʊ/ · UK /əʊ/" },
  }[level];
  return [
    rect(24, 78, 592, 272),
    ...label(175, 133, spec.teams[0], C.lilac, C.blue, 120), ...label(465, 133, spec.teams[1], C.lilac, C.blue, 120),
    ...wordParts(175 - spec.words[0].map(([value]) => value.length).reduce((a, b) => a + b, 0) * 12, 205, spec.words[0], { size: 42 }),
    ...wordParts(465 - spec.words[1].map(([value]) => value.length).reduce((a, b) => a + b, 0) * 12, 205, spec.words[1], { size: 42 }),
    path("M175 228 Q175 270 284 270 M465 228 Q465 270 356 270", C.teal, 3),
    ...label(320, 288, spec.sound, C.mint, C.teal, 176),
    text(320, 378, spec.cue, 22),
  ];
}

function vowelContrast() {
  return [rect(24, 78, 592, 272),
    ...label(178, 126, "/uː/", C.mint, C.teal, 140), ...label(470, 126, "/ʊ/", C.cream, C.gold, 140),
    text(178, 201, "fool", 46, C.teal), text(470, 201, "full", 46, C.gold),
    rect(83, 233, 190, 18, C.teal, 9), rect(435, 233, 70, 18, C.gold, 9),
    text(178, 294, "pool", 31), text(470, 294, "pull", 31),
    text(178, 377, "LONGER · TENSER", 18, C.teal), text(470, 377, "SHORTER · RELAXED", 18, C.gold),
  ];
}

function rhotic(level) {
  if (level === 25) return [
    ...articulationPair(["r", { voiced: true, title: "US · /ɑr/", example: "car" }], ["open", { voiced: true, title: "UK · /ɑː/", example: "car" }]),
    text(166, 379, "A VOWEL + r", 17, C.muted), text(474, 379, "A VOWEL ENDING", 17, C.muted),
  ];
  return [
    rect(24, 78, 592, 271),
    ...["er", "ir", "ur"].flatMap((spelling, i) => [...label(126 + i * 194, 127, spelling, C.lilac, C.blue, 130), text(126 + i * 194, 197, ["her", "bird", "turn"][i], 36)]),
    path("M126 223 L126 244 L514 244 L514 223 M320 221 L320 274", C.line, 3),
    ...label(320, 311, "US /ɝ/   ·   UK /ɜː/", C.mint, C.teal, 334),
    text(320, 379, "DIFFERENT SPELLINGS · A SHARED VOWEL", 17, C.muted),
  ];
}

function glide(level) {
  const first = level === 27 ? { rx: 33, ry: 31, sound: "/ɔ/", label: "ROUND" } : { rx: 58, ry: 42, sound: "/a/", label: "OPEN" };
  const end = level === 27 ? { rx: 59, ry: 17, sound: "/ɪ/", label: "RELAX" } : { rx: 30, ry: 28, sound: "/ʊ/", label: "ROUND" };
  return [rect(24, 78, 592, 272),
    n("ellipse", { cx: 165, cy: 179, rx: first.rx + 12, ry: first.ry + 12, fill: C.blush, stroke: C.coral, "stroke-width": 6 }),
    n("ellipse", { cx: 165, cy: 179, rx: first.rx, ry: first.ry, fill: "#774940" }),
    n("ellipse", { cx: 471, cy: 179, rx: end.rx + 12, ry: end.ry + 12, fill: C.blush, stroke: C.coral, "stroke-width": 6 }),
    n("ellipse", { cx: 471, cy: 179, rx: end.rx, ry: end.ry, fill: "#774940" }),
    ...arrow(260, 179, 370, 179),
    text(165, 263, first.sound, 29), text(471, 263, end.sound, 29),
    text(320, 321, level === 27 ? "coin  ·  boy" : "house  ·  cow", 33, C.teal),
    text(320, 379, `${first.label} → ${end.label} · ONE SYLLABLE`, 19, C.muted),
  ];
}

function spellingChoices() {
  const rows = [
    { y: 98, spellings: "c · k · ck", examples: "cat · kite · back", sound: "/k/", fill: C.mint, color: C.teal },
    { y: 188, spellings: "c + e, i, y", examples: "city · cent", sound: "/s/", fill: C.cream, color: C.gold },
    { y: 278, spellings: "g · dge", examples: "giant · bridge", sound: "/dʒ/", fill: C.lilac, color: C.blue },
  ];
  return rows.flatMap(({ y, spellings, examples, sound, fill, color }) => [rect(24, y - 18, 592, 82), ...label(125, y + 26, spellings, fill, color, 174), ...arrow(229, y + 11, 277, y + 11, color), text(326, y + 27, sound, 29, color), text(490, y + 25, examples, 21)]);
}

function endings() {
  return [
    ...[0, 1, 2].flatMap((i) => [
      rect(24 + i * 202, 79, 188, 274, i === 2 ? C.cream : C.panel),
      text(118 + i * 202, 126, ["/s/", "/z/", "/ɪz/"][i], 29, i === 2 ? C.gold : C.teal),
      text(118 + i * 202, 168, ["cats", "dogs", "buses"][i], 31),
      ...Array.from({ length: i === 2 ? 2 : 1 }, (_, dot) => circle(118 + i * 202 + (i === 2 ? dot * 22 - 11 : 0), 194, 6, i === 2 ? C.gold : C.teal)),
      path(`M${44 + i * 202} 219 L${192 + i * 202} 219`, C.line, 2),
      text(118 + i * 202, 253, ["/t/", "/d/", "/ɪd/"][i], 27, i === 2 ? C.gold : C.teal),
      text(118 + i * 202, 295, ["washed", "played", "wanted"][i], 29),
      ...Array.from({ length: i === 2 ? 2 : 1 }, (_, dot) => circle(118 + i * 202 + (i === 2 ? dot * 22 - 11 : 0), 324, 6, i === 2 ? C.gold : C.teal)),
    ]),
    ...[118, 320, 522].map((x, index) => text(x, 380, index === 2 ? "TWO BEATS" : "ONE BEAT", 16, C.muted)),
  ];
}

function stress() {
  return [rect(24, 78, 592, 273),
    circle(143, 147, 12, C.line), circle(320, 139, 32, C.coral), circle(496, 147, 12, C.line),
    text(143, 220, "bə", 39, C.muted), text(320, 220, "NA", 60, C.coral), text(496, 220, "nə", 39, C.muted),
    path("M100 249 Q145 226 190 249 Q257 265 320 241 Q391 265 450 249 Q496 229 540 249", C.line, 3),
    text(320, 315, "banana", 35),
    text(143, 379, "LIGHT", 19, C.muted), text(320, 379, "STRONG", 19, C.muted), text(496, 379, "LIGHT", 19, C.muted),
  ];
}

function linking() {
  return [rect(24, 78, 592, 273),
    circle(145, 119, 12, C.teal), circle(347, 119, 7, C.line), circle(499, 119, 16, C.coral),
    text(145, 197, "pick", 49, C.teal), text(347, 197, "it", 38, C.muted), text(499, 197, "UP", 53, C.coral),
    path("M190 208 Q245 259 328 208", C.teal, 5), path("M361 208 Q411 259 464 208", C.teal, 5),
    text(320, 304, "Could you SEND it OVer?", 27),
    text(320, 379, "CONNECT THE WORDS · KEEP THE BEAT", 18, C.muted),
  ];
}

function teachingDiagram(level) {
  if (level === 1) return [...articulationPair(["m", { nasal: true, voiced: true, title: "/m/", example: "moon · map" }], ["s", { title: "/s/", example: "sun · sip" }]), text(166, 379, "CLOSED LIPS", 18, C.muted), text(474, 379, "NARROW AIR", 18, C.muted)];
  if (level === 2) return [...articulationPair(["n", { nasal: true, voiced: true, title: "/n/", example: "net · nod" }], ["b", { voiced: true, title: "/b/", example: "bag · bed" }]), text(166, 379, "TONGUE + NOSE", 17, C.muted), text(474, 379, "LIPS + VOICE", 17, C.muted)];
  if (level === 3) return [...articulationPair(["f", { title: "/f/", example: "fan" }], ["f", { voiced: true, title: "/v/", example: "van" }]), text(166, 379, "AIR ONLY", 18, C.muted), text(474, 379, "ADD VOICE", 18, C.muted)];
  if (level === 4) return [...articulationPair(["l", { voiced: true, title: "/l/", example: "light" }], ["r", { voiced: true, title: "/r/", example: "right" }]), text(166, 379, "TOUCH THE RIDGE", 18, C.muted), text(474, 379, "NO TOUCH", 18, C.muted)];
  if ([5, 6, 8, 9].includes(level)) return vowelDiagram(level);
  if (level === 7) return accentVowel();
  if (level >= 10 && level <= 13) return blend(level);
  if (level === 14) return [...articulationPair(["sh", { title: "/ʃ/", example: "ship" }], ["ch", { title: "/tʃ/", example: "chip" }]), text(166, 379, "CONTINUOUS AIR", 18, C.muted), text(474, 379, "STOP → AIR", 18, C.muted)];
  if (level === 15) return [...articulationPair(["th", { title: "/θ/", example: "think" }], ["th", { voiced: true, title: "/ð/", example: "this" }]), text(166, 379, "AIR ONLY", 18, C.muted), text(474, 379, "ADD VOICE", 18, C.muted)];
  if (level === 16) return [
    ...[["w", { title: "/w/", example: "when" }], ["f", { title: "/f/", example: "phone" }], ["ng", { title: "/ŋ/", example: "sing", nasal: true, voiced: true }]].flatMap((args, i) => [rect(20 + 205 * i, 87, 190, 250), group(20 + 205 * i, 108, mouth(...args), 0.73)]),
    text(115, 378, "ROUND LIPS", 17, C.muted), text(320, 378, "TEETH + LIP", 17, C.muted), text(525, 378, "NOSE", 17, C.muted),
  ];
  if (level >= 17 && level <= 20) return silentE(level);
  if (level >= 21 && level <= 23) return vowelTeams(level);
  if (level === 24) return vowelContrast();
  if (level === 25 || level === 26) return rhotic(level);
  if (level === 27 || level === 28) return glide(level);
  if (level === 29) return spellingChoices();
  if (level === 30) return endings();
  if (level === 31) return stress();
  return linking();
}

export function phonicsVisualTree(item) {
  const metadata = phonicsVisualMetadata(item);
  return n("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 640 400", width: 640, height: 400, role: "img", "aria-label": `${metadata.altEn} ${metadata.altJa}`, "data-phonics-level": metadata.level, preserveAspectRatio: "xMidYMid meet" }, [
    n("title", {}, `${metadata.titleEn} / ${metadata.titleJa}`),
    n("desc", {}, `${metadata.altEn} ${metadata.altJa}`),
    rect(0, 0, 640, 400, C.paper, 24),
    text(28, 43, `SOUND LAB ${String(metadata.level).padStart(2, "0")}`, 15, C.teal, 750, { "text-anchor": "start", "letter-spacing": 1.3 }),
    text(610, 43, metadata.titleEn, 24, C.ink, 700, { "text-anchor": "end" }),
    ...teachingDiagram(metadata.level),
  ]);
}
