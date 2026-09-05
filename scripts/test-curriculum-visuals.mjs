import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {curriculumVisualMarkup,visualSpecFor} from '../src/curriculum-visuals.js';
const root=new URL('../',import.meta.url);
let totalBytes=0,count=0;
const ledger=JSON.parse(fs.readFileSync(new URL('assets/curriculum-attributions.json',root),'utf8')).assets;
for(const category of ['words','phrases','phonics']) {
 const data=JSON.parse(fs.readFileSync(new URL(`curriculum/${category}.json`,root),'utf8'));
 assert.equal(data.levels.length,32);
 for(const level of data.levels){
  const fingerprints=new Set();
  for(const item of level.items){
   count++;
   const spec=visualSpecFor(item,category);
   assert.notEqual(spec.source,'missing',`${item.id}: missing illustration`);
   const markup=curriculumVisualMarkup(item,category);
   assert.equal(markup,curriculumVisualMarkup(item,category));
   assert.doesNotMatch(markup,/<script|<foreignObject|onerror=|onload=/i);
   assert.ok(spec.altEn.length>12&&spec.altJa.length>5,`${item.id}: semantic accessible labels required`);
   if(category==='phonics'){
    assert.match(markup,/<svg/);assert.match(markup,/role="img"/);
    assert.notEqual(markup,curriculumVisualMarkup({...item,level:level.level%32+1},category));
   }else{
    assert.equal(item.imageType,'licensed-illustration');assert.ok(!item.icon);
    assert.match(markup,/loading="lazy"/);assert.match(markup,/width="640" height="400"/);
    assert.match(curriculumVisualMarkup(item,category,{quiz:true}),/alt=""/);
    const asset=fs.readFileSync(new URL(spec.src.slice(1),root));totalBytes+=asset.length;
    assert.ok(asset.length<350_000,`${item.id}: asset too large`);
    const source=asset.toString();assert.doesNotMatch(source,/<script|<image|<foreignObject|\son\w+=|(?:href|src)="(?:https?:|data:|blob:)/i);
    const entry=ledger.find(row=>row.filename===spec.src.slice(1));assert.ok(entry,`${item.id}: no attribution`);
    assert.equal(entry.sha256,crypto.createHash('sha256').update(asset).digest('hex'));
    assert.ok(entry.licenseUrl.startsWith('https://creativecommons.org/'));
    // Text, ids and titles cannot make duplicated drawings pass the visual gate.
    const drawing=source.replace(/<(?:title|text)[\s\S]*?<\/(?:title|text)>/g,'').replace(/\bid="[^"]*"/g,'');
    const fingerprint=crypto.createHash('sha256').update(drawing).digest('hex');
    assert.ok(!fingerprints.has(fingerprint),`${item.id}: repeated drawing at level ${level.level}`);fingerprints.add(fingerprint);
   }
  }
 }
}
assert.equal(count,480);assert.equal(ledger.length,448);assert.ok(totalBytes<15_000_000,`Art budget exceeded: ${totalBytes}`);
const build=fs.readFileSync(new URL('scripts/build.mjs',root),'utf8');
assert.ok(!build.includes('"word-visual-map.json"'));assert.ok(!build.includes('"phrase-visual-map.json"'));
console.log(`Visual contract passed: ${count} semantic visuals, 448 licensed asset records, ${Math.round(totalBytes/1024)} KiB, no same-level drawing duplicates. Screenshot quality review is a separate required gate.`);
