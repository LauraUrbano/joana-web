"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Peca } from "./orbita";

/**
 * Os projetos em telemóvel: uma tira que se arrasta de lado.
 *
 * A órbita em três dimensões é para ecrã grande. No telemóvel a Joana mostrou
 * como deve ser, e é o que o gravity-design.de faz nessa largura -- medi-lhe a
 * galeria a 390x844:
 *
 *   tira        overflow-x: auto, scroll-snap-type: x mandatory, barra escondida
 *   caminho     flex, gap 14px, margem lateral 22px
 *   cartão      328 x 360, ou seja 84% da largura, scroll-snap-align: center,
 *               flex: 0 0 auto -- os vizinhos espreitam 17px de cada lado
 *   imagem      quadrada, 328 x 328, cantos de 6px
 *   barra       4px de altura, cantos de 2px, carril a 0,18 de opacidade
 *   legenda     12px, título a 13,8px e a 700
 *   setas       dois botões redondos de 46px, no fundo
 *
 * Aqui as proporções são as mesmas e as cores são as dela: barro e creme no
 * lugar do roxo e do preto.
 *
 * Duas diferenças, e são deliberadas. Lá a barra é o relógio da passagem
 * automática de imagens dentro de um projeto, com uma coluna de cinco pontos
 * ao lado; aqui cada projeto ainda só tem uma imagem, por isso um relógio não
 * diria nada -- a barra mostra antes onde se vai na tira, que é a única coisa
 * que há mesmo para dizer. Quando as imagens dela chegarem, a barra passa a
 * relógio e os pontos aparecem. E tocar num cartão vai directo para a página
 * do projeto: no telemóvel a tira já centra a peça, não é preciso o passo de
 * abrir que a órbita tem.
 */
export default function TiraProjetos({ pecas }: { pecas: Peca[] }) {
  const tira = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const t = tira.current;
    const b = barra.current;
    if (!t || !b) return;

    let raf = 0;
    let pendente = false;
    const medir = () => {
      pendente = false;
      const curso = t.scrollWidth - t.clientWidth;
      // Com um só cartão não há tira para percorrer: a barra fica cheia.
      const p = curso > 1 ? t.scrollLeft / curso : 1;
      // Nunca abaixo de um cartão: a barra tem de se ver desde o princípio.
      const minimo = 1 / Math.max(pecas.length, 1);
      b.style.width = `${(minimo + p * (1 - minimo)) * 100}%`;
    };
    const agendar = () => {
      if (pendente) return;
      pendente = true;
      raf = requestAnimationFrame(medir);
    };

    medir();
    t.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(raf);
      t.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [pecas.length]);

  /** Um cartão para a frente ou para trás, com o intervalo incluído. */
  const andar = (sentido: 1 | -1) => {
    const t = tira.current;
    if (!t) return;
    const cartao = t.firstElementChild as HTMLElement | null;
    const passo = cartao ? cartao.offsetWidth + 14 : t.clientWidth * 0.88;
    t.scrollBy({ left: sentido * passo, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={tira}
        className="flex snap-x snap-mandatory gap-[14px] overflow-x-auto overscroll-x-contain px-[22px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pecas.map((p) => (
          <figure key={p.id} className="w-[min(84vw,30rem)] shrink-0 snap-center">
            <Link href={p.href ?? "#projetos"} className="block">
              <span className="relative block aspect-square overflow-hidden rounded-[6px] bg-olive-deep">
                <Image
                  src={p.src}
                  alt={`${p.titulo} — ${p.tipo}`}
                  fill
                  sizes="(min-width: 36rem) 30rem, 84vw"
                  className="object-cover"
                />
              </span>
              <figcaption className="mt-[0.9rem] text-paper">
                <span className="block font-serif text-[clamp(1.35rem,5.6vw,2.1rem)] leading-tight">
                  {p.titulo}
                </span>
                <span className="mt-1 block font-sans text-[clamp(0.625rem,1.9vw,0.8rem)] font-semibold uppercase tracking-[0.18em] text-paper/75">
                  {p.tipo}
                </span>
              </figcaption>
            </Link>
          </figure>
        ))}
      </div>

      {/* A barra: onde se vai na tira. Mesma altura e mesmos cantos da
          referência, com a largura do cartão. */}
      <div className="mx-auto mt-[1.1rem] h-1 w-[min(84vw,30rem)] overflow-hidden rounded-[2px] bg-paper/20">
        <span ref={barra} className="block h-full rounded-[2px] bg-clay" />
      </div>

      <div className="mt-[1.6rem] flex items-center justify-between px-[22px]">
        {([-1, 1] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => andar(s)}
            aria-label={s === -1 ? "Projeto anterior" : "Projeto seguinte"}
            className="flex size-[46px] items-center justify-center rounded-full bg-clay text-paper transition-opacity active:opacity-70"
          >
            <span
              aria-hidden="true"
              className={s === -1 ? "rotate-180 text-[1.1rem]" : "text-[1.1rem]"}
            >
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
