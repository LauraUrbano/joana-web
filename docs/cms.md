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

## Como se faz

**Recomendação: CMS sobre o próprio repositório** (Sveltia ou Decap).

- Um endereço `/admin` com login, e as alterações dela ficam gravadas no
  GitHub como qualquer outra alteração. A Vercel reconstrói sozinha.
- Não custa nada e não há servidor para manter.
- Todas as alterações ficam com histórico e podem ser desfeitas — se ela
  apagar um projeto sem querer, recupera-se.
- O conteúdo continua a viver com o código: não há uma base de dados que
  possa ficar inacessível e levar o site com ela.

Alternativa, se ela vier a escrever muito e quiser uma biblioteca de imagens a
sério: um CMS alojado (o Sanity tem plano gratuito que chega bem para isto). É
melhor painel, mas é mais uma conta, mais uma dependência e o conteúdo passa a
estar fora do repositório.

O Supabase não serve para isto: dava a base de dados, mas o painel ficava todo
por construir — é o caminho mais trabalhoso e o que menos acrescenta a um
portefólio.

## O que ainda falta decidir

1. **Quem entra.** Só a Joana, ou a Laura também? (Muda a configuração do
   acesso, não o modelo.)
2. **Publica directo ou vê antes?** Para o blog recomendo rascunho →
   pré-visualizar → publicar. Para os projetos, directo chega.
3. **A migração dos seis projetos e do artigo** é um passo só, e faço-o eu —
   os ficheiros `lib/` de hoje já são este esquema, campo a campo.

## Ordem de trabalhos

| Fase | O quê | Depende de |
| --- | --- | --- |
| 0 | Este mapa validado | a Laura |
| 1 | CMS com os três tipos, imagens optimizadas no carregamento, migração do que existe | fase 0 |
| 2 | Página de artigo (moldura "Artigo" do Figma) + dados estruturados | fase 1 |
| 3 | Títulos, descrições e palavras-chave por página | validação da procura (Keyword Planner / Search Console) |
