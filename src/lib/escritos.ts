/**
 * O que ela escreve, e onde.
 *
 * A página /escrita é a casa disto -- a nota dela: "na parte do escrevo, é
 * importante ter esta página intermédia, já com a possibilidade de colocar o
 * artigo da marketeer, porque é a partir daí que consigo trabalhar SEO através
 * de conteúdos escritos por mim".
 *
 * Os textos vivem em `content/escritos/*.md` -- Markdown com cabeçalho, que é
 * o que o painel escreve -- e são lidos por `lib/conteudo.ts`. Aqui ficam o
 * tipo e as funções que também correm no browser.
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
  /** Rascunho não aparece em lado nenhum. */
  estado?: "rascunho" | "publicado";
};

/** A ilustração do ficheiro, para os cartões que ainda não têm a sua. */
export const ILUSTRACAO_PADRAO = "/escrita/ilustracao-padrao.webp";

/** Do mais recente para o mais antigo, que é como se lê uma lista destas. */
export function porData(escritos: Escrito[]) {
  return [...escritos].sort((a, b) => b.data.localeCompare(a.data));
}

/** As famílias que têm mesmo texto, pela ordem do ficheiro. */
export function familiasComTexto(escritos: Escrito[]): Familia[] {
  const ordem: Familia[] = ["Artigo de opinião", "Texto original", "Paper"];
  return ordem.filter((f) => escritos.some((e) => e.familia === f));
}
