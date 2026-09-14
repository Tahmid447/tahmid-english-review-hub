import { notePayload, validateNote, clone } from './lesson-note-model.js?v=20260914-notes';
export const NOTE_BUCKET='review-lesson-note-assets';
const PREFIX='review_lesson_note';
export function noteError(error) {
 const message=error?.message || String(error);
 if(message.includes('NOTE_CONFLICT'))return 'This changed in another session. Your text is still here; reload the latest version before saving. · 別の画面で更新されています。入力内容を控えてから最新版を読み込んでください。';
 if(/permission|authoris|not allowed|unavailable|JWT|expired/i.test(message))return 'Access changed or your session expired. Reload and sign in again. · 権限またはログイン状態を確認し、再読み込みしてください。';
 if(/fetch|network/i.test(message))return 'Connection lost. Your text is still here; please retry. · 接続できません。入力内容は残っています。もう一度お試しください。';
 return message;
}
export function createNoteApi(client) {
 const result=async query=>{const {data,error}=await query;if(error)throw error;return data;};
 const rpc=async(name,args)=>{const data=await result(client.rpc(`review_note_${name}`,args));return Array.isArray(data)&&data.length===1?data[0]:data;};
 const note=id=>result(client.from('review_lesson_notes').select('*').eq('id',id).single());
 const related=(table,id)=>result(client.from(`${PREFIX}_${table}`).select('*').eq('note_id',id).order('created_at',{ascending:false}));
 const api={
  client,rpc,note,
  async list({studentId,status,offset=0,limit=30}={}) {
   // List deliberately excludes the large structured document and full-resolution images.
   let q=client.from('review_lesson_notes').select('id,student_id,teacher_id,lesson_date,title,summary,tags,status,version,cover_asset_id,published_at,updated_at,created_at,assets:review_lesson_note_assets!review_lesson_note_assets_note_id_fkey(id,state,uploader_role,thumbnail_path),seen:review_lesson_note_review_status(viewed_version,reviewed_version)')
    .order('lesson_date',{ascending:false}).order('created_at',{ascending:false}).range(offset,offset+limit-1);
   if(studentId)q=q.eq('student_id',studentId);if(status&&status!=='all')q=q.eq('status',status);
   return result(q);
  },
  async detail(id,{teacher=false}={}) {
   const data=await note(id);
   const values=await Promise.all(['annotations','suggestions','comments','assets','review_status',...(teacher?['activity','revisions']:[])].map(table=>{
    // Review status has no created_at; revisions list does not transfer all snapshots.
    if(table==='review_status')return result(client.from(`${PREFIX}_${table}`).select('*').eq('note_id',id));
    if(table==='revisions')return result(client.from(`${PREFIX}_${table}`).select('id,note_id,changed_by,change_type,affected_blocks,created_at').eq('note_id',id).order('created_at',{ascending:false}).limit(100));
    return related(table,id);
   }));
   const saved=teacher?[]:await result(client.from('review_personal_cards').select('id,source_block_id,favorites:review_personal_card_favorites!inner(card_id)').eq('student_id',data.student_id).eq('source_note_id',id).eq('active',true));
   return {note:data,saved_phrases:saved,...Object.fromEntries(['annotations','suggestions','comments','assets','review_status',...(teacher?['activity','revisions']:[])].map((key,i)=>[key,values[i]]))};
  },
  save: n=>{validateNote(n);return rpc('save',{target_note:n.id,target_student:n.student_id,expected_version:n.version,payload:notePayload(n)});},
  annotate:(id,block,body,version)=>rpc('annotate',{target_note:id,target_block:block,body_text:body,expected_version:version}),
  suggest:(id,block,changes)=>rpc('suggest',{target_note:id,target_block:block,changes}),
  reviewSuggestion:(id,decision,version)=>rpc('review_suggestion',{target_suggestion:id,decision,expected_version:version}),
  directEdit:(id,version,changes)=>rpc('direct_edit',{target_note:id,expected_version:version,block_changes:changes}),
  comment:(id,body)=>rpc('comment',{target_note:id,body_text:body}),
  mark:(id,reviewed,version)=>rpc('mark',{target_note:id,reviewed,expected_version:version}),
  savePhrase:(id,block)=>rpc('save_phrase',{target_note:id,target_block:block}),
  notifications:()=>result(client.from(`${PREFIX}_notifications`).select('*,note:review_lesson_notes(title,lesson_date,student_id)').eq('unread',true).order('updated_at',{ascending:false}).limit(100)),
  acknowledge:id=>rpc('acknowledge',{target_note:id}),
  revision:id=>result(client.from(`${PREFIX}_revisions`).select('*').eq('id',id).single()),
  restore:(id,version)=>rpc('restore',{target_revision:id,expected_version:version}),
  assetChange:(id,changes,version)=>rpc('asset_change',{target_asset:id,changes,expected_version:version}),
  order:(id,ids,cover,version)=>rpc('assets_order',{target_note:id,asset_ids:ids,cover_id:cover,expected_version:version}),
  async signed(path){const data=await result(client.storage.from(NOTE_BUCKET).createSignedUrl(path,300));return data.signedUrl;},
  async cancelUpload(asset){
   await result(client.storage.from(NOTE_BUCKET).remove([asset.storage_path,asset.thumbnail_path]));
   return rpc('asset_cancel',{target_asset:asset.id});
  },
  async upload(id,file,metadata,{replaceId=null,onStatus=()=>{}}={}) {
   onStatus('Preparing image… · 画像を最適化中…');const {full,thumbnail}=await prepareNoteImage(file);
   const asset=await rpc('asset_reserve',{target_note:id,asset_metadata:{...metadata,mime_type:full.type}});
   try {
    onStatus('Uploading privately… · 非公開でアップロード中…');
    await result(client.storage.from(NOTE_BUCKET).upload(asset.storage_path,full,{contentType:full.type,upsert:false,cacheControl:'0'}));
    await result(client.storage.from(NOTE_BUCKET).upload(asset.thumbnail_path,thumbnail,{contentType:'image/jpeg',upsert:false,cacheControl:'0'}));
    return await rpc('asset_finish',{target_asset:asset.id,replace_asset:replaceId});
   }catch(error){
    try{await api.cancelUpload(asset);}catch{/* Pending entry remains visible with an explicit retry/remove control. */}
    throw error;
   }
  },
  async duplicate(original,assets,onStatus=()=>{}) {
   const copy=clone(original);copy.id=null;copy.version=0;copy.status='draft';copy.title=`${copy.title.slice(0,165)} (copy)`;
   const created=await api.save(copy),assetIds=new Map();
   try {
    for(const asset of assets.filter(a=>a.uploader_role==='teacher'&&a.state==='ready').sort((a,b)=>a.display_order-b.display_order)) {
     onStatus('Copying private images… · 画像を複製中…');
     const blob=await result(client.storage.from(NOTE_BUCKET).download(asset.storage_path));
     const extension=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'})[asset.mime_type];
     const next=await api.upload(created.id,new File([blob],`image.${extension}`,{type:asset.mime_type}),asset);
     assetIds.set(asset.id,next.id);
     if(original.cover_asset_id===asset.id)created.cover_asset_id=next.id;
    }
    const detail=await api.detail(created.id,{teacher:true});
    if(copy.content_json.blocks.some(b=>b.type==='image'&&assetIds.has(b.assetId))) {
     detail.note.content_json.blocks=detail.note.content_json.blocks.map(b=>b.type==='image'&&assetIds.has(b.assetId)?{...b,assetId:assetIds.get(b.assetId)}:b);
     detail.note=await api.save(detail.note);
    }
    await api.order(created.id,detail.assets.filter(a=>a.state==='ready').sort((a,b)=>a.display_order-b.display_order).map(a=>a.id),created.cover_asset_id||null,detail.note.version);
    return created.id;
   }catch(error){throw new Error(`Draft copy saved; some images need another upload. Open it from the list. · 下書きは複製済みです。一覧から開き、未完了の画像を追加してください。 ${noteError(error)}`);}
  },
 };
 return api;
}

