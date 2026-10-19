import { createServer } from 'node:http';
import handler from '../api/site.mjs';
const port = Number(process.env.PORT || 4177);
createServer((req, res) => {
  handler(req, res).catch(() => {
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não foi possível abrir o material.');
  });
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
