import Image from "next/image";
import Link from "next/link";

import MenuTelemovel from "@/components/home/menu-telemovel";
import Seta from "@/components/seta";
import { lerRedes } from "@/lib/conteudo";
import { ALVO, CAPS, GUTTER } from "@/lib/tipo";

/** Os destinos do sítio, na ordem do ficheiro. */
export const DESTINOS = [
  { label: "Projetos", href: "/#projetos" },
  { label: "Investigação", href: "/#percursos" },
  { label: "Escrita", href: "/escrita" },
] as const;

/**
 * A cabeça das páginas interiores, como no ficheiro: a marca à esquerda, os
 * destinos à direita, e o contacto num botão cheio -- na home é um risco por
 * baixo, aqui é um botão, e é assim que está desenhado.
 *
 * O destino onde estamos fica sublinhado. No telemóvel os destinos saem e fica
 * o menu, que é o mesmo da home (a moldura estreita do ficheiro desta página
 * tem lá as duas linhas no canto, tal e qual).
 */
export default function Cabecalho({ activo }: { activo?: string }) {
  return (
    <header
      className={`flex items-start justify-between gap-6 py-[clamp(1.5rem,3.9vw,4rem)] ${GUTTER}`}
    >
      <Link href="/" aria-label="Joana Domingues Design, início">
        {/* 382/1669 de largura no ficheiro */}
        <Image
          src="/home/marca-topo.webp"
          alt="Joana Domingues Design"
          width={671}
          height={151}
          priority
          className="h-auto w-[clamp(9rem,22.9vw,24rem)]"
        />
      </Link>

      <nav className="hidden items-center gap-x-[clamp(1rem,2.8vw,3rem)] md:flex">
        {DESTINOS.map((d) => {
          const aqui = d.label === activo;
          return (
            <Link
              key={d.label}
              href={d.href}
              aria-current={aqui ? "page" : undefined}
              className={`${CAPS} ${ALVO} text-clay transition-opacity hover:opacity-60 ${
                aqui ? "border-b border-clay" : ""
              }`}
            >
              {d.label}
            </Link>
          );
        })}
        <Link
          href="/#conversar"
          className={`${CAPS} flex items-center gap-3 bg-clay px-[clamp(0.75rem,1.4vw,1.5rem)] py-[clamp(0.5rem,0.72vw,0.8rem)] text-paper transition-opacity hover:opacity-80`}
        >
          Entrar em contacto <Seta />
        </Link>
      </nav>

      <div className="md:hidden">
        <MenuTelemovel destinos={[...DESTINOS]} redes={lerRedes("menu")} />
      </div>
    </header>
  );
}
