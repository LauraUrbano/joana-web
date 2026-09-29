import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import LiquidBackground from "@/components/liquid-background";
import { Arrow, Pill, SectionLabel } from "@/components/home/primitives";
import { GridArt, Swatches } from "@/components/projeto/bits";
import CaseMotion from "@/components/projeto/motion";
import { PROJETOS, getProjeto } from "@/lib/projetos";

export function generateStaticParams() {
  return PROJETOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projetos/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const projeto = getProjeto(slug);
  if (!projeto) return { title: "Projeto — Joana Domingues" };
  return {
    title: `${projeto.nome.sans} ${projeto.nome.serif} — Joana Domingues`,
    description: projeto.premissa,
    // Enquanto a entrada do site for a página "em breve", isto é rascunho,
    // como a /home. Apaga-se quando for para publicar.
    robots: { index: false, follow: false },
  };
}

/** Título em duas vozes: a metade serifada chega um tempo depois. */
function Split({
  sans,
  serif,
  className = "",
  quebra = false,
}: {
  sans: string;
  serif: string;
  className?: string;
  quebra?: boolean;
}) {
  return (
    <span data-split className={className}>
      <span className="font-bold uppercase tracking-[-0.018em]">{sans}</span>
      {quebra ? <br /> : " "}
      <span
        data-late
        className="inline-block font-serif font-normal italic tracking-normal"
      >
        {serif}
      </span>
    </span>
  );
}

