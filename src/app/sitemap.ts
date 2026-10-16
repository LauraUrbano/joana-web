import type { MetadataRoute } from "next";

import { SITIO } from "@/lib/sitio";

/**
 * A entrada do sítio e as duas páginas legais.
 *
 * A /home e as páginas de projeto ficam de fora enquanto forem rascunho --
 * pôr num sitemap uma página marcada `noindex` é mandar sinais contrários.
 * Quando o site abrir, acrescentam-se aqui.
 *
 * As legais entram porque são páginas públicas e acabadas, e porque a única
 * coisa que lhes aponta dentro do sítio é o rodapé da /home, que é
 * `nofollow`: sem o sitemap, ninguém as encontrava.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: SITIO, lastModified: agora, changeFrequency: "monthly", priority: 1 },
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
