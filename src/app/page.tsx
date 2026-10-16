import Image from "next/image";
import type { CSSProperties } from "react";

import { REDES } from "@/lib/redes";

/**
 * A página de espera: por agora, é esta a entrada do site.
 *
 * Vem da moldura "Underconstruction" do ficheiro do Figma (1851 x 1047), e as
 * medidas abaixo foram lidas do próprio desenho, em percentagem da moldura
 * para a página acompanhar qualquer largura:
 *
 *   marca        x 184 (9.94%)  largura 831 (44.9%)   tinta 274..579
 *   "design"     x 1381         largura 225 (12.16%)  tinta 428..453
 *   "Soon"       x 234 (12.64%) 53px serifado itálico, linha de base 901
 *   redes        14px, espacejamento 2.52px (0.18em), linha de base 895
 *
 * As duas linhas de baixo partilham a linha de base, como no ficheiro. E a
 * marca fica centrada no espaço que sobra por cima delas: medido, o centro da
 * tinta cai a 40,7% da altura, que é exactamente o centro desse espaço -- daí
 * não haver aqui nenhum afastamento no topo.
 */
export default function EmBreve() {
  return (
    <main className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden bg-olive">
      {/* A mesma parede de azeitona com sombras de folhas que fecha a /home.
          No ficheiro a imagem está desenhada a 2045 x 1151 numa moldura de
          1851 x 1047, deslocada (-82, -28): ou seja, um pouco mais aproximada
          do que o `object-cover` dá por si. Daí a escala e o desvio -- medido,
          aproxima o enquadramento do ficheiro em 19%. */}
      <Image
        src="/home/fundo-azeitona.jpg"
        alt=""
        fill
        priority
        sizes="(max-width: 1024px) 1600px, 110vw"
        className="-z-10 -translate-x-[0.35%] -translate-y-[1.9%] scale-[1.0993] object-cover"
      />

      <h1 className="sr-only">Joana Domingues Design — em breve</h1>

      {/* ============================================================== marca */}
      <div className={`flex flex-1 items-center ${GUTTER}`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-y-[clamp(1.5rem,4vw,4rem)]">
          {/* A marca avança 2,7% para fora da margem das linhas de baixo, como
              no ficheiro: a tinta começa aos 184 e o "Soon" aos 234. */}
          <Image
            src="/home/marca-joana-domingues.png"
            alt="Joana Domingues"
            width={527}
            height={195}
            priority
            sizes="(max-width: 1024px) 72vw, 45vw"
            data-entrada
            className="-ml-[2.7vw] h-auto w-[clamp(17rem,44.9vw,52rem)]"
          />
          {/* O "design" fica 15px abaixo do centro da marca, como no
              ficheiro. Deslocado por `top` e não por `transform`: a animação
              de entrada escreve `transform`, e apagava-o. */}
          <Image
            src="/home/marca-design.png"
            alt="Design"
            width={191}
            height={34}
            sizes="(max-width: 1024px) 28vw, 13vw"
            data-entrada
            style={{ "--atraso": 0.12 } as CSSProperties}
            className="relative top-[0.81vw] h-auto w-[clamp(5rem,12.16vw,14rem)]"
          />
        </div>
      </div>

      {/* ========================================================== a espera */}
      <div
        className={`flex flex-wrap items-baseline justify-between gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-[clamp(1rem,2vw,2rem)] pb-[12.4svh] ${GUTTER}`}
      >
        <p
          data-entrada
          style={{ "--atraso": 0.24 } as CSSProperties}
          className="font-serif text-[clamp(1.5rem,2.86vw,3.1rem)] italic leading-[1.2] text-white"
        >
          Soon
        </p>

        <nav
          aria-label="Redes"
          data-entrada
          style={{ "--atraso": 0.32 } as CSSProperties}
          className="flex flex-wrap gap-x-[clamp(1.5rem,6.75vw,7rem)] gap-y-3"
        >
          {REDES.map((r) =>
            r.href ? (
              <a
                key={r.nome}
                href={r.href}
                className={`${CAPS} text-paper transition-opacity hover:opacity-70`}
              >
                {r.nome}
              </a>
            ) : (
              <span key={r.nome} className={`${CAPS} text-paper`}>
                {r.nome}
              </span>
            )
          )}
        </nav>
      </div>
    </main>
  );
}

/** Margem lateral: 234/1851 do ficheiro, onde começam o "Soon" e as redes. */
const GUTTER = "px-[clamp(1.25rem,12.7vw,14.5rem)]";

/** Caixa alta das redes: 14px numa moldura de 1851, espacejamento 0,18em. */
const CAPS =
  "font-sans text-[clamp(0.625rem,0.76vw,1rem)] font-semibold uppercase tracking-[0.18em]";
