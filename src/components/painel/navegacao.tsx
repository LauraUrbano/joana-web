"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * O menu do painel.
 *
 * É a única peça do painel que corre no browser, e corre por uma razão só:
 * saber em que secção estamos para a marcar. Tudo o resto -- os formulários, as
 * gravações -- é do servidor.
 *
 * No telemóvel passa a uma fila que se arrasta na horizontal, em vez de uma
 * coluna: numa coluna, o conteúdo começava dois ecrãs abaixo.
 */

export type Entrada = {
  href: string;
  label: string;
  conta?: number;
};

export default function Navegacao({
  conteudo,
  definicoes,
}: {
  conteudo: Entrada[];
  definicoes: Entrada[];
}) {
  return (
    <nav aria-label="Secções do painel">
      <Grupo titulo="Conteúdo" entradas={conteudo} />
      <div className="mt-8 hidden lg:block">
        <Grupo titulo="Painel" entradas={definicoes} />
      </div>
      <div className="mt-6 lg:hidden">
        <Grupo entradas={definicoes} />
      </div>
    </nav>
  );
}

function Grupo({
  titulo,
  entradas,
}: {
  titulo?: string;
  entradas: Entrada[];
}) {
  return (
    <>
      {titulo && (
        <p className="mb-3 hidden text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-40 lg:block">
          {titulo}
        </p>
      )}
      <ul className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0">
        {entradas.map((e) => (
          <li key={e.href} className="shrink-0">
            <Item {...e} />
          </li>
        ))}
      </ul>
    </>
  );
}

function Item({ href, label, conta }: Entrada) {
  const caminho = usePathname();
  // A secção está activa também quando se está a editar algo dentro dela --
  // /painel/projetos/carla-rocha continua a ser "Projetos".
  const activo = caminho === href || caminho.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`flex items-baseline justify-between gap-3 whitespace-nowrap rounded-sm px-3 py-2 font-body text-[1.02rem] transition-colors ${
        activo
          ? "bg-clay text-paper"
          : "text-clay hover:bg-clay/10"
      }`}
    >
      <span>{label}</span>
      {conta !== undefined && (
        <span className={`text-[0.8rem] ${activo ? "opacity-70" : "opacity-40"}`}>
          {conta}
        </span>
      )}
    </Link>
  );
}
