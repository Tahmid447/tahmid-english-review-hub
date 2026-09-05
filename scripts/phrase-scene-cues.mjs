// Layout directions for original phrase scenes. The supplied artist-drawn
// illustrations stay intact; their size, relationship and setting carry the
// teaching point. This module deliberately avoids a strip of three equal cards.
export function renderPhraseScene(spec, { art, text, esc }) {
  if (!spec.sceneEn || !spec.composition || spec.assets?.length !== 3) return '';
  const { type = 'context', hero = 0, pair = [0, 2] } = spec.composition;
  const files = spec.assets;
  const labels = spec.labels || [];
  const ink = '#244a43';
  const muted = '#57766d';
  const smallLabel = (index, x, y, width = 205) => {
    const value = String(labels[index] || '');
    if (!value) return '';
    // Actual short captions, not the phrase answer; allow two lines on mobile.
    const words = value.split(/\s+/);
    const lines = [''];
    const maxChars = Math.max(12, Math.floor(width / 8));
    for (const word of words) {
      const at = lines.length - 1;
      if (lines[at] && lines[at].length + word.length + 1 > maxChars) lines.push(word);
      else lines[at] += (lines[at] ? ' ' : '') + word;
    }
    return lines.map((line, i) => text(x, y + i * 18, line, 15, ink)).join('');
  };
  const image = (index, x, y, width, height) => {
    const artwork = art(files[index], x, y, width, height, `phrase-${index}`);
    const rotation = Number(spec.assetHueRotations?.[index] || 0);
    if (!rotation || !Number.isFinite(rotation)) return artwork;
    return `<defs><filter id="phrase-hue-${index}" color-interpolation-filters="sRGB"><feColorMatrix type="hueRotate" values="${rotation}"/></filter></defs><g filter="url(#phrase-hue-${index})">${artwork}</g>`;
  };
  const header = `<rect x="26" y="16" width="588" height="36" rx="18" fill="#fffdf7" fill-opacity=".96"/>${text(44, 39, spec.sceneEn, spec.sceneEn.length > 40 ? 15 : 17, ink, 'start')}`;
  const shadow = (x, y, width) => `<ellipse cx="${x}" cy="${y}" rx="${width}" ry="9" fill="#718878" fill-opacity=".12"/>`;
  if (type === 'route') {
    return header
      + '<path d="M73 280Q210 331 322 269T566 270" stroke="#fffdf7" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M87 281Q217 320 322 271T553 270" stroke="#aac2b0" stroke-width="3" stroke-dasharray="6 10" fill="none"/>'
      + image(0, 36, 122, 181, 162) + image(1, 235, 84, 170, 230) + image(2, 424, 112, 181, 183)
      + smallLabel(0, 125, 343, 174) + smallLabel(1, 320, 363, 185) + smallLabel(2, 515, 343, 174);
  }
  if (type === 'compare') {
    const [left, right] = pair;
    const bridge = [0, 1, 2].find((index) => !pair.includes(index));
    return header
      + '<path d="M22 115Q155 53 286 112v199Q152 344 22 304Z" fill="#ffffff" fill-opacity=".78"/><path d="M354 112Q480 54 618 115v189Q486 344 354 311Z" fill="#edf3e6" fill-opacity=".94"/>'
      + shadow(153, 314, 89) + shadow(488, 314, 89)
      + image(left, 46, 109, 218, 200) + image(right, 379, 109, 216, 200)
      + `<circle cx="320" cy="109" r="46" fill="#fff7dd" stroke="#dfd0a8" stroke-width="2"/>`
      + image(bridge, 285, 74, 70, 70)
      + smallLabel(left, 156, 352, 220) + smallLabel(right, 486, 352, 220)
      + smallLabel(bridge, 320, 181, 120);
  }
  if (type === 'weather') {
    return header
      + '<path d="M35 273Q151 205 292 258T611 254v109H35Z" fill="#dde9d4"/><path d="M75 292Q317 240 568 300" fill="none" stroke="#f7f5e9" stroke-width="22"/>'
      + image(0, 42, 85, 181, 165) + image(1, 236, 145, 171, 176) + image(2, 435, 69, 157, 220)
      + smallLabel(0, 130, 328, 170) + smallLabel(1, 321, 363, 175) + smallLabel(2, 514, 328, 170);
  }
  if (type === 'tabletop') {
    const other = [0, 1, 2].filter((index) => index !== hero);
    return header
      + '<path d="M316 296h285l-20 49H337Z" fill="#dcb98c"/><path d="M337 345v32M580 345v32" stroke="#ab875f" stroke-width="8"/>'
      + shadow(168, 321, 91) + image(hero, 44, 78, 252, 242)
      + image(other[0], 333, 117, 160, 177) + image(other[1], 485, 176, 112, 113)
      + smallLabel(hero, 170, 355, 235) + smallLabel(other[0], 407, 103, 190) + smallLabel(other[1], 538, 151, 140);
  }
  if (type === 'steps') {
    return header
      + '<path d="M75 226Q186 275 307 236T565 180" stroke="#87aa99" stroke-width="3" stroke-dasharray="6 8" fill="none"/>'
      + shadow(127, 298, 76) + shadow(320, 271, 87) + shadow(518, 246, 70)
      + image(0, 46, 134, 163, 163) + image(1, 224, 78, 191, 190) + image(2, 438, 74, 160, 168)
      + smallLabel(0, 127, 336, 170) + smallLabel(1, 320, 312, 185) + smallLabel(2, 518, 289, 170)
      + '<path d="m208 273 12 7-10 9M413 226l13 4-8 10" fill="none" stroke="#608775" stroke-width="3" stroke-linecap="round"/>';
  }
  const other = [0, 1, 2].filter((index) => index !== hero);
  return header
    + '<path d="M51 288Q151 246 294 282v37H51Z" fill="#dbe7d4" fill-opacity=".75"/>'
    + shadow(189, 319, 115) + image(hero, 43, 68, 292, 252)
    + '<path d="M361 88h221q16 0 16 16v101q0 16-16 16H391l-20 20 5-20h-15q-16 0-16-16V104q0-16 16-16Z" fill="#fffdf5" stroke="#d8dfcc" stroke-width="2"/>'
    + image(other[0], 381, 103, 167, 97)
    + image(other[1], 452, 248, 132, 101)
    + smallLabel(hero, 184, 357, 260)
    + smallLabel(other[0], 468, 77, 240)
    + smallLabel(other[1], 422, 370, 256);
}
