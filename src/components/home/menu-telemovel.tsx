"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * O menu do telemóvel, que está no ficheiro em dois estados -- fechado e
 * aberto -- e que não existia no sítio.
 *
 * Fechado: duas linhas no canto superior direito. Não é um hambúrguer de três
 * linhas; são duas, de 36 por 2, a 20 uma da outra. Medi-as no SVG do ficheiro.
 *
 * Aberto: o ecrã todo, com o retrato dela por trás e um véu por cima
 * (rgba(86,91,92,0.48), o rectângulo que está no ficheiro). A marca "JOANA" em
 * cima à esquerda, o fecho à direita, os três destinos em serifado com um
 * risco debaixo de cada um, as redes, e o "entrar em contacto" ao fundo.
 *
 * É um `<dialog>` aberto com `showModal`, e não uma camada qualquer, por duas
 * razões. A primeira é que o browser trata sozinho do que seria preciso
 * escrever à mão e esquecer: a tecla de escape, o foco preso lá dentro e
 * devolvido ao botão à saída, e o resto da página escondido de quem lê por
 * voz. A segunda é geometria: o botão vive dentro do hero, que tem
 * `transform`, e um `position: fixed` dentro de um elemento transformado passa
 * a contar a partir dele em vez do ecrã -- o painel ficava torto. A camada de
 * topo do `<dialog>` não está sujeita a isso.
 *
 * As duas linhas e a cruz vão desenhadas aqui e não como ficheiro: são duas
 * rectas, reproduzo-as exactamente, e assim herdam a cor e passam de uma à
 * outra com uma rotação em vez de uma troca de imagem. A marca já é um
 * logótipo, essa vem do ficheiro.
 *
 * Proporções: o ficheiro desenha isto numa moldura de 681 de largura, por isso
 * cada medida é a fracção dela -- 68/681 para os destinos, e por aí fora --,
 * travada no valor que atinge aos 440px, que é onde o telemóvel acaba.
 */
