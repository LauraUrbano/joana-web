import type { Metadata } from "next";
import Image from "next/image";
import {
  Arrow,
  ImageSlot,
  Pill,
  SectionLabel,
} from "@/components/home/primitives";

export const metadata: Metadata = {
  title: "Joana Domingues — Design Studio",
  description:
    "Branding, design digital e investigação académica. Estúdio de design em Portugal.",
};

const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Contact", href: "#contact" },
];

const WORKS = [
  { n: "01", title: "Rukom", kind: "sans", meta: "Digital design · Branding", year: "2025" },
  { n: "02", title: "Segmento Urbano", kind: "serif", meta: "Brand identity · Visual identity", year: "2024" },
  { n: "03", title: "Carla Rocha", kind: "sans", meta: "Branding · Art direction", year: "2024" },
  { n: "04", title: "International Conference on Degrowth 2027", kind: "serif", meta: "Identity · Conference", year: "2023" },
] as const;

const METHOD = [
  { n: "01", title: "Understand", kind: "sans", body: "Começo pelo contexto e pelas pessoas a quem o trabalho se dirige, antes de qualquer decisão visual." },
  { n: "02", title: "Structure", kind: "serif", body: "Organizo conteúdo e sistemas, para que o desenho assente numa estrutura e não no acaso." },
  { n: "03", title: "Design", kind: "sans", body: "Desenho identidade e interface como um sistema coerente, do detalhe ao conjunto." },
  { n: "04", title: "Question", kind: "serif", body: "Devolvo o trabalho à prova: o que resiste fica, o que não resiste volta à mesa." },
] as const;

