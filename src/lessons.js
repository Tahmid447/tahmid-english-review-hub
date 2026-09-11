import { fetchDatabaseLessons } from './supabase.js?v=20260911-mobile1';
import { loadStudentAccess, applyStudentFeatureVisibility, featureAllowed, renderStudentAccessBoundary } from './student-visibility.js?v=20260911-mobile1';
import { initialiseMemberPreferences } from './member-preferences.js?v=20260911-mobile1';
import { escapeHTML as e, getSettings, updateSettings } from './store.js?v=20260911-mobile1';
import './study-music.js?v=20260911-mobile1';
const grid = document.querySelector('#catalogueGrid');
const status = document.querySelector('#catalogueStatus');
const search = document.querySelector('#catalogueSearch');
const filter = document.querySelector('#catalogueFilter');
let lessons = [];
function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const shown = lessons.filter(lesson => (!query || `${lesson.title} ${lesson.titleJa} ${lesson.summary} ${lesson.summaryJa}`.toLocaleLowerCase().includes(query)) && (filter.value !== 'open' || !lesson.locked) && (filter.value !== 'preview' || lesson.isPreview));
  status.textContent = `${shown.length} / ${lessons.length} lessons · レッスン`;
  grid.innerHTML = shown.map(lesson => {
    const number = lessons.indexOf(lesson) + 1;
    const path = `/lesson/${encodeURIComponent(lesson.id)}?return=${encodeURIComponent('/lessons')}`;
    return `<article class="catalogue-card ${lesson.locked ? 'is-locked' : ''}"><div class="catalogue-card-top"><span class="lesson-index">${String(number).padStart(2,'0')}</span><span class="access-label">${lesson.isPreview ? 'FREE PREVIEW · 無料体験' : lesson.locked ? 'MEMBERS · 会員向け' : 'READY TO LEARN · 学習できます'}</span></div><h2>${e(lesson.title)}</h2><p class="catalogue-title-ja" lang="ja">${e(lesson.titleJa)}</p><p class="catalogue-summary">${e(lesson.summaryJa || lesson.summary)}</p><div class="catalogue-card-bottom"><span>${lesson.questionCount ? `${lesson.questionCount} questions · 問題` : 'Lesson review · レッスン復習'}</span>${lesson.locked ? `<a class="secondary-btn" href="${path}">View lesson · 詳細 →</a>` : `<a class="primary-btn" href="${path}&practice=quick">Quick practice · まずは8問 →</a><a class="catalogue-full-link" href="${path}&practice=full">Full lesson · 全問を開く</a>`}</div></article>`;
  }).join('') || '<p class="member-empty">No matching lessons. / 該当するレッスンがありません。</p>';
}
search.addEventListener('input', render); filter.addEventListener('change', render);
document.querySelector('#memberTheme').onchange = event => updateSettings({theme:event.target.value});
try {
  const preferences = initialiseMemberPreferences();
  const access = await loadStudentAccess(); applyStudentFeatureVisibility(access);
  if (!featureAllowed(access,'show_review_lessons') && !featureAllowed(access,'show_homework')) {
    renderStudentAccessBoundary(document.querySelector('#catalogueContent'));
  } else {
    const result = await fetchDatabaseLessons({ audience:'all', includeQuestions:false });
    if (!result.lessons) throw new Error('Please reload to try again. / 再読み込みして、もう一度お試しください。');
    lessons = result.lessons; render();
  }
  await preferences; document.querySelector('#memberTheme').value = getSettings().theme;
} catch (error) { status.textContent = error.message; }
