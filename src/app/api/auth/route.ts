import { NextResponse, type NextRequest } from "next/server";

/**
 * A primeira metade do login do painel.
 *
 * O painel é uma aplicação que corre no browser e precisa de uma chave do
 * GitHub para escrever no repositório. Essa chave só se obtém trocando um
 * código por ela, e a troca exige um segredo que não pode andar no browser --
 * daí ter de haver servidor nesta parte, e só nesta.
 *
 * Em vez de depender de um serviço de terceiros (o caminho habitual é um
 * trabalhador na Cloudflare ou a Netlify), o cliente de OAuth é o próprio
 * sítio: isto manda para o GitHub, e o /api/auth/callback recebe de volta.
 *
 * O `state` é um número de uso único guardado num cookie e conferido no
 * regresso: é o que impede que alguém force um login a partir de outro sítio.
 */
export async function GET(req: NextRequest) {
  const cliente = process.env.GITHUB_OAUTH_ID;
  if (!cliente) {
    return new NextResponse(
      "O painel ainda não tem credenciais. Falta a variável GITHUB_OAUTH_ID.",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const estado = crypto.randomUUID();
  const origem = new URL(req.url).origin;

  const paraOGitHub = new URL("https://github.com/login/oauth/authorize");
  paraOGitHub.searchParams.set("client_id", cliente);
  paraOGitHub.searchParams.set("redirect_uri", `${origem}/api/auth/callback`);
  // `repo` é o mínimo para escrever conteúdo e abrir os pedidos de integração
  // que a pré-visualização do blog usa.
  paraOGitHub.searchParams.set("scope", "repo");
  paraOGitHub.searchParams.set("state", estado);

  const resposta = NextResponse.redirect(paraOGitHub);
  resposta.cookies.set("painel_estado", estado, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return resposta;
}
