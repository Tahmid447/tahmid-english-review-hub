const avatarRenders = new WeakMap();
export const AVATAR_BUCKET = 'review-avatars';
export const avatarPath = (userId) => `${userId}/avatar.jpg`;
export const avatarReference = (userId) => `storage:${AVATAR_BUCKET}/${avatarPath(userId)}`;
export async function displayProfileAvatar(node, profile, client) {
  if (!node) return;
  const render = {}; avatarRenders.set(node, render);
  const name = profile?.display_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Learner';
  node.textContent = name.trim().slice(0, 1).toUpperCase();
  node.setAttribute('aria-label', name);
  const paths = [avatarPath(profile?.user_id), `${profile?.user_id}/avatar.webp`];
  const path = paths.find(value => profile?.avatar_url === `storage:${AVATAR_BUCKET}/${value}`);
  if (!client || !path) return;
  const { data, error } = await client.storage.from(AVATAR_BUCKET).createSignedUrl(path, 600);
  if (error || !data?.signedUrl || !node.isConnected || avatarRenders.get(node) !== render) return;
  const image = document.createElement('img'); image.alt = name; image.width = 96; image.height = 96;
  image.src = data.signedUrl; image.referrerPolicy = 'no-referrer';
  image.onload = () => { if (node.isConnected && avatarRenders.get(node) === render) node.replaceChildren(image); };
}
export async function compactAvatar(file) {
  const kind = String(file?.type || '').toLowerCase();
  if (!file || !( ['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(kind) || (!kind && /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name || '')))) throw new Error('Choose a photo (JPEG, PNG, WebP or HEIC). / 写真を選んでください。');
  if (file.size > 20 * 1024 * 1024) throw new Error('Choose a photo smaller than 20 MB. / 20MB以下の写真を選んでください。');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url;
    try { await image.decode(); } catch { throw new Error('This photo format cannot be opened here. Choose a JPEG or PNG copy. / この写真形式は読み込めません。JPEG・PNG形式の写真を選んでください。'); }
    const canvas = document.createElement('canvas');
    const size = Math.min(image.naturalWidth, image.naturalHeight);
    if (!size) throw new Error('The photo could not be read. / 写真を読み取れません。');
    // Safari may decode WebP but export PNG for a requested WebP canvas.
    // JPEG is supported by Safari's encoder and keeps large phone photos small.
    for (const width of [384, 256, 192]) {
      canvas.width = canvas.height = width;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Photo processing is unavailable. / 写真の処理を開始できません。');
      context.fillStyle = '#ffffff'; context.fillRect(0,0,width,width);
      context.drawImage(image, (image.naturalWidth-size)/2, (image.naturalHeight-size)/2, size, size, 0, 0, width, width);
      for (const quality of [0.82, 0.65, 0.45]) {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (blob?.type === 'image/jpeg' && blob.size > 0 && blob.size <= 102400) return blob;
      }
    }
    throw new Error('Please choose a simpler photo. / 別の写真を選んでください。');
  } finally { URL.revokeObjectURL(url); }
}
