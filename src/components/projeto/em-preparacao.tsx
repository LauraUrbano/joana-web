import Image from "next/image";
import Link from "next/link";

import type { Preparacao } from "@/lib/projetos";

/**
 * A página de um projeto que ainda não tem caso de estudo escrito.
 *
 * Mostra o que se sabe de verdade: o título, o tipo, o ano, o âmbito nas
 * palavras dela, e as fotografias todas. É uma ficha, não um caso de estudo --
 * não há aqui narrativa nenhuma inventada por mim.
 *
 * Primeiro o texto, depois o trabalho em coluna e grande: numa página de
 * portfólio é o trabalho que tem de falar, e uma grelha de miniaturas obriga a
 * clicar para ver seja o que for.
 *
 * É aqui que vivem os vídeos. Na cena da home ficam só imagens -- pedido da
 * Joana, e também o que faz sentido: a órbita tem seis peças a girar e a
 * passar imagens sozinhas, e meter vídeo ali seria ruído em cima de ruído.
 * A ordem é a capa, depois o vídeo, depois o resto: a marca, a marca em
 * movimento, e por fim as aplicações.
 *
 * Quando um caso for escrito, o projeto passa para `PROJETOS` e a ligação
 * continua a mesma.
 */
export default function EmPreparacao({ peca }: { peca: Preparacao }) {
  const gutter = "px-[clamp(1.25rem,6.8vw,7.5rem)]";
  const imagens = peca.imagens?.length
    ? peca.imagens
    : peca.src
      ? [peca.src]
      : [];
  const videos = peca.videos ?? [];

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

      <header className="max-w-[46ch]">
        <p className="flex flex-wrap gap-x-4 font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] opacity-70">
          <span>{peca.tipo}</span>
          {peca.ano && <span>{peca.ano}</span>}
        </p>
        <h1 className="mt-[0.35em] font-serif text-[clamp(2.25rem,6.4vw,6.6rem)] leading-[0.9]">
          {peca.titulo}
        </h1>

        {peca.descricao ? (
          <p className="mt-[clamp(1.25rem,2.6vw,2.6rem)] font-body text-[clamp(1rem,1.6vw,1.7rem)] leading-snug">
            {peca.descricao}
          </p>
        ) : (
          <p className="mt-[clamp(1.25rem,2.6vw,2.6rem)] font-body text-[clamp(0.95rem,1.4vw,1.45rem)] leading-snug opacity-70">
            O texto deste projeto está a chegar.
          </p>
        )}

        <a
          href="/home#conversar"
          className="mt-[clamp(1.5rem,3vw,3rem)] inline-flex items-center gap-3 border-b border-clay/60 pb-1 font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
        >
          Falar sobre este projeto
          <span aria-hidden="true" className="inline-block -rotate-45">
            →
          </span>
        </a>
      </header>

      {(imagens.length > 0 || videos.length > 0) && (
        <div className="mx-auto mt-[clamp(3rem,7vw,7rem)] flex max-w-[68rem] flex-col gap-[clamp(1.5rem,3.5vw,3.5rem)] pb-[clamp(4rem,9vw,10rem)]">
          {imagens.slice(0, 1).map((src) => (
            <Image
              key={src}
              src={src}
              alt={`${peca.titulo} — ${peca.tipo}`}
              width={1400}
              height={1050}
              priority
              sizes="(max-width: 1024px) 92vw, 68rem"
              className="h-auto w-full"
            />
          ))}

          {/* Sem arranque automático e só com os metadados: o vídeo é
              pesado ao pé de uma fotografia, e ninguém pediu para ele
              começar sozinho. A imagem de cartaz é um fotograma dele, por
              isso vê-se logo o que é sem descarregar nada. */}
          {videos.map((v) => (
            <video
              key={v.src}
              src={v.src}
              poster={v.poster}
              width={v.w}
              height={v.h}
              controls
              playsInline
              preload="metadata"
              className="h-auto w-full"
            />
          ))}

          {imagens.slice(1).map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${peca.titulo}, imagem ${i + 2}`}
              width={1400}
              height={1050}
              sizes="(max-width: 1024px) 92vw, 68rem"
              className="h-auto w-full"
            />
          ))}
        </div>
      )}
    </main>
  );
}
