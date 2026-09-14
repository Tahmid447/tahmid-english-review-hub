import {mountLessonNoteStudio} from '/src/lesson-note-studio.js?v=20260915-practice';
import {mountNoteView,cardMarkup} from '/src/lesson-note-view.js?v=20260915-practice';
import {createNoteApi} from '/src/lesson-note-api.js?v=20260915-practice';
import {escapeHTML as e} from '/src/store.js?v=20260911-mobile2';
if(location.hostname!=='127.0.0.1')throw new Error('Loopback fixture only');
const ids={teacher:'10000000-0000-4000-8000-000000000001',student:'20000000-0000-4000-8000-000000000001',other:'20000000-0000-4000-8000-000000000002'};
const root=document.querySelector('#qaRoot');let role='teacher',view;
const request=async payload=>(await fetch('/__notes_qa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,role})})).json();
const client={
 rpc:(name,args)=>request({op:'rpc',name,args}),
 from(table){const p={op:'query',table,filters:[],orders:[]};const builder={select(columns){p.columns=columns;return builder;},is(key,value){p.filters.push([key,value,"is"]);return builder;},not(key,op,value){p.filters.push([key,value,"not"]);return builder;},eq(key,value){p.filters.push([key,value]);return builder;},order(key,{ascending=true}={}){p.orders.push([key,ascending]);return builder;},range(start,end){p.offset=start;p.limit=end-start+1;return builder;},limit(limit){p.limit=limit;return builder;},single(){p.single=true;return builder;},then(resolve,reject){return request(p).then(resolve,reject);}};return builder;},
 storage:{from(){return {createSignedUrl:path=>request({op:'signed',path}),async upload(path,blob){const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return request({op:'upload',path,type:blob.type,bytes:btoa(binary)});},remove:paths=>request({op:'remove',paths}),async download(path){const response=await request({op:'signed',path});if(response.error)return response;return {data:await(await fetch(response.data.signedUrl)).blob(),error:null};}};}}
};
const api=createNoteApi(client);
function clear(){if(view?.dirty()&&!confirm('Discard local unsaved changes?'))return false;view?.dispose();view=null;root.replaceChildren();return true;}
function teacher(){if(!clear())return;role='teacher';view=mountLessonNoteStudio(root,{client,teacherId:ids.teacher,profiles:[{user_id:ids.student,first_name:'Student',last_name:'A'}],studentId:ids.student});}
async function student(which='student'){
 if(!clear())return;role=which;const notes=await api.list({studentId:ids[role],status:'published'});
 root.innerHTML='<h1>My Lesson Notes</h1><div class="ln-cards">'+notes.map(n=>cardMarkup(n)).join('')+'</div>';
 if(!notes.length)root.innerHTML+='<p>No published notes available.</p>';
 root.querySelectorAll('a[href^="/my-page/notes/"]').forEach(link=>link.onclick=event=>{event.preventDefault();void open(link.getAttribute('href').split('/').pop());});
}
async function open(id){view?.dispose();const detail=await api.detail(id);view=mountNoteView(root,{detail,api,userId:ids[role],onRefresh:()=>void open(id)});await api.mark(id,false,detail.note.version);}
document.querySelector('#qaTeacher').onclick=teacher;document.querySelector('#qaStudent').onclick=()=>void student();document.querySelector('#qaOther').onclick=()=>void student('other');
document.querySelector('#qaFavorites').onclick=async()=>{if(!clear())return;role='student';const cards=await client.from('review_personal_cards').select('*');root.innerHTML='<h1>Saved phrases — existing personal cards</h1>'+cards.data.map(c=>`<article class="ln-block"><h2>${e(c.text_en)}</h2><p>${e(c.text_ja)}</p><p>${e(c.source_lesson_date)} · ${e(c.source_note_id)}</p></article>`).join('');};
teacher();
