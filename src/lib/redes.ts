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
  // Este endereço não veio por mensagem: está publicado pela própria Joana no
  // perfil público dela no ORCID, que ela mandou. Se não for para usar, é
  // pôr `null` outra vez.
  { nome: "LinkedIn", href: "https://www.linkedin.com/in/jcmdomingues/" },
  { nome: "Substack", href: null },
  { nome: "Instagram", href: null },
  { nome: "WhatsApp", href: null },
];
