import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { podeEntrar } from "@/lib/painel/dados";
import { ambiente, login } from "@/lib/painel/neon";

/**
 * Quem está a pedir, e se tem direito.
 *
 * Está num sítio só porque é usado em todas as páginas e em todas as acções do
 * painel -- uma página protegida não protege um `POST` que chegue de outro
 * lado, por isso cada acção volta a perguntar.
 */
export async function quemPede() {
  if (!ambiente().pronto) return null;
  const auth = await login();
  if (!auth) return null;
  const { data: sessao } = (await auth.getSession()) ?? { data: null };
  const utilizador = sessao?.user;
  if (!utilizador?.email) return null;
  if (!(await podeEntrar(utilizador.email))) return null;
  return { email: utilizador.email, nome: utilizador.name ?? null };
}

/** O mesmo, mas manda à entrada em vez de devolver nada. */
export async function exigeSessao() {
  const quem = await quemPede();
  if (!quem) redirect("/painel/entrar");
  return quem;
}

/** Nas acções: sem direito, volta-se à entrada sem gravar nada. */
export async function exigeSessaoNaAccao() {
  const quem = await quemPede();
  if (!quem) redirect("/painel/entrar");
  return quem.email;
}

/**
 * Manda o sítio reconstruir-se.
 *
 * As páginas de conteúdo ficam guardadas um minuto (`revalidate = 60`). Isso
 * chega para não ir à base de dados a cada visita, mas não chega para quem
 * acabou de gravar: "gravei e o site não mudou" é a primeira coisa que se
 * pensa. Isto apaga o que está guardado, e a visita seguinte -- a dela, a
 * confirmar -- já vê o novo.
 */
export function refrescarSitio() {
  revalidatePath("/", "layout");
}
