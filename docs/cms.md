# Backoffice: mapa de conteúdos

Decidido e construído a 22 de outubro de 2026. O painel está em **`/admin`** e
guarda tudo em ficheiros dentro do repositório: cada alteração fica com data,
autor e histórico, e desfaz-se se for preciso. Não há base de dados nenhuma.

Falta um passo que só pode ser dado por quem tem a conta do GitHub e da Vercel
-- está em **"Falta fazer, e é contigo"**, no fim.

O que a Joana edita:

1. **Projetos**
2. **Ligações externas**
3. **Blog**
4. **Informações de contacto**

Mais nada. Os textos do desenho — a bio, os três campos do "Designer", as três
linhas dos percursos, as frases do hero — ficam travados ao ficheiro do Figma e
mudam-se por pedido.

---

## 1. Projetos

Hoje são seis, em `src/lib/projetos.ts`. Os campos abaixo são os que já lá
estão, mais os que faltam para ela conseguir publicar um projeto de raiz.

| Campo | Tipo | Obrigatório | Notas |
| --- | --- | --- | --- |
| Título | texto | sim | "Authentic Studio Pilates" |
| Endereço (slug) | texto | sim | Nasce do título. **Mudá-lo parte as ligações que já andem por aí** — o painel tem de avisar e deixar o antigo a redireccionar. |
| Tipo | texto curto | sim | "Marca · Identidade visual". Sai no cartão, em maiúsculas. |
| Ano | número | sim | 2023 a 2026 |
| Descrição | texto, 1 a 3 parágrafos | não | Hoje a Sonae não tem. Sem descrição, a página mostra "o texto deste projeto está a chegar". |
| Capa | imagem **quadrada** | sim | É a que vai à órbita e à tira do telemóvel. Mínimo 1400×1400. |
| Imagens | lista de imagens | não | A galeria da página do projeto. Mínimo 1600 de largura. |
| Vídeos | lista de ficheiro + poster | não | MP4 (H.264). O poster é obrigatório: sem ele a página fica com um buraco preto enquanto carrega. |
| Aparece na home | sim/não | sim | Se entra na órbita e na tira, ou se só existe pelo endereço directo. |
| Ordem | número | sim | A ordem na home é dela, não é a data. |
| Estado | rascunho / publicado | sim | Rascunho não aparece em lado nenhum nem entra no sitemap. |

**Imagens — o ponto que costuma correr mal.** Hoje converto as fotografias à
mão: redimensiono, corto e gravo em `.webp` (as 31 que lá estão pesam 1,7 MB no
total; os vídeos foram de 29,6 MB para 1,3 MB). O painel tem de fazer isso
sozinho — se ela carregar um JPEG de 8 MB directamente da câmara, o site passa
a demorar segundos a abrir no telemóvel. Isto é requisito, não detalhe.

## 2. Ligações externas

Hoje estão espalhadas por dois sítios: as redes em `src/lib/redes.ts`, e o
ORCID, o Ciência Vitae, o Substack e os artigos dentro da home. Passam a ser uma
lista só.

| Campo | Tipo | Obrigatório | Notas |
| --- | --- | --- | --- |
| Nome | texto | sim | LinkedIn, Substack, Instagram, WhatsApp, ORCID, Ciência Vitae |
| Endereço | URL | sim | Validado. Um `https://` errado passa despercebido durante meses. |
| Onde aparece | rodapé / menu / linha "investigo" / linha "escrevo" | sim | Uma ligação pode aparecer em mais do que um sítio. |
| Activa | sim/não | sim | Para desligar sem apagar — foi o que aconteceu ao "saber mais". |

## 3. Blog

Hoje é `src/lib/escritos.ts` e tem um texto: o artigo dela no Marketeer. A
página `/escrita` já está feita e é a lista.

| Campo | Tipo | Obrigatório | Notas |
| --- | --- | --- | --- |
| Título | texto | sim | |
| Endereço (slug) | texto | só se viver aqui | |
| Família | artigo de opinião / texto original / paper | sim | São os filtros que o ficheiro do Figma desenha. |
| Data | data | sim | Ordena a lista e sai no cartão. |
| Resumo | texto, 2 linhas | sim | É o que sai no cartão e serve de descrição para os motores de busca. |
| Imagem | imagem **3:2** | não | Sem ela fica a ilustração do ficheiro. Mínimo 1200×800. |
| Corpo | texto formatado | só se viver aqui | Títulos, parágrafos, citações, imagens, ligações. |
| Publicado em | texto | não | "Marketeer". Preenchido, o cartão aponta para fora. |
| Endereço externo | URL | só se publicado noutro sítio | |
| Estado | rascunho / publicado | sim | |

