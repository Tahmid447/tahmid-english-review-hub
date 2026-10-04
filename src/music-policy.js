import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js?v=20260911-mobile2';

let pending;
let loadedAt = 0;

export function loadGlobalMusicAvailability({ refresh = false } = {}) {
  if (refresh || Date.now() - loadedAt > 30000) pending = undefined;
  return pending ||= (async () => {
    loadedAt = Date.now();
    try {
      // This existing public RPC returns site defaults when called anonymously,
      // even if the browser's signed-in account has individual feature settings.
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/review_my_experience`, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: '{}',
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return false;
      const data = await response.json();
      return Boolean(data?.features) && data.features.show_music !== false;
    } catch {
      return false;
    }
  })();
}
