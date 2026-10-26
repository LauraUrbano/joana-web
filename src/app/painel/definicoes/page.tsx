import { redirect } from "next/navigation";

import { Botao, Cabeca, Recado, Seccao, Texto } from "@/components/painel/campos";
import { acrescentarPessoa, pessoas, tirarPessoa } from "@/lib/painel/dados";
import { login } from "@/lib/painel/neon";
import { exigeSessao, exigeSessaoNaAccao } from "@/lib/painel/sessao";

/**
 * O que não é conteúdo: quem entra, e a palavra-passe de cada uma.
 *
 * Esteve tudo isto na página principal, e empurrava o conteúdo para baixo. São
 * coisas que se mexem uma vez por ano; o conteúdo é todos os dias.
 */
export const dynamic = "force-dynamic";

export default async function Definicoes({
  searchParams,
}: {
  searchParams: Promise<{ feito?: string; erro?: string }>;
}) {
  const quem = await exigeSessao();
  const { feito, erro } = await searchParams;
  const lista = (await pessoas()) ?? [];

  return (
    <>
      <Cabeca
        titulo="Definições"
        nota={`A tua conta é ${quem.email}. Aqui mudas a palavra-passe e quem mais pode entrar.`}
      />

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      <Seccao titulo="A tua palavra-passe">
        <p className="font-body text-[1.05rem]">
          Se entraste com uma palavra-passe que outra pessoa escolheu, troca-a
          aqui. A troca derruba as outras sessões.
        </p>
        <form action={mudarSenha} className="mt-5 flex flex-col gap-3">
          <Texto etiqueta="A actual" nome="actual" tipo="password" obrigatorio />
          <Texto
            etiqueta="A nova"
            nome="nova"
            tipo="password"
            obrigatorio
            ajuda="Oito caracteres ou mais."
          />
          <div>
            <Botao>Trocar a palavra-passe</Botao>
          </div>
        </form>
      </Seccao>

      <Seccao titulo="Quem pode entrar">
        <ul className="font-body text-[1.05rem]">
          {lista.map((p) => (
            <li
              key={p.email}
              className="flex items-baseline justify-between gap-4 border-t border-clay/20 py-2.5 first:border-t-0"
            >
              <span>
                {p.nome ? `${p.nome} · ` : ""}
                {p.email}
              </span>
              {lista.length > 1 && (
                <form action={retirar}>
                  <input type="hidden" name="email" value={p.email} />
                  <Botao discreto>Tirar</Botao>
                </form>
              )}
            </li>
          ))}
        </ul>

        <form action={convidar} className="mt-6 flex flex-col gap-3">
          <Texto etiqueta="Acrescentar um email" nome="email" tipo="email" obrigatorio />
          <Texto etiqueta="Nome (opcional)" nome="nome" />
          <div>
            <Botao>Acrescentar</Botao>
          </div>
        </form>
        <p className="mt-3 font-body text-[0.95rem] opacity-70">
          A pessoa cria depois a sua conta em <code>/painel/entrar</code>, com a
          palavra-passe que escolher. Tirar o email não apaga a conta: tira-lhe o
          acesso ao conteúdo.
        </p>
      </Seccao>
    </>
  );
}

/* --------------------------------------------------------------- acções */

async function mudarSenha(form: FormData) {
  "use server";
  await exigeSessaoNaAccao();

  const nova = String(form.get("nova") ?? "");
  if (nova.length < 8) {
    redirect(
      `/painel/definicoes?erro=${encodeURIComponent(
        "A palavra-passe nova precisa de oito caracteres ou mais."
      )}`
    );
  }

  const auth = await login();
  if (!auth) redirect("/painel/entrar");
  const { error } = await auth.changePassword({
    currentPassword: String(form.get("actual") ?? ""),
    newPassword: nova,
    revokeOtherSessions: true,
  });
  if (error) {
    redirect(
      `/painel/definicoes?erro=${encodeURIComponent(
        error.message?.toLowerCase().includes("password")
          ? "A palavra-passe actual não está certa."
          : error.message || "Não foi possível trocar a palavra-passe."
      )}`
    );
  }
  redirect(
    `/painel/definicoes?feito=${encodeURIComponent(
      "Palavra-passe trocada. Só tu a sabes."
    )}`
  );
}

async function convidar(form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const email = String(form.get("email") ?? "").trim();
  const nome = String(form.get("nome") ?? "").trim() || null;
  if (!email.includes("@")) {
    redirect(
      `/painel/definicoes?erro=${encodeURIComponent("Esse email não se lê.")}`
    );
  }
  await acrescentarPessoa(email, nome, quem);
  redirect(
    `/painel/definicoes?feito=${encodeURIComponent(
      `${email} pode agora criar conta e editar.`
    )}`
  );
}

async function retirar(form: FormData) {
  "use server";
  await exigeSessaoNaAccao();
  await tirarPessoa(String(form.get("email") ?? ""));
  redirect(`/painel/definicoes?feito=${encodeURIComponent("Lista actualizada.")}`);
}
