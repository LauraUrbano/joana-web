import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // A partir do Next 16 a lista de qualidades é obrigatória e, sem ela, o
    // valor por omissão é só [75]: o `quality={88}` do retrato do hero estava a
    // ser arredondado para 75 pelo optimizador, e metade do ganho de nitidez
    // perdia-se à chegada. Confirmei no HTML publicado -- o `src` saía com
    // `q=75`. Ver node_modules/next/dist/docs/01-app/03-api-reference/
    // 02-components/image.md, secção "qualities".
    qualities: [75, 88],
  },
  /* A home esteve em /home enquanto a entrada era a página de espera, e esse
     endereço andou por aí -- está no WhatsApp da Joana e no histórico de quem
     já lá foi. Fica a apontar para a entrada, em definitivo (308).

     O caminho é exacto, sem `:path*`: as redirecções são verificadas antes do
     sistema de ficheiros, e um padrão apanhava também as fotografias todas,
     que vivem em /public/home. */
  redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      /* O painel esteve em /admin, que era a ferramenta de fora. Agora o
         conteúdo edita-se no próprio sítio e esse endereço não serve nada --
         mas está em marcadores e em conversas, por isso leva ao painel em vez
         de dar um erro. Temporário (307): se um dia /admin voltar a ser outra
         coisa, não fica preso no histórico dos browsers. */
      { source: "/admin", destination: "/painel", permanent: false },
      { source: "/admin/:caminho*", destination: "/painel", permanent: false },
    ];
  },
  /* O sítio responde também nos endereços `.vercel.app` que a Vercel dá a cada
     projeto, e uma cópia do sítio inteiro noutro endereço é um problema para os
     motores de busca: duas páginas iguais a competir uma com a outra. As
     etiquetas canónicas já apontam todas para o domínio dela, e isto fecha a
     porta de vez. O domínio dela não é apanhado por isto. */
  headers() {
    return [
      {
        source: "/:caminho*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "x-robots-tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
