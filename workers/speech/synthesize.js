// Native Workers transport for the same Edge speech protocol used by the
// pinned edge-tts-universal 1.4.0 backend. No Node sockets, proxy or Netlify.
import { DRM } from "edge-tts-universal/webworker";
const CLIENT = "6A5AA1D4EAFF4E9FB37E23D68491D6F4"; // Public upstream client identifier, not an account secret.
const VERSION = "143.0.3650.75";
const escapeXML = text => text.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"})[c]);
const id = () => crypto.randomUUID().replaceAll("-", "");

export async function synthesize(text, profile, { fetcher = fetch, timeoutMs = 10000 } = {}) {
  const controller = new AbortController();
  let socket;
  let rejectAudio;
  const timer = setTimeout(() => {
    controller.abort();
    rejectAudio?.(new Error("Speech timeout"));
    try { socket?.close(1000, "timeout"); } catch {}
  }, timeoutMs);
  try {
    const url = new URL("https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1");
    url.search = new URLSearchParams({ TrustedClientToken: CLIENT, "Sec-MS-GEC": await DRM.generateSecMsGec(), "Sec-MS-GEC-Version": `1-${VERSION}`, ConnectionId: id() });
    const response = await fetcher(url, {
      headers: DRM.headersWithMuid({ Upgrade: "websocket", Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold", "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0`, "Accept-Language": "en-US,en;q=0.9", "Cache-Control": "no-cache" }),
      signal: controller.signal,
      redirect: "manual",
    });
    socket = response.webSocket;
    if (response.status !== 101 || !socket) throw new Error("Speech connection failed");
    if (controller.signal.aborted) throw new Error("Speech timeout");
    return await new Promise((resolve, reject) => {
      rejectAudio = reject;
      const chunks = [];
      let bytes = 0;
      let finished = false;
      const fail = () => { if (!finished) { finished = true; reject(new Error("Incomplete speech")); } };
      socket.binaryType = "arraybuffer";
      socket.addEventListener("error", fail);
      socket.addEventListener("close", fail);
      socket.addEventListener("message", event => {
        if (finished) return;
        try {
          if (typeof event.data === "string") {
            const headers = event.data.split("\r\n\r\n", 1)[0];
            if (/(?:^|\r\n)Path:turn.end(?:\r\n|$)/.test(headers)) {
              if (bytes < 128) return fail();
              const audio = new Uint8Array(bytes);
              let offset = 0;
              for (const chunk of chunks) { audio.set(chunk, offset); offset += chunk.length; }
              if (!(audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0) && !(audio[0] === 0x49 && audio[1] === 0x44 && audio[2] === 0x33)) return fail();
              finished = true;
              resolve(audio);
            }
            return;
          }
          const data = new Uint8Array(event.data);
          if (data.length < 2) return fail();
          const headerLength = (data[0] << 8) | data[1];
          if (headerLength + 2 > data.length) return fail();
          const headers = new TextDecoder().decode(data.subarray(2, headerLength + 2));
          if (!/(?:^|\r\n)Path:audio(?:\r\n|$)/.test(headers)) return fail();
          const chunk = data.subarray(headerLength + 2);
          if (!chunk.length) return; // Upstream may send an empty final frame.
          if (!/(?:^|\r\n)Content-Type:audio\/mpeg(?:\r\n|$)/.test(headers)) return fail();
          bytes += chunk.length;
          if (bytes > 1024 * 1024) return fail();
          chunks.push(chunk);
        } catch { fail(); }
      });
      socket.accept();
      const stamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, -1);
      socket.send(`X-Timestamp:${stamp}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${JSON.stringify({context:{synthesis:{audio:{metadataoptions:{sentenceBoundaryEnabled:"false",wordBoundaryEnabled:"false"},outputFormat:"audio-24khz-48kbitrate-mono-mp3"}}}})}\r\n`);
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${profile.language}'><voice name='${profile.voiceId}'><prosody pitch='${profile.pitch}' rate='${profile.rate}' volume='${profile.volume}'>${escapeXML(text)}</prosody></voice></speak>`;
      socket.send(`X-RequestId:${id()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${stamp}Z\r\nPath:ssml\r\n\r\n${ssml}`);
    });
  } finally {
    clearTimeout(timer);
    try { socket?.close(1000, "complete"); } catch {}
  }
}
