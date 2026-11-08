// Shows the built site (the "out" folder) on this computer, the way a static hosting serves it.
// Usage: npm run preview
// If the build was made for a sub-folder, pass it too: node scripts/preview.mjs /ASCEND-Site-Portfolio
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const OUT = path.resolve("out");
const BASE = process.argv[2] ?? "";
const PORT = 3001;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const isFile = (file) => fs.existsSync(file) && fs.statSync(file).isFile();
const send = (res, code, file) => {
  res.writeHead(code, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(file).pipe(res);
};
const notFound = (res) => send(res, 404, path.join(OUT, "404.html"));

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    if (BASE && pathname === "/") {
      res.writeHead(302, { Location: `${BASE}/` });
      return res.end();
    }
    if (BASE && pathname !== BASE && !pathname.startsWith(`${BASE}/`)) return notFound(res);

    const target = path.join(OUT, pathname.slice(BASE.length));
    if (!target.startsWith(OUT)) return notFound(res);
    if (isFile(target)) return send(res, 200, target);
    if (isFile(path.join(target, "index.html"))) {
      if (!pathname.endsWith("/")) {
        res.writeHead(301, { Location: `${pathname}/${url.search}` });
        return res.end();
      }
      return send(res, 200, path.join(target, "index.html"));
    }
    return notFound(res);
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}${BASE}/`));
