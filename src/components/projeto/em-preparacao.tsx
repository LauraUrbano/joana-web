import Image from "next/image";
import Link from "next/link";

import type { Preparacao } from "@/lib/projetos";

/**
 * A página de uma peça cujo caso de estudo ainda não está escrito.
 *
 * A Joana pediu que da cena de projetos se pudesse clicar para ir para a
 * página do projeto. Os seis projetos reais ainda não chegaram, por isso esta
 * página mostra só o que se sabe de verdade -- a peça, o título e o tipo de
 * trabalho -- e diz que o caso está a ser preparado. Quando o texto dela
 * chegar, a peça passa para `PROJETOS` e a ligação continua a mesma.
 *
 * Fica na linguagem nova da home: areia, barro e azeitona, serifado grande.
 */
export default function EmPreparacao({ peca }: { peca: Preparacao }) {
  const gutter = "px-[clamp(1.25rem,6.8vw,7.5rem)]";

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

      <div className="grid items-center gap-[clamp(2rem,5vw,5rem)] pb-[clamp(3rem,8vw,9rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Image
          src={peca.src}
          alt={`${peca.titulo} — ${peca.tipo}`}
          width={peca.w}
          height={peca.h}
          priority
          sizes="(max-width: 1024px) 88vw, 42vw"
          className="h-auto w-full shadow-[0_1.5rem_3rem_-1rem_rgba(43,35,40,0.35)]"
        />

        <div>
          <p className="font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] opacity-70">
            {peca.tipo}
          </p>
          <h1 className="mt-[0.35em] font-serif text-[clamp(2.25rem,6.4vw,6.6rem)] leading-[0.9]">
            {peca.titulo}
          </h1>
          <p className="mt-[clamp(1.25rem,2.6vw,2.6rem)] max-w-[38ch] font-body text-[clamp(1rem,1.6vw,1.7rem)] leading-snug">
            O caso de estudo deste projeto está a ser preparado. Entretanto fica
            aqui a peça, e o resto chega com as imagens e o texto da Joana.
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
