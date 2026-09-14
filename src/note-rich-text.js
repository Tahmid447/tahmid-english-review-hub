import {escapeHTML as e} from './store.js?v=20260911-mobile2';
export const MARK_COLORS=['yellow','green','blue','pink'];
export function cleanMarks(body,format) {
 return {version:1,spans:(format?.spans||[]).filter(s=>Number.isInteger(s.start)&&Number.isInteger(s.end)&&s.start>=0&&s.end>s.start&&s.start<body.length)
  .slice(-100).map(s=>({start:s.start,end:Math.min(s.end,body.length),...(s.bold?{bold:true}:{}),...(MARK_COLORS.includes(s.color)?{color:s.color}:{})}))};
}
export function richTextMarkup(body='',format={}) {
 const spans=cleanMarks(body,format).spans,points=[...new Set([0,body.length,...spans.flatMap(s=>[s.start,s.end])])].sort((a,b)=>a-b);
 return points.slice(0,-1).map((start,i)=>{const end=points[i+1],marks=spans.filter(s=>s.start<=start&&s.end>=end),color=marks.map(s=>s.color).filter(Boolean).at(-1);let chunk=e(body.slice(start,end));if(marks.some(s=>s.bold))chunk=`<strong>${chunk}</strong>`;if(color)chunk=`<mark class="ln-mark-${color}">${chunk}</mark>`;return chunk;}).join('');
}
export function moveMarks(before,after,format) {
 let start=0,end=0;while(start<before.length&&start<after.length&&before[start]===after[start])start++;
 while(end<before.length-start&&end<after.length-start&&before[before.length-1-end]===after[after.length-1-end])end++;
 const oldEnd=before.length-end,newEnd=after.length-end,delta=newEnd-oldEnd;
 return cleanMarks(after,{spans:(format?.spans||[]).map(s=>({...s,start:s.start<=start?s.start:s.start>=oldEnd?s.start+delta:start,end:s.end<=start?s.end:s.end>=oldEnd?s.end+delta:newEnd}))});
}
export function applyMark(format,start,end,mark) {
 const remaining=(format?.spans||[]).flatMap(s=>s.end<=start||s.start>=end?[s]:[{...s,end:Math.min(s.end,start)},{...s,start:Math.max(s.start,end)}].filter(x=>x.end>x.start));
 // Clear removes all marks in the selection; formatting preserves other selected marks.
 return {version:1,spans:mark?[...(format?.spans||[]),{start,end,...mark}].slice(-100):remaining};
}
