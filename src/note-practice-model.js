export const PRACTICE_TYPES = Object.freeze({
 quick_practice_group:['Practice section · 練習セクション','teal','◎'],
 multiple_choice:['Multiple choice · 選択問題','teal','A/B'],
 fill_in_blank:['Fill in the blank · 穴埋め','teal','___'],
 error_correction:['Error correction · 誤りを直す','red','↗'],
 sentence_reorder:['Sentence reorder · 並び替え','blue','⇄'],
 japanese_to_english_practice:['Japanese → English practice · 英作文','purple','あ→A'],
 short_answer:['Short answer · 自由回答','blue','✎'],
 self_check:['Self check · 理解を確認','amber','✓'],
 remember_review:['Remember & review · 覚えて復習','amber','↻'],
});
export const isPractice = b => (Boolean(PRACTICE_TYPES[b.type]) && b.type!=='quick_practice_group') || b.type==='quick_practice';
export const questionId = b => b.questionId || b.id;
const canonical = value => Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
export const sameQuestion = (a,b) => JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
export function practiceSummary(blocks,attempts=[]) {
 const questions=blocks.filter(isPractice);
 const current=questions.map(b=>attempts.find(a=>a.question_id===questionId(b)&&sameQuestion(a.question_snapshot,b))).filter(Boolean);
 return {total:questions.length,opened:current.filter(a=>a.opened_at).length,attempted:current.filter(a=>a.answered_at).length,
  completed:current.filter(a=>a.completed).length,correct:current.filter(a=>a.is_correct===true).length,
  checked:current.filter(a=>typeof a.is_correct==='boolean').length,review:current.filter(a=>a.is_correct===false||a.self_check_status==='review').length,
  lastActivity:current.map(a=>a.updated_at).filter(Boolean).sort().at(-1)||null};
}
export const practiceSectionType = title => {
 const clean=title.replace(/^[^\p{L}]+/u,'').trim();
 return [
  [/^multiple\s*choice|選択問題/i,'multiple_choice'],[/^fill\s*in\s*(?:the\s*)?blank|穴埋め/i,'fill_in_blank'],
  [/^(?:error\s*correction|natural\s*english\s*correction)|誤りを直す/i,'error_correction'],[/^sentence\s*reorder|並び替え/i,'sentence_reorder'],
  [/^japanese\s*(?:→|->|to)\s*english\s*practice|英作文練習/i,'japanese_to_english_practice'],
  [/^short\s*(?:answer|free\s*response)|自由回答/i,'short_answer'],[/^self[-\s]*check|理解を確認/i,'self_check'],
  [/^remember\s*(?:&|and)?\s*review|覚えて復習/i,'remember_review'],
  [/^(?:quick\s*practice\s*group|practice\s*section)|練習セクション/i,'quick_practice_group'],
 ].find(([p])=>p.test(clean))?.[1];
};
