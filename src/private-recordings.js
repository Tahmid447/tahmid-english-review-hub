export const FEEDBACK_BUCKET = 'review-feedback-recordings';
const node = (tag, className, text) => { const value=document.createElement(tag); if(className)value.className=className; if(text)value.textContent=text; return value; };

// Keep playback in the document. Opening a signed URL after an asynchronous
// request was blocked as a popup in Safari.
export function privateRecordingPlayer({ client, bucket, path, label, text=(en,ja)=>`${en} / ${ja}` }) {
  const wrap=node('div','private-recording-player');
  const button=node('button','secondary-btn',label || text('Play recording','録音を再生')); button.type='button';
  const audio=node('audio'); audio.controls=true; audio.preload='none'; audio.hidden=true;
  audio.setAttribute('aria-label',label || text('Private recording','非公開の録音'));
  const status=node('p','recording-status'); status.setAttribute('role','status');
  button.onclick=async()=>{
    button.disabled=true; status.textContent=text('Loading recording…','録音を読み込み中…');
    // Start on this gesture to unlock this same element on Safari.
    audio.src='/assets/audio/silence.wav'; void audio.play().catch(()=>{});
    try {
      const {data,error}=await client.storage.from(bucket).createSignedUrl(path,900);
      if(error || !data?.signedUrl) throw error || new Error('missing recording');
      if(!wrap.isConnected)return;
      audio.src=data.signedUrl; audio.hidden=false;
      try { await audio.play(); } catch { status.textContent=text('Ready. Press play below.','準備できました。下の再生ボタンを押してください。'); }
      button.textContent=text('Reload recording','録音を再読み込み');
    } catch { status.textContent=text('Could not load this recording. Please try again.','録音を読み込めませんでした。もう一度お試しください。'); }
    finally { button.disabled=false; }
  };
  audio.onplaying=()=>{ status.textContent=text('Playing','再生中'); };
  audio.onended=()=>{ status.textContent=text('Ready to play again','もう一度再生できます'); };
  audio.onerror=()=>{ if(!audio.hidden)status.textContent=text('Playback failed. Reload the recording and try again.','再生できませんでした。「再読み込み」を押してお試しください。'); };
  wrap.append(button,audio,status); return wrap;
}

