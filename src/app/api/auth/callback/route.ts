import { NextResponse, type NextRequest } from "next/server";

/**
 * A segunda metade do login do painel.
 *
 * O GitHub devolve aqui um código; este troca-o pela chave e entrega-a à
 * janela que abriu o login, que é o painel. A conversa é a que o Sveltia CMS
 * espera, herdada do Netlify CMS: a janela do login diz "authorizing:github",
 * o painel responde, e só então a chave segue -- para a origem de quem
 * respondeu, e não para qualquer uma.
 *
 * A chave nunca passa por aqui para lado nenhum senão para essa janela, e não
 * fica escrita em registo nenhum.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const codigo = url.searchParams.get("code");
  const estado = url.searchParams.get("state");
  const esperado = req.cookies.get("painel_estado")?.value;

  if (!codigo || !estado || estado !== esperado) {
    return pagina({ erro: "Pedido de login inválido. Tenta outra vez." });
  }

  const cliente = process.env.GITHUB_OAUTH_ID;
  const segredo = process.env.GITHUB_OAUTH_SECRET;
  if (!cliente || !segredo) {
    return pagina({ erro: "Faltam as credenciais do painel no servidor." });
  }

  const troca = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: cliente,
      client_secret: segredo,
      code: codigo,
      redirect_uri: `${url.origin}/api/auth/callback`,
    }),
  });

  const dados = (await troca.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!dados.access_token) {
    return pagina({
      erro: dados.error_description ?? "O GitHub não devolveu uma chave.",
    });
  }

  return pagina({ chave: dados.access_token });
}

/** A página que fala com o painel e se fecha a seguir. */
function pagina({ chave, erro }: { chave?: string; erro?: string }) {
  const carga = chave
    ? `authorization:github:success:${JSON.stringify({
        token: chave,
        provider: "github",
      })}`
    : `authorization:github:error:${JSON.stringify({ message: erro })}`;

  const html = `<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><title>A entrar…</title></head>
<body style="font:16px/1.5 system-ui;padding:2rem;color:#2b2328">
<p>${erro ? `Não foi possível entrar: ${escapar(erro)}` : "A entrar…"}</p>
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
</script>
</body></html>`;

  const resposta = new NextResponse(html, {
    status: erro ? 400 : 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // A chave não se guarda em lado nenhum pelo caminho.
      "cache-control": "no-store",
    },
  });
  resposta.cookies.delete("painel_estado");
  return resposta;
}

function escapar(t: string) {
  return t.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
}
