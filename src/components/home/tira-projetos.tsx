"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useMovimentoReduzido } from "./movimento";
import type { Peca } from "./orbita";

/** Quanto tempo cada imagem fica. A nota dela diz "a cada 4-5 segundos". */
const TEMPO = 4500;

/**
 * Os projetos em telemóvel: uma tira que se arrasta de lado, e dentro de cada
 * peça as imagens do projeto vão passando.
 *
 * A órbita em três dimensões é para ecrã grande. No telemóvel a Joana mostrou
 * como deve ser, e é o que o gravity-design.de faz nessa largura -- medi-lhe a
 * galeria a 390x844:
 *
 *   tira        overflow-x: auto, scroll-snap-type: x mandatory, barra escondida
 *   caminho     flex, gap 14px, margem lateral 22px
 *   cartão      328 x 360, ou seja 84vw -- aqui travado nos 30rem, para num
 *               tablet não ocupar o ecrã todo --, snap-align: center
 *   imagem      quadrada, 328 x 328, cantos de 6px
 *   pontos      coluna de cinco, 6px cada, 9px entre eles, creme a 0,78,
 *               dentro da imagem e encostados à direita
 *   relógio     barra de 4px, cantos de 2px, carril a 0,18, debaixo da imagem
 *   legenda     título e crédito por baixo
 *   setas       dois botões redondos de 46px, no fundo
 *
 * Aqui as proporções são as mesmas e as cores são as dela: barro e creme no
 * lugar do roxo e do preto.
 *
 * Só a peça que está ao centro é que passa imagens -- as vizinhas, que
 * espreitam nas bordas, ficam na primeira. Fazer as quatro andarem ao mesmo
 * tempo seria ruído e trabalho à toa.
 *
 * Sem movimento permitido não há passagem automática, e é por isso que os
 * pontos são botões a sério: assim continua a dar para ver todas as imagens.
 *
 * Tocar na imagem vai para a página do projeto. No telemóvel a tira já centra
 * a peça, não é preciso o passo de abrir que a órbita tem.
 */
export default function TiraProjetos({ pecas }: { pecas: Peca[] }) {
  const tira = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  // O último valor conhecido, para a medição saber quando é que a peça ao
  // centro mudou e recomeçar a apresentação dela.
  const activoRef = useRef(0);
  const [slide, setSlide] = useState(0);
  const reduz = useMovimentoReduzido();

  /* Qual a peça ao centro. */
  useEffect(() => {
    const t = tira.current;
    if (!t) return;
    let raf = 0;
    let pendente = false;
    const medir = () => {
      pendente = false;
      const meio = t.scrollLeft + t.clientWidth / 2;
      let melhor = 0;
      let menor = Infinity;
      Array.from(t.children).forEach((c, i) => {
        const el = c as HTMLElement;
        const centro = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(centro - meio);
        if (d < menor) {
          menor = d;
          melhor = i;
        }
      });
      if (activoRef.current !== melhor) {
        activoRef.current = melhor;
        setActivo(melhor);
        setSlide(0);
      }
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
  }, []);

  /* A passagem automática. Temporizador por imagem e não intervalo: assim
     tocar num ponto recomeça a contagem, que é o que se espera. */
  useEffect(() => {
    if (reduz) return;
    const n = pecas[activo]?.imagens?.length ?? 1;
    if (n < 2) return;
    const t = window.setTimeout(() => setSlide((s) => (s + 1) % n), TEMPO);
    return () => window.clearTimeout(t);
  }, [activo, slide, reduz, pecas]);

  /** Uma peça para a frente ou para trás, com o intervalo incluído. */
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
        {pecas.map((p, i) => {
          const imagens = p.imagens?.length ? p.imagens : [p.src];
          const aqui = i === activo ? slide : 0;
          return (
            <figure
              key={p.id}
              className="w-[min(84vw,30rem)] shrink-0 snap-center"
            >
              <div className="relative aspect-square overflow-hidden rounded-[6px] bg-olive-deep">
                {imagens.map((src, k) => (
                  <Image
                    key={src}
                    src={src}
                    alt={k === 0 ? `${p.titulo} — ${p.tipo}` : ""}
                    fill
                    priority={i === 0 && k === 0}
                    sizes="(min-width: 36rem) 30rem, 84vw"
                    className="object-cover transition-opacity duration-[900ms] ease-out"
                    style={{ opacity: k === aqui ? 1 : 0 }}
                  />
                ))}

                {/* A ligação cobre a imagem toda. Fora dos pontos, e não à
                    volta deles: botões dentro de uma âncora não é marcação
                    válida, e o toque ficava a disputar-se. */}
                <Link
                  href={p.href ?? "#projetos"}
                  aria-label={`Ver o projeto ${p.titulo}`}
                  className="absolute inset-0 z-10"
                />

                {/* Os pontos: coluna à direita, ao meio da imagem, como na
                    referência -- lá são 6px com 9px entre eles, creme a 0,78.
                    Botões e não enfeite: sem movimento permitido não há
                    passagem automática, e é por aqui que se vêem as outras.
                    O fio de tinta à volta é porque as fotografias dela são
                    claras, e creme sobre creme desaparecia.

                    O ponto continua a ter 6px; quem tem 24 é o botão à volta
                    dele, que é o que o dedo precisa. Por isso o `right` é 5 e
                    não 14: é a conta para o ponto ficar onde estava. Ficam
                    encostados uns aos outros, sem intervalo, para os 24px de
                    cada um não invadirem o do lado. */}
                {imagens.length > 1 && (
                  <div className="absolute right-[5px] top-1/2 z-20 flex -translate-y-1/2 flex-col">
                    {imagens.map((src, k) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => {
                          activoRef.current = i;
                          setActivo(i);
                          setSlide(k);
                        }}
                        aria-label={`Imagem ${k + 1} de ${imagens.length}`}
                        aria-current={k === aqui}
                        className="grid size-6 place-items-center"
                      >
                        <span
                          className={`size-[6px] rounded-full bg-paper shadow-[0_0_0_1px_rgb(22_20_16_/_0.34)] transition-[opacity,transform] duration-500 ${
                            k === aqui
                              ? "scale-150 opacity-[0.95]"
                              : "scale-100 opacity-40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* O relógio da imagem: enche no tempo que ela fica. Recomeça
                  porque a chave muda, o que o volta a montar. */}
              {imagens.length > 1 && (
                <div className="mt-[0.7rem] h-1 overflow-hidden rounded-[2px] bg-paper/20">
                  <span
                    key={`${i === activo ? "a" : "p"}-${aqui}`}
                    data-relogio={i === activo && !reduz ? "" : undefined}
                    className="block h-full rounded-[2px] bg-clay"
                    style={{ width: i === activo && !reduz ? undefined : "0%" }}
                  />
                </div>
              )}

              <figcaption className="mt-[0.9rem] text-paper">
                <span className="block font-serif text-[clamp(1.35rem,5.6vw,2.1rem)] leading-tight">
                  {p.titulo}
                </span>
                <span className="mt-1 block font-sans text-[clamp(0.625rem,1.9vw,0.8rem)] font-semibold uppercase tracking-[0.18em] text-paper/75">
                  {p.tipo}
                </span>
              </figcaption>
            </figure>
          );
        })}
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
