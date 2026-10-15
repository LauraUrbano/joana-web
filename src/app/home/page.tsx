import type { Metadata } from "next";
import Image from "next/image";

import HomeMotion from "@/components/home/motion";
import Capitulo from "@/components/home/capitulo";
import Orbita, { type Peca } from "@/components/home/orbita";

/**
 * Home do estúdio.
 *
 * Medidas e cores lidas directamente do ficheiro do Figma (Joana Domingues
 * Design), numa moldura de 1669px. Daí as conversões para vw:
 *   140px -> 8.39vw   "Designer"
 *   135px -> 8.09vw   "Há coisas que faço." / "Outras, escrevo para..."
 *   109px -> 6.53vw   "Vamos conversar?"
 *    66px -> 3.95vw   títulos das linhas 01/02/03
 *    32px -> 1.92vw   corpo (EB Garamond)
 *    14px -> 0.84vw   etiquetas e navegação (tracking 0.18em)
 *
 * Três tipos de letra, cada um com o seu papel:
 *   Instrument Serif -> display, com itálico na palavra que carrega o sentido
 *   EB Garamond      -> corpo
 *   Instrument Sans  -> maiúsculas espaçadas, números, setas
 *
 * As faixas são fotográficas: os tons da paleta ficam por baixo das imagens,
 * para a página não ficar nua enquanto elas carregam.
 */

export const metadata: Metadata = {
  title: "Joana Domingues — Design de comunicação, investigação e escrita",
  description:
    "Entre o fazer e o pensar. Design de comunicação, investigação e escrita, a partir de Portugal.",
  // Enquanto a entrada do site for a página "em breve", isto é rascunho.
  robots: { index: false, follow: false },
};

const NAV = [
  { label: "Projetos", href: "#projetos" },
  { label: "Investigação", href: "#percursos" },
  { label: "Escrita", href: "#percursos" },
];

const PERCURSOS = [
  {
    n: "01",
    titulo: "Escrevo",
    corpo:
      "Artigos de opinião, ideias em desenvolvimento e outras coisas que preciso de pôr em palavras.",
    links: [{ label: "Artigos", href: "#percursos" }],
  },
  {
    n: "02",
    titulo: "Investigo",
    corpo:
      "A minha investigação sobre design, agência projetual e inteligência artificial generativa.",
    links: [
      { label: "Saber mais", href: "#percursos" },
      { label: "ORCID", href: "#percursos" },
      { label: "Ciência Vitae", href: "#percursos" },
    ],
  },
  {
    n: "03",
    titulo: "Estou a escrever",
    corpo: "Um livro em desenvolvimento, ainda a encontrar a sua forma.",
    links: [{ label: "Brevemente", href: "#percursos" }],
  },
] as const;

/**
 * O que o lado direito do capítulo "Designer" atravessa. A nota da Joana no
 * Figma: "o lado esq mantém-se, o lado dir faz scroll, por cada novo título
 * fica por baixo de 'designer', roda apenas o texto".
 * O texto é o dela, incluindo os clientes reais.
 */
const CAMPOS = [
  {
    titulo: null,
    paragrafos: [
      "Sou designer de comunicação há mais de 14 anos e trabalho por conta própria há 9.",
      "Ao longo deste percurso, tenho trabalhado com diferentes marcas, criado dezenas de identidades visuais e desenvolvido projetos de branding e comunicação digital.",
      "Entre projetar, investigar e escrever, vou descobrindo novas formas de pensar e fazer design. É nesse movimento constante que a minha prática acontece e continua a evoluir.",
    ],
  },
  {
    titulo: "Comunicação institucional",
    paragrafos: [
      "Desenvolvi projetos de comunicação para entidades como a Presidência da República Portuguesa, as Repúblicas de Moçambique e de Cabo Verde, o Ministério da Educação, Portugal Digital, Test Beds, Sonae, Galp Distribuição, Grupo Renascença, Central de Cervejas, Grupo Lactogal, Hotéis Vila Baleira, Valorpneu e os municípios de Évora e Arraiolos, entre outras.",
      "Contextos muito diferentes, com uma exigência comum: comunicar com clareza, respeitando a identidade, o protocolo e a responsabilidade de cada instituição.",
    ],
  },
  {
    titulo: "Comunicação comercial",
    paragrafos: [
      "Desenvolvi projetos de comunicação comercial e de eventos para organizações como a Sonae, Galp, CTT, Lactogal, Fosun, Grupo Delta, Lidl, BCG, Grupo Central de Cervejas, Carla Rocha Comunicação, Grupo Ferpinta, Hotéis Vila Baleira, Habitat Invest, Grupo RE/MAX, Axians e TAP, entre outras, incluindo a Conferência Decrescimento 2027.",
      "Esta experiência permitiu-me trabalhar com diferentes escalas, setores e necessidades de comunicação, mantendo a consistência da mensagem e da identidade de cada marca.",
    ],
  },
  {
    titulo: "Branding e arquitetura de marca",
    paragrafos: [
      "Construir marcas é mais do que criar uma identidade visual. Trabalhei em projetos de branding, comunicação, publicações internas e campanhas para organizações como a H/Advisors CV&A, do grupo Havas, Lusíadas Saúde, Hotéis Vila Baleira, KPMG, Impresa, Legalworks, CTT e Segmento Urbano.",
      "Paralelamente, criei dezenas de marcas para pequenas e médias empresas, com identidades pensadas para cada negócio, que fazem sentido para quem as constrói e funcionam para além da sua expressão visual.",
    ],
  },
] as const;

