import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
};

http
  .createServer((request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/takiwaki" || pathname === "/takiwaki.html") {
      response.writeHead(302, { location: "/?legacy=takiwaki" });
      response.end();
      return;
    }
    if (pathname === "/teacher") pathname = "/teacher.html";
    if (pathname === "/phrases") pathname = "/phrases.html";
    if (pathname === "/plans") pathname = "/pricing.html";
    if (pathname === "/pricing-layout-preview") pathname = "/pricing-layout-preview.html";
    if (pathname === "/music-credits") pathname = "/music-credits.html";
    if (pathname.startsWith("/lesson/")) pathname = "/lesson.html";
    if (pathname.endsWith("/")) pathname += "index.html";
    const file = path.join(root, pathname.replace(/^\/+/, ""));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    fs.createReadStream(file).pipe(response);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Local URL: http://127.0.0.1:${port}/`);
  });
