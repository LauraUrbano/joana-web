"use client";

import Image from "next/image";

import { useMovimentoReduzido } from "./movimento";

/**
 * O retrato do hero.
 *
 * Duas camadas, e cada uma com o seu movimento:
 *
 *  - A de fora recua com o scroll (`--foco`, escrito pelo HomeMotion): o hero
 *    fica fixo enquanto o capítulo seguinte sobe por cima dele, e à medida que
 *    recua perde o foco e afasta-se, como uma câmara a mudar de plano.
 *  - A de dentro deriva sozinha, muito devagar -- 26 segundos a ir e a vir.
 *    A fotografia dela já é sobre movimento, tem o rasto de luz; isto é só
 *    para a imagem não ficar completamente parada à espera do primeiro scroll.
 *
 * São duas camadas e não uma porque um elemento só tem um `transform`: se o
 * scroll e a deriva escrevessem no mesmo, uma apagava a outra.
 *
 * Em vez de animar `filter: blur()` a cada fotograma, que obriga o browser a
 * repintar o ecrã inteiro, há duas cópias sobrepostas -- nítida e desfocada --
 * e cruza-se a opacidade. Opacidade e transform são as duas coisas que o
 * compositor faz sem repintar.
 *
 * As imagens vêm do original a 1055 x 1491 que está no Figma, reamostradas
 * para 1600 de largura com uma máscara de nitidez leve. À largura a que isto
 * aparece -- 1440 -- a versão antiga media 8,7 de nitidez e esta mede 22,5:
 * o hero estava a ser ampliado 36% pelo browser, e era isso que se via.
 */
export default function HeroFoco() {
  const reduz = useMovimentoReduzido();

  return (
    <div
      aria-hidden="true"
      data-hero-foco={reduz ? undefined : ""}
      className="absolute inset-0 -z-10"
    >
      <div data-hero-deriva={reduz ? undefined : ""} className="absolute inset-0">
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
            sizes="100vw"
            data-desfocado=""
            className="object-cover object-[60%_center]"
          />
        )}
      </div>
    </div>
  );
}
