export const eventLabels={note_created:"New lesson note · 新しいレッスンノート",annotation:'Notes updated · メモ更新',suggestion:'Edit suggested · 修正提案',student_image:'Image added · 添付画像',comment:'New comment · コメント',direct_edit:'Content edited · 教材編集',reviewed:'Lesson reviewed · 復習完了',review_undone:'Review reopened · 復習を再開',practice:'Practice updated · 練習の回答',note_published_or_updated:'Lesson published / updated · ノート公開・更新',asset_added:'Material added · 教材追加',asset_replaced:'Material replaced · 教材差し替え',suggestion_accepted:'Suggestion accepted · 提案を採用',suggestion_rejected:'Suggestion reviewed · 提案を確認',suggestion_resolved:'Suggestion resolved · 提案の確認完了'};
// One narrow, RLS-protected realtime subscription, with a visible-tab fallback.
export function watchNoteUpdates(client,userId,onChange,{noteId='',pollMs=45000}={}) {
 let stopped=false,timer,poll,channel;
 const notify=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!stopped&&document.visibilityState!=='hidden')onChange();},650);};
 if(client.channel)channel=client.channel(`note-updates-${userId}-${noteId}-${Math.random().toString(36).slice(2)}`).on('postgres_changes',{event:'*',schema:'public',table:'review_lesson_note_notifications',filter:`recipient_id=eq.${userId}`},payload=>{if(!noteId||payload.new?.note_id===noteId)notify();}).subscribe();
 poll=setInterval(notify,pollMs);const visible=()=>{if(document.visibilityState==='visible')notify();};document.addEventListener('visibilitychange',visible);
 return ()=>{stopped=true;clearTimeout(timer);clearInterval(poll);document.removeEventListener('visibilitychange',visible);if(channel)void client.removeChannel(channel);};
}