const REDES = ["LinkedIn", "Substack", "Instagram", "WhatsApp"];

/**
 * Peças da cena de projetos. As imagens são recortes da composição do Figma;
 * os títulos foram lidos dos próprios mockups e os tipos de trabalho são
 * provisórios, à espera dos seis projetos reais.
 */
const PECAS: Peca[] = [
  { id: "solar", titulo: "Solar", tipo: "Identidade · Embalagem", src: "/home/projetos/solar.jpg", w: 416, h: 485 },
  { id: "boa-companhia", titulo: "In Boa Companhia", tipo: "Editorial · Publicação", src: "/home/projetos/boa-companhia.jpg", w: 342, h: 340 },
  { id: "terra", titulo: "Terra", tipo: "Website · Design digital", src: "/home/projetos/terra.jpg", w: 411, h: 385 },
  { id: "cuidar", titulo: "Cuidar é um Lugar", tipo: "Identidade · Embalagem", src: "/home/projetos/cuidar.jpg", w: 245, h: 224 },
];

/** Maiúsculas espaçadas do sistema: navegação, etiquetas e ligações. */
const CAPS =
  "font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em]";

/** Seta a 45°, como no ficheiro. */
function Seta({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-block -rotate-45 ${className}`}>
      →
    </span>
  );
}

export default function HomePage() {
  const gutter = "px-[clamp(1.25rem,6.8vw,7.5rem)]";

  return (
    <div className="min-h-dvh overflow-x-clip bg-sand">
      <HomeMotion />
      {/* =============================================================== capa */}
      <header className="relative isolate bg-mauve">
        <Image
          src="/home/retrato-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[60%_center]"
        />

        <div
          className={`flex min-h-[clamp(34rem,62.7vw,65rem)] flex-col justify-between py-[clamp(1.5rem,5.9vw,6rem)] ${gutter}`}
        >
          <nav className="flex flex-wrap items-center justify-end gap-x-[clamp(1rem,2.8vw,3rem)] gap-y-3 text-paper">
            {NAV.map((i) => (
              <a
                key={i.label}
                href={i.href}
                className={`${CAPS} opacity-85 transition-opacity hover:opacity-100`}
              >
                {i.label}
              </a>
            ))}
            <a
              href="#conversar"
              className={`${CAPS} flex items-center gap-3 border-b border-paper pb-0.5`}
            >
              Entrar em contacto <Seta />
            </a>
          </nav>

          <div className="flex flex-1 items-center">
            <div className="flex w-full flex-wrap items-center justify-between gap-y-8">
              <h1>
                <Image
                  src="/home/marca-joana-domingues.png"
                  alt="Joana Domingues"
                  width={527}
                  height={195}
                  priority
                  sizes="(max-width: 1024px) 78vw, 50vw"
                  className="h-auto w-[clamp(13rem,49.8vw,52rem)]"
                />
              </h1>
              <Image
                src="/home/marca-design.png"
                alt="Design"
                width={191}
                height={34}
                sizes="(max-width: 1024px) 30vw, 14vw"
                className="h-auto w-[clamp(6rem,13.5vw,14rem)]"
              />
            </div>
          </div>

          <div className="text-paper">
            <p className="font-serif text-[clamp(1.5rem,3.18vw,3.3rem)] leading-tight">
              Entre o fazer e o pensar.
            </p>
            <p className="font-body text-[clamp(1rem,1.8vw,1.9rem)] italic leading-snug opacity-95">
              Design de comunicação, investigação e escrita.
            </p>
          </div>
        </div>
      </header>

      {/* ========================================================== designer */}
      {/* A nota da Joana: o lado esquerdo mantém-se, o direito roda. O bloco
          fica fixo enquanto se percorrem cinco ecrãs, e o texto troca em
          quatro passos -- a bio, e depois os três campos. */}
      <Capitulo id="sobre" ecras={5} passos={4} className="relative isolate bg-mauve">
        <Image
          src="/home/fundo-designer.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          className={`grid h-full items-center gap-y-8 py-[clamp(2rem,6vw,6rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-x-[clamp(2rem,6.8vw,7rem)] ${gutter}`}
        >
          <div>
            <h2 className="font-serif text-[clamp(2.5rem,8.39vw,8.75rem)] leading-[0.95] text-paper-soft">
              Designer
            </h2>
            {/* O título de cada campo fica por baixo de "Designer". */}
            <div className="relative mt-[clamp(0.75rem,1.5vw,1.5rem)] min-h-[clamp(1.5rem,2.6vw,2.75rem)]">
              {CAMPOS.map((c, i) => (
                <p
                  key={c.titulo ?? "bio"}
                  data-quando={i}
                  className={`${CAPS} text-paper/85`}
                >
                  {c.titulo}
                </p>
              ))}
            </div>
          </div>

          <div className="relative min-h-[clamp(14rem,28vw,24rem)]">
            {CAMPOS.map((c, i) => (
              <div
                key={c.titulo ?? "bio"}
                data-quando={i}
                className="flex flex-col gap-[0.8em] font-body text-[clamp(0.95rem,1.7vw,1.8rem)] leading-snug text-paper"
              >
                {c.paragrafos.map((t) => (
                  <p key={t.slice(0, 24)}>{t}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Capitulo>

      {/* ========================================================== projetos */}
      <Orbita pecas={PECAS} />

      {/* ========================================================= percursos */}
      {/* "À medida que vamos fazendo scroll vão aparecendo os tópicos 1, 2 e 3."
          Acumulam-se: aparecem e ficam. */}
      <Capitulo id="percursos" ecras={4} passos={3} className="bg-sand">
        <div
          className={`flex h-full flex-col justify-center py-[clamp(2rem,5vw,5rem)] ${gutter}`}
        >
          <h2 className="font-serif text-[clamp(1.75rem,6.4vw,6.6rem)] leading-[0.95] text-clay">
            Outras, escrevo para <em>compreender</em> melhor aquilo que faço.
          </h2>

          <ul className="mt-[clamp(1.5rem,4vw,4rem)]">
            {PERCURSOS.map((p, i) => (
              <li
                key={p.n}
                data-desde={i}
                className="border-t border-clay/70 py-[clamp(0.8rem,1.7vw,1.9rem)]"
              >
                <div className="grid gap-x-[clamp(1rem,3vw,3.5rem)] gap-y-3 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.6fr)_auto] md:items-start">
                  <span className="font-sans text-[clamp(0.875rem,1.44vw,1.5rem)] tracking-[0.075em] text-clay">
                    {p.n}
                  </span>
                  <h3 className="font-serif text-[clamp(1.4rem,3.4vw,3.5rem)] uppercase leading-[0.86] text-clay">
                    {p.titulo}
                  </h3>
                  <div className="text-clay">
                    <p className="font-body text-[clamp(0.95rem,1.6vw,1.7rem)] leading-snug">
                      {p.corpo}
                    </p>
                    <p className="mt-[clamp(0.5rem,1.2vw,1.2rem)] flex flex-wrap gap-x-6 gap-y-2">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          className={`${CAPS} flex items-center gap-2 border-b border-clay/60 pb-0.5 transition-opacity hover:opacity-60`}
                        >
                          {l.label} <Seta />
                        </a>
                      ))}
                    </p>
                  </div>
                  <Seta className="hidden text-[clamp(1.25rem,2.2vw,2.3rem)] text-clay md:block" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Capitulo>

      {/* ========================================================= conversar */}
      <section className="relative isolate bg-olive" id="conversar">
        <Image
          src="/home/fundo-azeitona.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className={`py-[clamp(3.5rem,10vw,11rem)] ${gutter}`}>
          <h2 className="font-serif text-[clamp(2rem,6.53vw,6.8rem)] uppercase leading-[0.95] text-paper">
            Vamos conversar?
          </h2>
          <p className="mt-[clamp(1rem,2vw,2rem)] max-w-[34ch] font-body text-[clamp(1rem,1.92vw,2rem)] leading-snug text-paper">
            Disponível para novos projetos e colaborações em design e
            comunicação.
          </p>
          <a
            href="mailto:jcm@linear.com.pt"
            className={`${CAPS} mt-[clamp(1.75rem,3.5vw,3.5rem)] inline-flex items-center gap-3 border-b border-paper pb-1 text-paper transition-opacity hover:opacity-70`}
          >
            Entrar em contacto <Seta />
          </a>
        </div>
      </section>

      {/* ============================================================ rodapé */}
      <footer className={`bg-olive-deep pb-10 pt-[clamp(2.5rem,6vw,6.5rem)] text-paper ${gutter}`}>
        <div className="flex flex-wrap items-start justify-between gap-y-10">
          <Image
            src="/home/marca-rodape.svg"
            alt="Joana Domingues Design"
            width={231}
            height={131}
            unoptimized
            className="h-auto w-[clamp(7rem,13.8vw,14.5rem)]"
          />
          <nav className="flex flex-wrap gap-x-[clamp(1.5rem,3.2vw,3.5rem)] gap-y-3">
            {REDES.map((r) => (
              <a
                key={r}
                href="#conversar"
                className={`${CAPS} opacity-70 transition-opacity hover:opacity-100`}
              >
                {r}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-[clamp(2.5rem,5vw,5rem)] flex flex-wrap justify-between gap-y-2 border-t border-paper/20 pt-5 font-body text-[clamp(0.75rem,1vw,1rem)] opacity-70">
          <p>© 2026 Joana Domingues Design</p>
          <p>Aviso legal e Política de Privacidade</p>
        </div>
      </footer>
    </div>
  );
}
