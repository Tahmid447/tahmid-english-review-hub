import { escapeHTML as e } from './store.js?v=20260911-mobile2';

export const noteHref=(noteId,blockId='')=>`/my-page/notes/${encodeURIComponent(noteId)}${blockId?`#block-${encodeURIComponent(blockId)}`:''}`;
export const itemStamp=item=>item.updated_at||item.created_at||item.starts_at||'';
// These are display acknowledgements on this browser, not learning completion.
export function createSectionAwareness(userId,storage) {
 const key=`te-hub-awareness:${userId}`;let seen={};
 try{storage ||= globalThis.localStorage;const parsed=JSON.parse(storage.getItem(key)||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))seen=parsed;}catch{}
 return {
  unread:(section,item)=>Boolean(itemStamp(item))&&seen[`${section}:${item.id}`]!==itemStamp(item),
  mark(section,items){for(const item of items)seen[`${section}:${item.id}`]=itemStamp(item);
   const bounded=Object.entries(seen).sort((a,b)=>String(b[1]).localeCompare(String(a[1]))).slice(0,1000);seen=Object.fromEntries(bounded);
   try{storage.setItem(key,JSON.stringify(seen));}catch{}
  },
 };
}
export function learnerNextActions({notes=[],announcements=[],cards=[]}={}) {
 const visible=notes.filter(n=>n.status==='published'&&!n.deleted_at),actions=[];
 const updated=visible.find(n=>Number(n.viewed_version||0)<n.version);
 if(updated)actions.push({kind:'note',title:updated.title,detail:updated.viewed_version?'Updated by your teacher · 先生が更新':'New lesson note · 新しいレッスンノート',href:noteHref(updated.id),label:'Open note · ノートを開く'});
 const practice=visible.find(n=>n.id!==updated?.id&&n.next_block&&(n.practice_completed<n.practice_total||n.practice_review>0));
 if(practice)actions.push({kind:'practice',title:practice.title,detail:`${practice.practice_completed} of ${practice.practice_total} completed · 練習の進捗`,href:noteHref(practice.id,practice.next_block),label:'Continue practice · 練習を続ける'});
 if(announcements.length)actions.push({kind:'announcement',title:announcements[0].title_en||announcements[0].title_ja,detail:'From your teacher · 先生からのお知らせ',href:'#announcements',noticeId:announcements[0].id,label:'Read announcement · お知らせを読む'});
 if(cards.length)actions.push({kind:'personal',title:cards[0].text_en||cards[0].text_ja,detail:`${cards.length} new / updated personal cards · 新着・更新の復習カード`,href:'#personal',label:'Review cards · カードを復習'});
 return actions.slice(0,3);
}
export function teacherNoteActions(notes=[]) {
 return notes.filter(n=>!n.deleted_at&&n.status!=='archived').flatMap(n=>{
  const activity=n.pending_suggestions>0||n.unread_activity>0;
  if(!activity&&n.status!=='draft')return [];
  const detail=n.pending_suggestions>0?`${n.pending_suggestions} suggestions to review · 修正提案の確認`:n.unread_activity>0?'New learner activity · 生徒の更新':'Finish your draft · 下書きを仕上げる';
  return [{kind:'note',title:n.title,detail,studentId:n.student_id,href:`/teacher?studio=notes&note=${encodeURIComponent(n.id)}${activity?'&view=activity':''}`,label:activity?'Review activity · 更新を確認':'Continue draft · 下書きを続ける',priority:n.pending_suggestions>0?0:activity?1:2}];
 }).sort((a,b)=>a.priority-b.priority).slice(0,3);
}
export function nextActionsMarkup(actions) {
 return `<ol class="hub-next-list">${actions.map(action=>`<li><div><small>${e(action.detail)}</small><strong>${e(action.title)}</strong></div><a href="${e(action.href)}" ${action.noticeId?`data-next-notice="${e(action.noticeId)}"`:''}>${e(action.label)} <span aria-hidden="true">→</span></a></li>`).join('')}</ol>`;
}
