import {mountLessonNoteStudio} from '/src/lesson-note-studio.js?v=20260915-practice';
import {mountNoteView,cardMarkup} from '/src/lesson-note-view.js?v=20260915-practice';
import {createNoteApi} from '/src/lesson-note-api.js?v=20260915-practice';
import {escapeHTML as e} from '/src/store.js?v=20260911-mobile2';
import {client,ids,role,setRole} from './helpers/notes-qa-client.js';
if(location.hostname!=='127.0.0.1')throw new Error('Loopback fixture only');
const root=document.querySelector('#qaRoot');let view;
const api=createNoteApi(client);
function clear(){if(view?.dirty()&&!confirm('Discard local unsaved changes?'))return false;view?.dispose();view=null;root.replaceChildren();return true;}
function teacher(){if(!clear())return;setRole('teacher');view=mountLessonNoteStudio(root,{client,teacherId:ids.teacher,profiles:[{user_id:ids.student,first_name:'Student',last_name:'A'}],studentId:ids.student});}
async function student(which='student'){
 if(!clear())return;setRole(which);const notes=await api.list({studentId:ids[role],status:'published'});
 root.innerHTML='<h1>My Lesson Notes</h1><div class="ln-cards">'+notes.map(n=>cardMarkup(n)).join('')+'</div>';
 if(!notes.length)root.innerHTML+='<p>No published notes available.</p>';
 root.querySelectorAll('a[href^="/my-page/notes/"]').forEach(link=>link.onclick=event=>{event.preventDefault();void open(link.getAttribute('href').split('/').pop());});
}
async function open(id){view?.dispose();const detail=await api.detail(id);view=mountNoteView(root,{detail,api,userId:ids[role],onRefresh:()=>void open(id)});await api.mark(id,false,detail.note.version);}
document.querySelector('#qaTeacher').onclick=teacher;document.querySelector('#qaStudent').onclick=()=>void student();document.querySelector('#qaOther').onclick=()=>void student('other');
document.querySelector('#qaFavorites').onclick=async()=>{if(!clear())return;setRole('student');const cards=await client.from('review_personal_cards').select('*');root.innerHTML='<h1>Saved phrases — existing personal cards</h1>'+cards.data.map(c=>`<article class="ln-block"><h2>${e(c.text_en)}</h2><p>${e(c.text_ja)}</p><p>${e(c.source_lesson_date)} · ${e(c.source_note_id)}</p></article>`).join('');};
teacher();
