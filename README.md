# Raio-X · Imobiliária Marcio Raposo

Página da Multiplix para a retomada entre Jaerty e Leo, construída a partir da transcrição fornecida. Os dados são atribuídos à reunião anterior. Não apresenta proposta, preço ou previsão de retorno.

## Publicar na Vercel

1. Use a pasta `raiox-marcio-raposo` inteira como raiz do projeto. Se usar o ZIP, extraia antes. Importe o projeto na Vercel com o preset **Other**.
2. Em **Environment Variables**, cadastre as duas variáveis do arquivo local `.private/VERCEL-variaveis.txt`: `RAIOX_PASSWORD` e `SESSION_SECRET`. Selecione os ambientes em que for publicar (Production e Preview, se necessário). Os valores já estão prontos nesse arquivo, que fica separado do pacote de publicação.
3. Publique. A configuração `vercel.json` define a compilação e as rotas. Depois de adicionar ou alterar variáveis, faça um novo deploy.
4. Abra o endereço em uma janela anônima: deve aparecer a tela de acesso. Entre com a senha solicitada e confirme a leitura. Compartilhe o link e a senha com Jaerty e Leo.

Não use a pasta `dist` isoladamente como site estático: o controle de acesso depende da função de servidor incluída neste projeto. A saída pública é `public`, definida automaticamente pela configuração.

Configuração: [documentação oficial da Vercel](https://vercel.com/docs/project-configuration/vercel-json).

## Como funciona o acesso

A senha é verificada no servidor. A sessão tem assinatura, duração de 8 horas e cookie HttpOnly, SameSite=Lax e Secure em produção. HTML, CSS e JavaScript do diagnóstico passam pelo mesmo controle de acesso; o conteúdo não é colocado na pasta pública. Os logos e o estilo da tela de acesso são liberados antes da autenticação.

Sem variáveis válidas, o acesso permanece fechado. O bloqueio de tentativas é por instância de servidor; não representa um limite global persistente. Trocar a senha ou o segredo invalida as sessões anteriores. O botão Sair remove a sessão do navegador.

## Conferências realizadas

- Conteúdo cruzado com a transcrição; números ambíguos omitidos.
- Desktop, tablet e celulares de 360 e 390 px, sem rolagem horizontal.
- Imagens e âncoras válidas, acordeões com teclado, preferência por redução de movimento.
- Testes de acesso: senha incorreta, sessão válida, sessão adulterada e expirada, saída, ausência de configuração, rotas protegidas e tentativa de origem externa.
- Conteúdo essencial disponível sem JavaScript.

A verificação foi local. A publicação na Vercel e a checagem do endereço final ficam para o responsável pelo deploy.

## Prévia local

Com Node.js instalado e as variáveis em `.env.local`, execute `npm run dev` e abra o endereço exibido. A prévia usa a mesma função de autenticação do projeto.

`npm test` verifica os cenários de acesso; `npm run build` prepara a saída pública. O projeto não depende de pacotes externos.

As pastas `.private` e os arquivos `.env.local` são ignorados pelo Git e pelo envio para a Vercel. Não compartilhe anotações internas, transcrição ou variáveis com os visitantes.
