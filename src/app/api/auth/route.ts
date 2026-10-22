import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

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
 * - A palavra-passe está em `PAINEL_SENHA`, ao lado da chave. Guardá-la
 *   cifrada protegeria pouco: quem conseguisse ler as variáveis já levava a
 *   chave na mesma. O que interessa é ser longa e não andar a passear por
 *   conversas.
 */

export async function GET() {
  return paginaDeEntrada();
}

export async function POST(req: NextRequest) {
  // Só aceita o formulário que serve daqui.
  const origem = req.headers.get("origin");
  if (origem && origem !== new URL(req.url).origin) {
    return paginaDeEntrada("Pedido vindo de fora. Tenta outra vez.");
  }

  const senhaCerta = process.env.PAINEL_SENHA;
  const chave = process.env.PAINEL_CHAVE_GITHUB;
  if (!senhaCerta || !chave) {
    return paginaDeEntrada(
      "O painel ainda não está configurado no servidor: faltam as variáveis PAINEL_SENHA e PAINEL_CHAVE_GITHUB."
    );
  }

  const form = await req.formData();
  const tentativa = String(form.get("senha") ?? "");

  // Um segundo de espera a cada tentativa. Não é uma defesa a sério, mas torna
  // um ataque por força bruta impraticável numa palavra-passe longa.
  await new Promise((r) => setTimeout(r, 1000));

  if (!igual(tentativa, senhaCerta)) {
    return paginaDeEntrada("Palavra-passe errada.");
  }

  return paginaDeChave(chave);
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
