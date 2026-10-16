/**
 * As redes da Joana, partilhadas pela página de espera e pelo rodapé da home.
 *
 * Os quatro endereços são dela, mandados por ela. Abrem à parte, com
 * `rel="me"`, que é a forma de dizer que aquele perfil é da mesma pessoa que
 * este sítio.
 *
 * O `href` continua a aceitar `null`, e vale a pena ficar assim: se algum dia
 * uma rede sair ou mudar, pôr `null` faz o nome voltar a aparecer como texto
 * em vez de uma ligação que não leva a lado nenhum. Numa página de espera, que
 * é a única coisa que o público vê, uma ligação morta é pior do que nenhuma.
 */
export type Rede = { nome: string; href: string | null };

export const REDES: Rede[] = [
  { nome: "LinkedIn", href: "https://www.linkedin.com/in/jcmdomingues/" },
  { nome: "Substack", href: "https://substack.com/@joanadomingues" },
  {
    nome: "Instagram",
    href: "https://www.instagram.com/joanadomingues.design/",
  },
  // +351 915 086 579. O wa.me quer o indicativo colado ao número, sem o mais
  // e sem espaços; abre a conversa na aplicação ou no WhatsApp Web.
  { nome: "WhatsApp", href: "https://wa.me/351915086579" },
];
