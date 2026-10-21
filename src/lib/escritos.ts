/**
 * O que ela escreve, e onde.
 *
 * A página /escrita é a casa disto -- a nota dela: "na parte do escrevo, é
 * importante ter esta página intermédia, já com a possibilidade de colocar o
 * artigo da marketeer, porque é a partir daí que consigo trabalhar SEO através
 * de conteúdos escritos por mim".
 *
 * Por agora há um texto só, o que ela publicou mesmo. Não invento os outros:
 * acrescentam-se aqui à medida que forem saindo, e a página cresce sozinha.
 *
 * Quando um texto passar a viver no próprio sítio -- que é o que dá SEO a
 * sério, porque um artigo noutro domínio soma para esse domínio e não para o
 * dela -- ganha `href` interno em vez de `externo`, e a moldura "Artigo" do
 * ficheiro do Figma é o molde dessa página.
 */

/** As famílias de texto que o ficheiro mostra nos filtros da página. */
export type Familia = "Artigo de opinião" | "Texto original" | "Paper";

export type Escrito = {
  titulo: string;
  /** Duas linhas, no máximo: é o que a caixa do ficheiro comporta. */
  resumo: string;
  familia: Familia;
  /** Data de publicação, em ISO, para a máquina e para ordenar. */
  data: string;
  href: string;
  /** Onde foi publicado, quando não é aqui. Sai no cartão, junto à data. */
  publicado?: string;
  /** A ilustração do cartão. Sem imagem própria, fica a do ficheiro. */
  imagem?: string;
};

export const ESCRITOS: Escrito[] = [
  {
    titulo:
      "A IA não está a substituir os designers. Está a mudar aquilo pelo qual somos responsáveis",
    resumo:
      "O que muda no trabalho de quem desenha quando a máquina passa a produzir forma depressa: a responsabilidade desloca-se da execução para o critério.",
    familia: "Artigo de opinião",
    data: "2026-10-17",
    href: "https://marketeer.sapo.pt/a-ia-nao-esta-a-substituir-os-designers-esta-a-mudar-aquilo-pelo-qual-somos-responsaveis/",
    publicado: "Marketeer",
  },
];

/** A ilustração do ficheiro, para os cartões que ainda não têm a sua. */
export const ILUSTRACAO_PADRAO = "/escrita/ilustracao-padrao.webp";

/** Do mais recente para o mais antigo, que é como se lê uma lista destas. */
export function porData(escritos: Escrito[] = ESCRITOS) {
  return [...escritos].sort((a, b) => b.data.localeCompare(a.data));
}

/** As famílias que têm mesmo texto, pela ordem do ficheiro. */
export function familiasComTexto(escritos: Escrito[] = ESCRITOS): Familia[] {
  const ordem: Familia[] = ["Artigo de opinião", "Texto original", "Paper"];
  return ordem.filter((f) => escritos.some((e) => e.familia === f));
}
