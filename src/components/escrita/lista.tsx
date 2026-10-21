"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Seta from "@/components/seta";
import {
  ILUSTRACAO_PADRAO,
  familiasComTexto,
  porData,
  type Escrito,
  type Familia,
} from "@/lib/escritos";
import { ALVO, ALVO_CIMA, CAPS } from "@/lib/tipo";

/**
 * A lista de textos, com os filtros que o ficheiro põe por cima dela
 * ("todos · artigos de opinião · textos originais · papers").
 *
 * Os filtros só aparecem quando há mais do que uma família de textos. Com um
 * texto só, uma fila de filtros onde todos levam ao mesmo lado era mobília.
 *
 * Cada linha é um risco em cima, a ilustração à esquerda e o texto à direita,
 * como na moldura larga; no telemóvel a ilustração vai para cima e o texto
 * por baixo, como na estreita.
 */
export default function Lista({ escritos }: { escritos: Escrito[] }) {
  const familias = familiasComTexto(escritos);
  const [filtro, setFiltro] = useState<Familia | null>(null);
  const lista = porData(escritos).filter(
    (e) => filtro === null || e.familia === filtro
  );

  return (
    <>
      {familias.length > 1 && (
        <nav
          aria-label="Filtrar por tipo de texto"
          className="mt-[clamp(2rem,5.6vw,6rem)] flex flex-wrap gap-x-[clamp(1.5rem,3.4vw,3.5rem)] gap-y-2"
        >
          {[null, ...familias].map((f) => (
            <button
              key={f ?? "todos"}
              type="button"
              onClick={() => setFiltro(f)}
              aria-pressed={filtro === f}
              className={`${CAPS} ${ALVO} text-clay transition-opacity hover:opacity-60 ${
                filtro === f ? "border-b border-clay" : "opacity-60"
              }`}
            >
              {f === null ? "Todos" : f}
            </button>
          ))}
        </nav>
      )}

      <ul className="mt-[clamp(1.5rem,3.9vw,4rem)]">
        {lista.map((e) => {
          const externo = e.href.startsWith("http");
          return (
            <li
              key={e.href}
              className="border-t border-clay/70 py-[clamp(1.5rem,2.7vw,2.8rem)]"
            >
              <Link
                href={e.href}
                target={externo ? "_blank" : undefined}
                rel={externo ? "noopener noreferrer" : undefined}
                className="group grid gap-[min(5.7vw,44px)] md:grid-cols-[minmax(0,0.83fr)_minmax(0,1fr)] md:items-start md:gap-x-[6.8vw]"
              >
                {/* 582 por 388 no ficheiro, ou seja 3:2 */}
                <div className="relative aspect-[3/2] overflow-hidden bg-clay/10">
                  <Image
                    src={e.imagem ?? ILUSTRACAO_PADRAO}
                    alt=""
                    fill
                    sizes="(min-width: 48rem) 36vw, 86vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>

                <div>
                  <p className={`${CAPS} flex flex-wrap gap-x-3 text-clay/70`}>
                    <span>{e.familia}</span>
                    {/* A data e onde saiu não estão no desenho, mas um texto
                        sem data nem casa não se avalia -- e são as duas coisas
                        que dão crédito a quem o escreveu. */}
                    {e.publicado && <span aria-hidden="true">·</span>}
                    {e.publicado && <span>{e.publicado}</span>}
                    <span aria-hidden="true">·</span>
                    <time dateTime={e.data}>{porExtenso(e.data)}</time>
                  </p>

                  {/* 66 em maiúsculas, como os títulos de linha da home. A
                      entrelinha é que não: o ficheiro dá 57 em 66 (0,86) e aí
                      o título é "TÍTULO DO ARTIGO", três palavras numa linha.
                      Um título a sério ocupa três ou quatro, e a 0,86 as
                      maiúsculas de uma linha encostam às da outra. */}
                  <h2 className="mt-[min(5.4vw,41px)] font-serif text-[min(9.69vw,43px)] uppercase leading-[0.95] text-clay md:mt-[clamp(0.75rem,1.6vw,1.7rem)] md:text-[clamp(1.4rem,3.4vw,3.5rem)]">
                    {e.titulo}
                  </h2>

                  <p className="mt-[min(3vw,24px)] max-w-[46ch] font-body text-[min(4.7vw,21px)] leading-snug text-clay md:mt-[clamp(0.75rem,1.4vw,1.5rem)] md:text-[clamp(0.95rem,1.6vw,1.7rem)]">
                    {e.resumo}
                  </p>

                  <span
                    className={`${CAPS} ${ALVO_CIMA} mt-[min(8vw,56px)] inline-flex items-center gap-2 border-b border-clay/60 pb-0.5 text-clay transition-opacity group-hover:opacity-60 md:mt-[clamp(1rem,2.2vw,2.3rem)]`}
                  >
                    Ler artigo <Seta />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {lista.length === 0 && (
        <p className="mt-10 font-body text-[clamp(1rem,1.6vw,1.7rem)] text-clay/70">
          Ainda não há nada publicado nesta família.
        </p>
      )}
    </>
  );
}

/** "2026-10-17" -> "17 de outubro de 2026", que é como se lê em português. */
function porExtenso(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
