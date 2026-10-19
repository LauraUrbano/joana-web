import Image from "next/image";
import type { CSSProperties } from "react";

import { REDES } from "@/lib/redes";
import { SITIO } from "@/lib/sitio";

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

      {/* Quem é, para os motores de busca. O mínimo e só o que é verdade: os
          perfis dela entram em `sameAs` quando os endereços chegarem. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Joana Domingues",
            jobTitle: "Designer de comunicação",
            url: SITIO,
            image: `${SITIO}/opengraph-image.jpg`,
            knowsLanguage: ["pt-PT", "en"],
            // O iD do ORCID é o identificador forte de um investigador: é
            // por aqui que os motores de busca ligam a pessoa ao trabalho.
            identifier: {
              "@type": "PropertyValue",
              propertyID: "ORCID",
              value: "https://orcid.org/0009-0006-0013-609X",
            },
            sameAs: [
              "https://orcid.org/0009-0006-0013-609X",
              "https://www.cienciavitae.pt/pt/2E16-8DC8-2D22",
              "https://www.linkedin.com/in/jcmdomingues/",
              "https://substack.com/@joanadomingues",
              "https://www.instagram.com/joanadomingues.design/",
            ],
            description:
              "Designer de comunicação há mais de 14 anos. Identidades visuais, branding e comunicação digital, investigação e escrita.",
          }),
        }}
      />

      {/* ============================================================== marca */}
      <div className={`flex flex-1 items-center ${GUTTER}`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-y-[clamp(1.5rem,4vw,4rem)]">
          {/* A marca avança 2,7% para fora da margem das linhas de baixo, como
              no ficheiro: a tinta começa aos 184 e o "Soon" aos 234. */}
          <Image
            src="/home/marca-joana-domingues.svg"
            alt="Joana Domingues"
            width={527}
            height={194}
            priority
            unoptimized
            data-entrada
            className="-ml-[2.7vw] h-auto w-[clamp(17rem,44.9vw,52rem)]"
          />
          {/* O "design" fica 15px abaixo do centro da marca, como no
              ficheiro. Deslocado por `top` e não por `transform`: a animação
              de entrada escreve `transform`, e apagava-o. */}
          <Image
            src="/home/marca-design.svg"
            alt="Design"
            width={191}
            height={33}
            unoptimized
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
                target="_blank"
                rel="noopener noreferrer me"
                className={`${CAPS} ${ALVO} text-paper transition-opacity hover:opacity-70`}
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

      {/* As páginas legais têm de ser alcançáveis a partir da entrada: esta é
          a única página que o público vê, e as ligações do rodapé vivem na
          /home, que ainda é rascunho. Vai no espaço que já sobra por baixo da
          linha do "Soon", por isso não mexe nas medidas do ficheiro. */}
      <nav
        aria-label="Informação legal"
        className={`absolute inset-x-0 bottom-[clamp(0.9rem,3.2svh,2.4rem)] flex flex-wrap gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-2 ${GUTTER}`}
      >
        <a
          href="/aviso-legal"
          className={`${CAPS} ${ALVO} text-paper/55 transition-opacity hover:text-paper`}
        >
          Aviso legal
        </a>
        <a
          href="/politica-de-privacidade"
          className={`${CAPS} ${ALVO} text-paper/55 transition-opacity hover:text-paper`}
        >
          Política de Privacidade
        </a>
      </nav>
    </main>
  );
}

/** Margem lateral: 234/1851 do ficheiro, onde começam o "Soon" e as redes. */
const GUTTER = "px-[clamp(1.25rem,12.7vw,14.5rem)]";

/** Caixa alta das redes: 14px numa moldura de 1851, espacejamento 0,18em. */
const CAPS =
  "font-sans text-[clamp(0.625rem,0.76vw,1rem)] font-semibold uppercase tracking-[0.18em]";

/* Área de toque. O texto em caixa alta tem 15px de altura e o dedo precisa de
   24 (WCAG 2.2 AA); são 5px acima e abaixo, que é enchimento a sério e não uma
   camada por cima -- assim nunca rouba o toque ao vizinho. */
const ALVO = "py-[5px]";