export async function prepareNoteImage(file) {
 const extensions={ 'image/jpeg':/\.jpe?g$/i,'image/png':/\.png$/i,'image/webp':/\.webp$/i };
 if(!extensions[file.type] || !extensions[file.type].test(file.name))throw new Error('Choose a PNG, JPEG or WebP image. · PNG・JPEG・WebPを選んでください。');
 if(file.size>20*1024*1024 || !file.size)throw new Error('Choose an image up to 20MB. · 20MB以下の画像を選んでください。');
 const url=URL.createObjectURL(file);let image;
 try {
  image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('This image cannot be opened. Try exporting it as JPEG or PNG. · この画像を読み込めません。'));img.src=url;});
  if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth*image.naturalHeight>80000000)throw new Error('Image dimensions are too large. Please export a smaller image. · 画像の解像度を小さくしてください。');
  const encode=async(maxSide,maxPixels,quality)=>{
   const scale=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight),Math.sqrt(maxPixels/(image.naturalWidth*image.naturalHeight)));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));canvas.width=canvas.height=1;
   if(!blob || blob.type!=='image/jpeg')throw new Error('Image conversion failed. · 画像変換に失敗しました。');return blob;
  };
  let full=await encode(8192,16000000,.9);if(full.size>5242880)full=await encode(6144,10000000,.75);
  let thumbnail=await encode(640,409600,.76);if(thumbnail.size>262144)thumbnail=await encode(480,230400,.6);
  if(full.size>5242880 || thumbnail.size>262144)throw new Error('This image is too complex. Please use a smaller image. · もう少し小さい画像を使用してください。');
  return {full,thumbnail};
 } finally {URL.revokeObjectURL(url);}
}
