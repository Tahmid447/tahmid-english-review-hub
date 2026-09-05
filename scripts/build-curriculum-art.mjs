import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { renderWordVisualCue } from './word-visual-cues.mjs';
import { renderPhraseScene } from './phrase-scene-cues.mjs';
const root = path.resolve(import.meta.dirname,'..');
const sourceRoot = process.env.MULBERRY_SOURCE || '/tmp/tahmid-mulberry-source/EN';
const sourceCommit='9cbab9f400c5de44e2bc58839cca07294aadb086';
const target=path.join(root,'assets/curriculum');fs.mkdirSync(target,{recursive:true});
const ledgerPath=path.join(root,'assets/curriculum-attributions.json');
const previousAssets=fs.existsSync(ledgerPath)?JSON.parse(fs.readFileSync(ledgerPath,'utf8')).assets.map(row=>row.filename):[];
const contentBoxes=new Map();
const originalBoxes=new Map();
// Authored symbols have very different amounts of transparent/white margin.
// Measure visible content once so a train, pencil and face receive equal visual
// weight. An explicit pedagogical crop always takes precedence over auto-fit.
const allSpecs=['word','phrase'].flatMap(kind=>Object.values(JSON.parse(fs.readFileSync(path.join(root,`scripts/${kind}-visual-map.json`),'utf8'))));
const sourceFiles=[...new Set(allSpecs.flatMap(spec=>spec.assets||[]))];
for(let start=0;start<sourceFiles.length;start+=6){
  await Promise.all(sourceFiles.slice(start,start+6).map(async file=>{
    const input=fs.readFileSync(path.join(sourceRoot,file));
    const box=input.toString().match(/viewBox="([^"]+)"/)?.[1]?.split(/[ ,]+/).map(Number);
    if(!box)throw new Error(`Missing source viewBox ${file}`);
    originalBoxes.set(file,box);
    const {data,info}=await sharp(input).resize({width:640}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let x0=info.width,y0=info.height,x1=-1,y1=-1;
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
      const i=(y*info.width+x)*4;
      if(data[i+3]>24&&Math.min(data[i],data[i+1],data[i+2])<246){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    }
    if(x1<0)throw new Error(`Empty source illustration ${file}`);
    const pad=10;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(info.width,x1+pad);y1=Math.min(info.height,y1+pad);
    contentBoxes.set(file,[box[0]+box[2]*x0/info.width,box[1]+box[3]*y0/info.height,box[2]*(x1-x0)/info.width,box[3]*(y1-y0)/info.height].join(' '));
  }));
}
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=(x,y,label,size=18,color='#294740',anchor='middle')=>`<text x="${x}" y="${y}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}" font-weight="600" text-anchor="${anchor}">${esc(label)}</text>`;
function art(file,x,y,w,h,prefix,crop) {
  if(!/^[A-Za-z0-9_, -]+\.svg$/.test(file)||file.includes('..'))throw new Error(`Invalid source path: ${file}`);
  let raw=fs.readFileSync(path.join(sourceRoot,file),'utf8');
  if(/<script|<foreignObject|<image|onload=|onerror=|https?:\/\/(?!www.w3.org|creativecommons.org|purl.org|inkscape.org|sodipodi.sourceforge.net)/i.test(raw.replace(/<metadata[\s\S]*?<\/metadata>/g,''))) {
    if(/<script|<foreignObject|<image|onload=|onerror=/i.test(raw))throw new Error(`Unsafe asset ${file}`);
  }
  let box=raw.match(/viewBox="([^"]+)"/)?.[1];if(!box)throw new Error(`Missing viewBox ${file}`);
  if(crop){const [bx,by,bw,bh]=box.split(/[ ,]+/).map(Number);box=[bx+bw*crop.x,by+bh*crop.y,bw*crop.width,bh*crop.height].join(' ');}
  else box=contentBoxes.get(file)||box;
  let body=raw.slice(raw.indexOf('>')+1,raw.lastIndexOf('</svg>')).replace(/<metadata[\s\S]*?<\/metadata>/g,'').replace(/<title[\s\S]*?<\/title>/g,'').replace(/<desc[\s\S]*?<\/desc>/g,'');
  const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  for(const id of ids){body=body.replaceAll(`id="${id}"`,`id="${prefix}-${id}"`).replaceAll(`#${id})`,`#${prefix}-${id})`).replaceAll(`href="#${id}"`,`href="#${prefix}-${id}"`);}
  if(crop){const [cx,cy,cw,ch]=box.split(/[ ,]+/).map(Number);body=`<defs><clipPath id="${prefix}-crop"><rect x="${cx}" y="${cy}" width="${cw}" height="${ch}"/></clipPath></defs><g clip-path="url(#${prefix}-crop)">${body}</g>`;}
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${box}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
}
function background(type) {
  const common='<rect width="640" height="400" rx="22" fill="#fbf8f1"/>';
  if(!type)return common;
  const window='<rect x="438" y="35" width="135" height="135" rx="5" fill="#dfeeed" stroke="#9ebeb7" stroke-width="3"/><path d="M505 37v131M441 103h129" stroke="#fbf8f1" stroke-width="8"/>';
  const ground='<path d="M0 307h640v93H0z" fill="#ece8da"/><path d="M0 307h640" stroke="#d6d3c5" stroke-width="2"/>';
  if(['home','classroom','office','studio','cafe','shop'].includes(type)) return common+window+ground+(type==='classroom'?'<rect x="42" y="33" width="228" height="115" rx="5" fill="#739d8f" stroke="#496f60" stroke-width="5"/><path d="M64 127h178" stroke="#dce7cf" stroke-width="4"/>':'');
  if(['park','street'].includes(type))return common+'<path d="M0 245Q130 210 295 247T640 237v163H0z" fill="#e1ebd7"/><path d="M0 349Q223 270 640 330v70H0z" fill="#e8e3d6"/>';
  return common;
}
function diagram(spec) {
  const d=String(spec.diagram||'').replace(/^colour-/,'color-');
  const colors={red:'#d85145',blue:'#4183cc',yellow:'#f2c447',green:'#58a379',black:'#253235',white:'#ffffff'};
  const c=d.replace(/^color[-:]/,'');
  if(colors[c])return `<path d="M165 232c-18-75 16-134 105-142s187 26 203 87-16 128-111 132-180-6-197-77z" fill="${colors[c]}" stroke="#567067" stroke-width="3"/><path d="M213 145q52-29 112-17" stroke="#fff" opacity=".45" stroke-width="13" stroke-linecap="round" fill="none"/>`;
  const shape=d.replace(/^shape[-:]/,'');
  if(shape==='circle')return '<circle cx="320" cy="195" r="115" fill="#72b5a3" stroke="#294740" stroke-width="5"/>';
  if(shape==='square')return '<path d="M212 87h216v216H212z" fill="#dd9a77" stroke="#294740" stroke-width="5"/>';
  if(shape==='star')return '<path d="m320 66 36 84 92 8-70 64 22 91-80-49-80 49 22-91-70-64 92-8z" fill="#f2c447" stroke="#294740" stroke-width="5" stroke-linejoin="round"/>';
  if(shape==='line')return '<path d="M148 263 492 127" stroke="#568fae" stroke-width="12" stroke-linecap="round"/>';
  throw new Error(`Missing explicit diagram design: ${d}`);
}
function compose(spec,id) {
  let body=background(spec.background);
  const cue=renderPhraseScene(spec,{art,text,esc}) || renderWordVisualCue(spec,{art,text,esc});
  if(cue)return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400" role="img"><title>${esc(spec.altEn)}</title>${body}${cue}</svg>`;
  if(spec.diagram&&!spec.assets?.length)body+=diagram(spec);
  const files=spec.assets||[];
  const labels=spec.labels||[];
  const n=files.length;
  if(n===1){body+=art(files[0],92,21,456,322,'a',spec.crop);if(labels[0])body+=text(320,365,labels[0],18);}
  else if(n>1){
    const count=n;
    const panelWidth=560/count;
    files.forEach((file,i)=>{
      const x=40+i*panelWidth;
      if(spec.layout==='contrast'||spec.layout==='sequence')body+=`<rect x="${x+3}" y="45" width="${panelWidth-12}" height="270" rx="16" fill="${i%2?'#eef3e9':'#ffffff'}" stroke="#e0e5d8"/>`;
      body+=art(file,x+3,49,panelWidth-12,264,`s${i}`);
      if(labels[i])body+=text(x+panelWidth/2,346,labels[i],count>2?15:18);
      if(spec.layout==='sequence' && i<count-1)body+=`<path d="M${x+panelWidth-12} 180h27m-10-9 10 9-10 9" stroke="#488779" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
  }
  if(spec.highlight&&n===1){
    const {x,y,r}=spec.highlight;const [ox,oy,ow,oh]=originalBoxes.get(files[0]);
    const [bx,by,bw,bh]=spec.crop?[ox+ow*spec.crop.x,oy+oh*spec.crop.y,ow*spec.crop.width,oh*spec.crop.height]:contentBoxes.get(files[0]).split(/[ ,]+/).map(Number);
    const scale=Math.min(456/bw,322/bh);const cx=92+(456-bw*scale)/2+(ox+ow*x-bx)*scale;const cy=21+(322-bh*scale)/2+(oy+oh*y-by)*scale;const radius=oh*r*scale;
    body+=`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#d55743" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${radius+5}" fill="none" stroke="#fff" stroke-width="2"/>`;
  }
  if(n===0&&!spec.diagram)throw new Error(`No artwork: ${id}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400" role="img"><title>${esc(spec.altEn)}</title>${body}</svg>`;
}
const ledger=[];
for(const [category,mapName] of [['words','word-visual-map.json'],['phrases','phrase-visual-map.json']]){
  const mapPath=path.join(root,'scripts',mapName);if(!fs.existsSync(mapPath))throw new Error(`Missing curated map: ${mapName}`);
  const specs=JSON.parse(fs.readFileSync(mapPath,'utf8'));
  const p=path.join(root,'curriculum',category+'.json');const data=JSON.parse(fs.readFileSync(p,'utf8'));
  for(const item of data.levels.flatMap(l=>l.items)){
    const spec=specs[item.id];if(!spec?.altEn||!spec?.altJa)throw new Error(`No reviewed visual spec for ${item.id}`);
    const svg=compose(spec,item.id);const hash=crypto.createHash('sha256').update(svg).digest('hex').slice(0,16);const filename=`${category}-${hash}.svg`;
    fs.writeFileSync(path.join(target,filename),svg);
    item.imageType='licensed-illustration';item.icon='';
    item.visual={src:'/assets/curriculum/'+filename,kind:spec.layout||'single',altEn:spec.altEn,altJa:spec.altJa,sceneEn:spec.sceneEn||'',sceneJa:spec.sceneJa||''};
    ledger.push({filename:'assets/curriculum/'+filename,itemId:item.id,author:'Garry Paxton / Steve Lee; composition by Tahmid English Club',license:spec.assets?.length?'CC-BY-SA-4.0':'CC0-1.0',licenseUrl:spec.assets?.length?'https://creativecommons.org/licenses/by-sa/4.0/':'https://creativecommons.org/publicdomain/zero/1.0/',originalUrls:(spec.assets||[]).map(f=>`https://github.com/mulberrysymbols/mulberry-symbols/blob/${sourceCommit}/EN/${encodeURIComponent(f)}`),modifications:'Illustrations arranged with original background and teaching cues; no AI image generation.',sha256:crypto.createHash('sha256').update(svg).digest('hex')});
  }
  fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n');
}
fs.writeFileSync(path.join(root,'assets/curriculum-attributions.json'),JSON.stringify({sourceCommit,assets:ledger},null,2)+'\n');
const currentPaths=new Set(ledger.map(row=>row.filename));
for(const file of previousAssets)if(!currentPaths.has(file)&&/^assets\/curriculum\/(words|phrases)-[a-f0-9]{16}\.svg$/.test(file))fs.rmSync(path.join(root,file),{force:true});
console.log(`Built ${ledger.length} individually specified learning illustrations, with source and licence for each.`);
