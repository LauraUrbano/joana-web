import type { MetadataRoute } from "next";

import { SITIO } from "@/lib/sitio";

/**
 * Por agora só a entrada do sítio.
 *
 * A /home e as páginas de projeto ficam de fora enquanto forem rascunho --
 * pôr num sitemap uma página marcada `noindex` é mandar sinais contrários.
 * Quando o site abrir, acrescentam-se aqui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITIO,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
