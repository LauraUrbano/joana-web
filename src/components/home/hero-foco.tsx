"use client";

import Image from "next/image";
import { useEffect } from "react";

import { useMovimentoReduzido } from "./movimento";

/**
 * O retrato do hero.
 *
 * Quatro camadas sobrepostas, cada uma com o seu movimento, porque um elemento
 * só tem um `transform`: se dois movimentos escrevessem no mesmo, um apagava o
 * outro.
 *
 *   data-hero-foco      recua com o scroll (`--foco`, escrito pelo HomeMotion)
 *   data-hero-paralaxe  responde ao rato, com atraso
 *   data-hero-deriva    deriva sozinha, de um lado para o outro
 *   as duas imagens     cruzam-se em opacidade: a nítida e a desfocada
 *
 * A primeira vez que escrevi isto, o movimento ficou tão discreto que não se
 * via -- cerca de um pixel por segundo. A Joana disse-o duas vezes, e tinha
 * razão. Agora a deriva anda a uns seis pixéis por segundo, o retrato chega
 * fora de foco e resolve-se, e a fotografia respira: o desfoque sobe e desce
 * sozinho, o que faz o rasto de luz dela cintilar. É a linguagem da própria
 * imagem -- a fotografia já é sobre movimento -- e não um efeito posto por
 * cima.
 *
 * Em vez de animar `filter: blur()` a cada fotograma, que obriga o browser a
 * repintar o ecrã inteiro, há duas cópias e cruza-se a opacidade. Opacidade e
 * transform são as duas coisas que o compositor faz sem repintar.
 *
 * As imagens vêm do original a 1055 x 1491 que está no Figma, reamostradas
 * para 1600 de largura com uma máscara de nitidez leve. À largura a que isto
 * aparece -- 1440 -- a versão antiga media 8,7 de nitidez e esta mede 22,5.
 */
export default function HeroFoco() {
  const reduz = useMovimentoReduzido();

  useEffect(() => {
    if (reduz) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const raiz = document.documentElement;

    let alvoX = 0;
    let alvoY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let vivo = false;

    const passo = () => {
      x += (alvoX - x) * 0.055;
      y += (alvoY - y) * 0.055;
      // Escreve-se o deslocamento, não um `transform`: assim o retrato e o
      // texto do hero somam-no cada um à sua maneira -- o retrato inteiro, o
      // texto ao contrário e a um terço -- e dá profundidade em vez de tudo
      // andar junto.
      raiz.style.setProperty("--par-x", `${x.toFixed(2)}px`);
      raiz.style.setProperty("--par-y", `${y.toFixed(2)}px`);
      // Pára quando já chegou: não vale a pena um ciclo por fotograma a somar
      // centésimas de pixel.
      if (Math.abs(alvoX - x) < 0.05 && Math.abs(alvoY - y) < 0.05) {
        raf = 0;
        vivo = false;
        return;
      }
      raf = requestAnimationFrame(passo);
    };

    const aoMover = (e: PointerEvent) => {
      // Só enquanto o hero está à vista; mais abaixo não há nada a mover.
      if (window.scrollY > window.innerHeight) return;
      alvoX = (e.clientX / window.innerWidth - 0.5) * -52;
      alvoY = (e.clientY / window.innerHeight - 0.5) * -28;
      if (!vivo) {
        vivo = true;
        raf = requestAnimationFrame(passo);
      }
    };

    window.addEventListener("pointermove", aoMover, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", aoMover);
      raiz.style.removeProperty("--par-x");
      raiz.style.removeProperty("--par-y");
    };
  }, [reduz]);

  return (
    <div
      aria-hidden="true"
      data-hero-foco={reduz ? undefined : ""}
      className="absolute inset-0 -z-10"
    >
      <div data-hero-paralaxe={reduz ? undefined : ""} className="absolute inset-0">
        <div
          data-hero-deriva={reduz ? undefined : ""}
          className="absolute inset-0"
        >
          <Image
            src="/home/retrato-hero-1600.jpg"
            alt=""
            fill
            priority
            quality={88}
            sizes="100vw"
            className="object-cover object-[60%_center]"
          />
          {/* Sem movimento, a cópia desfocada nem chega a existir: sem a regra
              que lhe dá a opacidade, ficaria por cima da nítida a tapá-la. */}
          {reduz ? null : (
            <Image
              src="/home/retrato-hero-1600-fora-de-foco.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              data-desfocado=""
              className="object-cover object-[60%_center]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
