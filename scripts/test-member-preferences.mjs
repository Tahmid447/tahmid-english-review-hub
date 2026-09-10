import assert from 'node:assert/strict';
const storage = new Map();
let serverSettings = {settings:{ambientEnabled:true,ambientTrack:'calm_focus'},updated_at:'2026-01-01T00:00:00Z'};
const saved = [];
let owner = true;
const created = [];
const user = '00000000-0000-4000-8000-000000000010';
const client = {
  auth:{getSession:async()=>({data:{session:{user:{id:user}}},error:null})},
  rpc:async name=>({data:name==='review_is_site_owner'&&owner,error:null}),
  from:()=>({
    select(){return this;},eq(){return this;},maybeSingle:async()=>({data:serverSettings,error:null}),
    upsert:async row=>{saved.push(row);serverSettings={settings:row.settings,updated_at:new Date().toISOString()};return {error:null};},
  }),
};
globalThis.window = {
  location:{origin:'https://example.test',pathname:'/my-page',search:''},
  localStorage:{getItem:key=>storage.get(key) ?? null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
  supabase:{createClient:(_url,_key,options)=>{created.push(options.auth.storageKey);return client;}},
};
const normal = await import('../src/supabase.js?member-test=normal');
assert.equal((await normal.getStudentSession()).user.id,user);
assert.equal(created.at(-1),'te-review-hub-student-auth');
normal.rememberPendingUserSettings(user,{ambientEnabled:false,ambientTrack:'rainy_desk',ambientVolume:0.11});
const recovered=await normal.loadUserSettings(user);
assert.equal(recovered.settings.ambientEnabled,false,'Unsent music-off survives a pending save and reload.');
assert.equal(recovered.settings.ambientTrack,'rainy_desk');
await normal.saveUserSettings(recovered.settings,{expectedUserId:user});
assert.equal(saved.at(-1).settings.ambientEnabled,false);
assert.equal((await normal.loadUserSettings(user)).settings.ambientVolume,0.11,'The next browser can load the saved volume.');
const before=saved.length;
const changed=await normal.saveUserSettings({ambientEnabled:true},{expectedUserId:'another-user'});
assert.equal(changed.reason,'auth-changed');assert.equal(saved.length,before,'Account changes cannot write to a different learner.');
window.location.search='?owner_preview=1';
const preview=await import('../src/supabase.js?member-test=owner');
assert.equal((await preview.getStudentSession()).user.id,user);
assert.equal(created.at(-1),'te-review-hub-teacher-auth','Explicit preview uses the existing teacher auth store.');
owner=false;
const notOwner=await import('../src/supabase.js?member-test=not-owner');
assert.equal(await notOwner.getStudentSession(),null,'A URL flag alone never grants owner preview.');
window.location.pathname='/';
const ordinaryHome=await import('../src/supabase.js?member-test=home');
await ordinaryHome.getStudentSession();assert.equal(created.at(-1),'te-review-hub-student-auth','Owner preview does not replace the normal home sign-in.');
console.log('Member preferences passed: pending save recovery, remote preferences, identity guards and verified owner preview.');
