import { connect } from 'cloudflare:sockets';
import { sendGoogleMail } from './smtp.js';
import { createHandler, authorized } from './router.js';
import { processOwnerEvents } from './queue.js';
const send = mail => sendGoogleMail(connect, mail);
const diagnostic = createHandler(send);
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/process' || request.method !== 'POST') return diagnostic(request,env);
    const headers = {'Content-Type':'application/json','Cache-Control':'no-store'};
    if (!await authorized(request,env)) return new Response('{"error":"Unauthorized"}',{status:401,headers});
    try { return new Response(JSON.stringify(await processOwnerEvents(env,send)),{headers}); }
    catch { return new Response('{"error":"Owner activity processing failed"}',{status:502,headers}); }
  },
};
