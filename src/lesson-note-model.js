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
 return {id:newId(),type,englishText:'',japaneseSupport:'',japaneseSupportMode:'none',examples:[],explanation:'',tags:[],
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
export function validateNote(note) {
 if(!note.student_id)throw new Error('Choose a learner. · 生徒を選んでください。');
 if(!note.title.trim())throw new Error('Add a lesson title. · タイトルを入力してください。');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(note.lesson_date))throw new Error('Choose a lesson date. · 日付を選んでください。');
 if(note.content_json.blocks.length>150 || new TextEncoder().encode(JSON.stringify(note.content_json)).length>220000)
  throw new Error('Use up to 150 blocks / 220KB per note. · 長い教材はノートを分けてください。');
 if(note.status==='published' && (!note.focus.trim() || !note.content_json.blocks.length))
  throw new Error('Add Today’s Focus and at least one teaching block before publishing. · 今日のポイントと教材を入力してください。');
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
export function importLessonText(input) {
 if(new TextEncoder().encode(input).length>180000)throw new Error('Import up to 180KB at once. · 長い教材は分けて取り込んでください。');
 const text=safeImportedText(input),warnings=[];
 if(text!==input.replace(/\r\n?/g,'\n'))warnings.push('Embedded HTML and link destinations were removed. Text remains editable. · HTMLやリンク先を除去しました。内容を確認してください。');
 const blocks=[];let current=null,kind='paragraph',field='englishText',title='',sectionTitle='';
 const flush=()=>{
  if(current && Object.entries(current).some(([k,v])=>['englishText','japaneseSupport','originalText','explanation','comparisonText','items','correctOptions'].includes(k) && (Array.isArray(v)?v.length:String(v).trim()))) {
   if(current.japaneseSupport)current.japaneseSupportMode=['grammar_point','nuance','natural_english_upgrade'].includes(current.type)?'explanation':'short';
   blocks.push(current);
  }
  current=null;field='englishText';
 };
 const ensure=()=>current ||= newBlock(kind);
 for(const line of text.split('\n')) {
  const heading=line.match(/^\s*(#{1,6})\s+(.+)$/);
  const semantic=sections.find(([pattern])=>pattern.test(heading?.[2] || (/^[^:：]{2,70}$/.test(line)?line:'')));
  if(heading?.[1]==='#' && !title){title=heading[2].trim();continue;}
  if((heading && heading[1].length<=2) || (!heading && semantic)) {
   flush(); sectionTitle=heading?.[2] || line; kind=semantic?.[1] || 'paragraph';
   if(!semantic)blocks.push({...newBlock('heading'),englishText:sectionTitle});
   continue;
  }
  if(heading){flush();ensure();if(kind==='japanese_to_english')current.japaneseSupport=heading[2];else current.title=heading[2];continue;}
  if(!line.trim())continue;
  const label=line.match(/^\s*([A-Za-z ]+|日本語)[:：]\s*(.*)$/);
  const mapped=label && fieldNames[label[1].trim().toLowerCase()];
  if(mapped){
   if(mapped==='englishText' && current?.englishText && !current.originalText)flush();
   ensure();field=mapped;if(!label[2])continue;
  }
  const value=(mapped?label[2]:line).replace(/^\s*[-*•]\s+/,'').trim();
  if(!value)continue;ensure();
  if(['examples','correctOptions','tags'].includes(field))current[field]=[...(current[field]||[]),value];
  else current[field]=[current[field]||'',value].filter(Boolean).join('\n');
 }
 flush();
 if(blocks.length>150)throw new Error('This import has more than 150 blocks. Split it into two notes.');
 if(!blocks.length && text.trim())blocks.push({...newBlock(),englishText:text.trim()});
 return {title,blocks,warnings};
}
