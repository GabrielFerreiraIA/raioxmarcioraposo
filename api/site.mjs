import { createHmac, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const duration = 8 * 60 * 60;
const cookieName = 'multiplix_raiox';
const attempts = new Map();
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/script.js', ['script.js', 'text/javascript; charset=utf-8']],
  ['/assets/multiplix-symbol.jpg', ['assets/multiplix-symbol.jpg', 'image/jpeg']],
  ['/assets/multiplix-wordmark.jpg', ['assets/multiplix-wordmark.jpg', 'image/jpeg']],
]);
const publicAssets = new Map([
  ['/login.css', ['login.css', 'text/css; charset=utf-8']],
  ['/assets/multiplix-symbol.jpg', ['assets/multiplix-symbol.jpg', 'image/jpeg']],
  ['/assets/multiplix-wordmark.jpg', ['assets/multiplix-wordmark.jpg', 'image/jpeg']],
]);
const securityHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'",
};
function safeEqual(a, b) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}
function sign(payload) {
  return createHmac('sha256', process.env.SESSION_SECRET).update(`${process.env.RAIOX_PASSWORD}\0${payload}`).digest('base64url');
}
function sessionValid(req) {
  const cookie = (req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`));
  if (!cookie) return false;
  const token = cookie.slice(cookieName.length + 1);
  const [expiry, nonce, signature, extra] = token.split('.');
  if (extra || !/^\d{10}$/.test(expiry || '') || !/^[a-f0-9]{32}$/.test(nonce || '') || !signature) return false;
  const now = Math.floor(Date.now() / 1000);
  return Number(expiry) > now && Number(expiry) <= now + duration && safeEqual(signature, sign(`${expiry}.${nonce}`));
}
function setCookie(req, res, value, maxAge) {
  const secure = process.env.VERCEL || req.headers['x-forwarded-proto'] === 'https';
  res.setHeader('Set-Cookie', `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`);
}
function redirect(res, location) {
  res.statusCode = 303;
  res.setHeader('Location', location);
  res.end();
}
function send(res, status, type, body, head = false) {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  res.end(head ? undefined : body);
}
async function loginPage(error = '', status = 200) {
  const message = error ? `<p class="error" role="alert">${error}</p>` : '';
  const template = await readFile(join(process.cwd(), 'dist/login.html'), 'utf8');
  return { status, html: template.replace('{{ERROR}}', message) };
}
async function readPassword(req) {
  if (req.body !== undefined) {
    if (Buffer.isBuffer(req.body) || typeof req.body === 'string') {
      const text = req.body.toString();
      if (Buffer.byteLength(text) > 4096) throw new Error('body');
      return new URLSearchParams(text).get('password') || '';
    }
    return typeof req.body.password === 'string' ? req.body.password : '';
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) throw new Error('body');
    chunks.push(chunk);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString()).get('password') || '';
}
export default async function handler(req, res) {
  for (const [name, value] of Object.entries(securityHeaders)) res.setHeader(name, value);
  const url = new URL(req.url, 'http://localhost');
  // Vercel forwards the original path through this explicit rewrite parameter.
  const routedPath = req.query?.route ?? url.searchParams.get('route');
  let pathname;
  try { pathname = routedPath !== null && routedPath !== undefined ? '/' + String(routedPath).replace(/^\/+/, '') : decodeURIComponent(url.pathname); }
  catch { return send(res, 400, 'text/plain; charset=utf-8', 'Endereço inválido.'); }
  if (!['GET', 'HEAD', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD, POST');
    return send(res, 405, 'text/plain; charset=utf-8', 'Método não permitido.');
  }
  if (publicAssets.has(pathname) && ['GET', 'HEAD'].includes(req.method)) {
    const [file, type] = publicAssets.get(pathname);
    return send(res, 200, type, await readFile(join(process.cwd(), 'dist', file)), req.method === 'HEAD');
  }
  if (!process.env.RAIOX_PASSWORD || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return send(res, 503, 'text/html; charset=utf-8', '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Acesso em preparação</title><p>O acesso está em preparação. Tente novamente em instantes.</p></html>');
  }
  if (req.method === 'POST') {
    const origin = req.headers.origin;
    if (origin) {
      try { if (new URL(origin).host !== req.headers.host) return send(res, 403, 'text/plain; charset=utf-8', 'Origem não permitida.'); }
      catch { return send(res, 403, 'text/plain; charset=utf-8', 'Origem não permitida.'); }
    }
    if (pathname === '/logout') {
      setCookie(req, res, '', 0);
      return redirect(res, '/');
    }
    if (pathname !== '/login') return send(res, 404, 'text/plain; charset=utf-8', 'Página não encontrada.');
    if (!(req.headers['content-type'] || '').startsWith('application/x-www-form-urlencoded')) return send(res, 415, 'text/plain; charset=utf-8', 'Formato não aceito.');
    // Per-instance throttling complements the hosting provider's firewall.
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
    const previous = attempts.get(ip);
    if (previous?.count >= 6) {
      res.setHeader('Retry-After', String(Math.ceil((previous.until - now) / 1000)));
      const page = await loginPage('Muitas tentativas. Aguarde alguns minutos para tentar novamente.', 429);
      return send(res, page.status, 'text/html; charset=utf-8', page.html);
    }
    let password;
    try { password = await readPassword(req); }
    catch { return send(res, 413, 'text/plain; charset=utf-8', 'Solicitação muito grande.'); }
    if (password.length > 256 || !safeEqual(password, process.env.RAIOX_PASSWORD)) {
      attempts.set(ip, { count: (previous?.count || 0) + 1, until: previous?.until || now + 10 * 60 * 1000 });
      await new Promise(resolve => setTimeout(resolve, 600));
      const page = await loginPage('Senha incorreta. Confira a senha e tente novamente.', 401);
      return send(res, page.status, 'text/html; charset=utf-8', page.html);
    }
    attempts.delete(ip);
    const payload = `${Math.floor(now / 1000) + duration}.${randomBytes(16).toString('hex')}`;
    setCookie(req, res, `${payload}.${sign(payload)}`, duration);
    return redirect(res, '/');
  }
  if (!sessionValid(req)) {
    if (pathname !== '/' && pathname !== '/login' && pathname !== '/index.html') return redirect(res, '/');
    const page = await loginPage();
    return send(res, page.status, 'text/html; charset=utf-8', page.html, req.method === 'HEAD');
  }
  if (pathname === '/login') return redirect(res, '/');
  const file = files.get(pathname);
  if (!file) return send(res, 404, 'text/plain; charset=utf-8', 'Página não encontrada.');
  try { return send(res, 200, file[1], await readFile(join(process.cwd(), 'dist', file[0])), req.method === 'HEAD'); }
  catch { return send(res, 500, 'text/plain; charset=utf-8', 'Não foi possível abrir o material.'); }
}
