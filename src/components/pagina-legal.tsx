import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A moldura das páginas legais.
 *
 * Fica na linguagem da home -- areia, barro, serifado -- mas é uma página de
 * leitura: medida de linha curta, entrelinha larga e nada a mexer. Ninguém
 * vem aqui para ver animações.
 */
export default function PaginaLegal({
  titulo,
  atualizado,
  children,
}: {
  titulo: string;
  /** Data da última revisão, como aparece ao fundo do texto. */
  atualizado: string;
  children: ReactNode;
}) {
  const gutter = "px-[clamp(1.25rem,6.8vw,7.5rem)]";

  return (
    <main className={`min-h-dvh bg-sand text-clay ${gutter}`}>
      <nav className="py-[clamp(1.25rem,2.6vw,2.6rem)]">
        <Link
          href="/"
          className="flex w-fit items-center gap-3 border-b border-clay/60 pb-0.5 pt-2 font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true" className="inline-block rotate-[-135deg]">
            →
          </span>
          Voltar
        </Link>
      </nav>

      <article className="max-w-[62ch] pb-[clamp(4rem,10vw,10rem)]">
        <h1 className="font-serif text-[clamp(2rem,5.4vw,4.4rem)] leading-[0.95]">
          {titulo}
        </h1>

        <div className="mt-[clamp(1.75rem,4vw,4rem)] flex flex-col gap-[clamp(1.75rem,3.4vw,3.4rem)] font-body text-[clamp(1rem,1.35vw,1.35rem)] leading-relaxed">
          {children}
        </div>

        <p className="mt-[clamp(2.5rem,5vw,5rem)] border-t border-clay/40 pt-5 font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] opacity-60">
          Última actualização: {atualizado}
        </p>
      </article>
    </main>
  );
}

/** Uma secção do texto: título curto e os parágrafos. */
export function Acto({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[0.8em]">
      <h2 className="font-serif text-[clamp(1.25rem,2.1vw,2.1rem)] leading-tight">
        {titulo}
      </h2>
      {children}
    </section>
  );
}
