import type { Metadata } from "next";

import Navegacao from "@/components/painel/navegacao";
import {
  escritosTodos,
  ligacoesTodas,
  projetosTodos,
} from "@/lib/painel/conteudo-db";
import { quemPede } from "@/lib/painel/sessao";

import Sair from "./sair";

/**
 * A moldura do painel: o menu à esquerda, o trabalho à direita.
 *
 * Esteve aqui uma coluna só, com tudo empilhado -- os projetos, os textos, as
 * ligações e o contacto na mesma página, um a seguir ao outro. Para ver os
 * contactos era preciso passar por tudo o resto. Agora cada coisa é uma secção
 * com o seu endereço, e o menu diz onde se está.
 *
 * A página de entrada usa esta mesma moldura mas sem menu: antes de haver
 * sessão não há secções para onde ir. É por isso que o menu depende da sessão
 * em vez de estar sempre.
 */
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const quem = await quemPede();

  if (!quem) {
    return (
      <div className="min-h-svh bg-paper-warm px-6 py-[clamp(2rem,6vw,5rem)] text-clay">
        <main className="mx-auto w-full max-w-[26rem]">{children}</main>
      </div>
    );
  }

  const [projetos, escritos, ligacoes] = await Promise.all([
    projetosTodos(),
    escritosTodos(),
    ligacoesTodas(),
  ]);

  return (
    <div className="min-h-svh bg-paper-warm text-clay">
      <div className="mx-auto grid w-full max-w-[72rem] gap-x-10 px-5 py-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-8 lg:py-10">
        <div className="lg:border-r lg:border-clay/20 lg:pr-8">
          <header className="mb-6 hidden lg:block">
            <p className="font-serif text-[1.5rem] leading-none">Painel</p>
            <p className="mt-1 truncate font-body text-[0.95rem] opacity-60">
              {quem.nome || quem.email}
            </p>
          </header>

          <Navegacao
            conteudo={[
              { href: "/painel/projetos", label: "Projetos", conta: projetos.length },
              { href: "/painel/escritos", label: "Textos", conta: escritos.length },
              { href: "/painel/ligacoes", label: "Ligações", conta: ligacoes.length },
              { href: "/painel/contacto", label: "Contacto" },
            ]}
            definicoes={[
              { href: "/painel/ajuda", label: "Ajuda" },
              { href: "/painel/definicoes", label: "Definições" },
            ]}
          />

          <div className="mt-6 lg:mt-8">
            <Sair />
          </div>
        </div>

        <main className="min-w-0 pt-8 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
