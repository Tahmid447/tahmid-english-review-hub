// Browser fixture adapter. Requests stay on the loopback server and use real RLS.
if(location.hostname!=='127.0.0.1')throw new Error('Loopback fixture only');
export const ids={teacher:'10000000-0000-4000-8000-000000000001',otherTeacher:'10000000-0000-4000-8000-000000000002',student:'20000000-0000-4000-8000-000000000001',other:'20000000-0000-4000-8000-000000000002'};
export let role=new URLSearchParams(location.search).get('qa_role')||(location.pathname.startsWith('/teacher')?'teacher':'student');
export const setRole=value=>{role=value;};
const session=()=>({user:{id:ids[role],email:`${role}@example.test`,user_metadata:{display_name:'Local QA'}}});
const request=async payload=>(await fetch('/__notes_qa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,role})})).json();
export const client={
 auth:{getSession:async()=>({data:{session:session()}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},
 rpc:(name,args={})=>request({op:'rpc',name,args}),
 from(table){const p={op:'query',table,filters:[],orders:[]};const b={
  select(columns){p.columns=columns;return b;},is(key,value){p.filters.push([key,value,'is']);return b;},not(key,op,value){p.filters.push([key,value,'not']);return b;},eq(key,value){p.filters.push([key,value]);return b;},in(key,value){p.filters.push([key,value,'in']);return b;},
  order(key,{ascending=true}={}){p.orders.push([key,ascending]);return b;},range(start,end){p.offset=start;p.limit=end-start+1;return b;},limit(limit){p.limit=limit;return b;},single(){p.single=true;return b;},maybeSingle(){p.maybeSingle=true;return b;},update(values){p.op='update';p.values=values;return b;},upsert(values){p.op='upsert';p.values=values;return b;},then(resolve,reject){return request(p).then(resolve,reject);}
 };return b;},
 storage:{from(){return {createSignedUrl:path=>request({op:'signed',path}),async upload(path,blob){const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return request({op:'upload',path,type:blob.type,bytes:btoa(binary)});},remove:paths=>request({op:'remove',paths}),async download(path){const response=await request({op:'signed',path});if(response.error)return response;return {data:await(await fetch(response.data.signedUrl)).blob(),error:null};}};}}
};
export const services={
 getStudentClient:()=>client,getTeacherClient:()=>client,getStudentSession:async()=>session(),getTeacherSession:async()=>session(),
 onStudentAuthChange:()=>()=>{},onTeacherAuthChange:()=>()=>{},rememberPendingUserSettings:()=>{},googleStudentAuthAvailable:async()=>false,
 getStudentProfile:async()=>{const r=await client.from('review_profiles').select('*').eq('user_id',ids[role]).single();return {profile:r.data,error:r.error};},
 getStudentMembership:async()=>({membership:null,error:null}),
 loadUserSettings:async()=>{const r=await client.from('review_user_settings').select('*').eq('user_id',ids[role]).maybeSingle();return {loaded:Boolean(r.data),settings:r.data?.settings,userId:ids[role]};},
 saveUserSettings:async settings=>{const r=await client.from('review_user_settings').upsert({user_id:ids[role],settings});return {saved:!r.error,error:r.error};},
 getTeacherLearnerAuthStatus:async()=>({data:null,error:null}),
};