**O que "blog" implica.** Um texto no Marketeer trabalha o SEO do Marketeer: o
Google atribui o valor ao domínio onde o texto está. Para que escrever dê
resultado a ela, os textos têm de viver aqui — e aí é preciso:

- a **página de artigo**, que o ficheiro já tem desenhada (moldura "Artigo");
- **dados estruturados** por artigo (`Article`, com autor, datas e imagem);
- **título e descrição próprios** por artigo, que é onde as palavras-chave
  entram depois de validarmos a procura.

Para o que já saiu noutro sítio, como o Marketeer, o caminho honesto é publicar
aqui a versão dela com a nota "publicado originalmente em" e um `rel=canonical`
a apontar ao original — sinaliza ao Google quem veio primeiro e não compete
consigo própria.

## 4. Informações de contacto

É um registo só, não uma lista: há um email e um telefone, não vários.

| Campo | Tipo | Obrigatório | Notas |
| --- | --- | --- | --- |
| Email | email | sim | Hoje `jcm@linear.com.pt`; passa a `hello@joanadominguesdesign.pt`. |
| Telefone | texto | não | `+351 915 086 579`. Sai como WhatsApp nas redes e escrito por extenso nas páginas legais. |

**Dois avisos que o painel tem de dar, porque isto não é só o botão de
contacto.** O email aparece em cinco sítios — o convite da home, as duas
páginas legais e a ficha de projeto — e o telefone em três. Nas páginas legais
não é decoração: é o **contacto do responsável pelo tratamento de dados**, que o
RGPD obriga a estar lá e a estar certo. Mudar o email no painel muda-o também
aí, e é isso que se quer; mas apagá-lo sem pôr outro deixa as páginas legais
incompletas, e o painel deve recusar.

Hoje o endereço já vive num sítio só (`src/lib/contacto.ts`), à espera disto.

---

## Decidido

1. **Quem entra:** a Laura e a Joana, com uma palavra-passe partilhada. Mais
   ninguém.
2. **O blog publica com pré-visualização.** Gravar um texto não o põe no site:
   abre um pedido de integração no GitHub, a Vercel constrói esse pedido num
   endereço à parte, e vê-se o texto na página a sério antes de publicar. Os
   projetos, as ligações e os contactos publicam directo.
3. **O painel é o Sveltia CMS, sobre o próprio repositório.** Não custa nada,
   não há servidor nem base de dados para manter, e cada alteração fica com
   data, autor e histórico -- se alguém apagar um projeto sem querer,
   recupera-se.
4. **A migração está feita.** Os seis projetos, o artigo, as seis ligações e o
   contacto já vivem em `content/`.

O Supabase não chegou a servir para nada: dava a base de dados, mas o painel
ficava todo por construir.

## Como funciona, por dentro

- O painel está em `public/admin/` -- `index.html` com a versão presa de
  propósito (eles publicam versões novas quase todos os dias) e `config.yml`,
  que é onde estão descritos os campos todos.
- O painel corre no browser e, para escrever no repositório, precisa de uma
  chave do GitHub. Essa chave está guardada no servidor, numa variável de
  ambiente, e é entregue a quem acertar na palavra-passe: `/api/auth` serve a
  página de login e devolve a chave à janela que a pediu.
- O botão do painel continua a dizer "Sign In with GitHub" porque o nome vem da
  ferramenta. O que ele abre é a nossa página de login.

## Falta fazer, e é contigo

Dois passos, uma vez só, os dois em contas a que chegas. Feitos estes, entra-se
no painel com uma palavra-passe e nunca mais se fala de chaves.

O projeto da Vercel que serve `joanadominguesdesign.pt` está numa conta a que
não chegamos -- a conta que a Laura tem ligada só vê `lauraurbano30-7380's
projects`, e o `joana-web` não está lá. Para não ficar tudo à espera disso,
criei o projeto **`joana-painel`** na conta dela: é este mesmo código, publicado
noutro endereço, e existe só para guardar a chave e servir a página de entrada.
O painel do sítio vai lá buscá-la (`base_url` no `config.yml`). Se um dia
aparecer quem tem a conta do sítio, a variável passa para lá, o `base_url` volta
ao domínio dela e este projeto apaga-se num clique.