const audioType = type => {
  const mime=String(type || '').split(';')[0].toLowerCase();
  return ({'audio/mp4':'mp4','audio/webm':'webm','audio/ogg':'ogg','audio/wav':'wav','audio/x-wav':'wav','audio/mpeg':'mp3'})[mime] ? {mime,extension:({'audio/mp4':'mp4','audio/webm':'webm','audio/ogg':'ogg','audio/wav':'wav','audio/x-wav':'wav','audio/mpeg':'mp3'})[mime]} : null;
};
export function voiceFeedbackEditor({client, teacherId, submissionId, feedback, text=(en,ja)=>`${en} / ${ja}`, onDirty=()=>{}}) {
  const root=node('section','voice-feedback-editor');
  root.append(node('h4','',text('Voice feedback','音声フィードバック')),node('p','',text('Record a pronunciation model, then listen before saving. Up to 3 minutes / 5 MB.','発音のお手本を録音し、聞き直してから保存できます。3分・5MBまで。')));
  const actions=node('div','premium-task-actions');
  const record=node('button','secondary-btn',text('Record feedback','フィードバックを録音'));record.type='button';
  const stop=node('button','quiet-btn',text('Stop','停止'));stop.type='button';stop.disabled=true;
  const choose=node('label','secondary-btn audio-upload-label',text('Choose audio','音声ファイルを選ぶ'));
  const file=node('input');file.type='file';file.accept='audio/mp4,audio/webm,audio/ogg,audio/wav,audio/mpeg,.m4a';choose.append(file);
  const remove=node('button','quiet-btn',text('Remove voice','音声を外す'));remove.type='button';
  const preview=node('audio');preview.controls=true;preview.hidden=true;preview.preload='metadata';
  const existing=node('div');
  let value={path:feedback?.audio_object_path || null,duration:feedback?.audio_duration_seconds || null};
  if(value.path)existing.append(privateRecordingPlayer({client,bucket:FEEDBACK_BUCKET,path:value.path,label:text('Listen to saved feedback','保存済みフィードバックを聞く'),text}));
  const status=node('p','recording-status');status.setAttribute('role','status');
  const time=node('strong','','0:00');
  let blob=null, objectUrl='', recorder=null,stream=null,timer=null,started=0,seconds=0, disposed=false, requesting=false, locked=false;
  const tracksOff=()=>{stream?.getTracks().forEach(track=>track.stop());stream=null;clearInterval(timer);};
  const revoke=()=>{preview.pause();if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl='';};
  const showBlob=(data,duration)=>{
    if(!audioType(data.type) || !data.size || data.size>5242880 || !Number.isFinite(duration) || duration<=0 || duration>180) throw new Error(text('Choose an audio recording up to 3 minutes and 5 MB.','3分・5MB以下の音声を選んでください。'));
    revoke();blob=data;seconds=duration;objectUrl=URL.createObjectURL(blob);preview.src=objectUrl;preview.hidden=false;existing.hidden=true;onDirty();
    status.textContent=text('Ready to listen. Save a private draft, publish, or return with feedback below.','聞き直せます。下のボタンから下書き保存・公開・修正依頼を選んでください。');
  };
  const controls=()=>{
    const busy=requesting || recorder?.state==='recording';
    record.disabled=locked || busy || !globalThis.MediaRecorder || !navigator.mediaDevices?.getUserMedia;
    file.disabled=locked || busy;remove.disabled=locked || busy || !(blob || value.path);stop.disabled=locked || !busy;
  };
  record.onclick=async()=>{
    requesting=true;controls(); status.textContent=text('Allow microphone access to record.','マイクを許可すると録音が始まります。');
    try {
      const acquired=await navigator.mediaDevices.getUserMedia({audio:true});
      if(disposed){acquired.getTracks().forEach(track=>track.stop());return;}
      stream=acquired;
      const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(type=>MediaRecorder.isTypeSupported(type));
      recorder=new MediaRecorder(stream,{...(mime?{mimeType:mime}:{}),audioBitsPerSecond:64000});
      const chunks=[];recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data);};
      recorder.onstop=()=>{
        const duration=Math.min(180,Math.max(.1,(Date.now()-started)/1000));tracksOff();
        if(disposed)return;
        try{showBlob(new Blob(chunks,{type:recorder.mimeType || mime || 'audio/webm'}),duration);}catch(error){status.textContent=error.message;}
        controls();
      };
      recorder.onerror=()=>{tracksOff();status.textContent=text('Recording failed. Please try again.','録音できませんでした。もう一度お試しください。');controls();};
      preview.pause();started=Date.now();recorder.start(1000);status.textContent=text('Recording…','録音中…');
      timer=setInterval(()=>{const elapsed=Math.floor((Date.now()-started)/1000);time.textContent=`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;if(elapsed>=180 && recorder.state==='recording')recorder.stop();},250);
    }catch{tracksOff();status.textContent=text('Microphone unavailable. Allow access or choose an audio file.','マイクを利用できません。許可するか音声ファイルを選んでください。');}
    finally{requesting=false;controls();}
  };
  stop.onclick=()=>{if(recorder?.state==='recording')recorder.stop();};
  file.onchange=async()=>{
    const selected=file.files?.[0];if(!selected)return;
    let probeUrl='';file.disabled=true;
    try{
      const kind=audioType(selected.type) || (/\.m4a$/i.test(selected.name)?audioType('audio/mp4'):null);
      if(!kind || selected.size>5242880)throw new Error(text('Choose a supported audio file up to 5 MB.','5MB以下の音声ファイルを選んでください。'));
      const probe=node('audio');probe.preload='metadata';probeUrl=URL.createObjectURL(selected);
      const duration=await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error(text('Could not read audio length.','音声の長さを読み取れませんでした。'))),10000);probe.onloadedmetadata=()=>{clearTimeout(timeout);resolve(probe.duration);};probe.onerror=()=>{clearTimeout(timeout);reject(new Error(text('Could not read this audio file.','この音声を読み取れませんでした。')));};probe.src=probeUrl;});
      if(!disposed)showBlob(new Blob([selected],{type:kind.mime}),duration);
    }catch(error){status.textContent=error.message;}finally{if(probeUrl)URL.revokeObjectURL(probeUrl);file.value='';controls();}
  };
  remove.onclick=()=>{revoke();blob=null;value={path:null,duration:null};preview.hidden=true;existing.hidden=true;onDirty();status.textContent=text('Voice removed from this draft. Save below to apply.','下書きから音声を外しました。下の保存ボタンで確定してください。');controls();};
  actions.append(record,stop,choose,remove);root.append(actions,time,existing,preview,status);controls();
  return {root,
    hasAudio:()=>Boolean(blob || value.path),
    isRecording:()=>requesting || recorder?.state==='recording',
    setBusy:busy=>{locked=busy;controls();},
    async prepare(){
      if(!blob)return value;
      const kind=audioType(blob.type);const path=`${teacherId}/${submissionId}/${crypto.randomUUID()}.${kind.extension}`;
      const {error}=await client.storage.from(FEEDBACK_BUCKET).upload(path,blob,{contentType:kind.mime,cacheControl:'0',upsert:false});
      if(error)throw error;
      return {path,duration:seconds,uploaded:true};
    },
    async discardUploaded(audio){if(audio?.uploaded)await client.storage.from(FEEDBACK_BUCKET).remove([audio.path]);},
    async saved(audio){if(feedback?.audio_object_path && feedback.audio_object_path!==audio.path)await client.storage.from(FEEDBACK_BUCKET).remove([feedback.audio_object_path]);blob=null;value=audio;},
    dispose(){disposed=true;requesting=false;if(recorder?.state==='recording')recorder.stop();tracksOff();revoke();root.querySelectorAll('audio').forEach(audio=>audio.pause());},
  };
}
