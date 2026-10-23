import { NextResponse, type NextRequest } from "next/server";
import { scryptSync, timingSafeEqual } from "node:crypto";

import { SENHA_IMPRESSAO } from "@/lib/painel";

/**
 * O login do painel.
 *
 * O painel é uma aplicação que corre no browser e, para escrever no
 * repositório, precisa de uma chave do GitHub. Havia dois caminhos para a
 * conseguir: cada pessoa entrar com a sua conta do GitHub (mais seguro, mas
 * obriga cada uma a ter conta e a passar pelo OAuth), ou isto -- uma
 * palavra-passe nossa que, quando certa, entrega a chave que está guardada no
 * servidor. A Laura pediu o simples, e é este.
 *
 * O painel abre este endereço numa janela e fica à espera de uma mensagem com
 * a chave -- é o protocolo que o Sveltia CMS herdou do Netlify CMS. Para ele,
 * esta janela é uma caixa fechada: não sabe nem precisa de saber que lá dentro
 * há uma palavra-passe em vez do GitHub.
 *
 * O que isto implica, dito com todas as letras:
 *
 * - A chave é uma só, do repositório, e fica em `PAINEL_CHAVE_GITHUB`. Quem
 *   entrar com a palavra-passe certa fica com ela no browser enquanto a sessão
 *   do painel durar -- é inevitável, porque é o browser que fala com o GitHub.
 *   Por isso a chave deve ser estreita: só este repositório, só conteúdo e
 *   pedidos de integração.
 * - Todas as alterações ficam assinadas pela conta dona da chave, seja quem
 *   for que as fez. Para duas pessoas que trabalham juntas, serve.
 * - A palavra-passe não precisa de variável nenhuma: vive no repositório como
 *   impressão digital (`lib/painel.ts`), que é uma conta que só anda para a
 *   frente -- confirma-se, não se descobre. Assim só há uma coisa para
 *   configurar na Vercel, que é a chave. Quem quiser trocar a palavra-passe
 *   sem mexer no código põe `PAINEL_SENHA` nas variáveis, e é essa que manda.
 */

export async function GET() {
  // Sem a chave no servidor, pedir a palavra-passe era mandar alguém a um beco:
  // acertava e, no fim, levava com um erro. Mais vale dizê-lo à entrada e
  // apontar o caminho que funciona sem servidor nenhum.
  if (!process.env.PAINEL_CHAVE_GITHUB) return paginaSemChave();
  return paginaDeEntrada();
}

export async function POST(req: NextRequest) {
  // Só aceita o formulário que serve daqui. Compara-se o anfitrião e não a
  // origem inteira: atrás do proxy da Vercel, o `req.url` pode vir em `http`
  // enquanto o browser diz `https`, e aí uma comparação de origens recusava o
  // login legítimo -- foi o que aconteceu no teste.
  const origem = req.headers.get("origin");
  if (origem && anfitriao(origem) !== req.headers.get("host")) {
    return paginaDeEntrada("Pedido vindo de fora. Tenta outra vez.");
  }

  const chave = process.env.PAINEL_CHAVE_GITHUB;
  if (!chave) {
    return paginaDeEntrada(
      "O painel ainda não tem a chave do repositório: falta a variável PAINEL_CHAVE_GITHUB na Vercel."
    );
  }

  const form = await req.formData();
  const tentativa = String(form.get("senha") ?? "");

  // Um segundo de espera a cada tentativa. Não é uma defesa a sério, mas torna
  // um ataque por força bruta impraticável numa palavra-passe longa.
  await new Promise((r) => setTimeout(r, 1000));

  if (!senhaCerta(tentativa)) {
    return paginaDeEntrada("Palavra-passe errada.");
  }

  return paginaDeChave(chave);
}

/** O anfitrião de um endereço, ou nada se o endereço não se ler. */
function anfitriao(endereco: string) {
  try {
    return new URL(endereco).host;
  } catch {
    return null;
  }
}

/**
 * Confere a palavra-passe: contra a variável de ambiente, se existir, e senão
 * contra a impressão digital que está no repositório.
 */