**1. Criar a chave do repositório.**
Em <https://github.com/settings/personal-access-tokens> → *Generate new token*
(*fine-grained*):

| Campo | Valor |
| --- | --- |
| Token name | Painel Joana Domingues |
| Expiration | *No expiration*, ou a data que preferires -- quando expirar, o painel deixa de gravar até se pôr uma nova |
| Repository access | *Only select repositories* → `LauraUrbano/joana-web` |
| Contents | **Read and write** -- é o que grava o conteúdo |
| Pull requests | **Read and write** -- é o que faz a pré-visualização do blog |

Copia a chave: só aparece uma vez.

**2. Pôr **uma** variável na Vercel, no `joana-painel`.**
<https://vercel.com/lauraurbano30-7380s-projects/joana-painel/settings/environment-variables>

| Nome | Valor | Ambiente |
| --- | --- | --- |
| `PAINEL_CHAVE_GITHUB` | a chave do passo 1 | *Production* |

Depois de gravar é preciso **voltar a publicar** (*Deployments* → o último →
*Redeploy*): as variáveis só entram numa construção nova. Ou dizer-me, que eu
faço o redeploy daqui.

A outra variável desse projeto já está posta: `NEXT_PUBLIC_SITE_URL` aponta
para o domínio dela, para que os endereços canónicos da cópia continuem a
apontar ao sítio a sério. As pré-visualizações estão desligadas nesse projeto, e
tudo o que for servido por um `.vercel.app` leva `x-robots-tag: noindex` -- a
cópia não compete com o sítio no Google.

**A palavra-passe não precisa de variável.** Vive no repositório como
impressão digital de scrypt (`src/lib/painel.ts`) -- uma conta que só anda para
a frente: confirma se uma palavra-passe está certa, mas não a revela. Para
trocar sem mexer no código, acrescenta-se `PAINEL_SENHA` às variáveis e é essa
que passa a mandar.

## Como se entra

1. Abrir <https://www.joanadominguesdesign.pt/admin>
2. Carregar em **"Sign In with GitHub"**
3. Escrever a palavra-passe

Nem contas do GitHub para a Joana, nem tokens para gerir.

**Enquanto a variável não estiver posta**, a página de entrada diz logo que
falta um passo, e dá para entrar pelo outro botão do painel, **"Sign In Using
Access Token"**: cada pessoa cria a sua chave em
<https://github.com/settings/tokens/new?scopes=repo&description=Painel+Joana+Domingues>
e cola-a ali. Exige conta do GitHub e convite para o repositório, e é por isso
que não é o caminho final -- é só a rede, para o caso de ser preciso gravar algo
antes de a chave estar no servidor.

Há um guia escrito para a Joana, com os dois caminhos passo a passo:
<https://claude.ai/artifact/WQUr4hCQRr1fBWBwXN7oxN>

## O que isto implica, dito com todas as letras

- **A chave é uma só.** Quem entrar com a palavra-passe certa fica com ela no
  browser enquanto a sessão durar. É inevitável -- é o browser que fala com o
  GitHub -- e é por isso que a chave é estreita: só este repositório, só
  conteúdo e pedidos de integração. Não dá para apagar o repositório nem para
  tocar em mais nada.
- **Todas as alterações ficam assinadas pela conta dona da chave**, seja quem
  for que as fez. Para duas pessoas que trabalham juntas, serve. Se um dia for
  preciso saber quem fez o quê, passa-se ao login por conta do GitHub, que é
  mais seguro e que já esteve construído.
- **Trocar a palavra-passe**: pôr `PAINEL_SENHA` nas variáveis da Vercel, ou
  pedir-me para gerar outra impressão. Se a chave andar por onde não devia,
  revoga-se no GitHub e gera-se outra -- o painel volta a funcionar assim que a
  nova estiver na Vercel.
- A palavra-passe em si não está escrita em lado nenhum do repositório: o que
  lá está é a impressão digital dela. Mesmo quem leia o código todo não a
  descobre.

## Ordem de trabalhos

| Fase | O quê | Estado |
| --- | --- | --- |
| 0 | Mapa de conteúdos validado | feito |
| 1 | Conteúdo em ficheiros, painel, login | feito, à espera dos dois passos acima |
| 2 | Página de artigo (moldura "Artigo" do Figma) + dados estruturados | a seguir |
| 3 | Títulos, descrições e palavras-chave por página | depende da validação da procura |
