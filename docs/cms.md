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

1. **Quem entra:** a Laura e a Joana, cada uma com a sua conta -- email e
   palavra-passe próprias, como em qualquer sítio. A lista de quem pode entrar
   está na base de dados e edita-se em `/painel`. Mais ninguém.
2. **O blog publica com pré-visualização.** Gravar um texto não o põe no site:
   abre um pedido de integração no GitHub, a Vercel constrói esse pedido num
   endereço à parte, e vê-se o texto na página a sério antes de publicar. Os
   projetos, as ligações e os contactos publicam directo.
3. **O conteúdo continua a viver no repositório**, com o Sveltia CMS por cima.
   Cada alteração fica com data, autor e histórico -- se alguém apagar um
   projeto sem querer, recupera-se. É isso que uma base de dados de conteúdo
   não dava.
4. **O login é o Neon Auth, e a base de dados é o Lakebase Postgres.** Contas a
   sério em vez de uma palavra-passe partilhada. A base de dados guarda duas
   coisas: quem pode entrar, e a chave do GitHub.
5. **A migração está feita.** Os seis projetos, o artigo, as seis ligações e o
   contacto já vivem em `content/`.

O Supabase chegou a ser considerado e não serviu: dava a base de dados, mas o
painel ficava todo por construir. O Neon entrou por outra razão -- não para
guardar o conteúdo, mas para guardar **quem entra e a chave** --, que é o que
faltava para a entrada ser um login normal.

## Como funciona, por dentro

- O conteúdo está em `content/` e o painel em `public/admin/` -- `index.html`
  com a versão presa de propósito (eles publicam versões novas quase todos os
  dias) e `config.yml`, que é onde estão descritos os campos todos.
- O painel corre no browser e, para escrever no repositório, precisa de uma
  chave do GitHub. Por isso há três camadas:

| Onde | O quê |
| --- | --- |
| `/painel/entrar` | a entrada: email e palavra-passe. Formulário do servidor, sem JavaScript nosso |
| `/painel` | a sala de máquinas: onde se guarda a chave do GitHub e se edita quem pode entrar |
| `/api/painel` | o que o painel de conteúdos abre numa janela. Sem sessão manda à entrada; com sessão e com direito, entrega a chave |

- As contas e as sessões são do **Neon Auth** (esquema `neon_auth`). As nossas
  duas tabelas são `painel_pessoas` (a lista de quem pode) e `painel_segredos`
  (a chave do GitHub, e o segredo que assina os cookies de sessão). O SQL está
  em `db/painel.sql` e aplica-se com `npm run painel:migrar`.
- **O registo é aberto, o acesso não.** Tem de ser aberto, ou a primeira conta
  não tinha como existir. A porta é a `painel_pessoas`: criar conta com um email
  que não esteja na lista entra e não vê nada.
- O segredo dos cookies **nasce na base de dados** à primeira utilização, em vez
  de ser uma variável posta à mão. É um valor que só precisa de existir e de não
  mudar; assim é uma variável menos, e ninguém tem de o ver.
- O botão do painel continua a dizer "Sign In with GitHub" porque o nome vem da
  ferramenta. O que ele abre é a nossa página de login.
- **O armazenamento de objetos do Neon ficou declarado mas não ligado**, e é de
  propósito: as imagens vão para o repositório, que é o que lhes dá histórico e
  o que o Sveltia sabe fazer. Dar-lhe um trabalho só para o usar era mobília. Se
  um dia as imagens tiverem de sair do repositório -- e há um argumento para
  isso, que os ficheiros grandes ficam lá para sempre --, é um trabalho à parte
  e digo-te o que custa.

## Falta fazer, e é contigo

Uma coisa só: **a chave do repositório**. Tudo o resto está montado e provado.

Em <https://github.com/settings/personal-access-tokens> → *Generate new token*
(*fine-grained*):

| Campo | Valor |
| --- | --- |
| Token name | Painel Joana Domingues |
| Expiration | *No expiration*, ou a data que preferires -- quando expirar, o painel deixa de gravar até se pôr uma nova |
| Repository access | *Only select repositories* → `LauraUrbano/joana-web` |
| Contents | **Read and write** -- é o que grava o conteúdo |
| Pull requests | **Read and write** -- é o que faz a pré-visualização do blog |

