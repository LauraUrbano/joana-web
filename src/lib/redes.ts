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

/* Os endereços estão em `content/ligacoes.json`, que é o que o painel
   escreve. `lib/conteudo.ts` lê-os e devolve-os nesta forma. */
