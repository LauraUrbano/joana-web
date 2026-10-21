/**
 * As medidas que mais de uma página usa.
 *
 * Estavam todas dentro da home, que era a única página do sítio feita ao
 * ficheiro. A partir do momento em que há outra -- a /escrita -- ou se
 * partilham ou passam a existir duas verdades.
 */

/** Margem lateral: 113 numa moldura de 1669 no ficheiro. */
export const GUTTER = "px-[clamp(1.25rem,6.8vw,7.5rem)]";

/**
 * Maiúsculas espaçadas do sistema: navegação, etiquetas e ligações.
 *
 * O tamanho do telemóvel é o da moldura estreita do ficheiro (22/681), que foi
 * o que a Joana pediu para uniformizar; do `md` para cima é o da moldura
 * larga (14/1669).
 */
export const CAPS =
  "font-sans text-[min(3.23vw,14px)] md:text-[clamp(0.625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em]";

/* Área de toque. O texto em caixa alta tem 15px de altura e o dedo precisa de
   24 (WCAG 2.2 AA); são 5px acima e abaixo, que é enchimento a sério e não uma
   camada por cima -- assim nunca rouba o toque ao vizinho. Quem tem risco por
   baixo só recebe por cima, para o risco ficar onde está. */
export const ALVO = "py-[5px]";
export const ALVO_CIMA = "pt-2";
