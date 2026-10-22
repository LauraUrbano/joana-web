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
    return [{ source: "/home", destination: "/", permanent: true }];
  },
  /* O painel é um ficheiro estático em public/admin/index.html. O Next serve-o
     nesse endereço exacto, mas não em /admin -- e /admin é o que se escreve.
     Isto faz o endereço curto servir o ficheiro sem mudar de endereço. */
  rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
