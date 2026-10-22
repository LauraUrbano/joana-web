import type { Ramp } from "@/components/liquid-background";

/**
 * Os tipos dos projetos.
 *
 * Os dados deixaram de estar aqui: vivem em `content/projetos/*.json`, que é o
 * que o painel escreve, e são lidos por `lib/conteudo.ts`. Aqui ficam só as
 * formas, que é o que os componentes precisam de conhecer.
 *
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
  /**
   * Vídeos do projeto. Só aparecem na página de detalhe, nunca na cena da
   * home -- é o que a Joana pediu: na home só imagens.
   */
  videos?: { src: string; poster: string; w: number; h: number }[];
};


