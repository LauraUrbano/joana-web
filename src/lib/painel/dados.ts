/**
 * As leituras e escritas do painel: quem pode entrar.
 *
 * A chave do GitHub esteve aqui, enquanto o conteúdo vivia em ficheiros e uma
 * ferramenta de fora os escrevia. Já não existe nenhuma das duas coisas: o
 * conteúdo está na base de dados e edita-se no painel.
 *
 * As funções devolvem `null` ou falso quando não há base de dados configurada,
 * para que as páginas possam dizer isso em vez de estoirar.
 */
import { base } from "@/lib/painel/neon";

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
