import type { Metadata } from "next";
import Link from "next/link";

import Cabecalho from "@/components/cabecalho";
import Conversar from "@/components/conversar";
import Rodape from "@/components/rodape";
import Lista from "@/components/escrita/lista";
import { ESCRITOS } from "@/lib/escritos";
import { ALVO, CAPS, GUTTER } from "@/lib/tipo";

/**
 * A página da escrita.
 *
 * A nota da Joana: "na parte do escrevo, é importante ter esta página
 * intermédia -- já com a possibilidade de colocar o artigo da marketeer,
 * porque é a partir daí que consigo trabalhar SEO através de conteúdos
 * escritos por mim".
 *
 * Vem da moldura "Escrevo" do ficheiro (1669 de largura, e 754 na estreita):
 * marca e destinos em cima, "voltar", o título grande, a entrada, os filtros,
 * e a lista de textos.
 *
 * O título e a descrição desta página ficam por acertar: ela quer validar a
 * procura primeiro -- "validamos a procura primeiro e depois escolhemos as
 * palavras-chave principais, secundárias e ajustamos títulos, descrições e
 * textos de cada secção". Por agora dizem o que a página é, sem forçar nada.
 */
export const metadata: Metadata = {
  title: "Escrita — Joana Domingues",
  description:
    "Ideias que começam no design, sobre design. Artigos de opinião, textos e investigação de Joana Domingues sobre design de comunicação, criatividade e inteligência artificial.",
  alternates: { canonical: "/escrita" },
  openGraph: {
    title: "Escrita — Joana Domingues",
    description:
      "Ideias que começam no design, sobre design. Artigos de opinião, textos e investigação sobre design de comunicação, criatividade e inteligência artificial.",
    url: "/escrita",
  },
};

export default function EscritaPage() {
  return (
    <main className="min-h-dvh bg-sand">
      <Cabecalho activo="Escrita" />

      <div className={GUTTER}>
        <Link
          href="/"
          className={`${CAPS} ${ALVO} inline-flex items-center gap-2 border-b border-clay/60 pb-0.5 text-clay transition-opacity hover:opacity-60`}
        >
          <span aria-hidden="true" className="inline-block rotate-[-135deg]">
            →
          </span>
          Voltar
        </Link>

        {/* 135/1669 na moldura larga, 85/681 na estreita */}
        <h1 className="mt-[clamp(1.5rem,2.9vw,3rem)] max-w-[20ch] font-serif text-[min(12.48vw,55px)] leading-[0.95] text-clay md:text-[clamp(1.75rem,8.09vw,8.4rem)]">
          Ideias que começam no design, sobre design.
        </h1>

        <p className="mt-[clamp(1.5rem,2.4vw,2.5rem)] max-w-[34ch] font-body text-[min(4.7vw,21px)] leading-snug text-clay md:text-[clamp(1rem,1.92vw,2rem)]">
          Escrevo sobre design, comunicação, criatividade e inteligência
          artificial. Às vezes para partilhar conhecimento, outras para perceber
          melhor aquilo que ainda estou a tentar compreender.
        </p>

        <div className="pb-[clamp(3rem,7vw,7rem)]">
          <Lista escritos={ESCRITOS} />
        </div>
      </div>

      <Conversar />
      <Rodape />
    </main>
  );
}
