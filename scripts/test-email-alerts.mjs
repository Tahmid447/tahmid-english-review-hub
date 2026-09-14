import assert from 'node:assert/strict';
import { createHandler } from '../workers/email-alerts/router.js';
import { sendGoogleMail } from '../workers/email-alerts/smtp.js';
const env = { ADMIN_TOKEN: 'a'.repeat(64), SEND_ENABLED: 'true', SMTP_USER: 'sender@gmail.com', SMTP_PASSWORD: 'secret-app-pass', OWNER_EMAIL: 'owner@gmail.com' };
let sent;
const handle = createHandler(async mail => { sent = mail; return { accepted: true }; });
const request = (path='/test', token=env.ADMIN_TOKEN) => new Request('https://test.invalid'+path, {method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify({to:'attacker@example.com'})});
assert.equal((await handle(new Request('https://test.invalid/health'),env)).status,200);
assert.equal((await handle(request('/test','wrong'),env)).status,401);
assert.equal((await handle(request(),{...env, SEND_ENABLED:'false'})).status,409);
assert.equal(sent,undefined);
assert.equal((await handle(request(),env)).status,200);
assert.equal(sent.to,env.OWNER_EMAIL);
assert.equal(sent.user,env.SMTP_USER);
assert.equal((await handle(request('/unknown'),env)).status,404);
const bad = createHandler(async()=>{throw new Error(env.SMTP_PASSWORD);});
assert.ok(!(await (await bad(request(),env)).text()).includes(env.SMTP_PASSWORD));

function fakeConnect({authReject=false, quitDrop=false}={}) {
  const transcript=[]; let controller;
  const push = text => { const bytes=new TextEncoder().encode(text); for(let i=0;i<bytes.length;i+=7) controller.enqueue(bytes.slice(i,i+7)); };
  let step=0, closed=false;
  const readable = new ReadableStream({start(c){controller=c;push('220 smtp.gmail.com ready\r\n');}});
  const writable = new WritableStream({write(bytes){
    const text=new TextDecoder().decode(bytes); transcript.push(text);
    const replies=['250-smtp.gmail.com\r\n250 AUTH LOGIN\r\n','334 VXNlcg==\r\n','334 UGFzcw==\r\n',authReject?'535 auth failed\r\n':'235 authenticated\r\n','250 sender\r\n','250 recipient\r\n','354 send data\r\n','250 accepted\r\n','221 goodbye\r\n'];
    if(quitDrop && step===8){controller.close();closed=true;step++;return;}
    push(replies[step++]);
  }});
  return {transcript, connect(address,options){
    assert.deepEqual(address,{hostname:'smtp.gmail.com',port:465});assert.equal(options.secureTransport,'on');
    return {readable,writable,opened:Promise.resolve(),closed:Promise.resolve(),async close(){if(!closed){controller.close();closed=true;}}};
  }};
}
const mail={user:env.SMTP_USER,password:env.SMTP_PASSWORD,to:env.OWNER_EMAIL,subject:'English Hub check',text:'日本語 notification\nNo links.'};
for(const quitDrop of [false,true]) {
 const mock=fakeConnect({quitDrop}); const result=await sendGoogleMail(mock.connect,mail);
 assert.equal(result.accepted,true);assert.ok(mock.transcript[7].includes('From: Tahmid English Hub <sender@gmail.com>'));
 assert.ok(mock.transcript[7].includes('Content-Transfer-Encoding: base64'));
 assert.ok(!mock.transcript[7].includes(env.SMTP_PASSWORD));
}
const rejected=fakeConnect({authReject:true});
await assert.rejects(()=>sendGoogleMail(rejected.connect,mail),{code:'SMTP_535'});
assert.equal(rejected.transcript.length,4);
await assert.rejects(()=>sendGoogleMail(()=>assert.fail(),{...mail,to:'x@gmail.com\r\nBcc: victim@gmail.com'}),{code:'INVALID_CONFIGURATION'});
console.log('PASS: fixed recipient/auth guards, fragmented SMTPS, TLS, auth failures, header injection and accepted DATA handling');