const RESEARCH = [
  { label: "Research", title: "PhD Research", body: "Investigação doutoral no cruzamento entre design e tecnologias emergentes." },
  { label: "Publications", title: "Academic Writing", body: "Artigos, ensaios e comunicações em torno de design, prática e investigação." },
  { label: "Academic profiles", title: "ORCID & Ciência Vitae", body: "Perfis académicos, publicações e atividade de investigação." },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-paper text-ink">
      {/* ---------------------------------------------------------------- nav */}
      <header className="sticky top-0 z-50 bg-ink text-paper">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3 lg:px-10">
          <a
            href="#top"
            className="text-[0.6875rem] font-bold uppercase tracking-[0.14em]"
          >
            Joana Domingues
          </a>
          <nav className="hidden gap-8 md:flex">
            {NAV.map((i) => (
              <a
                key={i.href}
                href={i.href}
                className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] opacity-70 transition-opacity hover:opacity-100"
              >
                {i.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-paper px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-85"
          >
            Get in touch
          </a>
        </div>
      </header>

      {/* -------------------------------------------------------------- hero */}
      <section id="top" className="bg-paper pb-0 pt-6 lg:pt-8">
        <h1 className="overflow-hidden whitespace-nowrap px-[1.5%] text-center text-[10.3vw] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-lilac-soft">
          Joana Domingues
        </h1>

        <div className="mx-auto mt-8 grid max-w-[1600px] grid-cols-1 items-end gap-8 px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          <div className="hidden lg:block" />
          <Image
            src="/joana-retrato.jpg"
            alt="Retrato de Joana Domingues"
            width={480}
            height={542}
            priority
            sizes="(max-width: 1024px) 70vw, 340px"
            className="mx-auto h-auto w-[min(70vw,340px)] object-cover"
          />
          <p className="text-left text-[clamp(1.25rem,2.1vw,2rem)] font-bold uppercase leading-[1.15] tracking-[-0.01em] lg:pb-6 lg:text-right">
            Where
            <br />
            <span className="text-ink">Design</span>{" "}
            <span className="opacity-45">meets</span>
            <br />
            Research
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1600px] flex-col gap-4 border-t border-ink/10 px-6 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
          <span className="w-fit rounded-full bg-lilac px-4 py-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em]">
            Lisboa, Portugal
          </span>
          <p className="text-[0.6875rem] uppercase tracking-[0.1em] opacity-55">
            Branding, design digital e investigação académica
          </p>
          <a
            href="#work"
            className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-60"
          >
            View selected work <Arrow />
          </a>
        </div>
      </section>

      {/* --------------------------------------------------------- manifesto */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[1.25fr_1fr] lg:px-10 lg:py-28">
          <h2 className="text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.06] tracking-[-0.02em]">
            <span className="font-bold uppercase">Design has never</span>
            <br />
            <span className="font-bold uppercase">Been </span>
            <span className="font-serif">static.</span>
            <br />
            <span className="font-bold uppercase">Neither has </span>
            <span className="font-serif">my</span>
            <br />
            <span className="font-serif">practice.</span>
          </h2>
          <div className="flex flex-col justify-end gap-4 text-[0.8125rem] leading-[1.7] opacity-70">
            <p>
              Ao longo dos anos trabalhei em branding, comunicação e design
              digital, ajudando organizações a traduzir aquilo que fazem em
              sistemas visuais claros e com sentido.
            </p>
            <p>
              Hoje, a minha prática atravessa a investigação, o trabalho de
              estúdio e o ensino, com interesse particular em como as
              tecnologias emergentes estão a mudar a forma como desenhamos,
              pensamos e colaboramos.
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- explore */}
      <section className="relative overflow-hidden bg-butter">
        <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="relative mx-auto max-w-[620px] text-center">
            <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.2] tracking-[-0.01em]">
              <span className="font-bold">Explore</span>{" "}
              <span className="font-serif italic">selected work</span>
            </p>
            <div className="mx-auto my-7 h-px w-16 bg-ink/25" />
            <p className="text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.18] tracking-[-0.015em]">
              <span className="font-bold uppercase">Branding,</span>
              <br />
              <span className="font-serif italic">digital design</span>
              <br />
              <span className="font-bold uppercase">and</span>{" "}
              <span className="font-serif italic">research</span>
            </p>
            <p className="mx-auto mt-8 max-w-[380px] text-[0.75rem] leading-[1.7] opacity-65">
              Projetos desenhados entre identidade visual, design digital e
              investigação, para marcas e instituições.
            </p>
            <div className="mt-7">
              <Pill href="#work">
                View all works <Arrow />
              </Pill>
            </div>
          </div>
        </div>

        {/* Mockups que flutuam à volta do bloco central. */}
        <ImageSlot
          label="Mockup 1"
          ratio="4 / 3"
          className="pointer-events-none absolute left-[3%] top-[12%] hidden w-[16%] rotate-[-4deg] lg:flex"
        />
        <ImageSlot
          label="Mockup 2"
          ratio="9 / 16"
          className="pointer-events-none absolute left-[13%] top-[28%] hidden w-[8%] rotate-[3deg] lg:flex"
        />
        <ImageSlot
          label="Mockup 3"
          ratio="9 / 16"
          className="pointer-events-none absolute right-[8%] top-[10%] hidden w-[8%] rotate-[-3deg] lg:flex"
        />
        <ImageSlot
          label="Mockup 4"
          ratio="3 / 4"
          className="pointer-events-none absolute bottom-[6%] right-[5%] hidden w-[13%] rotate-[2deg] lg:flex"
        />
      </section>

      {/* -------------------------------------------------------------- work */}
      <section id="work" className="bg-paper-warm">
        <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
          <SectionLabel>Selected work</SectionLabel>
          <ul className="mt-8">
            {WORKS.map((w) => (
              <li key={w.n} className="border-t border-ink/15 last:border-b">
                <a
                  href="#work"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 transition-opacity hover:opacity-60"
                >
                  <span className="text-[0.625rem] tabular-nums opacity-40">
                    {w.n}
                  </span>
                  <span>
                    <span
                      className={
                        w.kind === "sans"
                          ? "block text-[clamp(1.35rem,2.6vw,2.25rem)] font-bold uppercase leading-[1.1] tracking-[-0.015em]"
                          : "block font-serif text-[clamp(1.45rem,2.8vw,2.4rem)] leading-[1.1] tracking-[-0.01em]"
                      }
                    >
                      {w.title}
                    </span>
                    <span className="mt-1 block text-[0.625rem] uppercase tracking-[0.12em] opacity-45">
                      {w.meta}
                    </span>
                  </span>
                  <span className="flex items-center gap-5">
                    <span className="text-[0.625rem] tabular-nums opacity-45">
                      {w.year}
                    </span>
                    <Arrow className="text-base transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Pill href="#work">
              View all works <Arrow />
            </Pill>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ método */}
      <section className="bg-lilac">
        <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
          <SectionLabel>How we work</SectionLabel>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.75rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
            How I work
          </h2>
          <ul className="mt-12">
            {METHOD.map((m) => (
              <li key={m.n} className="border-t border-ink/20 last:border-b">
                <div className="grid grid-cols-[auto_1fr] items-start gap-5 py-6 md:grid-cols-[auto_1fr_1.4fr_auto] md:items-center">
                  <span className="text-[0.625rem] tabular-nums opacity-45">
                    {m.n}
                  </span>
                  <span
                    className={
                      m.kind === "sans"
                        ? "text-[clamp(1.1rem,2vw,1.6rem)] font-bold uppercase tracking-[0.02em]"
                        : "font-serif text-[clamp(1.2rem,2.2vw,1.75rem)]"
                    }
                  >
                    {m.title}
                  </span>
                  <p className="col-span-2 text-[0.75rem] leading-[1.7] opacity-70 md:col-span-1">
                    {m.body}
                  </p>
                  <span className="hidden text-base opacity-50 md:block">+</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- research */}
      <section id="research" className="bg-white">
        <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-28">
          <SectionLabel>Research & practice</SectionLabel>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
            <h2 className="text-[clamp(2.25rem,5.2vw,4.5rem)] font-bold uppercase leading-[1.04] tracking-[-0.025em]">
              Designer.
              <br />
              <span className="text-lilac-soft">Researcher.</span>
            </h2>
            <div className="flex flex-col justify-end gap-4 text-[0.8125rem] leading-[1.7] opacity-70">
              <p>
                Junto uma prática profissional de estúdio a um doutoramento em
                Design, onde a investigação alimenta o trabalho e o trabalho
                alimenta a investigação.
              </p>
              <p>
                O interesse está em como as tecnologias emergentes atravessam a
                prática do design: o que muda na colaboração, na autoria e no
                modo como desenhamos.
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden bg-ink/12 md:grid-cols-3">
            {RESEARCH.map((r) => (
              <div key={r.title} className="bg-white p-6">
                <div className="flex items-center justify-between">
                  <SectionLabel>{r.label}</SectionLabel>
                  <Arrow className="text-xs opacity-40" />
                </div>
                <p className="mt-5 font-serif text-[1.35rem] leading-tight">
                  {r.title}
                </p>
                <p className="mt-3 text-[0.75rem] leading-[1.7] opacity-65">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- about */}
      <section id="about" className="bg-paper">
        <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[520px]">
            <SectionLabel>About</SectionLabel>
            <h2 className="mt-5 text-[clamp(2rem,3.6vw,3rem)] leading-[1.12] tracking-[-0.015em]">
              <span className="font-serif">About</span>
              <br />
              <span className="font-serif italic">the</span>
              <br />
              <span className="font-bold uppercase">Designer</span>
            </h2>
            <div className="mt-7 flex flex-col gap-4 text-[0.8125rem] leading-[1.75] opacity-75">
              <p>
                Joana Domingues é designer e investigadora em design, a
                trabalhar a partir de Portugal.
              </p>
              <p>
                Com mais de dez anos de prática profissional, tem trabalho feito
                em branding, identidade visual, comunicação e design digital.
              </p>
              <p>
                Dá aulas e escreve sobre design, e cruza a prática de estúdio com
                a investigação académica.
              </p>
              <p>
                Atualmente é doutoranda em Design, com investigação centrada na
                forma como a criação e a mudança tecnológica atravessam a prática
                do design.
              </p>
            </div>
            <div className="mt-8">
              <Pill href="#contact" tone="lilac">
                Get in touch <Arrow />
              </Pill>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- contact */}
      <section id="contact" className="bg-paper pb-20 lg:pb-28">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-stretch gap-8 px-6 lg:grid-cols-2 lg:px-10">
          <Image
            src="/mockup-portatil.webp"
            alt="Portátil a mostrar a identidade do estúdio"
            width={679}
            height={580}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
          <div className="bg-lilac p-8 lg:p-12">
            <SectionLabel>Get in touch</SectionLabel>
            <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold uppercase leading-[1.1] tracking-[-0.015em]">
              Have a project
              <br />
              in mind?
            </h2>
            <p className="mt-4 max-w-[380px] text-[0.75rem] leading-[1.7] opacity-70">
              Conte-me o que tem em mãos. Respondo a todas as mensagens.
            </p>

            <form className="mt-8 flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-[0.625rem] font-bold uppercase tracking-[0.12em] opacity-70">
                  Nome
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  className="rounded-md bg-white/70 px-3 py-2.5 text-[0.8125rem] outline-none ring-1 ring-inset ring-ink/10 focus:ring-2 focus:ring-ink/40"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[0.625rem] font-bold uppercase tracking-[0.12em] opacity-70">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="rounded-md bg-white/70 px-3 py-2.5 text-[0.8125rem] outline-none ring-1 ring-inset ring-ink/10 focus:ring-2 focus:ring-ink/40"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[0.625rem] font-bold uppercase tracking-[0.12em] opacity-70">
                  Mensagem
                </span>
                <textarea
                  name="message"
                  rows={4}
                  className="resize-none rounded-md bg-white/70 px-3 py-2.5 text-[0.8125rem] outline-none ring-1 ring-inset ring-ink/10 focus:ring-2 focus:ring-ink/40"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-fit rounded-full bg-ink px-6 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-paper transition-opacity hover:opacity-85"
              >
                Send message
              </button>
            </form>

            <p className="mt-7 flex flex-wrap gap-4 text-[0.625rem] uppercase tracking-[0.12em] opacity-60">
              <span>jcm@linear.com.pt</span>
              <span>LinkedIn</span>
              <span>Instagram</span>
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ footer */}
      <footer className="bg-ink pt-16 text-paper">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-6 pb-12 md:grid-cols-4 lg:px-10">
          <div className="col-span-2 md:col-span-2">
            <SectionLabel className="text-paper">
              Joana Domingues Design Studio
            </SectionLabel>
            <p className="mt-3 max-w-[280px] text-[0.75rem] leading-[1.7] opacity-55">
              Estúdio de design e investigação, a trabalhar a partir de Portugal.
            </p>
          </div>
          <div>
            <SectionLabel className="text-paper">Serviços</SectionLabel>
            <ul className="mt-3 flex flex-col gap-1.5 text-[0.75rem] opacity-60">
              <li>Branding</li>
              <li>Design digital</li>
              <li>Comunicação</li>
              <li>Investigação</li>
            </ul>
          </div>
          <div>
            <SectionLabel className="text-paper">Contacto</SectionLabel>
            <ul className="mt-3 flex flex-col gap-1.5 text-[0.75rem] opacity-60">
              <li>
                <a href="mailto:jcm@linear.com.pt" className="hover:opacity-100">
                  jcm@linear.com.pt
                </a>
              </li>
              <li>LinkedIn</li>
              <li>Instagram</li>
              <li>ORCID</li>
            </ul>
          </div>
        </div>
        <p
          aria-hidden="true"
          className="select-none overflow-hidden whitespace-nowrap px-[1.5%] pb-4 text-center text-[7.4vw] font-bold uppercase leading-[0.95] tracking-[-0.025em]"
        >
          Joana Domingues Design
        </p>
      </footer>
    </div>
  );
}
