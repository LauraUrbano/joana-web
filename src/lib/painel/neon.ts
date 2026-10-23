/**
 * As duas ligações ao Neon: a base de dados e o login.
 *
 * Porque é que isto existe. O painel de conteúdos corre no browser e, para
 * escrever no repositório, precisa de uma chave do GitHub. Essa chave tem de
 * estar guardada do lado do servidor e ser entregue só a quem tem direito a
 * ela -- e é esse "quem tem direito" que passou a ser um login a sério:
 * endereço de email e palavra-passe, contas separadas, cada uma com a sua.
 *
 * O que vive onde:
 *
 *   Neon Auth (esquema `neon_auth`)   as contas e as sessões
 *   Lakebase Postgres                 a chave do GitHub e quem pode entrar
 *
 * Tudo é lido em tempo de execução, nunca na construção: o sítio é publicado
 * duas vezes -- no domínio dela e no projeto que guarda a chave -- e só o
 * segundo tem estas variáveis. Sem elas, as páginas do painel dizem-no em vez
 * de estoirar.
 */
import { randomBytes } from "node:crypto";

import { neon } from "@neondatabase/serverless";
import { createNeonAuth } from "@neondatabase/auth/next/server";

/**
 * As duas variáveis que isto precisa, e que o `neon deploy` escreve.
 *
 * São duas e não três: o segredo que assina os cookies de sessão nasce na
 * própria base de dados (ver `segredoDeCookies`), porque é um valor que só
 * precisa de existir e de não mudar -- não de ser escrito à mão por alguém.
 */
export function ambiente() {
  const base = process.env.DATABASE_URL;
  const auth = process.env.NEON_AUTH_BASE_URL;
  if (!base || !auth) {
    return {
      pronto: false as const,
      falta: [!base && "DATABASE_URL", !auth && "NEON_AUTH_BASE_URL"].filter(
        Boolean
      ) as string[],
    };
  }
  return { pronto: true as const, base, auth };
}

/**
 * O segredo com que as sessões são assinadas, guardado na base de dados.
 *
 * Se dois pedidos chegarem ao mesmo tempo com a tabela vazia, os dois geram um
 * valor, só um fica gravado (`do nothing`), e ambos leem o que ficou -- é por
 * isso que se lê outra vez depois de escrever em vez de devolver o que se
 * gerou. Sem isto, duas sessões assinadas com segredos diferentes.
 */
export async function segredoDeCookies() {
  const sql = base();
  if (!sql) return null;

  const ler = async () => {
    const linhas = (await sql`
      select valor from painel_segredos where nome = 'segredo_cookies' limit 1
    `) as unknown as { valor: string }[];
    return linhas[0]?.valor ?? null;
  };

  const existente = await ler();
  if (existente) return existente;

  await sql`
    insert into painel_segredos (nome, valor, actualizado_por)
    values ('segredo_cookies', ${randomBytes(48).toString("base64")}, 'automático')
    on conflict (nome) do nothing
  `;
  return ler();
}

/**
 * O login.
 *
 * Construído à chamada e não no topo do ficheiro: `createNeonAuth` recusa um
 * segredo com menos de 32 caracteres, e no projeto que serve o domínio dela
 * não há base de dados de onde o tirar -- importar este módulo não pode ser o
 * que parte a página.
 */
let guardado: ReturnType<typeof createNeonAuth> | null = null;

export async function login() {
  if (guardado) return guardado;

  const amb = ambiente();
  if (!amb.pronto) return null;
  const segredo = await segredoDeCookies();
  if (!segredo) return null;

  // Guardado depois de dar certo, e só então: um erro passageiro da base de
  // dados não pode deixar este módulo convencido de que não há login.
  guardado = createNeonAuth({
    baseUrl: amb.auth,
    cookies: { secret: segredo },
  });
  return guardado;
}

/**
 * A base de dados, pelo driver HTTP: cada consulta é um pedido só, que é o que
 * serve a um punhado de leituras curtas em funções sem estado. Um pool de
 * ligações aqui não teria onde viver entre pedidos.
 */
export function base() {
  const amb = ambiente();
  if (!amb.pronto) return null;
  return neon(amb.base);
}
