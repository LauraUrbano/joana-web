/**
 * As redes da Joana, partilhadas pela página de espera e pelo rodapé da home.
 *
 * O `href` fica a `null` enquanto ela não enviar os endereços: sem endereço, o
 * nome aparece como texto em vez de uma ligação que não leva a lado nenhum --
 * numa página de espera, que é a única coisa que o público vê, uma ligação
 * morta é pior do que nenhuma.
 *
 * As que têm endereço abrem à parte, com `rel="me"`: é a forma de dizer que
 * aquele perfil é da mesma pessoa que este sítio.
 */
export type Rede = { nome: string; href: string | null };

export const REDES: Rede[] = [
  { nome: "LinkedIn", href: "https://www.linkedin.com/in/jcmdomingues/" },
  { nome: "Substack", href: "https://substack.com/@joanadomingues" },
  {
    nome: "Instagram",
    href: "https://www.instagram.com/joanadomingues.design/",
  },
  { nome: "WhatsApp", href: null },
];
