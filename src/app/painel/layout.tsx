import type { Metadata } from "next";

/**
 * A moldura das páginas do painel: a entrada e a sala de máquinas.
 *
 * Não é o painel de conteúdos -- esse é o /admin, que é a ferramenta. Isto é o
 * que está antes dele: quem entra, e onde a chave do repositório se guarda.
 *
 * Fora do sítio, de propósito: sem tipografia do desenho, sem cabeçalho, sem
 * rodapé. É uma porta, e uma porta não precisa de retrato.
 */
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-paper-warm px-6 py-[clamp(2rem,6vw,5rem)] text-clay">
      <main className="mx-auto w-full max-w-[34rem]">{children}</main>
    </div>
  );
}
