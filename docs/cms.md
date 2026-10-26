# Backoffice: mapa de conteúdos

Decidido a 22 de outubro de 2026, refeito a 26. O painel está em
**`/painel`**: entra-se com email e palavra-passe e os editores estão ali.

Começou noutro desenho -- o conteúdo em ficheiros no repositório, editado por
uma ferramenta de fora (`/admin`) que precisava de uma chave do GitHub. Dava
histórico por alteração, mas eram dois passos e duas ferramentas, e a Laura
mandou tirar o segundo: *"esse painel deve salvar as coisas no neon, corrija
para ficar um cms completo que abre os editores assim que faço login"*. O que
isso custou está em **"Decidido"**.

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
   palavra-passe próprias. A lista de quem pode entrar está na base de dados e
   edita-se em `/painel/definicoes`. Mais ninguém.
2. **O conteúdo vive na base de dados** (Lakebase Postgres, no Neon) e edita-se
   no próprio sítio, em `/painel`. Não há ferramenta de fora, nem chave do
   GitHub, nem segundo passo: entra-se e os editores estão ali.
3. **O login é o Neon Auth** (Better Auth gerido), com as contas e as sessões no
   esquema `neon_auth` da mesma base.
4. **Rascunho é o estado de trabalho.** Um rascunho aceita tudo e guarda; é a
   publicação que exige -- um texto publicado tem de ter corpo ou endereço
   externo, um projeto publicado tem de ter cartaz em cada vídeo. Assim uma
   recusa nunca deita fora o que já estava escrito.

O que se perdeu nesta mudança, dito com todas as letras: **o histórico do git
por alteração**. Antes, cada gravação era um commit e desfazia-se uma a uma.
Agora fica o `actualizado_por`/`actualizado_em` de cada linha, e a janela de
recuperação do Neon, que faz voltar a base inteira a um instante anterior. Para
desfazer uma alteração isolada, é pedir.

Os ficheiros em `content/` ficaram no repositório como **semente**: a primeira
importação leu-os, e cada um é a versão que estava no ar no dia da mudança.

## Como funciona, por dentro

| Onde | O quê |
| --- | --- |
| `/painel/entrar` | a entrada: email e palavra-passe. Formulário do servidor, sem JavaScript nosso |
| `/painel` | o conteúdo todo: projetos, textos, ligações e contacto |
| `/painel/projetos/[slug]`, `/painel/escritos/[slug]` | um projeto, um texto. `novo` é o endereço do que ainda não existe |
| `/painel/definicoes` | quem entra, e a palavra-passe de cada uma |
| `/painel/ajuda` | o guia, ao lado do que descreve |
| `/admin` | redirecção para `/painel` -- esteve lá a ferramenta antiga e o endereço ficou em marcadores |

- **Tabelas:** `conteudo_projetos`, `conteudo_escritos`, `conteudo_ligacoes`,
  `conteudo_contacto` (um registo só), mais `painel_pessoas` (quem entra) e
  `painel_segredos` (hoje só o segredo que assina os cookies). O SQL está em
  `db/*.sql` e aplica-se com `npm run painel:migrar`, que se pode repetir.
- **A porta de entrada do conteúdo continua a ser `lib/conteudo.ts`**: os
  componentes importam de lá e não sabem de onde vem. Foi isso que permitiu
  trocar ficheiros por base de dados sem mexer no desenho de nada -- comparei o
  HTML das páginas antes e depois, e o corpo é idêntico linha a linha.
- **As páginas de conteúdo têm `revalidate = 60`** e as acções do painel chamam
  `revalidatePath("/", "layout")` ao gravar. Sem isso, o Next lia a base uma vez
  na construção e congelava: gravar no painel não mudava nada no sítio. Com
  isso, a alteração aparece logo a seguir e as visitas não pagam uma ida à base
  de dados.
- **As medidas das imagens ficam gravadas na linha.** Antes mediam-se os bytes
  do ficheiro a cada construção, o que só funciona para imagens dentro do
  repositório.
- **O registo de contas é aberto, o acesso não.** Tem de ser aberto, ou a
  primeira conta não tinha como existir. A porta é a `painel_pessoas`: criar
  conta com um email que não esteja na lista entra e não vê nada.
- **O segredo dos cookies nasce na base de dados** à primeira utilização. É uma
  variável a menos para configurar, e ninguém tem de o ver.
- **O armazenamento de objetos do Neon está provisionado (`assets`) e não
  ligado.** As imagens ainda são caminhos para ficheiros no repositório,
  convertidos à mão. Carregá-las pelo painel é o próximo trabalho, e é aí que o
  bucket entra.

## Falta fazer

| O quê | Porquê |
| --- | --- |
| Carregar imagens pelo painel | Hoje é um caminho escrito à mão; ela não consegue pôr uma fotografia nova sozinha |
| Página de artigo (moldura "Artigo" do Figma) | Um texto com corpo precisa de uma página onde ser lido |
| Desfazer alteração a alteração | A janela do Neon recupera a base inteira, não uma linha |

## Ordem de trabalhos

| Fase | O quê | Estado |
| --- | --- | --- |
| 0 | Mapa de conteúdos validado | feito |
| 1 | Login com contas próprias | feito e provado em produção |
| 1b | Conteúdo na base de dados, editores no painel | feito e provado (18/18); o `/admin` saiu |
| 2 | Página de artigo (moldura "Artigo" do Figma) + dados estruturados | a seguir |
| 3 | Títulos, descrições e palavras-chave por página | depende da validação da procura |
