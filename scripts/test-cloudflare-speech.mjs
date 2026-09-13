import assert from 'node:assert/strict';
import { handleSpeech } from '../workers/speech/index.js';
import { synthesize } from '../workers/speech/synthesize.js';
import { createSpeechRequest, validateSpeechResponse, VOICE_PROFILES } from '../src/speech-contract.js';
const url='https://speech.tahmidenglishhub.dpdns.org/api/natural-speech';
let calls=0, keys=[];
const env={SPEECH_LIMITER:{limit:async ({key})=>{keys.push(key);return {success:true};}}};
const fake=async (text,profile)=>{calls++;assert(text.length<=500);assert(Object.values(VOICE_PROFILES).some(p=>p.voiceId===profile.voiceId));return new Uint8Array(256);};
const req=(body, extra={})=>new Request(url,{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1','Origin':'https://tahmidenglishhub.dpdns.org',...extra},body:typeof body==='string'?body:JSON.stringify(body)});
for (const accent of ['us','gb','ja']) {
 const response=await handleSpeech(req(createSpeechRequest('Practice & learn.',accent)),env,fake);
 validateSpeechResponse(response,accent);
 assert.equal(response.headers.get('Cache-Control'),'private, no-store');
 assert.equal(response.headers.get('Access-Control-Allow-Origin'),'https://tahmidenglishhub.dpdns.org');
}
assert.equal(calls,3);assert(keys.every(k=>k==='speech:192.0.2.1'));
for (const [body,status] of [[{text:'',accent:'us'},400],[{text:'x'.repeat(501),accent:'us'},400],[{text:'bad\ntext',accent:'us'},400],[{text:'hello',accent:'xx'},400],[{text:'hello',accent:'us',voice:VOICE_PROFILES.gb.voiceId},409],[{text:'hello',accent:'us',profile:'unknown'},409],['{',400],['x'.repeat(5001),413]]) {
 assert.equal((await handleSpeech(req(body),env,fake)).status,status);
}
assert.equal(calls,3,'Invalid input must never reach synthesis');
assert.equal((await handleSpeech(req({text:'hello',accent:'us'},{Origin:'https://unrelated.example'}),env,fake)).status,403);
assert.equal((await handleSpeech(req({text:'hello',accent:'us'}),{SPEECH_LIMITER:{limit:async()=>({success:false})}},fake)).status,429);
assert.equal((await handleSpeech(req({text:'hello',accent:'us'}),{},fake)).status,503);
assert.equal(calls,3,'Denied requests must never reach synthesis');
assert.equal((await handleSpeech(new Request(url),env,fake)).status,405);
assert.equal((await handleSpeech(new Request(url,{method:'OPTIONS',headers:{Origin:'https://tahmidenglishhub.dpdns.org'}}),env,fake)).status,204);
assert.equal((await handleSpeech(req(createSpeechRequest('hello','us')),env,async()=>{throw Error('private upstream details');})).status,502);
// Transport fixtures prove complete-turn requirement, frame validation, XML
// escaping, socket cleanup and timeout. They never connect to the real service.
function socketFor(mode) {
 const handlers=new Map();
 return {closed:false,sent:[], addEventListener(name,fn){handlers.set(name,fn);},accept(){},close(){this.closed=true;},send(text){this.sent.push(text);if(this.sent.length!==2)return;
 queueMicrotask(()=>{
 if(mode==='timeout')return;
 const head=new TextEncoder().encode('Path:audio\r\nContent-Type:audio/mpeg\r\n');
 const frame=new Uint8Array(2+head.length+256);frame[0]=head.length>>8;frame[1]=head.length&255;frame.set(head,2);frame[head.length+2]=0xff;frame[head.length+3]=0xfb;
 handlers.get('message')({data:mode==='malformed'?new Uint8Array([0,255]).buffer:frame.buffer});
 if(mode==='complete')handlers.get('message')({data:'Path:turn.end\r\n\r\n'});
 if(mode==='early-close')handlers.get('close')();
 });}};
}
for (const mode of ['complete','malformed','early-close','timeout']) {
 const socket=socketFor(mode);
 const fetcher=async (requestUrl,options)=>{
  assert.equal(requestUrl.hostname,'speech.platform.bing.com');
  assert(!requestUrl.toString().includes('student'));
  assert(!('Authorization' in options.headers));
  assert.equal(options.redirect,'manual');
  return {status:101,webSocket:socket};
 };
 const result=synthesize('student <voice> & text',VOICE_PROFILES.us,{fetcher,timeoutMs:mode==='timeout'?30:1000});
 if(mode==='complete'){assert.equal((await result).length,256);assert(socket.sent[1].includes('student &lt;voice&gt; &amp; text'));}
 else await assert.rejects(result);
 assert(socket.closed,`${mode}: release socket`);
}
console.log('Cloudflare speech checks passed: voices, privacy, CORS, limits, malformed input, framing, XML escaping, completion and timeout cleanup.');
