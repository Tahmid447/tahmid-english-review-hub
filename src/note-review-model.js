import {sameQuestion} from './note-practice-model.js';

export const LEARNING_TYPES=new Set(['useful_phrase','vocabulary','grammar_point','common_mistake','natural_english_upgrade','japanese_to_english','pronunciation','comparison','nuance']);
export const isLearningPoint=block=>LEARNING_TYPES.has(block.type);
export const learningSnapshot=block=>Object.fromEntries(Object.entries(block||{}).filter(([key])=>!['displayOptions','pronunciation','tags'].includes(key)));
export const pointReview=(block,reviews=[])=>reviews.find(r=>r.block_id===block.id&&sameQuestion(r.block_snapshot,learningSnapshot(block)));
export function reviewSummary(blocks,reviews=[]) {
 const points=blocks.filter(isLearningPoint),understood=points.filter(b=>pointReview(b,reviews)?.state==='understood'),revisit=points.filter(b=>pointReview(b,reviews)?.state==='revisit');
 const next=points.find(b=>!['understood','revisit'].includes(pointReview(b,reviews)?.state));
 return {total:points.length,understood:understood.length,revisit:revisit.length,next:next||revisit[0]||null};
}
export const pointTitle=block=>block.englishText||block.correctOptions?.[0]||block.originalText||block.title||'Learning point';