Copia a chave: só aparece uma vez. **Não vai a variável de ambiente nenhuma** --
cola-se em <https://www.joanadominguesdesign.pt/painel>, já lá dentro com a tua
conta, e fica na base de dados. Trocar por outra é lá, sem publicar nada.

### O que já está feito

| O quê | Onde |
| --- | --- |
| `neon deploy` -- Postgres, Neon Auth e o bucket `assets` | ramo `production` |
| Tabelas `painel_pessoas` e `painel_segredos` | `npm run painel:migrar` |
| Domínios de confiança do Neon Auth | `joanadominguesdesign.pt` e `www.` |
| `DATABASE_URL` e `NEON_AUTH_BASE_URL` | projeto `joana-web` da Vercel, em *Production* |
| A entrada no próprio domínio | `base_url` no `config.yml` |

O segredo que assina os cookies não está nessa lista de propósito: nasce na base
de dados à primeira utilização e ninguém precisa de lhe tocar.

Houve pelo caminho um projeto `joana-painel`, na conta da Laura, para servir a
entrada enquanto não havia acesso ao projeto do sítio. Já não faz falta e
apaga-se.

## Como se entra

1. Abrir <https://www.joanadominguesdesign.pt/admin>
2. Carregar em **"Sign In with GitHub"**
3. Escrever o email e a palavra-passe

Nem contas do GitHub para a Joana, nem chaves para guardar. A primeira vez,
cada uma cria a sua conta em `/painel/entrar` -- só funciona para os emails que
estejam na lista, e a Laura já está lá pela migração.

**Enquanto as variáveis não estiverem postas**, a página de entrada diz logo que
o painel não é ali, e dá para entrar pelo outro botão do painel, **"Sign In
Using Access Token"**: cada pessoa cria a sua chave em
<https://github.com/settings/tokens/new?scopes=repo&description=Painel+Joana+Domingues>
e cola-a ali. Exige conta do GitHub e convite para o repositório, e é por isso
que não é o caminho final -- é só a rede, para o caso de ser preciso gravar algo
antes de a chave estar no servidor.

Há um guia escrito para a Joana, com os dois caminhos passo a passo:
<https://claude.ai/artifact/WQUr4hCQRr1fBWBwXN7oxN>

## O que isto implica, dito com todas as letras

- **A chave do GitHub é uma só, e vai ao browser de quem entrar.** É inevitável
  -- é o browser que fala com o GitHub -- e é por isso que a chave é estreita:
  só este repositório, só conteúdo e pedidos de integração. Não dá para apagar o
  repositório nem para tocar em mais nada. O que mudou é quem a recebe: antes,
  quem soubesse uma palavra-passe partilhada; agora, uma conta nomeada que está
  na lista.
- **Todas as alterações no GitHub ficam assinadas pela conta dona da chave**,
  seja quem for que as fez. Isto não mudou com o login: as contas dizem quem
  entrou no painel, não quem assinou o commit. Para o segundo, seria preciso uma
  chave por pessoa, e aí voltávamos a pedir contas do GitHub à Joana.
- **Trocar a palavra-passe** é de cada uma, na sua conta. **Trocar a chave** é em
  `/painel`, sem publicar nada. Se a chave andar por onde não devia, revoga-se no
  GitHub, cria-se outra e cola-se lá -- um minuto, sem tocar na Vercel.
- **Tirar o acesso a alguém** é tirar o email da lista em `/painel`. A conta
  continua a existir e deixa de ver conteúdo.
- O registo de contas é aberto porque tem de ser -- é como a primeira conta
  nasce. Quem criar conta com um email fora da lista entra e vê uma página a
  dizer que não tem acesso. Nada de conteúdo, nada de chave.

## Ordem de trabalhos

| Fase | O quê | Estado |
| --- | --- | --- |
| 0 | Mapa de conteúdos validado | feito |
| 1 | Conteúdo em ficheiros, painel, login com contas | feito e provado em produção (14/14); falta só colar a chave do repositório |
| 2 | Página de artigo (moldura "Artigo" do Figma) + dados estruturados | a seguir |
| 3 | Títulos, descrições e palavras-chave por página | depende da validação da procura |
