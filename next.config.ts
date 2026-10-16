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
};

export default nextConfig;
