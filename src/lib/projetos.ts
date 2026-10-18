import type { Ramp } from "@/components/liquid-background";

/**
 * Projetos do portfólio.
 *
 * O nome de cada projeto vem partido em duas metades, `sans` e `serif`: é a
 * assinatura tipográfica do estúdio, que alterna grotesco e serifado dentro da
 * mesma frase, e aqui também governa a animação de entrada.
 *
 * A `ramp` tinge a capa líquida. Vem da paleta do estúdio -- lilás #C6B9DE e
 * amarelo #F4EF93, ambos amostrados dos ficheiros do Figma -- com o lilás
 * escurecido na ponta escura para a capa ter contraste. O tom do meio atravessa
 * o creme da página, que é o que acontece naturalmente entre os dois.
 */
export type Projeto = {
  slug: string;
  indice: string;
  nome: { sans: string; serif: string };
  ambito: string;
  ano: string;
  premissa: string;
  ramp: Ramp;
  ficha: { termo: string; valor: string }[];
  secoes: {
    premissa: { sans: string; serif: string; corpo: string[] };
    sistema: {
      sans: string;
      serif: string;
      intro: string;
      espécime: { alto: string; baixo: string; nota: string; corpo: string };
      paleta: { titulo: string; corpo: string; valores: string[] };
      grelha: { titulo: string; corpo: string; colunas: number; sinal: number };
    };
    pecas: {
      sans: string;
      serif: string;
      lista: { titulo: string; nota: string }[];
    };
    resultado: {
      sans: string;
      serif: string;
      numeros: { valor: string; unidade?: string; corpo: string }[];
    };
  };
  seguinte: { nome: string; ambito: string; slug?: string };
};

/**
 * Vazio de propósito.
 *
 * Aqui esteve um caso de estudo do Segmento Urbano escrito por mim --
 * Câmara Municipal de Matosinhos, sete planos de mobilidade, 412 paragens
 * renomeadas. Nada disso aconteceu: era texto de preenchimento meu sobre um
 * cliente real dela, e saiu assim que a Joana mandou a descrição verdadeira,
 * que está agora em EM_PREPARACAO. O tipo e a página ficam de pé à espera do
 * primeiro caso escrito por ela.
 */
export const PROJETOS: Projeto[] = [];

export function getProjeto(slug: string) {
  return PROJETOS.find((p) => p.slug === slug);
}

/**
 * Os seis projetos, com as fotografias e os textos dela.
 *
 * Estiveram aqui quatro peças de preenchimento -- recortes de mockups da
 * composição do Figma, a que eu tinha chamado Solar, In Boa Companhia, Terra e
 * Cuidar é um Lugar por ser o que se lia nos próprios mockups. Saíram: a Joana
 * mandou os seis projetos reais, com imagens e âmbito, que era o que a nota
 * dela no Figma pedia ("vamos colocar apenas 6 projetos").
 *
 * Ainda não têm caso de estudo escrito, por isso a página de cada um mostra o
 * que se sabe de verdade -- as imagens, o título, o tipo, o ano e o âmbito nas
 * palavras dela. Quando um caso for escrito, passa para `PROJETOS` e sai
 * daqui; a ligação `/projetos/<slug>` não muda.
 *
 * A ordem é a da lista que ela mandou, com a Sonae no fim, que veio depois.
 */
export type Preparacao = {
  slug: string;
  titulo: string;
  tipo: string;
  /** O ano do trabalho, como ela o deu. */
  ano?: string;
  /** O âmbito, nas palavras dela. */
  descricao?: string;
  /**
   * Se entra na cena de projetos da home. Só entram as que têm imagem: um
   * cartão sem imagem numa órbita de fotografias não é uma peça, é um buraco.
   * As outras têm página própria e entram na cena assim que as fotografias
   * chegarem -- é virar esta marca e acrescentar as imagens.
   */
  naCena?: boolean;
  src?: string;
  w?: number;
  h?: number;
  /**
   * As imagens do projeto, para a passagem automática que ela pediu: "as
   * imagens desse projeto vão alternando, por exemplo, a cada 4-5 segundos".
   * A primeira é a mesma do `src`, para a peça não mudar de imagem no
   * instante em que a apresentação começa.
   */
  imagens?: string[];
};

