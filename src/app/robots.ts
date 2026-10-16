import type { MetadataRoute } from "next";

import { SITIO } from "@/lib/sitio";

/**
 * Deixa passar tudo, de propósito.
 *
 * A /home e as páginas de projeto são rascunho e já dizem `noindex` nos seus
 * metadados. Proibi-las aqui seria contraproducente: um endereço proibido no
 * robots.txt não chega a ser lido, por isso o `noindex` nunca seria visto -- e
 * o Google pode na mesma listar o endereço, só que sem conteúdo. Deixar
 * rastejar e dizer `noindex` na página é a forma que funciona.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
