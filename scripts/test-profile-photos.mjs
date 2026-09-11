import assert from 'node:assert/strict';
import { compactAvatar, avatarPath, avatarReference } from '../src/profile-api.js';
const originalImage=globalThis.Image, originalDocument=globalThis.document;
const requested=[];let releases=0;const oldRevoke=URL.revokeObjectURL;
URL.revokeObjectURL=(url)=>{releases++;oldRevoke(url);};
globalThis.Image=class { naturalWidth=4032;naturalHeight=3024;async decode(){} };
globalThis.document={createElement(tag){assert.equal(tag,'canvas');return {width:0,height:0,getContext(){return {fillRect(){},drawImage(){}};},toBlob(callback,type){requested.push(type);callback(new Blob(['encoded photo'],{type:type==='image/webp'?'image/png':type}));}};}};
try{
 const result=await compactAvatar(new Blob(['large phone photo'],{type:'image/jpeg'}));
 assert.equal(result.type,'image/jpeg');assert.ok(result.size<=102400);assert.deepEqual(requested,['image/jpeg']);assert.equal(releases,1);
 assert.equal(avatarPath('student'),'student/avatar.jpg');assert.equal(avatarReference('student'),'storage:review-avatars/student/avatar.jpg');
 await assert.rejects(compactAvatar(new Blob(['<svg>'],{type:'image/svg+xml'})),/Choose a photo/);
 globalThis.Image=class {async decode(){throw new Error('unsupported');}};
 await assert.rejects(compactAvatar(new Blob(['heic'],{type:'image/heic'})),/JPEG or PNG/);assert.equal(releases,2);
 console.log('Profile encoding passed: JPEG encoder fallback compatibility, bounded output, safe formats, unreadable photo guidance and object URL cleanup.');
}finally{globalThis.Image=originalImage;globalThis.document=originalDocument;URL.revokeObjectURL=oldRevoke;}
