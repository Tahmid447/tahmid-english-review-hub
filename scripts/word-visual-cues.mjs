// Original teaching cues for meanings that cannot be inferred from a stock
// drawing alone. Authored Mulberry drawings remain the main illustration;
// these per-item annotations show an action, comparison, or relationship.
export function renderWordVisualCue(spec, { art, text, esc }) {
  const d = spec.diagram;
  if (!d || !(spec.assets || []).length) return null;
  let serial = 0;
  const A = (i, x, y, w, h) => art(spec.assets[i] || spec.assets[0], x, y, w, h, `cue${serial++}`);
  const T = (x, y, s, size = 20, color = '#294740') => text(x, y, s, size, color);
  const R = (x, y, w, h, fill = '#ffffff', stroke = '#b6c9bd', radius = 14) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const L = (x1, y1, x2, y2, color = '#547f73', width = 4) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  const arrow = (x, y, w = 55) => `<path d="M${x} ${y}h${w}m-12-10 12 10-12 10" fill="none" stroke="#488779" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const check = (x, y, size = 1) => `<path d="m${x} ${y} ${12 * size} ${13 * size} ${27 * size} ${-31 * size}" fill="none" stroke="#43886d" stroke-width="${5 * size}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const clock = (x, y, hour, minute, radius = 53) => {
    const hand = (angle, len) => L(x, y, x + Math.sin(angle) * len, y - Math.cos(angle) * len, '#294740', 5);
    return `<circle cx="${x}" cy="${y}" r="${radius}" fill="#fff" stroke="#6c9b8a" stroke-width="4"/>` +
      [0, 1, 2, 3].map(n => { const a = n * Math.PI / 2; return `<circle cx="${x + Math.sin(a) * (radius - 8)}" cy="${y - Math.cos(a) * (radius - 8)}" r="3" fill="#53796c"/>`; }).join('') +
      hand((hour + minute / 60) * Math.PI / 6, radius * .48) + hand(minute * Math.PI / 30, radius * .74);
  };
  const page = (x, y, w, h, lines = 6) => R(x, y, w, h) + Array.from({ length: lines }, (_, n) => L(x + 20, y + 27 + n * (h - 48) / Math.max(lines, 1), x + w - 20 - (n % 3) * 9, y + 27 + n * (h - 48) / Math.max(lines, 1), '#779586', 4)).join('');
  const tag = (x, y, amount, muted = false) => R(x, y, 166, 74, muted ? '#f2ece2' : '#fff4cc', '#b68e55', 8) + T(x + 83, y + 46, amount, 27, muted ? '#8e8c84' : '#654d2c');
  const panel = (x, label) => R(x, 48, 250, 281, '#fffef9') + T(x + 125, 362, label, 19);
  const dots = (x, y, n, fill = '#5c9984') => Array.from({ length: n }, (_, i) => `<circle cx="${x + (i % 5) * 24}" cy="${y + Math.floor(i / 5) * 24}" r="8" fill="${fill}"/>`).join('');

  switch (d) {
    case 'price':
    case 'cheap':
      return A(0, 87, 37, 315, 296) + L(365, 136, 431, 184, '#c1a171', 3) + tag(396, 176, spec.labels?.[0] || '¥3,000') + T(320, 365, d === 'price' ? 'The amount on the tag' : d === 'cheap' ? 'A low price' : 'A high price', 18);
    case 'expensive':
      return A(0, 65, 37, 302, 296) + A(1, 382, 49, 144, 126) + A(1, 423, 69, 144, 126) + A(1, 465, 91, 144, 126) + tag(395, 228, '¥30,000') + T(320, 368, 'It takes much more money', 19);
    case 'cost':
      return R(38, 55, 564, 274) + A(0, 58, 66, 159, 160) + A(2, 265, 77, 155, 140) + T(236, 166, '+', 32) + T(144, 259, '¥1,000', 25) + T(342, 259, '¥200', 25) + L(462, 72, 462, 300, '#d5dacc', 2) + T(530, 140, 'Total', 21) + T(530, 197, '¥1,200', 25) + T(320, 365, 'Item + delivery = total cost', 19);
    case 'change':
      return A(0, 44, 74, 167, 155) + A(1, 247, 66, 158, 167) + A(0, 449, 86, 148, 135) + arrow(210, 155, 33) + arrow(407, 155, 32) + T(125, 275, 'Pay ¥1,000', 20) + T(327, 275, 'Price ¥700', 20) + T(520, 275, '¥300 back', 20) + T(320, 350, 'Money returned to the buyer', 18);
    case 'discount':
      return A(0, 58, 65, 260, 260) + tag(376, 66, '¥2,000', true) + L(395, 98, 529, 98, '#b86754', 4) + `<path d="M461 153v34m-10-10 10 10 10-10" stroke="#538d79" stroke-width="4" fill="none"/>` + tag(376, 204, '¥1,500') + T(320, 362, 'Same item · lower price', 19);
    case 'receipt':
      return A(1, 39, 116, 199, 182) + R(282, 40, 270, 304, '#fffef9', '#c5c6b7', 5) + T(417, 79, 'RECEIPT', 23) + L(310, 97, 524, 97, '#91a08d', 2) + T(417, 135, 'Soup       ¥700', 20) + T(417, 177, 'Drink      ¥300', 20) + L(310, 218, 524, 218, '#91a08d', 2) + T(417, 255, 'PAID  ¥1,000', 24) + T(417, 303, 'Thank you', 16);
    case 'ticket':
      return R(69, 73, 502, 252, '#fffdf5', '#698c7b', 10) + A(0, 91, 95, 127, 107) + T(365, 123, 'TRAIN TICKET', 25) + T(356, 178, 'Tokyo  →  Yokohama', 23) + L(234, 204, 528, 204, '#bac8b9', 2) + T(340, 247, '09:30 · Car 3 · Seat 12', 20) + Array.from({ length: 28 }, (_, n) => `<rect x="${101 + n * 5}" y="262" width="${n % 3 === 0 ? 3 : 2}" height="36" fill="#496052"/>`).join('');
    case 'map':
      return R(44, 42, 552, 314, '#edf1df') + `<path d="M65 288H567M178 58v285M433 60v285M178 183h255" fill="none" stroke="#fffef4" stroke-width="31"/><path d="M65 288H567M178 58v285M433 60v285M178 183h255" fill="none" stroke="#ccbfa7" stroke-width="2" stroke-dasharray="8 8"/>` + A(0, 62, 68, 121, 100) + A(1, 428, 68, 125, 108) + A(2, 261, 204, 108, 116) + `<path d="M178 152v31h255v-29" fill="none" stroke="#cc7358" stroke-width="6" stroke-dasharray="9 7"/>` + T(111, 189, 'Home', 17) + T(500, 205, 'School', 17) + T(319, 338, 'Park', 17);
    case 'password':
      return R(187, 50, 369, 210, '#ffffff', '#719888') + T(371, 88, 'Sign in', 22) + R(221, 117, 300, 72, '#f5f7ed', '#c2cebf', 7) + T(365, 160, '● ● ● ● ● ● ● ●', 23) + R(399, 209, 121, 31, '#6c9986', '#6c9986', 7) + T(459, 230, 'Continue', 14, '#ffffff') + A(0, 105, 273, 388, 88);
    case 'account':
      return R(118, 43, 403, 301, '#ffffff', '#719888') + `<circle cx="213" cy="112" r="35" fill="#f0d5ba"/><path d="M170 182c0-43 85-43 85 0" fill="#88b4a0"/>` + T(367, 104, 'MY LEARNING', 20) + T(357, 149, 'Ren', 25) + L(152, 207, 489, 207, '#d3decf', 2) + T(320, 245, 'My lessons · My progress', 20) + dots(210, 291, 10);
    case 'update':
      return panel(48, 'Installed version 1') + panel(342, 'Updated version 2') + A(0, 75, 75, 199, 169) + A(0, 368, 75, 199, 169) + T(173, 280, '1.0', 31, '#aa9279') + T(467, 280, '2.0', 31, '#43886d') + arrow(302, 183, 34) + check(504, 100, .8);
    case 'station':
      return R(59, 73, 514, 45, '#709184', '#709184', 3) + T(316, 105, 'STATION', 25, '#ffffff') + L(81, 121, 81, 312, '#718d80', 7) + L(551, 121, 551, 312, '#718d80', 7) + A(0, 158, 131, 288, 153) + clock(485, 171, 9, 0, 31) + `<path d="M94 308h470" stroke="#8d9e92" stroke-width="16"/>`;
    case 'early':
    case 'late': {
      const isEarly = d === 'early';
      return panel(48, isEarly ? 'Arrive at 8:50' : 'Bus leaves at 9:00') + panel(342, isEarly ? 'Bus leaves at 9:00' : 'Arrive at 9:10') + clock(172, 128, isEarly ? 8 : 9, isEarly ? 50 : 0) + clock(467, 128, 9, isEarly ? 0 : 10) + A(1, isEarly ? 102 : 391, 207, 151, 104) + (isEarly ? check(457, 264, 1) : T(176, 271, 'Gone', 25, '#b76856')) + arrow(303, 181, 33);
    }
    case 'deadline':
      return page(73, 73, 240, 246, 7) + `<circle cx="458" cy="183" r="98" fill="#fff3e9" stroke="#c97859" stroke-width="8"/><path d="M458 104v79h59" fill="none" stroke="#a95941" stroke-width="9" stroke-linecap="round"/><path d="M441 56h34m-17 0v23m-88 14-17-17m187 17 17-17" fill="none" stroke="#c97859" stroke-width="9" stroke-linecap="round"/><path d="m289 99 19-17 17 17" fill="none" stroke="#c97859" stroke-width="6"/><path d="M308 82v224" fill="none" stroke="#c97859" stroke-width="5" stroke-dasharray="10 7"/>` + T(458, 306, 'DUE 3:00', 25, '#a95941') + T(320, 371, 'Finish before the deadline', 20);
    case 'schedule':
    case 'appointment':
    case 'reservation':
    case 'reserve': {
      const label = d === 'deadline' ? 'FRIDAY · DUE 3:00' : d === 'appointment' ? 'MONDAY · 10:30' : d === 'reservation' ? 'FRI – SUN · ROOM 4' : d === 'reserve' ? '2 PEOPLE · 7:00' : 'THIS WEEK';
      return R(68, 44, 342, 285, '#fffef9') + R(68, 44, 342, 53, '#6c9986', '#6c9986', 10) + T(239, 79, label, 18, '#ffffff') + Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => R(82 + c * 62, 111 + r * 48, 52, 37, '#f0f2e5', '#dbe0d1', 3)).join('')).join('') + R(267, 159, 52, 37, '#f4c969', '#c99a47', 3) + T(293, 185, '●', 18, '#8c602d') + A(d === 'reserve' ? 0 : d === 'reservation' ? 1 : d === 'appointment' ? 1 : 0, 438, 135, 146, 173) + (d === 'deadline' ? T(480, 110, 'DUE', 23, '#bd664b') : '') + T(320, 367, d === 'deadline' ? 'Finish by this time' : d === 'schedule' ? 'Plans organised by day and time' : 'A time set aside for you', 18);
    }
    case 'delay':
      return A(0, 149, 45, 334, 142) + R(73, 220, 200, 85, '#f5eee1') + R(367, 220, 200, 85, '#fff3c9') + T(173, 271, '09:00', 34, '#aa9279') + T(467, 271, '09:30', 34) + arrow(290, 262, 60) + T(320, 365, 'Later than planned', 19);
    case 'cancel':
      return R(98, 43, 285, 289) + T(239, 94, 'TODAY', 25) + A(1, 144, 119, 193, 181) + L(118, 113, 356, 299, '#bc6852', 7) + T(488, 202, 'Canceled', 23, '#bc6852') + T(320, 369, 'The event will not happen', 19);
    case 'sweep':
      return `<path d="M83 305H558" stroke="#c8c4b1" stroke-width="3"/>` + A(0, 194, 36, 174, 292) + dots(388, 285, 12, '#ad9774') + `<path d="M147 250q33 53 97 51m-12-12 12 12-14 8" fill="none" stroke="#659480" stroke-width="5" stroke-linecap="round"/>`;
    case 'fix':
      return A(2, 176, 136, 338, 156) + A(0, 70, 59, 104, 208) + A(1, 496, 45, 94, 226) + `<circle cx="285" cy="254" r="41" fill="none" stroke="#d59753" stroke-width="5" stroke-dasharray="9 5"/>` + T(320, 362, 'Repair the loose part', 19);
    case 'borrow':
      return panel(48, 'Use it for now') + panel(342, 'Give it back later') + A(0, 97, 95, 152, 176) + A(1, 385, 93, 167, 185) + arrow(303, 181, 33) + T(320, 32, 'Still belongs to someone else', 18);
    case 'cough':
      return A(0, 111, 49, 314, 269) + `<g transform="translate(0 40)"><path d="M345 279 422 204 470 236 383 318" fill="#8eb9ca" stroke="#38556b" stroke-width="5" stroke-linejoin="round"/><path d="m422 204-47-26q-22-10-31 3t18 23l36 21" fill="#f3d7b8" stroke="#38556b" stroke-width="4"/></g><path d="m457 215 24-9m-22 32h34m-37 20 23 13" fill="none" stroke="#799884" stroke-width="5" stroke-linecap="round"/>` + T(320, 386, 'Cover your cough', 18);
    case 'fever':
      return A(1, 61, 53, 261, 272) + R(409, 52, 67, 235, '#fffef9', '#739280', 26) + `<path d="M442 91v180" stroke="#d87560" stroke-width="17" stroke-linecap="round"/><circle cx="442" cy="290" r="34" fill="#d87560" stroke="#739280" stroke-width="3"/>` + T(522, 168, '38.5', 31, '#b66451') + T(522, 207, '°C', 22) + T(320, 365, 'A raised body temperature', 19);
    case 'pain':
      return A(0, 166, 34, 309, 302) + `<circle cx="331" cy="215" r="39" fill="#e9977955"/><path d="m322 174 11 27 20-5-12 26 19 8-29 13-12-19-20 1 18-21-10-18z" fill="#cb6d54"/>` + T(320, 370, 'A sore place', 19);
    case 'windy':
      return `<g transform="rotate(12 198 212)">${A(0, 61, 64, 261, 263)}</g><g transform="rotate(-65 447 192)">${A(1, 383, 61, 108, 245)}</g><path d="M312 92h142q33 0 23-22M325 142h212q28 0 22-21M299 283h221q34 0 31-26" fill="none" stroke="#91b4af" stroke-width="7" stroke-linecap="round"/>`;
    case 'sky':
      return `<path d="M0 0h640v299H0z" fill="#e5f2f3"/>` + A(0, 79, 41, 223, 168) + A(1, 424, 87, 94, 99) + `<path d="M0 328q130-60 267-21t373-8v101H0z" fill="#d5e1bd"/><path d="M308 239v-83m-11 15 11-15 11 15" fill="none" stroke="#719e9f" stroke-width="4"/>`;
    case 'evening':
      return `<path d="M0 0h640v400H0z" fill="#f4dfbf"/>` + A(0, 313, 98, 202, 179) + `<path d="M0 239q181-36 348 0t292-12v173H0z" fill="#b4b99b"/>` + A(1, 80, 126, 204, 201) + T(469, 340, 'Evening', 22);
    case 'compare':
      return panel(48, 'Look at both') + panel(342, 'What is similar?') + A(0, 71, 81, 204, 216) + A(1, 414, 144, 104, 110) + `<path d="M307 177h26m-6-7 7 7-7 7m-18-14-7 7 7 7" stroke="#538d79" stroke-width="3" fill="none"/>`;
    case 'summarize':
      return page(75, 51, 214, 276, 13) + page(368, 98, 195, 182, 3) + arrow(308, 190, 36) + T(182, 367, 'Full details', 20) + T(465, 320, 'Three key points', 20);
    case 'report':
      return R(206, 31, 275, 316) + T(342, 71, 'REPORT', 24) + L(235, 95, 450, 95, '#aac0ad', 2) + A(0, 248, 110, 185, 132) + L(236, 262, 448, 262, '#7f9d89', 4) + L(236, 286, 426, 286, '#7f9d89', 4) + L(236, 310, 400, 310, '#7f9d89', 4) + T(320, 375, 'Findings, explained clearly', 18);
    case 'grade':
      return A(0, 131, 44, 316, 284) + `<circle cx="458" cy="112" r="67" fill="#f9e5ae" stroke="#bd9454" stroke-width="3"/>` + T(458, 115, '8 / 10', 32) + T(458, 147, 'Score', 18) + check(440, 258, 1.2);
    case 'question':
      return A(0, 58, 91, 240, 204) + page(346, 59, 205, 255, 4) + T(448, 267, '?', 61, '#b08c4d');
    case 'strategy':
      return R(73, 48, 494, 287, '#f4f3e5') + `<path d="M131 274V115h137v154h179V104" fill="none" stroke="#719d87" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="m435 123 12-20 12 20" fill="none" stroke="#719d87" stroke-width="5"/><path d="M306 134h63v89h-63z" fill="#d3aa7c" stroke="#a5855a" stroke-width="3"/><circle cx="131" cy="276" r="14" fill="#507e6c"/>` + T(131, 314, 'Start', 17) + T(446, 83, 'Goal', 20) + T(336, 251, 'Obstacle', 15) + T(320, 367, 'A plan for reaching the goal', 18);
    case 'progress':
      return [0, 1, 2].map((n) => {
        const x = 39 + n * 199;
        return R(x, 70, 166, 217, '#fffef9') + A(n, x + 15, 88, 136, 120) + R(x + 16, 235, 134, 20, '#e4e9dd', '#e4e9dd', 7) + `<rect x="${x + 16}" y="235" width="${(n + 1) * 33.5}" height="20" rx="7" fill="#73a38b"/>` + T(x + 83, 329, `${(n + 1) * 25}% complete`, 18);
      }).join('') + arrow(209, 179, 24) + arrow(409, 179, 24);
    case 'priority':
      return R(132, 52, 379, 287) + R(158, 75, 327, 64, '#fff0bd', '#d5b66d', 6) + A(1, 168, 78, 53, 55) + T(344, 115, 'Most important', 21) + T(202, 187, '2', 25, '#8a9a88') + L(242, 180, 448, 180, '#94a592', 5) + T(202, 257, '3', 25, '#8a9a88') + L(242, 250, 420, 250, '#94a592', 5) + T(320, 371, 'Do this first', 19);
    case 'budget':
      return A(0, 57, 88, 174, 173) + arrow(235, 173, 37) + A(1, 329, 44, 247, 241) + T(143, 303, '¥10,000 limit', 21) + T(452, 315, 'Planned spending', 21) + T(320, 366, 'Divide the money before you spend', 18);
    case 'feedback':
      return A(0, 83, 53, 224, 270) + R(331, 67, 257, 209, '#fffdf3', '#c0baa0', 13) + T(459, 109, 'Clear main idea', 20) + check(354, 149, .6) + T(470, 153, 'Good examples', 17) + L(353, 177, 566, 177, '#d1d4c4', 2) + T(457, 215, 'Try a shorter ending', 18) + `<path d="m348 276-30 23 16-23" fill="#fffdf3" stroke="#c0baa0" stroke-width="2"/>`;
    case 'revise':
      return page(74, 58, 211, 257, 7) + page(370, 58, 199, 257, 5) + L(99, 143, 260, 143, '#c67b63', 5) + T(176, 182, 'new wording', 17, '#579278') + check(488, 291, .8) + arrow(307, 181, 34) + T(177, 361, 'Draft with edits', 20) + T(467, 361, 'Revised version', 20);
    case 'approve':
      return page(184, 37, 268, 306, 9) + `<g transform="rotate(-12 437 231)">${R(328, 186, 220, 92, '#ecf6e8', '#639779', 5)}${T(438, 241, 'APPROVED', 25, '#397e58')}</g>`;
    case 'efficient':
      return panel(48, 'Same result · more time') + panel(342, 'Same result · less time') + page(100, 76, 144, 134, 4) + page(394, 76, 144, 134, 4) + check(194, 191, .6) + check(488, 191, .6) + T(174, 280, '60 min', 29, '#a58468') + T(468, 280, '20 min', 29, '#43886d');
    case 'significant':
      return panel(48, 'A small change') + panel(342, 'A significant change') + L(80, 286, 266, 286, '#b1bba6', 3) + L(375, 286, 554, 286, '#b1bba6', 3) + `<path d="M112 285V192h43v93zm66 0V180h43v105z" fill="#b6c9a7"/><path d="M409 285v-93h43v93zm66 0V92h43v193z" fill="#6b9f82"/>` + T(177, 320, '+3%', 19, '#a18764') + T(471, 320, '+40%', 19, '#43886d');
    case 'specific':
      return A(0, 47, 124, 154, 161) + A(1, 239, 124, 154, 161) + A(2, 431, 124, 154, 161) + `<circle cx="316" cy="205" r="98" fill="none" stroke="#ce9b52" stroke-width="5"/><path d="M316 58v45m-11-11 11 11 11-11" fill="none" stroke="#ce9b52" stroke-width="5"/>` + T(320, 361, 'This exact one', 22);
    case 'reduce':
      return panel(48, 'Before') + panel(342, 'Use less') + A(0, 94, 92, 158, 187) + A(1, 390, 92, 158, 187) + `<path d="M139 134h70v93h-70z" fill="#75b8d777"/><path d="M435 197h70v30h-70z" fill="#75b8d777"/>` + arrow(306, 180, 30);
    case 'reuse':
      return panel(48, 'An empty jar') + panel(342, 'A pencil holder') + A(0, 91, 106, 166, 199) + A(0, 385, 106, 166, 199) + `<g transform="rotate(-14 454 183)">${A(1, 438, 69, 36, 171)}</g><g transform="rotate(11 484 183)">${A(1, 472, 56, 36, 184)}</g>` + arrow(304, 188, 34);
    case 'embarrassed':
      return A(0, 110, 48, 288, 281) + A(1, 434, 214, 145, 123) + `<ellipse cx="234" cy="204" rx="29" ry="12" fill="#d9807888"/><ellipse cx="289" cy="203" rx="29" ry="12" fill="#d9807888"/>` + T(481, 157, 'Oops...', 24, '#b46c59');
    case 'likely':
    case 'unlikely': {
      const high = d === 'likely';
      return A(0, 77, 59, 208, 211) + A(1, 388, 87, 161, 184) + T(320, 301, high ? '80% chance' : '5% chance', 25) + R(136, 328, 368, 22, '#e7eadd', '#e7eadd', 8) + `<rect x="136" y="328" width="${high ? 294 : 18}" height="22" rx="8" fill="#6f9c83"/>`;
    }
    case 'clarify':
      return A(0, 25, 77, 171, 217) + page(251, 71, 145, 212, 3) + T(270, 105, '1', 16) + T(270, 161, '2', 16) + T(270, 215, '3', 16) + A(2, 431, 88, 167, 196) + arrow(198, 179, 36) + arrow(395, 179, 33) + T(111, 350, 'Unclear', 20) + T(324, 350, 'Clear steps', 20) + T(516, 350, 'Understood', 20);
    case 'emphasize':
      return page(146, 54, 324, 271, 7) + R(164, 154, 288, 50, '#ffe8a2', '#ffe8a2', 3) + T(308, 187, 'THE KEY POINT', 23) + L(186, 213, 427, 213, '#c99546', 5) + A(1, 459, 162, 123, 106) + T(320, 368, 'Make this stand out', 20);
    case 'permanent':
      return page(125, 59, 389, 255, 0) + `<path d="m205 192 51 25 60-55 71 20" stroke="#304844" stroke-width="12" fill="none" stroke-linecap="round"/><path d="m370 124 46-19 56 65-46 19z" fill="#e2b5a4" stroke="#957b6b" stroke-width="3"/><path d="M433 237h42m-47 17h55" stroke="#b3b6a1" stroke-width="4"/>` + T(320, 364, 'The mark stays', 23);
    case 'temporary':
      return R(105, 61, 425, 227) + T(317, 109, 'OPEN THIS WEEK', 25) + [0, 1, 2, 3, 4, 5, 6].map(i => R(126 + i * 55, 146, 44, 78, i < 5 ? '#d0e3bd' : '#eeeeDF', '#bac8ac', 5) + T(148 + i * 55, 193, i < 5 ? '✓' : '—', 20)).join('') + T(320, 348, 'For a limited time', 23);
    case 'customs':
      return R(44, 43, 552, 45, '#708e84', '#708e84', 4) + T(320, 75, 'CUSTOMS · DECLARE ITEMS', 22, '#ffffff') + A(0, 74, 133, 158, 184) + A(1, 285, 137, 132, 175) + A(2, 452, 150, 111, 157) + L(50, 321, 590, 321, '#b5a98d', 9) + T(320, 374, 'Border inspection', 20);
    case 'departure':
    case 'arrival':
      return R(103, 41, 433, 65, '#496d63', '#496d63', 4) + T(320, 84, d === 'departure' ? 'DEPARTURES   09:30' : 'ARRIVALS   11:00', 24, '#ffffff') + A(0, 146, 126, 335, 194) + T(320, 367, d === 'departure' ? 'Leaving the airport' : 'Reaching the airport', 20);
    case 'platform':
      return A(0, 115, 79, 415, 194) + `<path d="M50 299H590v62H50z" fill="#c7c4b3"/><path d="M50 303H590" stroke="#ddbe59" stroke-width="8" stroke-dasharray="22 9"/>` + A(1, 78, 190, 76, 136) + T(391, 349, 'Platform 6', 23);
    default: return null;
  }
}
