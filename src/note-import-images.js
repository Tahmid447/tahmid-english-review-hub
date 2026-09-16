export function importImageMetadata(fileName,lessonTitle,index=1) {
 const title=(lessonTitle?.trim()||'Lesson infographic').slice(0,180);
 return {title,caption:'',alt_text:lessonTitle?.trim()?`${title} lesson infographic`:'Lesson infographic',asset_type:'infographic'};
}

// Keep local files until the user saves. Completed uploads are never uploaded again on retry.
export function createImportImageQueue({createURL=file=>URL.createObjectURL(file),revokeURL=url=>URL.revokeObjectURL(url)}={}) {
 const items=[];
 return {
  items,
  add(files,title){
   const types={'image/png':/\.png$/i,'image/jpeg':/\.jpe?g$/i,'image/webp':/\.webp$/i};
   if(items.length+files.length>6)throw new Error('Add up to 6 images per import. · 画像は1回6枚までです。');
   for(const file of files)if(!types[file.type]?.test(file.name)||!file.size||file.size>20*1024*1024)throw new Error('Choose PNG, JPEG or WebP images up to 20MB each. · 1枚20MB以下のPNG・JPEG・WebPを選んでください。');
   for(const file of files)items.push({id:crypto.randomUUID(),file,url:createURL(file),metadata:importImageMetadata(file.name,title,items.length+1),asset:null,cover:false});
  },
  remove(id){const i=items.findIndex(item=>item.id===id);if(i>=0){revokeURL(items[i].url);items.splice(i,1);}},
  validate(){for(const item of items)if(!item.metadata.alt_text.trim())throw new Error('Add a description for each image. · 各画像の説明を入力してください。');},
  async upload(noteId,api,onStatus=()=>{}){
   this.validate();
   for(const [i,item] of items.entries())if(!item.asset)item.asset=await api.upload(noteId,item.file,item.metadata,{onStatus:message=>onStatus(`${i+1}/${items.length} · ${message}`)});
   return items.map(item=>item.asset);
  },
  clear(){items.splice(0).forEach(item=>revokeURL(item.url));},
 };
}
