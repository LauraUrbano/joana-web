import { NextResponse } from "next/server";

import { chaveGithub, podeEntrar } from "@/lib/painel/dados";
import { ambiente, login } from "@/lib/painel/neon";

/**
 * A entrega da chave ao painel de conteúdos.
 *
 * O painel (Sveltia CMS) abre este endereço numa janela e fica à espera de uma
 * mensagem com uma chave do GitHub -- é o protocolo que herdou do Netlify CMS.
 * Para ele, esta janela é uma caixa fechada: não sabe, nem precisa de saber,
 * que lá dentro há um login a sério.
 *
 * O que acontece aqui, por ordem:
 *
 *   1. sem sessão            -> manda à página de entrada, e volta aqui
 *   2. sessão sem direito    -> diz que a conta não tem acesso
 *   3. sem chave guardada    -> diz onde se põe a chave
 *   4. tudo em ordem         -> entrega a chave à janela que a pediu
 *
 * A chave sai daqui para o browser, e isso é inevitável: é o browser que fala
 * com o GitHub. É por isso que a chave deve ser estreita -- só este
 * repositório, só conteúdo e pedidos de integração -- e por isso que só sai
 * para quem está na lista.
 */
export async function GET(pedido: Request) {
  const amb = ambiente();
  if (!amb.pronto) {
    return pagina(
      `<h1>O painel não é aqui</h1>
       <p>Este endereço serve o sítio, mas não guarda as chaves. A entrada é em
       <a href="https://joana-painel.vercel.app/admin">joana-painel.vercel.app</a>.</p>`,
      503
    );
  }

  const auth = await login();
  const { data: sessao } = (await auth!.getSession()) ?? { data: null };
  const utilizador = sessao?.user;

  if (!utilizador) {
    const entrada = new URL("/painel/entrar", pedido.url);
    entrada.searchParams.set("voltar", "/api/painel");
    return NextResponse.redirect(entrada);
  }

  if (!(await podeEntrar(utilizador.email))) {
    return pagina(
      `<h1>Esta conta não tem acesso</h1>
       <p>A conta <strong>${escapar(utilizador.email ?? "")}</strong> existe, mas
       o email não está na lista de quem pode editar o conteúdo.</p>
       <p>Pede a quem já entra para o acrescentar em
       <a href="/painel">/painel</a>.</p>`,
      403
    );
  }

  const chave = await chaveGithub();
  if (!chave) {
    return pagina(
      `<h1>Ainda falta a chave</h1>
       <p>Entraste, mas o painel não tem a chave do repositório para gravar.</p>
       <p>Põe-se uma vez em <a href="/painel">/painel</a>.</p>`,
      503
    );
  }

  return paginaDeChave(chave);
}

/** Entrega a chave à janela que abriu o login, e só a essa. */
function paginaDeChave(chave: string) {
  const carga = `authorization:github:success:${JSON.stringify({
    token: chave,
    provider: "github",
  })}`;
  return pagina(
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

function pagina(corpo: string, estado = 200) {
  const html = `<!doctype html>
<html lang="pt-PT"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Painel</title>
<style>
  :root { color-scheme: light }
  body { margin:0; min-height:100svh; display:grid; place-items:center;
         background:#ede7dc; color:#6b4430;
         font:16px/1.5 ui-serif, Georgia, serif; padding:1.5rem }
  main { width:min(26rem,100%) }
  h1 { font-size:1.6rem; font-weight:400; margin:0 0 .75rem }
  p { margin:0 0 1rem; font-size:1rem }
  a { color:inherit }
</style>
</head><body><main>${corpo}</main></body></html>`;
  return new NextResponse(html, {
    status: estado,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "content-security-policy":
        "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'",
    },
  });
}

function escapar(t: string) {
  return t.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
}
