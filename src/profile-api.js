export const AVATAR_BUCKET = 'review-avatars';
export const avatarReference = (userId) => `storage:${AVATAR_BUCKET}/${userId}/avatar.webp`;
export async function displayProfileAvatar(node, profile, client) {
  if (!node) return;
  const name = profile?.display_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Learner';
  node.textContent = name.trim().slice(0, 1).toUpperCase();
  node.setAttribute('aria-label', name);
  const reference = avatarReference(profile?.user_id);
  if (!client || profile?.avatar_url !== reference) return;
  const { data, error } = await client.storage.from(AVATAR_BUCKET).createSignedUrl(`${profile.user_id}/avatar.webp`, 600);
  if (error || !data?.signedUrl || !node.isConnected) return;
  const image = document.createElement('img'); image.alt = name; image.width = 96; image.height = 96;
  image.src = data.signedUrl; image.referrerPolicy = 'no-referrer';
  image.onload = () => { if (node.isConnected) node.replaceChildren(image); };
}
export async function compactAvatar(file) {
  if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG or WebP photo. / JPEG・PNG・WebPの写真を選んでください。');
  if (file.size > 8 * 1024 * 1024) throw new Error('Choose a photo smaller than 8 MB. / 8MB以下の写真を選んでください。');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 384;
    const size = Math.min(image.naturalWidth, image.naturalHeight);
    if (!size) throw new Error('The photo could not be read. / 写真を読み取れません。');
    canvas.getContext('2d').drawImage(image, (image.naturalWidth-size)/2, (image.naturalHeight-size)/2, size, size, 0, 0, 384, 384);
    for (const quality of [0.82, 0.65, 0.45]) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
      if (blob?.type === 'image/webp' && blob.size <= 102400) return blob;
    }
    throw new Error('Please choose a simpler photo. / 別の写真を選んでください。');
  } finally { URL.revokeObjectURL(url); }
}
