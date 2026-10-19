import { mkdir, writeFile, cp, copyFile } from 'node:fs/promises';
await mkdir('public', { recursive: true });
await cp('dist', 'public', { recursive: true });
await copyFile('dist/index.html', 'public/raiox.html');
await copyFile('dist/login.html', 'public/index.html');
await writeFile('public/robots.txt', 'User-agent: *\nDisallow: /\n');
console.log('Site estático pronto em public, sem funções ou variáveis de ambiente.');
