import { mkdir, writeFile } from 'node:fs/promises';
// Only this directory is public on Vercel. Content stays inside the function.
await mkdir('public', { recursive: true });
await writeFile('public/robots.txt', 'User-agent: *\nDisallow: /\n');
console.log('Configuração pronta: conteúdo servido pela função com autenticação.');
