import Image from "next/image";
import Link from "next/link";

import type { Preparacao } from "@/lib/projetos";

/**
 * A página de um projeto que ainda não tem caso de estudo escrito.
 *
 * Mostra só o que se sabe de verdade. Para os projetos que a Joana descreveu
 * -- título, ano e âmbito nas palavras dela -- isso já é uma ficha a sério,
 * mesmo sem fotografias. Para as peças da cena, que têm imagem mas ainda não
 * têm texto dela, é a imagem e o tipo de trabalho.
 *
 * Quando um caso for escrito, a peça passa para `PROJETOS` e a ligação
 * continua a mesma.
 */
export default function EmPreparacao({ peca }: { peca: Preparacao }) {
  const gutter = "px-[clamp(1.25rem,6.8vw,7.5rem)]";
  const comImagem = Boolean(peca.src);

  return (
    <main className={`min-h-dvh bg-sand text-clay ${gutter}`}>
      <nav className="py-[clamp(1.25rem,2.6vw,2.6rem)]">
        <Link
          href="/home#projetos"
          className="flex w-fit items-center gap-3 border-b border-clay/60 pb-0.5 font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true" className="inline-block rotate-[-135deg]">
            →
          </span>
          Voltar aos projetos
        </Link>
      </nav>

      <div
        className={`grid items-center gap-[clamp(2rem,5vw,5rem)] pb-[clamp(3rem,8vw,9rem)] ${
          comImagem ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""
        }`}
      >
        {comImagem && (
          <Image
            src={peca.src as string}
            alt={`${peca.titulo} — ${peca.tipo}`}
            width={peca.w as number}
            height={peca.h as number}
            priority
            sizes="(max-width: 1024px) 88vw, 42vw"
            className="h-auto w-full shadow-[0_1.5rem_3rem_-1rem_rgba(43,35,40,0.35)]"
          />
        )}

        <div className={comImagem ? "" : "max-w-[46ch]"}>
          <p className="flex flex-wrap gap-x-4 font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] opacity-70">
            <span>{peca.tipo}</span>
            {peca.ano && <span>{peca.ano}</span>}
          </p>
          <h1 className="mt-[0.35em] font-serif text-[clamp(2.25rem,6.4vw,6.6rem)] leading-[0.9]">
            {peca.titulo}
          </h1>

          {peca.descricao && (
            <p className="mt-[clamp(1.25rem,2.6vw,2.6rem)] max-w-[42ch] font-body text-[clamp(1rem,1.6vw,1.7rem)] leading-snug">
              {peca.descricao}
            </p>
          )}

          <p className="mt-[clamp(1.25rem,2.6vw,2.6rem)] max-w-[38ch] font-body text-[clamp(0.95rem,1.4vw,1.45rem)] leading-snug opacity-70">
            {peca.descricao
              ? "As imagens deste projeto estão a caminho."
              : "O caso de estudo deste projeto está a ser preparado. Entretanto fica aqui a peça, e o resto chega com as imagens e o texto da Joana."}
          </p>

          <a
            href="/home#conversar"
            className="mt-[clamp(1.5rem,3vw,3rem)] inline-flex items-center gap-3 border-b border-clay/60 pb-1 font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
          >
            Falar sobre este projeto
            <span aria-hidden="true" className="inline-block -rotate-45">
              →
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
