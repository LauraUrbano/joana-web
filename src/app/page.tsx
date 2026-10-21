import Image from "next/image";
import type { CSSProperties } from "react";

import Conversar from "@/components/conversar";
import Rodape from "@/components/rodape";
import Seta from "@/components/seta";
import HomeMotion from "@/components/home/motion";
import Capitulo from "@/components/home/capitulo";
import MenuTelemovel from "@/components/home/menu-telemovel";
import HeroFoco from "@/components/home/hero-foco";
import Orbita, { type Peca } from "@/components/home/orbita";
import { EM_PREPARACAO } from "@/lib/projetos";
import { REDES } from "@/lib/redes";
import { SITIO } from "@/lib/sitio";
import { ALVO, ALVO_CIMA, CAPS, GUTTER } from "@/lib/tipo";

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

/* O título, a descrição e o cartão de partilha vêm do `layout`, que é onde
   estão os da entrada do sítio -- esta página é essa entrada, e repetir aqui
   os mesmos valores só dava duas verdades para manter. */

const NAV = [
  { label: "Projetos", href: "#projetos" },
  { label: "Investigação", href: "#percursos" },
  { label: "Escrita", href: "/escrita" },
];

const PERCURSOS = [
  {
    n: "01",
    titulo: "Escrevo",
    corpo:
      "Artigos de opinião, ideias em desenvolvimento e outras coisas que preciso de pôr em palavras.",
    // Duas ligações, como no ficheiro do Figma, que nesta linha tinha "artigos
    // de opinião" e "notas e ensaios": os textos dela, e o Substack, onde
    // escreve a seguir.
    //
    // Os "artigos" apontavam directamente ao artigo no Marketeer e passam a
    // apontar à página da escrita, que é onde ele está com os outros -- a nota
    // dela: "é importante ter esta página intermédia, já com a possibilidade
    // de colocar o artigo da marketeer".
    links: [
      { label: "Artigos", href: "/escrita" },
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

/**
 * A escala do telemóvel, tirada da moldura de 681 do ficheiro.
 *
 * O ficheiro tem duas molduras -- 681 para o estreito e 1669 para o largo -- e
 * usa os mesmos tamanhos absolutos nas duas: 85px no título da secção, 66 no
 * título da linha, 32 no corpo, 24 no número, 22 nas ligações. A 681 isso é
 * muito maior em proporção, e era essa a nota da Joana: "no mobile, tentar
 * seguir mais este layout (mais por causa dos espaçamentos e tamanho do
 * título)", e a que ela deixou no próprio ficheiro: "uniformizar tamanho de
 * titulos; corpo de texto e tamanho de botões". Por isso isto é uma escala só,
 * usada em todas as secções, e não um arranjo por secção.
 *
 * Cada medida é a fracção da moldura (85/681 = 12,48vw, e por aí fora),
 * travada no valor que atinge aos 440px -- acima disso o telemóvel acabou e
 * não vale a pena continuar a crescer até ao `md`.
 */
const TEL = {
  /* 85/681, o título de qualquer secção */
  titulo: "text-[min(12.48vw,55px)] md:text-[clamp(1.75rem,6.4vw,6.6rem)]",
  /* o mesmo 85/681, onde o lado largo tem outra medida */
  tituloDesigner:
    "text-[min(12.48vw,55px)] md:text-[clamp(2.25rem,8.39vw,8.75rem)]",
  tituloConversar:
    "text-[min(12.48vw,55px)] md:text-[clamp(2rem,6.53vw,6.8rem)]",
  /* 53/681 e 30/681: a frase do hero */
  frase: "text-[min(7.78vw,34px)] md:text-[clamp(1.5rem,3.18vw,3.3rem)]",
  fraseSegunda: "text-[min(4.4vw,19px)] md:text-[clamp(1rem,1.8vw,1.9rem)]",
  /* 31/681, o corpo do capítulo "Designer" */
  corpoDesigner: "text-[min(4.7vw,21px)] md:text-[clamp(0.9rem,1.5vw,1.6rem)]",
  corpoConversar: "text-[min(4.7vw,21px)] md:text-[clamp(1rem,1.92vw,2rem)]",
  /* 98/681: do fundo do título ao primeiro risco */
  aposTitulo: "mt-[min(14.4vw,63px)] md:mt-[clamp(1.5rem,4vw,4rem)]",
  /* 32/681 por cima, 31/681 por baixo */
  linha: "pb-[min(4.55vw,20px)] pt-[min(4.7vw,21px)] md:py-[clamp(0.8rem,1.7vw,1.9rem)]",
  /* 64/681: o número fica numa coluna à esquerda e o resto alinha com o
     título, que é o que a moldura estreita faz */
  grelha:
    "grid-cols-[min(9.4vw,41px)_minmax(0,1fr)] gap-x-0 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.6fr)_auto] md:gap-x-[clamp(1rem,3vw,3.5rem)]",
  /* 45/681: do título ao parágrafo */
  entreTituloECorpo: "gap-y-[min(6.6vw,29px)] md:gap-y-3",
  /* 24/681 */
  numero: "text-[min(3.52vw,15px)] md:text-[clamp(0.875rem,1.44vw,1.5rem)]",
  /* 66/681 */
  tituloLinha: "text-[min(9.69vw,43px)] md:text-[clamp(1.4rem,3.4vw,3.5rem)]",
  /* 32/681. A entrelinha do ficheiro é 34 em 32, que em três ou quatro linhas
     de telemóvel fica apertada de mais para ler; fica a nossa. */
  corpo: "text-[min(4.7vw,21px)] md:text-[clamp(0.95rem,1.6vw,1.7rem)]",
  /* 86/681: do parágrafo às ligações */
  antesDasLigacoes: "mt-[min(12.6vw,56px)] md:mt-[clamp(0.5rem,1.2vw,1.2rem)]",
} as const;

export default function HomePage() {

  return (
    <div className="min-h-dvh overflow-x-clip bg-sand">
      <HomeMotion />

      {/* Quem é, para os motores de busca. O mínimo e só o que é verdade: os
          perfis dela entram em `sameAs` quando os endereços chegarem. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Joana Domingues",
            jobTitle: "Designer de comunicação",
            url: SITIO,
            image: `${SITIO}/opengraph-image.jpg`,
            knowsLanguage: ["pt-PT", "en"],
            // O iD do ORCID é o identificador forte de um investigador: é
            // por aqui que os motores de busca ligam a pessoa ao trabalho.
            identifier: {
              "@type": "PropertyValue",
              propertyID: "ORCID",
              value: "https://orcid.org/0009-0006-0013-609X",
            },
            sameAs: [
              "https://orcid.org/0009-0006-0013-609X",
              "https://www.cienciavitae.pt/pt/2E16-8DC8-2D22",
              "https://www.linkedin.com/in/jcmdomingues/",
              "https://substack.com/@joanadomingues",
              "https://www.instagram.com/joanadomingues.design/",
            ],
            description:
              "Designer de comunicação há mais de 14 anos. Identidades visuais, branding e comunicação digital, investigação e escrita.",
          }),
        }}
      />

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
            className={`flex h-full flex-col justify-between py-[clamp(1.5rem,5.9vw,6rem)] ${GUTTER}`}
          >
            {/* A saída não é um bloco só: a navegação vai-se primeiro, a marca
              sobe, e a frase de baixo afunda-se com a cortina. É isso que faz
              a passagem ler-se como um gesto e não como um corte. */}
          <nav
            data-hero-saida="0"
            data-entrada-cena
            style={{ "--atraso": 0.45 } as CSSProperties}
            className="flex items-start justify-end text-paper"
          >
              {/* No telemóvel o ficheiro não tem esta fila: tem um menu. As
                  ligações vão num invólucro em vez de levarem `hidden` cada
                  uma, porque o `hidden` e o `flex` são os dois `display` e
                  quem ganha é a ordem na folha de estilo. */}
              <div className="hidden flex-wrap items-center justify-end gap-x-[clamp(1rem,2.8vw,3rem)] gap-y-3 md:flex">
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
              </div>
              <MenuTelemovel destinos={[...NAV]} redes={[...REDES]} />
            </nav>

            <div
              className="flex flex-1 items-center"
              data-hero-saida="1"
              data-entrada-cena
              style={{ "--atraso": 0.18 } as CSSProperties}
            >
              {/* No telemóvel o "design" fica por baixo da marca e alinhado
                  à esquerda, não ao lado: é assim na moldura estreita do
                  ficheiro, e a marca ocupa lá 412,5 de 681. */}
              <div className="flex w-full flex-col items-start gap-[min(3.5vw,24px)] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-y-8">
                <h1>
                  <Image
                    src="/home/marca-joana-domingues.svg"
                    alt="Joana Domingues"
                    width={527}
                    height={194}
                    priority
                    unoptimized
                    className="h-auto w-[60.6vw] md:w-[clamp(13rem,49.8vw,52rem)]"
                  />
                </h1>
                <Image
                  src="/home/marca-design.svg"
                  alt="Design"
                  width={191}
                  height={33}
                  unoptimized
                  className="h-auto w-[24.8vw] md:w-[clamp(6rem,13.5vw,14rem)]"
                />
              </div>
            </div>

            <div
              className="text-paper"
              data-hero-saida="2"
              data-entrada-cena
              style={{ "--atraso": 0.32 } as CSSProperties}
            >
              <p className={`font-serif ${TEL.frase} leading-tight`}>
                Entre o fazer e o pensar.
              </p>
              <p className={`font-body ${TEL.fraseSegunda} italic leading-snug opacity-95`}>
                Design de comunicação, investigação e escrita.
              </p>
            </div>
          </div>
        </header>

        {/* ========================================================== designer */}
        {/* A nota da Joana: o lado esquerdo mantém-se, o direito roda. O bloco
            fica fixo enquanto se percorrem cinco ecrãs, e o texto troca em
            quatro passos -- a bio, e depois os três campos.

            No telemóvel também: "antes havia uma animação que mudava o texto
            no scroll, ela quer esse de volta". Cheguei a pô-lo em sequência,
            como a moldura estreita do ficheiro o mostra, e é isso que ela não
            quer aqui. Fica preso, e o que teve de ceder foi o ar à volta do
            texto -- não o corpo de letra, que é o que ela pediu para
            uniformizar. */}
        <Capitulo
          id="sobre"
          ecras={5}
          passos={4}
          revelaSolto
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
            /* O corpo de letra do "Designer" fica aqui porque o desvio do
               texto, mais abaixo, se mede nele. */
            style={{ "--tipo": "clamp(2.25rem,8.39vw,8.75rem)" } as CSSProperties}
            /* `content-center` e não `items-center`: com a altura toda e duas
               linhas, o `items-center` estica-as e centra cada uma na sua --
               abria um buraco entre o "Designer" e o título do campo. O que
               se quer é a pilha inteira ao meio. */
            className={`grid h-full content-center py-[clamp(2rem,6vw,6rem)] ${GUTTER}`}
          >
            <h2 className={`font-serif ${TEL.tituloDesigner} leading-[0.84] text-paper-soft`}>
              Designer
            </h2>

            {/* Cada passo é um bloco só -- o título do campo e os parágrafos
                dele juntos. Antes eram duas listas, uma por coluna: preso dava
                no mesmo, mas solto saíam os títulos todos de enfiada e os
                textos todos a seguir, desemparelhados. Agora solta-se aos
                pares, que é como está na moldura estreita do ficheiro.

                O título do campo fica por baixo de "Designer" e à mesma escala
                -- 140px numa moldura de 1669 --, e é a troca dele que faz a
                mudança ler-se. */}
            {/* O afastamento entre o "Designer" e o título do campo mede-se no
                corpo de letra dele -- 0,364 dele --, que é o que repõe ao
                pixel o que estava antes de os passos passarem a blocos. A
                margem negativa por baixo devolve-lhe a altura: senão o bloco
                ficava 44px mais alto e, estando centrado, subia 22. */}
            <div className="relative mt-[calc(var(--tipo)*0.364)] mb-[calc(var(--tipo)*-0.364)] grid min-h-[clamp(2.4rem,14vw,14.6rem)] lg:block">
              {CAMPOS.map((c, i) => (
                <div
                  key={c.titulo ?? "bio"}
                  data-quando={i}
                  className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-x-[clamp(2rem,5vw,5rem)]"
                >
                  <p
                    className={`font-serif ${TEL.tituloDesigner} leading-[0.84] text-paper-soft/70`}
                  >
                    {c.titulo}
                  </p>
                  {/* Em sequência, o texto fica debaixo do título do campo,
                      com os 76/681 de ar que o ficheiro lhe dá. No ecrã largo
                      sobe para o alto do bloco, à altura de "Designer", que é
                      onde o ficheiro o tem: o desvio é a caixa do "Designer",
                      1,05 do corpo de letra dele. */}
                  <div
                    className={`mt-[min(11.2vw,76px)] flex flex-col gap-[0.7em] font-body ${TEL.corpoDesigner} leading-snug text-paper lg:mt-[calc(var(--tipo)*-1.05)]`}
                  >
                    {c.paragrafos.map((t) => (
                      <p key={t.slice(0, 24)}>{t}</p>
                    ))}
                  </div>
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
          className={`flex h-full flex-col justify-center py-[clamp(2rem,5vw,5rem)] ${GUTTER}`}
        >
          <h2 className={`font-serif ${TEL.titulo} leading-[0.95] text-clay`}>
            Outras, escrevo para <em>compreender</em> melhor aquilo que faço.
          </h2>

          <ul className={TEL.aposTitulo}>
            {PERCURSOS.map((p, i) => (
              <li
                key={p.n}
                data-desde={i}
                className={`border-t border-clay/70 ${TEL.linha}`}
              >
                <div
                  className={`grid ${TEL.grelha} ${TEL.entreTituloECorpo} md:items-start`}
                >
                  <span className={`font-sans ${TEL.numero} tracking-[0.075em] text-clay`}>
                    {p.n}
                  </span>
                  <h3 className={`font-serif ${TEL.tituloLinha} uppercase leading-[0.86] text-clay`}>
                    {p.titulo}
                  </h3>
                  <div className="col-start-2 text-clay md:col-start-auto">
                    <p className={`font-body ${TEL.corpo} leading-snug`}>
                      {p.corpo}
                    </p>
                    <p className={`${TEL.antesDasLigacoes} flex flex-wrap gap-x-6 gap-y-2`}>
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

      <Conversar />
      <Rodape />
    </div>
  );
}
