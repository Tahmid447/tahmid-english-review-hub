import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(moduleDirectory, "..", "demo-dist");
const allowedHostnames = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const types = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
});

const routePath = (pathname) => {
  if (pathname === "/teacher") return "/teacher.html";
  if (["/learn", "/words", "/phonics"].includes(pathname)) return "/learn.html";
  if (pathname === "/") return null;
  if (pathname.endsWith("/")) return `${pathname}index.html`;
  return pathname;
};

export function createDemoServer({ root = defaultRoot } = {}) {
  const contentRoot = path.resolve(root);
  return http.createServer((request, response) => {
    let requestUrl;
    try {
      requestUrl = new URL(request.url || "/", `http://${request.headers.host || ""}`);
    } catch {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }
    if (!allowedHostnames.has(requestUrl.hostname.toLowerCase())) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("This demo is available only on localhost.");
      return;
    }
    if (requestUrl.pathname === "/") {
      response.writeHead(302, {
        location: "/learn?category=words&level=1&persona=full",
        "cache-control": "no-store",
      });
      response.end();
      return;
    }
    let pathname;
    try {
      pathname = routePath(decodeURIComponent(requestUrl.pathname));
    } catch {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }
    const file = path.resolve(contentRoot, `.${pathname}`);
    const insideRoot = file === contentRoot || file.startsWith(`${contentRoot}${path.sep}`);
    if (!insideRoot || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "x-robots-tag": "noindex, nofollow, noarchive",
      "content-security-policy": "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https://*.supabase.co; worker-src 'none'; form-action 'none'",
    });
    fs.createReadStream(file).pipe(response);
  });
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  if (!fs.existsSync(path.join(defaultRoot, "learn.html"))) {
    throw new Error("demo-dist is missing. Run npm run build:demo first.");
  }
  const port = Number(process.env.DEMO_PORT || 4174);
  createDemoServer().listen(port, "127.0.0.1", () => {
    console.log(`Local curriculum demo: http://127.0.0.1:${port}/`);
    console.log("Local-only mode: Supabase authentication, RLS and production output are not modified.");
  });
}