export default function MenuTelemovel({
  destinos,
  redes,
}: {
  destinos: { label: string; href: string }[];
  redes: { nome: string; href: string | null }[];
}) {
  const [aberto, setAberto] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);

  /* O `<dialog>` abre-se e fecha-se por método, não por atributo: é isso que
     o põe na camada de topo. A página por baixo deixa de rolar -- o modal
     trava o foco, mas em alguns browsers o dedo ainda arrasta o que está lá
     atrás. */
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
    if (!aberto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = antes;
    };
  }, [aberto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir o menu"
        aria-expanded={aberto}
        /* O desenho tem 20px de largura num telemóvel; o dedo precisa de 44, e
           é por isso que o botão é maior do que aquilo que se vê. */
        className="-my-3 -mr-3 flex size-11 items-center justify-end p-3 text-paper md:hidden"
      >
        <Linhas />
      </button>

      <dialog
        ref={dialogo}
        aria-label="Menu"
        onClose={() => setAberto(false)}
        /* Um clique no fundo também fecha. O `<dialog>` recebe o clique da
           moldura toda; o conteúdo lá dentro pára-o. */
        onClick={(e) => {
          if (e.target === dialogo.current) setAberto(false);
        }}
        data-menu
        className="m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent md:hidden"
      >
        <Image
          src="/home/retrato-hero-1600.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[rgb(86_91_92_/_0.48)]"
        />

        <div className="flex h-full flex-col px-[clamp(1.25rem,6.8vw,7.5rem)] py-[clamp(1.5rem,5.9vw,6rem)]">
          <div className="flex items-start justify-between">
            {/* 89/681 de largura */}
            <Image
              src="/home/marca-joana.svg"
              alt="Joana Domingues"
              width={89}
              height={29}
              unoptimized
              className="h-auto w-[min(13.07vw,89px)]"
            />
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar o menu"
              className="-my-3 -mr-3 flex size-11 items-center justify-end p-3 text-paper"
            >
              <Linhas cruz />
            </button>
          </div>

          {/* O espaço que sobra reparte-se em três, e não fica todo num
              sítio: no ficheiro os destinos começam a 18,6% da altura, as
              redes a 61,6% e o contacto a 90,6%. Como a moldura dele é mais
              baixa do que um telemóvel em proporção, essas percentagens não se
              copiam -- mas repartindo a folga 1 : 1 : 1,6 cai-se a dois
              pontos percentuais de cada uma delas. */}
          <Folga />

          {/* 68/681, com um risco debaixo de cada destino */}
          <nav className="flex flex-col">
            {destinos.map((d, i) => (
              <a
                key={d.label}
                href={d.href}
                onClick={() => setAberto(false)}
                data-entrada-menu
                style={{ "--atraso": `${0.05 * i + 0.06}s` } as CSSProperties}
                className="border-b border-paper/60 pb-[min(3vw,20px)] pt-[min(4.4vw,30px)] font-serif text-[min(9.99vw,68px)] leading-none text-paper transition-opacity hover:opacity-70"
              >
                {d.label}
              </a>
            ))}
          </nav>

          {/* As redes a seguir, e o contacto encostado ao fundo, como no
              ficheiro. Lá são 17/681; aqui seguem a escala das maiúsculas do
              resto do telemóvel, que é o que ela pediu para uniformizar. */}
          <Folga />

          <ul
            data-entrada-menu
            style={{ "--atraso": "0.24s" } as CSSProperties}
            className="mt-[min(4vw,27px)] flex flex-col"
          >
            {redes.map((r) => (
              <li key={r.nome}>
                {r.href ? (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    onClick={() => setAberto(false)}
                    className={`${REDE} text-paper transition-opacity hover:opacity-70`}
                  >
                    {r.nome}
                  </a>
                ) : (
                  <span className={`${REDE} text-paper/70`}>{r.nome}</span>
                )}
              </li>
            ))}
          </ul>

          <Folga vezes={1.6} />

          <a
            href="#conversar"
            onClick={() => setAberto(false)}
            data-entrada-menu
            style={{ "--atraso": "0.3s" } as CSSProperties}
            className="mt-[min(4vw,27px)] flex items-center gap-3 border-t border-paper/60 pt-[min(5vw,34px)] font-sans text-[min(3.23vw,14px)] font-bold uppercase tracking-[0.148em] text-paper transition-opacity hover:opacity-70"
          >
            Entrar em contacto
            <span aria-hidden="true" className="inline-block -rotate-45">
              →
            </span>
          </a>
        </div>
      </dialog>
    </>
  );
}

/** Espaço que estica. `vezes` é quanto desta folga leva, face às outras. */
function Folga({ vezes = 1 }: { vezes?: number }) {
  return (
    <span
      aria-hidden="true"
      className="block"
      style={{ flex: `${vezes} 1 0%` }}
    />
  );
}

/** Uma rede na lista: maiúsculas da escala do telemóvel, com área de toque. */
const REDE =
  "inline-block py-[7px] font-sans text-[min(3.23vw,14px)] font-bold uppercase tracking-[0.148em]";

/**
 * As duas linhas do ficheiro: 36 por 2, a 20 uma da outra, numa caixa de
 * 36x22. `cruz` roda-as uma contra a outra e dá o fecho, que no ficheiro é
 * exactamente isso -- duas rectas de 2 a cruzarem-se.
 */
function Linhas({ cruz = false }: { cruz?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative block h-[min(3.23vw,22px)] w-[min(5.29vw,36px)]"
    >
      {[0, 1].map((i) => (
        <span
          key={i}
          className="absolute inset-x-0 block h-[2px] origin-center bg-current"
          style={{
            top: cruz ? "calc(50% - 1px)" : i === 0 ? 0 : "calc(100% - 2px)",
            transform: cruz ? `rotate(${i === 0 ? 45 : -45}deg)` : undefined,
          }}
        />
      ))}
    </span>
  );
}
