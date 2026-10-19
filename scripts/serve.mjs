import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
await import('./build.mjs');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.jpg':'image/jpeg', '.txt':'text/plain; charset=utf-8' };
const allowed = new Set(['index.html','raiox.html','login.html','login.css','login.js','access.js','styles.css','script.js','robots.txt','assets/multiplix-symbol.jpg','assets/multiplix-wordmark.jpg']);
createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (!allowed.has(file)) { res.writeHead(404); res.end('Página não encontrada.'); return; }
  try {
    const body = await readFile(join(process.cwd(), 'public', file));
    res.writeHead(200, { 'Content-Type': mime[file.slice(file.lastIndexOf('.'))] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(body);
  } catch { res.writeHead(404); res.end('Página não encontrada.'); }
}).listen(4177, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4177'));
