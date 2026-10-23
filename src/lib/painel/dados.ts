/**
 * As leituras e escritas do painel: quem pode entrar, e a chave do GitHub.
 *
 * Todas as funções devolvem `null` quando não há base de dados configurada,
 * para que as páginas possam dizer isso em vez de estoirar -- o mesmo código
 * está publicado em dois sítios e só um tem as variáveis.
 */
import { base } from "@/lib/painel/neon";

/** O nome com que a chave do GitHub está guardada. */
const CHAVE = "chave_github";


export type Pessoa = {
  email: string;
  nome: string | null;
  acrescentado_em: string;
};

/**
 * Pode esta pessoa entrar?
 *
 * É a porta do painel. O registo no Neon Auth é aberto -- tem de ser, ou não
 * havia como criar a primeira conta -- e esta lista é o que separa ter conta de
 * ter acesso. Os emails comparam-se em minúsculas porque é assim que um
 * endereço de email funciona.
 */
export async function podeEntrar(email: string | null | undefined) {
  if (!email) return false;
  const sql = base();
  if (!sql) return false;
  const linhas = (await sql`
    select 1 from painel_pessoas where lower(email) = lower(${email}) limit 1
  `) as unknown[];
  return linhas.length > 0;
}

export async function pessoas(): Promise<Pessoa[] | null> {
  const sql = base();
  if (!sql) return null;
  return (await sql`
    select email, nome, acrescentado_em from painel_pessoas
    order by acrescentado_em
  `) as unknown as Pessoa[];
}

export async function acrescentarPessoa(
  email: string,
  nome: string | null,
  por: string
) {
  const sql = base();
  if (!sql) return;
  await sql`
    insert into painel_pessoas (email, nome, acrescentado_por)
    values (lower(${email}), ${nome}, ${por})
    on conflict (email) do nothing
  `;
}

export async function tirarPessoa(email: string) {
  const sql = base();
  if (!sql) return;
  // A última pessoa não se apaga: ficava um painel sem ninguém que pudesse
  // voltar a abrir a porta.
  await sql`
    delete from painel_pessoas
    where lower(email) = lower(${email})
      and (select count(*) from painel_pessoas) > 1
  `;
}

/** A chave do GitHub, ou nada se ainda não foi guardada. */
export async function chaveGithub() {
  const sql = base();
  if (!sql) return null;
  const linhas = (await sql`
    select valor from painel_segredos where nome = ${CHAVE} limit 1
  `) as unknown as { valor: string }[];
  return linhas[0]?.valor ?? null;
}

/** Quando foi posta e por quem, para a página mostrar sem revelar a chave. */
export async function estadoDaChave() {
  const sql = base();
  if (!sql) return null;
  const linhas = (await sql`
    select actualizado_em, actualizado_por, length(valor) as tamanho
    from painel_segredos where nome = ${CHAVE} limit 1
  `) as unknown as {
    actualizado_em: string;
    actualizado_por: string | null;
    tamanho: number;
  }[];
  return linhas[0] ?? null;
}

export async function guardarChave(valor: string, por: string) {
  const sql = base();
  if (!sql) return;
  await sql`
    insert into painel_segredos (nome, valor, actualizado_por)
    values (${CHAVE}, ${valor}, ${por})
    on conflict (nome) do update
      set valor = excluded.valor,
          actualizado_em = now(),
          actualizado_por = excluded.actualizado_por
  `;
}

export async function apagarChave() {
  const sql = base();
  if (!sql) return;
  await sql`delete from painel_segredos where nome = ${CHAVE}`;
}