export default async function ProjetoPage(props: PageProps<"/projetos/[slug]">) {
  const { slug } = await props.params;
  const projeto = getProjeto(slug);
  if (!projeto) notFound();

  const { secoes: s, ramp } = projeto;
  const banda = "py-[clamp(3.5rem,7.5vw,11rem)] px-[clamp(1rem,7.4vw,9rem)]";
  const gutter = "px-[clamp(1rem,7.4vw,9rem)]";

  return (
    <div className="min-h-dvh overflow-x-clip bg-paper text-ink">
      <CaseMotion />

      <header className="sticky top-0 z-50 bg-ink text-paper">
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between gap-4 py-3 ${gutter}`}
        >
          <Link
            href="/home"
            className="text-[0.6875rem] font-bold uppercase tracking-[0.14em]"
          >
            Joana Domingues
          </Link>
          <Link
            href="/home#work"
            className="flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] opacity-70 transition-opacity hover:opacity-100"
          >
            Todos os projetos
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------ capa */}
      <section
        data-cover
        className="relative isolate overflow-hidden"
        style={{ background: ramp[0] }}
      >
        {/* Gradiente estático: base e fallback caso não haja WebGL. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 95% at 42% 38%, ${ramp[2]} 0%, ${ramp[1]} 44%, ${ramp[0]} 100%)`,
          }}
        />
        <div data-cover-veil className="absolute inset-0">
          <LiquidBackground ramp={ramp} />
        </div>

        <div
          className={`relative grid gap-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,5rem)] pt-[clamp(3.5rem,9vw,9rem)] ${gutter}`}
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <SectionLabel className="opacity-60">{projeto.indice}</SectionLabel>
            <SectionLabel className="opacity-60">{projeto.ambito}</SectionLabel>
            <SectionLabel className="opacity-60">{projeto.ano}</SectionLabel>
          </div>
          <h1 className="text-[clamp(3rem,13vw,11rem)] leading-[0.88] text-balance">
            <Split sans={projeto.nome.sans} serif={projeto.nome.serif} quebra />
          </h1>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[26ch] font-serif text-[clamp(1.125rem,2.3vw,2.1rem)] italic leading-[1.34]">
              {projeto.premissa}
            </p>
            <span className="text-[0.625rem] uppercase tracking-[0.16em] opacity-60">
              Ler o caso ↓
            </span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- 01 premissa */}
      <section className={banda}>
        <div className="mx-auto grid max-w-[1600px] gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,7rem)]">
          <aside className="self-start lg:sticky lg:top-24">
            <dl className="grid gap-[1.1rem]">
              {projeto.ficha.map((f) => (
                <div key={f.termo}>
                  <dt className="mb-1 text-[0.625rem] uppercase tracking-[0.16em] opacity-45">
                    {f.termo}
                  </dt>
                  <dd className="text-sm leading-[1.45]">{f.valor}</dd>
                </div>
              ))}
            </dl>
          </aside>
          <div>
            <SectionLabel>01 — Premissa</SectionLabel>
            <h2 className="mb-6 mt-4 text-[clamp(1.75rem,4.4vw,3.75rem)] leading-[1.08] text-balance">
              <Split sans={s.premissa.sans} serif={s.premissa.serif} />
            </h2>
            <div className="grid gap-[1.1rem]">
              {s.premissa.corpo.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="max-w-[62ch] text-[clamp(0.8125rem,1.05vw,1rem)] leading-[1.7] opacity-[0.78]"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- peça */}
      <figure className="bg-paper-warm">
        <Image
          src="/mockup-portatil.webp"
          alt="Plataforma de consulta aberta num portátil"
          width={679}
          height={580}
          sizes="100vw"
          className="max-h-[78vh] w-full object-cover"
        />
        <figcaption
          className={`flex items-baseline gap-2 pb-6 pt-3.5 text-[0.6875rem] opacity-55 ${gutter}`}
        >
          <b className="font-serif font-normal italic opacity-90">
            Plataforma de consulta
          </b>
          — a mesma nomenclatura em papel e em ecrã.
        </figcaption>
      </figure>

      {/* ---------------------------------------------------- 02 sistema */}
      <section className={`bg-white ${banda}`}>
        <div className="mx-auto max-w-[1600px]">
          <SectionLabel>02 — O sistema</SectionLabel>
          <h2 className="mb-6 mt-4 text-[clamp(1.75rem,4.4vw,3.75rem)] leading-[1.08] text-balance">
            <Split sans={s.sistema.sans} serif={s.sistema.serif} />
          </h2>
          <p className="max-w-[62ch] text-[clamp(0.8125rem,1.05vw,1rem)] leading-[1.7] opacity-[0.78]">
            {s.sistema.intro}
          </p>

          <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-3">
            <div className="min-w-0 p-[clamp(1.1rem,2vw,1.6rem)] ring-1 ring-inset ring-ink/15">
              <SectionLabel>Tipografia</SectionLabel>
              <div className="mt-3 grid gap-0.5">
                <span className="text-[clamp(1.4rem,3vw,2.1rem)] font-bold uppercase leading-none tracking-[-0.02em]">
                  {s.sistema.espécime.alto}
                </span>
                <span className="font-serif text-[clamp(1.5rem,3.2vw,2.3rem)] italic leading-none">
                  {s.sistema.espécime.baixo}
                </span>
              </div>
              <p className="mt-2 text-[0.625rem] uppercase tracking-[0.2em] opacity-45">
                {s.sistema.espécime.nota}
              </p>
              <p className="mt-3 text-xs leading-[1.7] opacity-[0.68]">
                {s.sistema.espécime.corpo}
              </p>
            </div>

            <div className="min-w-0 p-[clamp(1.1rem,2vw,1.6rem)] ring-1 ring-inset ring-ink/15">
              <SectionLabel>Paleta</SectionLabel>
              <Swatches valores={s.sistema.paleta.valores} />
              <h3 className="mb-2 mt-3.5 font-serif text-[1.3rem] leading-tight">
                {s.sistema.paleta.titulo}
              </h3>
              <p className="text-xs leading-[1.7] opacity-[0.68]">
                {s.sistema.paleta.corpo}{" "}
                <em className="font-serif">Clica num valor para copiar.</em>
              </p>
            </div>

            <div className="min-w-0 p-[clamp(1.1rem,2vw,1.6rem)] ring-1 ring-inset ring-ink/15">
              <SectionLabel>Grelha</SectionLabel>
              <GridArt
                colunas={s.sistema.grelha.colunas}
                sinal={s.sistema.grelha.sinal}
                label={`Grelha de ${s.sistema.grelha.colunas} colunas, com a faixa de sinal`}
              />
              <h3 className="mb-2 mt-3.5 font-serif text-[1.3rem] leading-tight">
                {s.sistema.grelha.titulo}
              </h3>
              <p className="text-xs leading-[1.7] opacity-[0.68]">
                {s.sistema.grelha.corpo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ 03 peças */}
      <section data-lat className="overflow-x-clip bg-lilac text-ink">
        <div data-lat-stick>
          <div
            className={`pb-[clamp(1.5rem,3vw,2.5rem)] pt-[clamp(3.5rem,7.5vw,11rem)] ${gutter}`}
          >
            <div className="mx-auto max-w-[1600px]">
              <SectionLabel>03 — Peças</SectionLabel>
              <h2 className="mt-4 text-[clamp(1.6rem,4vw,3.25rem)] leading-[1.1] text-balance">
                <Split sans={s.pecas.sans} serif={s.pecas.serif} />
              </h2>
            </div>
          </div>
          <ul
            data-lat-track
            className={`flex snap-x snap-mandatory gap-[clamp(0.75rem,1.5vw,1.5rem)] overflow-x-auto pb-[clamp(3.5rem,7.5vw,11rem)] [scrollbar-width:none] ${gutter}`}
          >
            {s.pecas.lista.map((p) => (
              <li
                key={p.titulo}
                className="grid aspect-[4/5] w-[min(74vw,22rem)] flex-none snap-center content-center gap-1.5 p-4 text-center ring-1 ring-inset ring-ink/25 lg:w-[min(26vw,24rem)]"
                style={{ background: "rgba(245,240,232,0.35)" }}
              >
                <b className="font-serif text-lg font-normal italic">
                  {p.titulo}
                </b>
                <span className="text-[0.5625rem] uppercase tracking-[0.16em] opacity-60">
                  {p.nota}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------- 04 resultado */}
      <section className={`bg-ink text-paper ${banda}`}>
        <div className="mx-auto max-w-[1600px]">
          <SectionLabel className="opacity-55">04 — Resultado</SectionLabel>
          <h2 className="mt-4 text-[clamp(1.75rem,4.4vw,3.75rem)] leading-[1.08] text-balance">
            <Split sans={s.resultado.sans} serif={s.resultado.serif} />
          </h2>
          <div className="mt-[clamp(2rem,4vw,3rem)] grid gap-[clamp(1.5rem,3vw,2.5rem)] sm:grid-cols-3">
            {s.resultado.numeros.map((n) => (
              <div key={n.valor + n.corpo.slice(0, 12)} className="border-t border-paper/25 pt-4">
                <b className="block text-[clamp(2.25rem,5.5vw,4.25rem)] font-bold leading-none tracking-[-0.03em] tabular-nums">
                  {n.valor}
                  {n.unidade ? (
                    <em className="font-serif text-[0.55em] font-normal italic tracking-normal">
                      {" "}
                      {n.unidade}
                    </em>
                  ) : null}
                </b>
                <p className="mt-2.5 text-xs leading-[1.6] opacity-[0.66]">
                  {n.corpo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- 05 seguinte */}
      <section className={`bg-paper ${banda}`}>
        <div className="mx-auto max-w-[1600px]">
          <Link href={projeto.seguinte.slug ? `/projetos/${projeto.seguinte.slug}` : "/home#work"} className="block">
            <SectionLabel className="mb-2">Projeto seguinte</SectionLabel>
            <div className="nextmark overflow-hidden whitespace-nowrap text-[clamp(2.25rem,10.4vw,9rem)] font-bold uppercase leading-[0.95] tracking-[-0.025em]">
              {projeto.seguinte.nome}
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
              <SectionLabel>{projeto.seguinte.ambito}</SectionLabel>
              <span className="font-serif text-sm italic opacity-60">
                passa por cima do nome
              </span>
            </div>
          </Link>
        </div>
      </section>

      <footer className={`bg-ink pb-8 text-paper ${banda}`}>
        <div className="mx-auto grid max-w-[1600px] gap-6 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <SectionLabel className="text-paper">
              Joana Domingues Design Studio
            </SectionLabel>
            <p className="mt-2 max-w-[34ch] text-xs leading-[1.75] opacity-60">
              Estúdio de design e investigação, a trabalhar a partir de Portugal.
            </p>
            <div className="mt-6">
              <Pill href="/home#contact" tone="lilac">
                Falar do próximo <Arrow />
              </Pill>
            </div>
          </div>
          <div>
            <SectionLabel className="text-paper">Serviços</SectionLabel>
            <ul className="mt-3 grid gap-1.5 text-xs opacity-60">
              <li>Branding</li>
              <li>Design digital</li>
              <li>Comunicação</li>
              <li>Investigação</li>
            </ul>
          </div>
          <div>
            <SectionLabel className="text-paper">Contacto</SectionLabel>
            <ul className="mt-3 grid gap-1.5 text-xs opacity-60">
              <li>jcm@linear.com.pt</li>
              <li>LinkedIn</li>
              <li>Instagram</li>
              <li>ORCID</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-[0.625rem] tracking-[0.1em] opacity-40">
          Cliente, números e peças são conteúdo de exemplo, para avaliar a
          página. Não é trabalho real do estúdio.
        </p>
      </footer>
    </div>
  );
}
