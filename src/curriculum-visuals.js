import { phonicsVisualTree, phonicsVisualMetadata } from './phonics-visuals.js?v=20260906-studio1';

const SVG_NS = 'http://www.w3.org/2000/svg';
function contentFor(item) {
  const raw = item?.content;
  let content = {};
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) content = raw;
  else if (typeof raw === 'string') { try { content = JSON.parse(raw); } catch {} }
  return { ...content, ...item };
}
const categoryFor = (item, category) => category || item?.curriculum_category || item?.type || (String(item?.id).startsWith('phonics-') ? 'phonics' : String(item?.id).startsWith('phrase-') ? 'phrases' : 'words');
const validSource = (src) => /^\/assets\/curriculum\/[a-z0-9-]+\.(svg|webp|avif)$/.test(String(src || ''));

export function visualSpecFor(item, requestedCategory) {
  const content = contentFor(item);
  const category = categoryFor(item, requestedCategory);
  const visual = content.visual || {};
  const id = String(item?.id || 'custom-item');
  const phonics = category === 'phonics' ? phonicsVisualMetadata(content) : null;
  return Object.freeze({ id, category, level: Number(item?.level || content.level) || 1,
    source: phonics ? 'original-articulation-diagram' : validSource(visual.src) ? 'licensed-illustration' : 'missing',
    family: phonics ? 'phonics' : category === 'phrases' ? 'scene' : visual.kind || 'semantic',
    variant: visual.composition || id, visualKey: visual.src || `phonics:${id}`,
    src: validSource(visual.src) ? visual.src : null,
    altEn: phonics?.altEn || visual.altEn || 'An illustration for this learning item.',
    altJa: phonics?.altJa || visual.altJa || 'この教材のイラスト。',
    captionEn: visual.sceneEn || '', captionJa: visual.sceneJa || '',
    confidence: phonics ? 'educational-diagram' : visual.kind || 'curated',
  });
}
export function curriculumVisualTree(item, category, { language = 'en', quiz = false } = {}) {
  const spec = visualSpecFor(item, category);
  const alt = quiz ? '' : language === 'ja' ? spec.altJa : spec.altEn;
  if (spec.category === 'phonics') {
    const tree = phonicsVisualTree(contentFor(item));
    return { ...tree, attrs: { ...tree.attrs, role: quiz ? 'presentation' : 'img', 'aria-label': alt || undefined,
      'aria-hidden': quiz ? 'true' : undefined, focusable: 'false', 'data-visual-id': spec.id } };
  }
  if (!spec.src) return { tag: 'span', attrs: { class: 'curriculum-visual-missing', role: 'status' }, children: [language === 'ja' ? 'イラストを準備中' : 'Illustration coming soon'] };
  return { tag: 'img', attrs: { src: spec.src, alt, width: 640, height: 400, loading: 'lazy', decoding: 'async', 'data-visual-id': spec.id }, children: [] };
}
function createTree(tree, documentRef, svg = false) {
  if (typeof tree === 'string' || typeof tree === 'number') return documentRef.createTextNode(String(tree));
  const isSvg = svg || tree.tag === 'svg';
  const el = isSvg ? documentRef.createElementNS(SVG_NS, tree.tag) : documentRef.createElement(tree.tag);
  for (const [name,value] of Object.entries(tree.attrs || {})) if (value !== undefined && value !== null && value !== false) el.setAttribute(name,String(value));
  for (const child of tree.children || []) if (child !== null && child !== undefined) el.append(createTree(child,documentRef,isSvg));
  return el;
}
export function createCurriculumVisual(item, category, documentRef = globalThis.document, options = {}) {
  if (!documentRef?.createElement) throw new TypeError('A DOM document is required.');
  return createTree(curriculumVisualTree(item,category,options),documentRef);
}
const escape = (s) => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function serialize(tree) {
  if (typeof tree === 'string' || typeof tree === 'number') return escape(tree);
  const attrs = Object.entries(tree.attrs || {}).filter(([,v])=>v !== undefined && v !== null && v !== false).map(([k,v])=>` ${k}="${escape(v)}"`).join('');
  return `<${tree.tag}${attrs}>${(tree.children || []).filter(c=>c != null).map(serialize).join('')}${tree.tag === 'img' ? '' : `</${tree.tag}>`}`;
}
export const curriculumVisualMarkup = (item,category,options) => serialize(curriculumVisualTree(item,category,options));
export const curriculumVisualMetadata = Object.freeze({author:'Tahmid English Club / credited illustration artists',assetType:'curated licensed artwork and original teaching diagrams'});
