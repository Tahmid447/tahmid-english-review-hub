import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, readFrozenSeed } from './curriculum-release.mjs';

const baseline = '8537cb53129e6c5743b19d977332bb5c6b9cf152';
const excluded = new Set(['imageType', 'icon', 'visual']);
const categories = ['words', 'phrases', 'phonics'];
readFrozenSeed();
const records = [];
const counts = {};
for (const category of categories) {
  const before = JSON.parse(execFileSync('git', ['show', `${baseline}:curriculum/${category}.json`], { cwd: root, encoding: 'utf8' }));
  const after = JSON.parse(fs.readFileSync(path.join(root, `curriculum/${category}.json`), 'utf8'));
  const old = new Map(before.levels.flatMap(l => l.items).map(i => [i.id, i]));
  const current = after.levels.flatMap(l => l.items);
  if (current.length !== old.size) throw new Error(`${category} count changed.`);
  if (new Set(current.map(item => item.id)).size !== current.length) throw new Error(`${category} contains duplicate item IDs.`);
  counts[category] = { reviewed: current.length, revised: 0, retained: 0 };
  for (const item of current) {
    const previous = old.get(item.id);
    if (!previous || previous.level !== item.level) throw new Error(`Unexpected new/moved item ${item.id}.`);
    const changedFields = {};
    for (const field of new Set([...Object.keys(previous), ...Object.keys(item)])) {
      if (excluded.has(field)) continue;
      if (JSON.stringify(previous[field]) !== JSON.stringify(item[field])) changedFields[field] = { before: previous[field] ?? null, after: item[field] ?? null };
    }
    const decision = Object.keys(changedFields).length ? 'revised' : 'retained';
    counts[category][decision]++;
    records.push({ id: item.id, category, level: item.level, title: item.word || item.phrase || item.phonicsTarget, decision, changedFields });
  }
}
const output = {
  title: 'Tahmid English Curriculum Level 1–32: educator audit',
  reviewedOn: '2026-09-06',
  baselineCommit: baseline,
  reviewScope: 'All 480 learning items, including English, Japanese, examples/dialogues, usage and pronunciation guidance. Image metadata is tracked separately in the asset attribution ledger.',
  criteria: ['Everyday usefulness and frequency within topic', 'Grammar burden and level progression', 'Natural English and register', 'Japanese meaning and false friends', 'Collocations and learner mistakes', 'US/UK pronunciation and variation', 'Unique learning purpose and meaningful recycling', 'Stable IDs and existing progress/access preservation'],
  counts,
  items: records,
};
fs.writeFileSync(path.join(root, 'curriculum/educator-audit.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(counts));
console.log('Recorded every retained/revised item and every editorial before/after field.');