export const EM_PREPARACAO: Preparacao[] = [
  {
    slug: "authentic-studio-pilates",
    titulo: "Authentic Studio Pilates",
    tipo: "Marca · Identidade visual",
    ano: "2024",
    descricao:
      "Criação de marca e identidade visual, com desenvolvimento de elementos de comunicação para o espaço, incluindo decoração e lonas.",
    naCena: true,
    src: "/home/projetos/authentic-studio-pilates/1.webp",
    w: 1024,
    h: 1123,
    imagens: [
      "/home/projetos/authentic-studio-pilates/1.webp",
      "/home/projetos/authentic-studio-pilates/2.webp",
      "/home/projetos/authentic-studio-pilates/3.webp",
      "/home/projetos/authentic-studio-pilates/4.webp",
      "/home/projetos/authentic-studio-pilates/5.webp",
    ],
  },
  {
    slug: "carla-rocha",
    titulo: "Carla Rocha — Communication Training",
    tipo: "Webapp · Marca · Comunicação",
    ano: "2025",
    descricao:
      "Desenvolvimento de webapp com loja online e plataforma de cursos online. Desenvolvimento de materiais de marca e comunicação interna, pastas corporativas e imagem gráfica para webinars.",
    naCena: true,
    src: "/home/projetos/carla-rocha/1.webp",
    w: 1174,
    h: 1340,
    imagens: [
      "/home/projetos/carla-rocha/1.webp",
      "/home/projetos/carla-rocha/2.webp",
      "/home/projetos/carla-rocha/3.webp",
      "/home/projetos/carla-rocha/4.webp",
    ],
  },
  {
    slug: "segmento-urbano",
    titulo: "Segmento Urbano",
    tipo: "Branding · Evento",
    ano: "2026",
    descricao:
      "Desenvolvimento de branding e criação de imagem para evento.",
    naCena: true,
    src: "/home/projetos/segmento-urbano/1.webp",
    w: 1271,
    h: 1335,
    imagens: [
      "/home/projetos/segmento-urbano/1.webp",
      "/home/projetos/segmento-urbano/2.webp",
      "/home/projetos/segmento-urbano/3.webp",
      "/home/projetos/segmento-urbano/4.webp",
      "/home/projetos/segmento-urbano/5.webp",
    ],
  },
  {
    slug: "testbeds",
    titulo: "Testbeds",
    tipo: "Identidade visual · Evento",
    ano: "2023",
    descricao:
      "Desenvolvimento de identidade visual para evento, com execução em tempo recorde.",
    naCena: true,
    src: "/home/projetos/testbeds/1.webp",
    w: 1400,
    h: 1050,
    imagens: [
      "/home/projetos/testbeds/1.webp",
      "/home/projetos/testbeds/2.webp",
      "/home/projetos/testbeds/3.webp",
      "/home/projetos/testbeds/4.webp",
      "/home/projetos/testbeds/5.webp",
      "/home/projetos/testbeds/6.webp",
    ],
  },
  {
    slug: "hoteis-vila-baleira",
    titulo: "Hotéis Vila Baleira",
    tipo: "Marca · Arquitetura de marca · Comunicação",
    ano: "2024",
    descricao:
      "Criação de marca e arquitetura de marca, identidade visual e desenvolvimento de comunicação comercial, institucional e interna. Criação de materiais para eventos internos de grande escala, incluindo a Rota do Atum, o Paddle e a Latin Week.",
    naCena: true,
    src: "/home/projetos/hoteis-vila-baleira/1.webp",
    w: 1400,
    h: 933,
    imagens: [
      "/home/projetos/hoteis-vila-baleira/1.webp",
      "/home/projetos/hoteis-vila-baleira/2.webp",
      "/home/projetos/hoteis-vila-baleira/3.webp",
      "/home/projetos/hoteis-vila-baleira/4.webp",
    ],
  },
  {
    slug: "sonae",
    titulo: "Sonae — Education Innovators Forum",
    tipo: "Identidade de evento · Comunicação",
    ano: "2023",
    naCena: true,
    src: "/home/projetos/sonae/1.webp",
    w: 1400,
    h: 1050,
    imagens: [
      "/home/projetos/sonae/1.webp",
      "/home/projetos/sonae/2.webp",
      "/home/projetos/sonae/3.webp",
      "/home/projetos/sonae/4.webp",
      "/home/projetos/sonae/5.webp",
      "/home/projetos/sonae/6.webp",
      "/home/projetos/sonae/7.webp",
    ],
  },
];

export function getPreparacao(slug: string) {
  return EM_PREPARACAO.find((p) => p.slug === slug);
}
