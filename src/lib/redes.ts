/**
 * As redes da Joana, partilhadas pela página de espera e pelo rodapé da home.
 *
 * O `href` fica a `null` enquanto ela não enviar os endereços: sem endereço, o
 * nome aparece como texto em vez de uma ligação que não leva a lado nenhum --
 * numa página de espera, que é a única coisa que o público vê, uma ligação
 * morta é pior do que nenhuma.
 */
export type Rede = { nome: string; href: string | null };

export const REDES: Rede[] = [
  { nome: "LinkedIn", href: null },
  { nome: "Substack", href: null },
  { nome: "Instagram", href: null },
  { nome: "WhatsApp", href: null },
];
