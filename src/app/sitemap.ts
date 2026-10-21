import type { MetadataRoute } from "next";

import { SITIO } from "@/lib/sitio";

/**
 * A entrada do sítio -- que agora é a home --, a página da escrita e as duas
 * páginas legais.
 *
 * Ficam de fora as páginas de projeto e a página de espera, porque estão
 * marcadas `noindex`: pôr num sitemap uma página assim é mandar sinais
 * contrários. As de projeto entram aqui no dia em que deixarem de ser
 * rascunho.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: SITIO, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITIO}/escrita`,
      lastModified: agora,
      // É aqui que vai aparecendo texto novo, por isso é a que mais muda.
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITIO}/aviso-legal`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITIO}/politica-de-privacidade`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
