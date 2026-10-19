import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";

import HomeMotion from "@/components/home/motion";
import Capitulo from "@/components/home/capitulo";
import HeroFoco from "@/components/home/hero-foco";
import Orbita, { type Peca } from "@/components/home/orbita";
import { EM_PREPARACAO } from "@/lib/projetos";
import { REDES } from "@/lib/redes";

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
    // Duas ligações, como no ficheiro do Figma, que nesta linha tinha "artigos
    // de opinião" e "notas e ensaios": o artigo de opinião dela no Marketeer,
    // que ela mandou, e o Substack, onde escreve a seguir.
    links: [
      {
        label: "Artigos",
        href: "https://marketeer.sapo.pt/a-ia-nao-esta-a-substituir-os-designers-esta-a-mudar-aquilo-pelo-qual-somos-responsaveis/",
        externo: true,
      },
      {
        label: "Substack",
        href: "https://substack.com/@joanadomingues",
        externo: true,
      },
    ],
  },
  {
    n: "02",
    titulo: "Investigo",
    corpo:
      "A minha investigação sobre design, agência projetual e inteligência artificial generativa.",
    links: [
      // O "saber mais" saiu a pedido dela: não levava a lado nenhum e os dois
      // perfis a seguir já são o "saber mais".
      // Os dois perfis de investigação dela. Vieram da Joana; limpei-os:
      // o do ORCID vinha do painel dela (orcid.org/my-orcid?orcid=...), que
      // só abre a quem tem sessão iniciada -- o público é o iD directo. O do
      // Ciência Vitae vinha com uma barra a mais. Confirmei o ORCID na API
      // pública: o registo é mesmo dela.
      {
        label: "ORCID",
        href: "https://orcid.org/0009-0006-0013-609X",
        externo: true,
      },
      {
        label: "Ciência Vitae",
        href: "https://www.cienciavitae.pt/pt/2E16-8DC8-2D22",
        externo: true,
      },
    ],
  },
  {
    n: "03",
    // A Joana trocou: era "Estou a escrever".
    titulo: "Um livro em curso",
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

/**
 * Peças da cena de projetos. As imagens são recortes da composição do Figma;
 * os títulos foram lidos dos próprios mockups e os tipos de trabalho são
 * provisórios, à espera dos seis projetos reais.
 *
 * Vêm de `EM_PREPARACAO` para a cena e as páginas não divergirem, e cada uma
 * leva para a sua página. Só entram as que estão marcadas com `naCena` e têm
 * imagem: os projetos reais que a Joana mandou ainda não têm fotografias, e um
 * cartão vazio numa órbita de fotografias seria um buraco, não uma peça.
 */
const PECAS: Peca[] = EM_PREPARACAO.filter((p) => p.naCena && p.src).map(
  (p) => ({
    id: p.slug,
    titulo: p.titulo,
    tipo: p.tipo,
    src: p.src as string,
    w: p.w as number,
    h: p.h as number,
    href: `/projetos/${p.slug}`,
    imagens: p.imagens,
  })
);

/** Maiúsculas espaçadas do sistema: navegação, etiquetas e ligações. */
const CAPS =
  "font-sans text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em]";

/* Área de toque. O texto em caixa alta tem 15px de altura e o dedo precisa de
   24 (WCAG 2.2 AA); são 5px acima e abaixo, que é enchimento a sério e não uma
   camada por cima -- assim nunca rouba o toque ao vizinho. Quem tem risco por
   baixo só recebe por cima, para o risco ficar onde está. */
const ALVO = "py-[5px]";
const ALVO_CIMA = "pt-2";


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
      {/* Hero e primeiro capítulo partilham esta moldura: é ela que limita
          até onde o hero fica colado. Sem ela, o hero ficava sticky dentro
          do envolvente da página inteira e aparecia por trás do rodapé, que
          é estático e por isso pinta por baixo de elementos posicionados. */}
      <div className="relative">
        {/* Fica fixo: o capítulo seguinte sobe por cima dele como uma cortina,
            que é o que a referência faz na passagem do hero para a segunda secção. */}
        <header className="sticky top-0 z-0 h-svh overflow-hidden bg-mauve">
          <HeroFoco />
          {/* O hero não desaparece só por desfocar: também recua para a
              sombra, enquanto a cortina sobe. */}
          <div
            aria-hidden="true"
            data-hero-veu
            className="absolute inset-0 -z-[5] bg-[#1d1418]"
          />

          <div
            className={`flex h-full flex-col justify-between py-[clamp(1.5rem,5.9vw,6rem)] ${gutter}`}
          >
            {/* A saída não é um bloco só: a navegação vai-se primeiro, a marca
              sobe, e a frase de baixo afunda-se com a cortina. É isso que faz
              a passagem ler-se como um gesto e não como um corte. */}
          <nav
            data-hero-saida="0"
            data-entrada-cena
            style={{ "--atraso": 0.45 } as CSSProperties}
            className="flex flex-wrap items-center justify-end gap-x-[clamp(1rem,2.8vw,3rem)] gap-y-3 text-paper"
          >
              {NAV.map((i) => (
                <a
                  key={i.label}
                  href={i.href}
                  className={`${CAPS} ${ALVO} opacity-85 transition-opacity hover:opacity-100`}
                >
                  {i.label}
                </a>
              ))}
              <a
                href="#conversar"
                className={`${CAPS} ${ALVO_CIMA} flex items-center gap-3 border-b border-paper pb-0.5`}
              >
                Entrar em contacto <Seta />
              </a>
            </nav>

            <div
              className="flex flex-1 items-center"
              data-hero-saida="1"
              data-entrada-cena
              style={{ "--atraso": 0.18 } as CSSProperties}
            >
              <div className="flex w-full flex-wrap items-center justify-between gap-y-8">
                <h1>
                  <Image
                    src="/home/marca-joana-domingues.svg"
                    alt="Joana Domingues"
                    width={527}
                    height={194}
                    priority
                    unoptimized
                    className="h-auto w-[clamp(13rem,49.8vw,52rem)]"
                  />
                </h1>
                <Image
                  src="/home/marca-design.svg"
                  alt="Design"
                  width={191}
                  height={33}
                  unoptimized
                  className="h-auto w-[clamp(6rem,13.5vw,14rem)]"
                />
              </div>
            </div>

            <div
              className="text-paper"
              data-hero-saida="2"
              data-entrada-cena
              style={{ "--atraso": 0.32 } as CSSProperties}
            >
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
        <Capitulo
          id="sobre"
          ecras={5}
          passos={4}
          className="relative isolate z-10 bg-mauve"
        >
          <Image
            src="/home/fundo-designer.jpg"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover"
          />
          {/* O bordo da cortina: uma faixa de luz que apanha o topo deste
              bloco enquanto ele sobe, e some quando ele chega. */}
          <div
            aria-hidden="true"
            data-cortina
            className="absolute inset-x-0 top-0 h-[clamp(4rem,9vh,9rem)] bg-gradient-to-b from-paper-soft/55 via-paper-soft/15 to-transparent"
          />
          <div
            className={`grid h-full items-center gap-y-6 py-[clamp(2rem,6vw,6rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-x-[clamp(2rem,5vw,5rem)] ${gutter}`}
          >
            <div>
              <h2 className="font-serif text-[clamp(2.25rem,8.39vw,8.75rem)] leading-[0.84] text-paper-soft">
                Designer
              </h2>
              {/* O título do campo fica por baixo de "Designer" e à mesma
                  escala -- 140px numa moldura de 1669 no ficheiro. É a troca
                  deste título que faz a mudança ler-se. */}
              <div className="relative mt-[0.12em] min-h-[clamp(2.4rem,14vw,14.6rem)]">
                {CAMPOS.map((c, i) => (
                  <p
                    key={c.titulo ?? "bio"}
                    data-quando={i}
                    className="font-serif text-[clamp(2.25rem,8.39vw,8.75rem)] leading-[0.84] text-paper-soft/70"
                  >
                    {c.titulo}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative min-h-[clamp(13rem,26vw,22rem)]">
              {CAMPOS.map((c, i) => (
                <div
                  key={c.titulo ?? "bio"}
                  data-quando={i}
                  className="flex flex-col gap-[0.7em] font-body text-[clamp(0.9rem,1.5vw,1.6rem)] leading-snug text-paper"
                >
                  {c.paragrafos.map((t) => (
                    <p key={t.slice(0, 24)}>{t}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Capitulo>
      </div>

      {/* ========================================================== projetos */}
      <Orbita pecas={PECAS} />

      {/* ========================================================= percursos */}
      {/* "À medida que vamos fazendo scroll vão aparecendo os tópicos 1, 2 e 3."
          Acumulam-se: aparecem e ficam. */}
      {/* No telemóvel fica em sequência: ela pediu que os tópicos não fossem
          aparecendo um de cada vez, e é onde a maior parte das pessoas vai
          ver o sítio. */}
      <Capitulo
        id="percursos"
        ecras={4}
        passos={3}
        soltoNoTelemovel
        className="relative z-10 bg-sand"
      >
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
                      {p.links.map((l) => {
                        const externo = "externo" in l && l.externo;
                        return (
                          <a
                            key={l.label}
                            href={l.href}
                            // Os perfis de investigação abrem à parte: são
                            // sítios de terceiros e quem está a ler não deve
                            // perder o lugar na página.
                            target={externo ? "_blank" : undefined}
                            rel={externo ? "noopener noreferrer me" : undefined}
                            className={`${CAPS} ${ALVO_CIMA} flex items-center gap-2 border-b border-clay/60 pb-0.5 transition-opacity hover:opacity-60`}
                          >
                            {l.label} <Seta />
                          </a>
                        );
                      })}
                    </p>
                  </div>
                  {/* A seta de fim de linha é só do ecrã grande. Vai num
                      invólucro porque o `hidden` e o `inline-block` da própria
                      seta são os dois `display`: quem ganha é a ordem na folha
                      de estilo, não a ordem na classe, e ganhava o
                      `inline-block`. A seta aparecia no telemóvel, deitada, a
                      ocupar a linha toda, e empurrava 125px para fora da
                      caixa do capítulo. */}
                  <div className="hidden md:block">
                    <Seta className="text-[clamp(1.25rem,2.2vw,2.3rem)] text-clay" />
                  </div>
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
            className={`${CAPS} ${ALVO_CIMA} mt-[clamp(1.75rem,3.5vw,3.5rem)] inline-flex items-center gap-3 border-b border-paper pb-1 text-paper transition-opacity hover:opacity-70`}
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
            width={527}
            height={306}
            unoptimized
            className="h-auto w-[clamp(7rem,13.8vw,14.5rem)]"
          />
          <nav className="flex flex-wrap gap-x-[clamp(1.5rem,3.2vw,3.5rem)] gap-y-3">
            {REDES.map((r) =>
              r.href ? (
                <a
                  key={r.nome}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className={`${CAPS} ${ALVO} opacity-70 transition-opacity hover:opacity-100`}
                >
                  {r.nome}
                </a>
              ) : (
                <span key={r.nome} className={`${CAPS} opacity-70`}>
                  {r.nome}
                </span>
              )
            )}
          </nav>
        </div>
        <div className="mt-[clamp(2.5rem,5vw,5rem)] flex flex-wrap justify-between gap-y-2 border-t border-paper/20 pt-5 font-body text-[clamp(0.75rem,1vw,1rem)] opacity-70">
          <p>© 2026 Joana Domingues Design</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="/aviso-legal"
              className={`${ALVO} transition-opacity hover:opacity-100`}
            >
              Aviso legal
            </a>
            <a
              href="/politica-de-privacidade"
              className={`${ALVO} transition-opacity hover:opacity-100`}
            >
              Política de Privacidade
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