function senhaCerta(tentativa: string) {
  const porVariavel = process.env.PAINEL_SENHA;
  if (porVariavel) return igual(tentativa, porVariavel);

  const [tipo, sal, impressao] = SENHA_IMPRESSAO.split(":");
  if (tipo !== "scrypt" || !sal || !impressao) return false;

  const calculada = scryptSync(
    tentativa,
    Buffer.from(sal, "hex"),
    impressao.length / 2
  );
  return igual(calculada.toString("hex"), impressao);
}

/** Comparação de tempo constante: não deixa adivinhar a senha pelo relógio. */
function igual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) {
    // Compara na mesma, contra ela própria, para o tempo não denunciar o
    // comprimento.
    timingSafeEqual(x, x);
    return false;
  }
  return timingSafeEqual(x, y);
}

function moldura(corpo: string, estado = 200) {
  const html = `<!doctype html>
<html lang="pt-PT"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Entrar no painel</title>
<style>
  :root { color-scheme: light }
  body { margin:0; min-height:100svh; display:grid; place-items:center;
         background:#d8cec1; color:#6b4430;
         font:16px/1.5 ui-serif, Georgia, serif; padding:1.5rem }
  main { width:min(22rem,100%) }
  h1 { font-size:1.6rem; font-weight:400; margin:0 0 .25rem }
  p { margin:0 0 1.5rem; font-size:.95rem; opacity:.8 }
  label { display:block; font:600 .7rem/1 ui-sans-serif, system-ui;
          letter-spacing:.18em; text-transform:uppercase; margin-bottom:.5rem }
  input { width:100%; box-sizing:border-box; padding:.7rem .8rem; font:inherit;
          color:inherit; background:#efe9e0; border:1px solid #6b443060;
          border-radius:2px }
  input:focus-visible { outline:2px solid #6b4430; outline-offset:1px }
  button { margin-top:1rem; width:100%; padding:.7rem; cursor:pointer;
           font:600 .7rem/1 ui-sans-serif, system-ui; letter-spacing:.18em;
           text-transform:uppercase; color:#efe9e0; background:#6b4430;
           border:0; border-radius:2px }
  .erro { color:#8a2b1f; font-size:.9rem; margin:.75rem 0 0 }
</style>
</head><body><main>${corpo}</main></body></html>`;
  return new NextResponse(html, {
    status: estado,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      // Esta página só tem o que está aqui escrito.
      "content-security-policy":
        "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'",
    },
  });
}

/** Quando ainda não há chave no servidor. */
function paginaSemChave() {
  return moldura(
    `<h1>Ainda falta um passo</h1>
     <p>A chave do repositório ainda não está no servidor, por isso esta
     palavra-passe ainda não abre nada.</p>
     <p>Entretanto dá para entrar pelo outro botão do painel,
     <strong>"Sign In Using Access Token"</strong>, que não passa por aqui:
     gera-se uma chave no GitHub e cola-se lá.</p>
     <p>Fecha esta janela e usa esse botão.</p>`,
    503
  );
}

function paginaDeEntrada(erro?: string) {
  return moldura(
    `<h1>Conteúdo</h1>
     <p>Joana Domingues Design</p>
     <form method="post" action="/api/auth">
       <label for="senha">Palavra-passe</label>
       <input id="senha" name="senha" type="password" autocomplete="current-password"
              autofocus required />
       <button type="submit">Entrar</button>
       ${erro ? `<p class="erro">${escapar(erro)}</p>` : ""}
     </form>`,
    erro ? 401 : 200
  );
}

/** Entrega a chave à janela que abriu o login, e só a essa. */
function paginaDeChave(chave: string) {
  const carga = `authorization:github:success:${JSON.stringify({
    token: chave,
    provider: "github",
  })}`;
  return moldura(
    `<h1>Entrou</h1>
     <p>Já pode fechar esta janela.</p>
     <script>
       (function () {
         var carga = ${JSON.stringify(carga)};
         function responder(evento) {
           window.opener.postMessage(carga, evento.origin);
           window.removeEventListener("message", responder, false);
         }
         if (window.opener) {
           window.addEventListener("message", responder, false);
           window.opener.postMessage("authorizing:github", "*");
         }
       })();
     </script>`
  );
}

function escapar(t: string) {
  return t.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
}
