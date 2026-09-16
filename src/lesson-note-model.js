import { PRACTICE_TYPES, isPractice, practiceSectionType } from './note-practice-model.js?v=20260915-practice';
/** Portable, English-first teaching blocks. No HTML or editor-vendor document format. */
export const BLOCK_TYPES = Object.freeze({
 heading: ['Heading · 見出し','neutral','H'], paragraph: ['Paragraph · 本文','neutral','¶'],
 bullet_list: ['Bullet list · 箇条書き','neutral','≡'],
 japanese_to_english: ['Japanese → English · 日本語から英語へ','purple','あ→A'],
 natural_english_upgrade: ['Natural English · 自然な英語へ','green','↗'],
 common_mistake: ['Common mistake · よくある間違い','red','!'],
 grammar_point: ['Grammar · 文法','amber','Aa'], nuance: ['Nuance · ニュアンス','amber','≈'],
 pronunciation: ['Pronunciation · 発音','teal','♫'], useful_phrase: ['Useful phrase · 使える表現','blue','“ ”'],
 vocabulary: ['Vocabulary · 単語','teal','Ab'], teacher_tip: ['Teacher’s tip · 先生のヒント','amber','✧'],
 example: ['Example · 例文','blue','↳'], comparison: ['Compare · 違いを比べる','amber','⇄'],
 quick_practice: ['Quick practice · 使ってみよう','teal','✓'], callout: ['Remember · 覚えておこう','blue','★'],
 collapsible_section: ['Section · 開閉できるセクション','neutral','▤'], image: ['Image · 画像','neutral','▧'], divider: ['Divider · 区切り','neutral','—'],
 ...PRACTICE_TYPES,
});
export const PHRASE_TYPES = new Set(['useful_phrase','vocabulary','japanese_to_english','natural_english_upgrade','example','pronunciation','comparison']);
export const PERMISSIONS = Object.freeze({
 allow_student_annotations: ['Personal annotations · 生徒のメモ',true],
 allow_student_suggestions: ['Suggested edits · 修正の提案',false],
 allow_student_images: ['Student images · 生徒の画像アップロード',false],
 allow_student_comments: ['Comments · コメント',false],
 allow_direct_student_edit: ['Direct editing · 教材の直接編集（詳細設定）',false],
 notify_teacher_on_change: ['Activity notifications · 生徒の更新を通知',true],
});
export const clone = value => JSON.parse(JSON.stringify(value));
export function editableTextFields(block) {
 const fields=[['englishText','English · 英語'],['japaneseSupport','Japanese support · 日本語サポート']];
 if(['natural_english_upgrade','common_mistake'].includes(block.type))fields.push(['originalText','Original expression · 元の表現']);
 if(block.type==='common_mistake')fields.push(['correctOptions','Correct expressions — one per line · 正しい表現（1行ずつ）']);
 if(block.type==='bullet_list')fields.push(['items','List items — one per line · 箇条書き（1行ずつ）']);
 if(['comparison','pronunciation'].includes(block.type))fields.push(['comparisonText','Comparison · 比較する表現'],['comparisonJapanese','Comparison support · 比較の日本語']);
 if(block.type==='pronunciation')fields.push(['ipa','Pronunciation support · 発音の補足']);
 if(block.type==='quick_practice')fields.push(['answer','Model answer · 回答例']);
 fields.push(['explanation','Explanation · 説明'],['examples','Examples — one per line · 例文（1行ずつ）']);
 return fields;
}
export const newId = () => crypto.randomUUID();
export function newBlock(type='paragraph') {
 if (!BLOCK_TYPES[type]) throw new Error('Unknown teaching block');
 return {id:newId(),...(PRACTICE_TYPES[type]&&type!=='quick_practice_group'?{questionId:newId(),choices:[],acceptedAnswers:[],hint:'',answerKey:'',difficulty:''}:{}),type,englishText:'',japaneseSupport:'',japaneseSupportMode:'none',examples:[],explanation:'',tags:[],
  pronunciation:{enabled:PHRASE_TYPES.has(type)},displayOptions:{studentEditable:false,keyPhrase:type==='useful_phrase',collapsed:false}};
}
export function newNote(studentId='') {
 const date=new Date();const today=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
 return {id:null,student_id:studentId,lesson_date:today,title:'',summary:'',focus:'',tags:[],status:'draft',version:0,
  content_json:{schemaVersion:1,blocks:[]},...Object.fromEntries(Object.entries(PERMISSIONS).map(([k,v])=>[k,v[1]]))};
}
export function notePayload(note) {
 const keys=['lesson_date','title','summary','focus','tags','status','content_json',...Object.keys(PERMISSIONS)];
 return Object.fromEntries(keys.map(key=>[key,clone(note[key])]));
}
export function duplicateNoteDraft(original,studentId,assets=[]) {
 const note=newNote(studentId),payload=notePayload(original);
 for(const key of ['title','summary','focus','tags','content_json',...Object.keys(PERMISSIONS)])note[key]=payload[key];
 const images=clone(assets.filter(a=>a.note_id===original.id&&a.uploader_role==='teacher'&&a.state==='ready')).sort((a,b)=>a.display_order-b.display_order);
 const imageIds=new Set(images.map(a=>a.id));
 note.content_json.blocks=note.content_json.blocks.map(block=>{
  const copy={...block,id:newId()};
  if(block.questionId||isPractice(block))copy.questionId=newId();
  if('assetId' in copy&&!imageIds.has(copy.assetId))copy.assetId='';
  return copy;
 });
 note.cover_asset_id=imageIds.has(original.cover_asset_id)?original.cover_asset_id:null;
 return {note,assets:images};
}
export function validateNote(note) {
 if(!note.student_id)throw new Error('Choose a learner. · 生徒を選んでください。');
 if(!note.title.trim())throw new Error('Add a lesson title. · タイトルを入力してください。');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(note.lesson_date))throw new Error('Choose a lesson date. · 日付を選んでください。');
 if(note.content_json.blocks.length>150 || new TextEncoder().encode(JSON.stringify(note.content_json)).length>220000)
  throw new Error('Use up to 150 blocks / 220KB per note. · 長い教材はノートを分けてください。');
 if(note.status==='published' && (!note.focus.trim() || !note.content_json.blocks.length))
  throw new Error('Add Today’s Focus and at least one teaching block before publishing. · 今日のポイントと教材を入力してください。');
 if(note.status==='published')for(const b of note.content_json.blocks.filter(isPractice)) {
  if(!(b.englishText||'').trim())throw new Error('Add a prompt to each practice question. · 練習問題の設問を入力してください。');
  if(b.type==='multiple_choice'&&(b.choices||[]).length<2)throw new Error('Add at least two choices. · 選択肢を2つ以上入力してください。');
  if(b.type==='sentence_reorder'&&(b.items||[]).length<2)throw new Error('Add at least two reorder items. · 並び替えの語句を2つ以上入力してください。');
 }
 return note;
}
export function moveItem(items,id,direction) {
 const copy=[...items], index=copy.findIndex(x=>x.id===id),next=index+direction;
 if(index<0||next<0||next>=copy.length)return copy;
 [copy[index],copy[next]]=[copy[next],copy[index]];return copy;
}
export function noteState(note,seen) {
 if(seen?.reviewed_version>=note.version)return 'reviewed';
 if(!seen?.viewed_version)return 'new';
 if(seen.viewed_version<note.version)return 'updated';
 return 'opened';
}
export function noteListActions(note) {
 if(note.deleted_at)return [['restore','Restore from Trash · ゴミ箱から下書きに戻す']];
 return [['preview','Preview Student View · 生徒表示を確認'],['activity','Progress & activity · 進捗・更新'],['media','Images · 画像'],['duplicate','Duplicate for learner · 別の生徒用に複製'],...(note.status==='archived'?
  [['restore','Restore from Archive · 保管から下書きに戻す'],['trash','Move to Trash · ゴミ箱へ移動']]:[['archive','Archive · 保管する']])];
}
export const dateLabel = value => new Date(`${value}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
export const searchText = note => [note.title,note.summary,...note.tags,note.focus||''].join(' ').toLocaleLowerCase();

const sections = [
 [/japanese\s*(?:→|->|to)\s*english|日本語.*英語/i,'japanese_to_english'],
 [/natural\s*english|upgrade|自然な英語/i,'natural_english_upgrade'],
 [/common\s*mistake|correction|よくある間違い/i,'common_mistake'],
 [/grammar|文法/i,'grammar_point'],[/nuance|ニュアンス/i,'nuance'],[/pronunciation|発音/i,'pronunciation'],
 [/useful\s*phrase|professional\s*phrase|key\s*phrase|使える表現/i,'useful_phrase'],
 [/vocabulary|単語/i,'vocabulary'],[/quick\s*(practice|review)|練習/i,'quick_practice'],
 [/comparison|compare|比較/i,'comparison'],[/teacher.?s?\s*tip|先生のヒント/i,'teacher_tip'],
];
const fieldNames = {
 english:'englishText',natural:'englishText',correct:'correctOptions',wrong:'originalText',incorrect:'originalText',original:'originalText',
 japanese:'japaneseSupport','japanese support':'japaneseSupport','日本語':'japaneseSupport',
 example:'examples',examples:'examples',explanation:'explanation',ipa:'ipa',answer:'answer',tags:'tags',
 'word a':'englishText','word b':'comparisonText',
};
export function safeImportedText(value) {
 // Import produces plain text, never an HTML fragment. Unknown text is retained.
 return String(value).replace(/\r\n?/g,'\n')
  .replace(/<(script|iframe|style|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'')
  .replace(/<[^>]*>/g,'').replace(/!?(\[([^\]]*)\])\([^)]*\)/g,'$2')
  .replace(/\u0000/g,'');
}
export function importLessonText(input,{referenceDate=newNote().lesson_date}={}) {
 if(new TextEncoder().encode(input).length>180000)throw new Error('Import up to 180KB at once. · 長い教材は分けて取り込んでください。');
 const clean=safeImportedText(input),warnings=[];
 const extracted=extractLessonMetadata(clean),text=extracted.content;
 if(clean!==input.replace(/\r\n?/g,'\n'))warnings.push('Embedded HTML and link destinations were removed. Text remains editable. · HTMLやリンク先を除去しました。内容を確認してください。');
 const blocks=[];let current=null,kind='paragraph',field='englishText',title='',sectionTitle='';
 const flush=()=>{
  if(current && Object.entries(current).some(([k,v])=>['englishText','japaneseSupport','originalText','explanation','comparisonText','items','correctOptions','answerKey'].includes(k) && (Array.isArray(v)?v.length:String(v).trim()))) {
   if(current.japaneseSupport)current.japaneseSupportMode=['grammar_point','nuance','natural_english_upgrade'].includes(current.type)?'explanation':'short';
   blocks.push(current);
  }
  current=null;field='englishText';
 };
 const ensure=()=>current ||= newBlock(kind);
 for(const line of text.split('\n')) {
  const heading=line.match(/^\s*(#{1,6})\s+(.+)$/);
  const practiceKind=practiceSectionType(heading?.[2]||line);
  const semantic=sections.find(([pattern])=>pattern.test(heading?.[2] || (/^[^:：]{2,70}$/.test(line)?line:'')));
  if(heading?.[1]==='#' && !title){title=heading[2].trim();continue;}
  if(practiceKind){flush();kind=practiceKind;ensure();if(kind==='quick_practice_group'){current.englishText=heading?.[2]||line;flush();kind='paragraph';}continue;}
  if(heading && /quick\s*practice/i.test(heading[2]) && /(?:###\s*(?:Multiple Choice|Fill in|Error Correction|Short Answer|Self Check|Japanese.*Practice|Sentence Reorder))/i.test(text)){flush();kind='quick_practice_group';ensure();current.englishText=heading[2];flush();kind='paragraph';continue;}
  if(heading && /^(?:images?|infographics?|画像|図解)(?:\s|$)/i.test(heading[2])){flush();kind='image';ensure();current.title=heading[2];current.englishText=heading[2];continue;}
  if((heading && heading[1].length<=2) || (!heading && semantic)) {
   flush(); sectionTitle=heading?.[2] || line; kind=semantic?.[1] || 'paragraph';
   if(!semantic)blocks.push({...newBlock('heading'),englishText:sectionTitle});
   continue;
  }
  if(heading){flush();ensure();if(kind==='japanese_to_english')current.japaneseSupport=heading[2];else current.title=heading[2];continue;}
  if(!line.trim())continue;
  const label=line.match(/^\s*([A-Za-z ]+|日本語)[:：]\s*(.*)$/);
  const labelName=label?.[1].trim().toLowerCase();
  const practiceField=isPractice(current||{type:kind})&&({question:'englishText',prompt:'englishText',answer:'answerKey','answer key':'answerKey','accepted answers':'acceptedAnswers',hint:'hint',difficulty:'difficulty',items:'items',words:'items',options:'choices',choices:'choices'})[labelName];
  const choiceLabel=isPractice(current||{type:kind})&&/^[a-z]$/.test(labelName||'')?labelName:null;
  const mapped=choiceLabel?'choices':practiceField||(label && fieldNames[labelName]);
  if(mapped){
   if(mapped==='englishText' && current?.englishText && !current.originalText)flush();
   ensure();field=mapped;if(!label[2])continue;
  }
  const value=(mapped?label[2]:line).replace(/^\s*[-*•]\s+/,'').trim();
  if(!value)continue;ensure();
  if(['examples','correctOptions','tags','choices','acceptedAnswers','items'].includes(field))current[field]=[...(current[field]||[]),value];
  else current[field]=[current[field]||'',value].filter(Boolean).join('\n');
 }
 flush();
 if(blocks.length>150)throw new Error('This import has more than 150 blocks. Split it into two notes.');
 if(!blocks.length && text.trim())blocks.push({...newBlock(),englishText:text.trim()});
 const metadata=lessonMetadata(blocks,{...extracted.metadata,...!extracted.metadata.title&&title?{title}:{}});
 const suppliedDate=extracted.metadata.lesson_date;
 metadata.lesson_date=parseLessonDate(suppliedDate||metadata.title,referenceDate)||(!suppliedDate?referenceDate:'');
 if(suppliedDate&&!metadata.lesson_date)warnings.push('Check the lesson date. Use YYYY-MM-DD for an unambiguous date. · レッスン日を確認し、YYYY-MM-DD形式で入力してください。');
 return {title:metadata.title,metadata,explicitFields:extracted.fields,blocks,warnings};
}

export const METADATA_FIELDS = Object.freeze({
 lesson_date:['Lesson date · レッスン日',10],
 title:['Lesson Title · レッスンタイトル',180],summary:['Short Introduction · 短い概要',1200],
 focus:["Today's Focus · 今日のポイント",2000],tags:['Topics · テーマ',600],
});
export const autoImportLessonDate=(note,imported,manuallyChanged=false)=>!manuallyChanged&&Boolean(imported.metadata.lesson_date)&&(!note.id||imported.explicitFields.includes('lesson_date'));
const metadataLabels={'lesson date':'lesson_date',date:'lesson_date','レッスン日':'lesson_date','日付':'lesson_date','lesson title':'title','short introduction':'summary','a short introduction':'summary',"today's focus":'focus','todays focus':'focus',topics:'tags'};
export function parseLessonDate(value,referenceDate=newNote().lesson_date) {
 const source=String(value||'').trim(),year=Number(referenceDate.slice(0,4));let y,m,d;
 let match=source.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})(?:日|\b)/);
 if(match)[,y,m,d]=match;
 else {
  const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  match=source.match(/^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?\b/i);
  if(match&&months.includes(match[1].slice(0,3).toLowerCase()))[y,m,d]=[match[3]||year,months.indexOf(match[1].slice(0,3).toLowerCase())+1,match[2]];
  else {
   match=source.match(/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?\b/i);
   if(match&&months.includes(match[2].slice(0,3).toLowerCase()))[y,m,d]=[match[3]||year,months.indexOf(match[2].slice(0,3).toLowerCase())+1,match[1]];
   else {match=source.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(match&&Number(match[2])>12)[y,m,d]=[match[3],match[1],match[2]];else if(match&&Number(match[1])>12)[y,m,d]=[match[3],match[2],match[1]];}
  }
 }
 if(!y||!m||!d)return '';
 const date=new Date(Date.UTC(Number(y),Number(m)-1,Number(d)));
 return date.getUTCFullYear()===Number(y)&&date.getUTCMonth()+1===Number(m)&&date.getUTCDate()===Number(d)?`${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`:'';
}
function extractLessonMetadata(text) {
 const metadata={},fields=[],content=[];let active='';
 for(const line of text.split('\n')) {
  const unstyled=line.replace(/^\s*#{1,6}\s+/,'').replace(/\*\*/g,'').replace(/[’‘]/g,"'");
  const match=unstyled.match(/^\s*([A-Za-z' ]+|レッスン日|日付)[:：]\s*(.*)$/),key=metadataLabels[match?.[1].trim().toLowerCase()];
  if(key){active=key;if(!fields.includes(key))fields.push(key);metadata[key]=match[2].trim();continue;}
  if(active&&!line.trim()&&metadata[active]){active='';continue;}
  // A content heading or block field ends a multiline metadata value.
  if(/^\s*#/.test(line)||/^\s*[A-Za-z ]+[:：]/.test(line)||practiceSectionType(line)||/^\s*(?:Grammar|Vocabulary|Natural English|Common Mistakes?|Pronunciation|Useful Phrases?|Quick Practice)\s*$/i.test(line))active='';
  if(active){if(active==='tags'&&!line.trim()){active='';continue;}metadata[active]=[metadata[active],line.replace(/^\s*[-*•]\s+/,'').trim()].filter(Boolean).join('\n');}
  else content.push(line);
 }
 if('tags' in metadata)metadata.tags=metadata.tags.split(/[,、\n]/).map(t=>t.trim()).filter(Boolean);
 return {metadata,fields,content:content.join('\n')};
}
const compact=(value,max)=>{const text=String(value||'').replace(/\s+/g,' ').trim();if(text.length<=max)return text;const end=text.slice(0,max-1);return end.slice(0,end.lastIndexOf(' ')>max/2?end.lastIndexOf(' '):end.length)+'…';};
export function lessonMetadata(blocks,explicit={}) {
 const topics={japanese_to_english:'Japanese to English',natural_english_upgrade:'Natural English',common_mistake:'Common Mistakes',grammar_point:'Grammar',nuance:'Nuance',pronunciation:'Pronunciation',useful_phrase:'Useful Phrases',vocabulary:'Vocabulary',comparison:'Comparisons'};
 const teaching=blocks.filter(b=>!isPractice(b)&&!['image','divider','heading','collapsible_section','quick_practice_group'].includes(b.type));
 const tags=[...new Set(teaching.map(b=>topics[b.type]).filter(Boolean))].slice(0,6);
 const heading=blocks.find(b=>['heading','collapsible_section'].includes(b.type))?.englishText;
 const first=teaching[0],example=first?.englishText||first?.correctOptions?.[0]||'';
 const topicText=tags.length?tags.join(', '):compact(heading||first?.title||example,90);
 const title=compact(heading||first?.title||tags.slice(0,3).join(' & ')||example||'Lesson Review',180);
 const summary=topicText?`Review ${topicText.charAt(0).toLowerCase()+topicText.slice(1)}${blocks.some(isPractice)?' and practise with the lesson questions':''}.`:blocks.some(isPractice)?'Work through the practice questions from this lesson.':'';
 const focus=example?`Review this expression: ${compact(example,150)}`:heading?`Review ${compact(heading,150)}.`:tags.length?`Focus on ${tags.join(', ').toLowerCase()}.`:blocks.some(isPractice)?'Complete the practice questions and check your answers.':'';
 return {title,summary,focus,tags,...explicit};
}
export function applyLessonImport(note,imported,replaceFields=[]) {
 const copy=clone(note);
 if(copy.content_json.blocks.length+imported.blocks.length>150)throw new Error('Maximum 150 blocks per note. · 1ノート150ブロックまでです。');
 for(const [key,[,limit]] of Object.entries(METADATA_FIELDS)) {
  const value=imported.metadata[key];
  if(Array.isArray(copy[key])?copy[key].length&&!replaceFields.includes(key):String(copy[key]||'').trim()&&!replaceFields.includes(key))continue;
  if(key==='tags'){
   if(!Array.isArray(value)||value.length>12||value.some(t=>typeof t!=='string'||t.length>80))throw new Error('Use up to 12 topics, 80 characters each. · テーマは12個、各80文字までです。');
  }else if(typeof value!=='string'||value.length>limit)throw new Error(`${METADATA_FIELDS[key][0]}: maximum ${limit} characters. · 文字数を確認してください。`);
  if(key==='lesson_date'&&parseLessonDate(value)!==value)throw new Error('Choose a valid lesson date. · 正しいレッスン日を入力してください。');
  copy[key]=clone(value);
 }
 copy.content_json.blocks.push(...clone(imported.blocks));
 if(new TextEncoder().encode(JSON.stringify(copy.content_json)).length>220000)throw new Error('Use up to 220KB per note. · 長い教材はノートを分けてください。');
 return copy;
}
