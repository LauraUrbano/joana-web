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

export const PROJETOS: Projeto[] = [
  {
    slug: "segmento-urbano",
    indice: "Projeto 02",
    nome: { sans: "Segmento", serif: "Urbano" },
    ambito: "Identidade · Sinalética · Digital",
    ano: "2024",
    premissa: "Uma leitura da cidade feita por quem a atravessa todos os dias.",
    // Lilás escurecido → creme da página → amarelo. Tudo da paleta do estúdio.
    ramp: ["#ab99cf", "#ddd2c6", "#f4ef93"],
    ficha: [
      { termo: "Cliente", valor: "Câmara Municipal de Matosinhos" },
      { termo: "Ano", valor: "2024 — 2025" },
      { termo: "Âmbito", valor: "Identidade, sinalética e plataforma de consulta" },
      { termo: "Equipa", valor: "Joana Domingues com Atelier Fluvial" },
      { termo: "Reconhecimento", valor: "Prémio Nacional de Design, menção" },
    ],
    secoes: {
      premissa: {
        sans: "A cidade não se lê",
        serif: "de fora.",
        corpo: [
          "O município tinha sete planos de mobilidade, cada um com a sua nomenclatura, e nenhum legível para quem apanha o autocarro. O trabalho começou por aí: não por um logótipo, mas por descobrir que nome é que as pessoas dão às coisas.",
          "Percorremos quatro freguesias a registar o vocabulário real — as paragens têm alcunhas, os percursos têm atalhos que nenhum mapa mostra. Esse levantamento passou a ser a base do sistema, e não uma nota de rodapé.",
        ],
      },
      sistema: {
        sans: "Um alfabeto para",
        serif: "dezessete percursos.",
        intro:
          "Cada peça do sistema tem de funcionar num poste à chuva e num ecrã de cinco polegadas. O par tipográfico do estúdio resolve as duas: o grotesco carrega a informação que tem de ser lida de longe, o serifado carrega o que é dito na primeira pessoa.",
        espécime: {
          alto: "Rua da Praia",
          baixo: "quatro minutos",
          nota: "Instrument Sans 700 · Instrument Serif itálico",
          corpo:
            "O grotesco para o que se lê em movimento. O serifado para o tempo, a distância e tudo o que é dito na voz de quem informa.",
        },
        paleta: {
          titulo: "Lilás e sinal",
          corpo:
            "O lilás é o da identidade do estúdio, escurecido para aguentar a chuva e o contraluz. O amarelo é o único sinal, reservado ao que exige decisão: mudar de linha, sair, atravessar.",
          valores: ["#AB99CF", "#C6B9DE", "#DDD2C6", "#F4EF93", "#F5F0E8"],
        },
        grelha: {
          titulo: "Sete colunas",
          corpo:
            "Uma coluna por plano de mobilidade herdado. A grelha guarda a memória do problema que veio resolver.",
          colunas: 7,
          sinal: 4,
        },
      },
      pecas: {
        sans: "Do poste",
        serif: "ao bolso.",
        lista: [
          { titulo: "Sinalética de paragem", nota: "Poste · esmalte" },
          { titulo: "Mapa de percursos", nota: "Impressão · 700 × 1000" },
          { titulo: "Títulos de transporte", nota: "Cartão · série de sete" },
          { titulo: "Aplicação de consulta", nota: "iOS · Android" },
          { titulo: "Manual de nomenclatura", nota: "96 páginas" },
        ],
      },
      resultado: {
        sans: "Sete planos,",
        serif: "uma língua.",
        numeros: [
          {
            valor: "7",
            unidade: "→ 1",
            corpo:
              "Planos de mobilidade fundidos numa só nomenclatura, adotada pelos sete operadores da rede.",
          },
          {
            valor: "412",
            corpo:
              "Paragens renomeadas a partir do levantamento de campo, com o nome que as pessoas já usavam.",
          },
          {
            valor: "1",
            unidade: "de 4",
            corpo:
              "Pedidos de informação ao balcão que deixaram de existir no primeiro ano após a instalação.",
          },
        ],
      },
    },
    seguinte: { nome: "Carla Rocha", ambito: "Branding · Direção de arte · 2024" },
  },
];

export function getProjeto(slug: string) {
  return PROJETOS.find((p) => p.slug === slug);
}
