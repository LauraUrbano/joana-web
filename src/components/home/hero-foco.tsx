"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useMovimentoReduzido } from "./movimento";

/**
 * O retrato do hero, com foco conduzido pelo scroll.
 *
 * Medido no gravity-design.de: parado, o hero deles não mexe nada -- nem o
 * retrato, nem o canvas, nem os cartões da órbita. Todo o movimento daquele
 * site vem do scroll. Por isso aqui também não há nada a animar sozinho.
 *
 * O que acontece é motivado pela transição: o hero fica fixo enquanto o
 * capítulo seguinte sobe por cima dele, e à medida que recua perde o foco e
 * afasta-se um pouco, como uma câmara a mudar de plano. A fotografia dela já
 * é sobre movimento -- tem o rasto de luz -- por isso o desfoque é a
 * linguagem da própria imagem, não um efeito posto por cima.
 *
 * Em vez de animar `filter: blur()` a cada fotograma, que obriga o browser a
 * repintar o ecrã inteiro, há duas cópias sobrepostas -- nítida e desfocada --
 * e cruza-se a opacidade. Opacidade e transform são as duas coisas que o
 * compositor faz sem repintar.
 */
export default function HeroFoco() {
  const caixa = useRef<HTMLDivElement>(null);
  const reduz = useMovimentoReduzido();

  useEffect(() => {
    if (reduz) return;
    const el = caixa.current;
    if (!el) return;

    let raf = 0;
    let pendente = false;

    const medir = () => {
      pendente = false;
      // O hero é sticky: mede-se quanto já se desceu dentro do primeiro ecrã.
      const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
      el.style.setProperty("--foco", p.toFixed(4));
    };
    const agendar = () => {
      if (pendente) return;
      pendente = true;
      raf = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [reduz]);

  return (
    <div
      ref={caixa}
      aria-hidden="true"
      data-hero-foco={reduz ? undefined : ""}
      className="absolute inset-0 -z-10"
    >
      <Image
        src="/home/retrato-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_center]"
      />
      {/* Sem movimento, a cópia desfocada nem chega a existir: sem a regra
          que lhe dá a opacidade, ficaria por cima da nítida a tapá-la. */}
      {reduz ? null : (
        <Image
          src="/home/retrato-hero-fora-de-foco.jpg"
          alt=""
          fill
          sizes="100vw"
          data-desfocado=""
          className="object-cover object-[60%_center]"
        />
      )}
    </div>
  );
}
