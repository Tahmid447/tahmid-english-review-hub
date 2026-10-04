import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const storage = new Map(), events = new EventTarget();
globalThis.window = {
  localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v) },
  addEventListener: (...args) => events.addEventListener(...args),
  removeEventListener: (...args) => events.removeEventListener(...args),
  dispatchEvent: event => events.dispatchEvent(event),
};
const instances = [];
globalThis.Audio = class {
  constructor(src) { this.src=src; this.paused=true; instances.push(this); }
  play() { this.paused=false; return Promise.resolve(); }
  pause() { this.paused=true; }
  setAttribute() {}
};
const store = await import('../src/store.js?v=20260911-mobile2');
const audio = await import('../src/audio.js?v=20260911-mobile2');
store.setStorageUser('student-a');
assert.equal((await audio.syncAmbientFromSettings()).played,false,'Do not start before access is resolved.');
assert.equal(instances.length,0,'No audio is created during loading.');
audio.setAmbientAvailability(true);
await audio.syncAmbientFromSettings();
assert.equal(instances.at(-1).paused,false);
store.updateSettings({ambientEnabled:false});
assert.equal(instances.at(-1).paused,true,'Late remote OFF stops actual playback, not just button text.');
store.setStorageUser(null);
store.setStorageUser('student-a');
assert.equal(store.getSettings().ambientEnabled,false,'OFF survives leaving and re-entering the account.');
assert.equal((await audio.syncAmbientFromSettings()).played,false);
store.updateSettings({ambientEnabled:true});
await audio.syncAmbientFromSettings();
audio.setAmbientAvailability(false);
assert.equal(instances.at(-1).paused,true,'Teacher OFF stops music immediately.');
assert.equal((await audio.setAmbientPlayback(true,{userGesture:true})).played,false,'A learner gesture cannot bypass teacher OFF.');
assert.equal(store.getSettings().ambientEnabled,true,'Teacher policy does not overwrite the personal preference.');
store.updateSettings({ambientEnabled:false});
audio.setAmbientAvailability(true);
assert.equal((await audio.syncAmbientFromSettings()).played,false,'Teacher ON never overrides a personal OFF.');
assert.equal(store.getSettings().voiceEnabled,true,'Pronunciation stays independent.');
assert.equal(store.getSettings().sfxEnabled,true,'Effects stay independent.');
store.setStorageUser('student-b');
assert.equal(store.getSettings().ambientEnabled,true,'Different accounts retain their own preferences.');

const hub = await readFile(new URL('../src/hub.js',import.meta.url),'utf8');
const phrase = await readFile(new URL('../src/phrases.js',import.meta.url),'utf8');
assert(!hub.slice(hub.indexOf('function bindSettings()'),hub.indexOf('installPlayfulInteractions();')).includes('syncAmbientFromSettings()'));
assert(!phrase.slice(phrase.indexOf('function bindSettings()'),phrase.indexOf('installPlayfulInteractions();')).includes('syncAmbientFromSettings()'));
console.log('Music controls: delayed OFF, sign-in scope, teacher gate, personal OFF and independent voice/SFX passed.');
