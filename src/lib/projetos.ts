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
 * Peças que já estão na cena da home mas ainda não têm caso de estudo escrito.
 *
 * A Joana pediu que se pudesse clicar para ir para a página do projeto; só que
 * os seis projetos reais ainda não chegaram, e inventar-lhe casos de estudo
 * seria pôr no site texto que não é dela. Por isso cada uma destas peças tem
 * mesmo uma página -- com o que se sabe de verdade: a peça, o título e o tipo
 * de trabalho -- e diz com todas as letras que o caso está em preparação.
 *
 * Quando o caso chegar, passa para `PROJETOS` e sai daqui. A ligação não muda.
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
   * Estas são de simulação -- recortes da composição do Figma --, para se ver
   * o comportamento antes das imagens reais chegarem. Ver o LEIA-ME em
   * public/home/projetos/simulacao/.
   */
  imagens?: string[];
};

/** Atalho: as quatro imagens de simulação de um projeto. */
const simulacao = (slug: string) =>
  [1, 2, 3, 4].map((n) => `/home/projetos/simulacao/${slug}-${n}.jpg`);

export const EM_PREPARACAO: Preparacao[] = [
  {
    slug: "solar",
    titulo: "Solar",
    tipo: "Identidade · Embalagem",
    naCena: true,
    src: "/home/projetos/solar.jpg",
    w: 416,
    h: 485,
    imagens: simulacao("solar"),
  },
  {
    slug: "boa-companhia",
    titulo: "In Boa Companhia",
    tipo: "Editorial · Publicação",
    naCena: true,
    src: "/home/projetos/boa-companhia.jpg",
    w: 342,
    h: 340,
    imagens: simulacao("boa-companhia"),
  },
  {
    slug: "terra",
    titulo: "Terra",
    tipo: "Website · Design digital",
    naCena: true,
    src: "/home/projetos/terra.jpg",
    w: 411,
    h: 385,
    imagens: simulacao("terra"),
  },
  {
    slug: "cuidar",
    titulo: "Cuidar é um Lugar",
    tipo: "Identidade · Embalagem",
    naCena: true,
    src: "/home/projetos/cuidar.jpg",
    w: 245,
    h: 224,
    imagens: simulacao("cuidar"),
  },

  /* ------------------------------------------------------------------ *
   * Os projetos reais, nas palavras e nos anos que a Joana mandou.
   * Ainda sem fotografias -- a pasta do Drive dela está vazia vista daqui --,
   * por isso têm página própria mas ficam fora da cena. Quando as imagens
   * chegarem, é pôr `naCena: true`, `src` e `imagens`.
   * ------------------------------------------------------------------ */
  {
    slug: "authentic-studio-pilates",
    titulo: "Authentic Studio Pilates",
    tipo: "Marca · Identidade visual",
    ano: "2024",
    descricao:
      "Criação de marca e identidade visual, com desenvolvimento de elementos de comunicação para o espaço, incluindo decoração e lonas.",
  },
  {
    slug: "carla-rocha",
    titulo: "Carla Rocha — Communication Training",
    tipo: "Webapp · Marca · Comunicação",
    ano: "2025",
    descricao:
      "Desenvolvimento de webapp com loja online e plataforma de cursos online. Desenvolvimento de materiais de marca e comunicação interna, pastas corporativas e imagem gráfica para webinars.",
  },
  {
    slug: "segmento-urbano",
    titulo: "Segmento Urbano",
    tipo: "Branding · Evento",
    ano: "2026",
    descricao:
      "Desenvolvimento de branding e criação de imagem para evento.",
  },
  {
    slug: "testbeds",
    titulo: "Testbeds",
    tipo: "Identidade visual · Evento",
    ano: "2023",
    descricao:
      "Desenvolvimento de identidade visual para evento, com execução em tempo recorde.",
  },
  {
    slug: "hoteis-vila-baleira",
    titulo: "Hotéis Vila Baleira",
    tipo: "Marca · Arquitetura de marca · Comunicação",
    ano: "2024",
    descricao:
      "Criação de marca e arquitetura de marca, identidade visual e desenvolvimento de comunicação comercial, institucional e interna. Criação de materiais para eventos internos de grande escala, incluindo a Rota do Atum, o Paddle e a Latin Week.",
  },
];

export function getPreparacao(slug: string) {
  return EM_PREPARACAO.find((p) => p.slug === slug);
}
