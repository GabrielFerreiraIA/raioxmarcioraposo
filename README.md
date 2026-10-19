# Raio-X · Imobiliária Marcio Raposo

Página estática da Multiplix, preparada a partir da conversa com Jaerty para o alinhamento com Leo.

## Publicação na Vercel

Importe este repositório com o preset **Other**. O arquivo `vercel.json` já configura `npm run build` e a saída `public`. A atualização da branch `main` aciona a publicação no projeto conectado.

Não são necessárias funções de servidor ou variáveis de ambiente. As antigas variáveis de acesso podem ser removidas do painel, mas não interferem nesta versão.

## Senha de apresentação

A tela inicial compara a senha no JavaScript. A entrada permanece liberada na aba até usar **Sair** ou encerrar a sessão do navegador. Esta é apenas uma barreira de apresentação: senha e conteúdo estão nos arquivos públicos e podem ser vistos por quem inspecionar o site. Não é autenticação ou proteção de dados.

## Arquivos e prévia

Os arquivos editáveis estão em `dist`. `npm run build` prepara a versão publicada em `public`: a entrada é o login e o diagnóstico fica em `raiox.html`.

Para abrir uma prévia local, execute `npm run dev`. O projeto não precisa de pacotes externos. A pasta `.private` e os antigos arquivos `.env.local` continuam excluídos do Git e da publicação.
