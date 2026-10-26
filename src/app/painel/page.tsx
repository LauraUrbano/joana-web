import Link from "next/link";
import { redirect } from "next/navigation";

import {
  acrescentarPessoa,
  apagarChave,
  estadoDaChave,
  guardarChave,
  pessoas,
  podeEntrar,
  tirarPessoa,
} from "@/lib/painel/dados";
import { ambiente, login } from "@/lib/painel/neon";

/**
 * A sala de máquinas do painel: a chave do repositório e quem pode entrar.
 *
 * Isto não é onde se edita o conteúdo -- isso é o /admin. É o que está por
 * baixo: a chave do GitHub que o /admin precisa para gravar, e a lista de
 * emails que têm direito a ela.
 */
export const dynamic = "force-dynamic";

export default async function Painel({
  searchParams,
}: {
  searchParams: Promise<{ feito?: string; erro?: string }>;
}) {
  const amb = ambiente();
  if (!amb.pronto) redirect("/painel/entrar");

  const auth = await login();
  const { data: sessao } = (await auth!.getSession()) ?? { data: null };
  const utilizador = sessao?.user;
  if (!utilizador) redirect("/painel/entrar");

  const autorizado = await podeEntrar(utilizador.email);
  const { feito, erro } = await searchParams;

  if (!autorizado) {
    return (
      <>
        <h1 className="font-serif text-[2rem] leading-tight">
          Esta conta não tem acesso
        </h1>
        <p className="mt-4 font-body text-[1.05rem]">
          A conta <strong>{utilizador.email}</strong> existe, mas o email não
          está na lista de quem pode editar o conteúdo. Pede a quem já entra
          para o acrescentar.
        </p>
        <form action={sair} className="mt-8">
          <Botao>Sair</Botao>
        </form>
      </>
    );
  }

  const chave = await estadoDaChave();
  const lista = (await pessoas()) ?? [];

  return (
    <>
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-[2rem] leading-tight">Painel</h1>
        <form action={sair}>
          <button
            type="submit"
            className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-70 hover:opacity-100"
          >
            Sair
          </button>
        </form>
      </header>
      <p className="mt-1 font-body text-[1.05rem] opacity-70">
        {utilizador.name || utilizador.email}
      </p>

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      <Seccao titulo="Editar o conteúdo">
        <p className="font-body text-[1.05rem]">
          {chave ? (
            <>
              A chave está guardada. O painel de conteúdos está em{" "}
              <a
                href="https://www.joanadominguesdesign.pt/admin"
                className="border-b border-clay/60"
              >
                joanadominguesdesign.pt/admin
              </a>
              : abre, carrega em <strong>&quot;Sign In with GitHub&quot;</strong>{" "}
              e escreve estes mesmos dados.
            </>
          ) : (
            <>
              Falta a chave do repositório, por baixo. Sem ela o painel de
              conteúdos abre mas não consegue gravar.
            </>
          )}
        </p>
        <p className="mt-4 font-body text-[1.05rem]">
          <Link href="/painel/ajuda" className="border-b border-clay/60">
            Como se edita cada coisa
          </Link>{" "}
          — projetos, textos do blog, ligações e contactos, passo a passo.
        </p>
      </Seccao>

      <Seccao titulo="A tua palavra-passe">
        <p className="font-body text-[1.05rem]">
          Se entraste com uma palavra-passe que outra pessoa escolheu, troca-a
          aqui. A partir daí só tu a sabes.
        </p>
        <form action={mudarSenha} className="mt-5 flex flex-col gap-3">
          <Campo
            etiqueta="A actual"
            nome="actual"
            autoComplete="current-password"
          />
          <Campo
            etiqueta="A nova"
            nome="nova"
            autoComplete="new-password"
            ajuda="Oito caracteres ou mais."
          />
          <Botao>Trocar a palavra-passe</Botao>
        </form>
      </Seccao>

      <Seccao titulo="A chave do repositório">
        {chave ? (
          <p className="font-body text-[1.05rem]">
            Guardada em {porExtenso(chave.actualizado_em)}
            {chave.actualizado_por ? ` por ${chave.actualizado_por}` : ""}, com{" "}
            {chave.tamanho} caracteres. Não se mostra aqui, nem a mim: só é
            entregue ao painel de conteúdos quando alguém desta lista entra.
          </p>
        ) : (
          <p className="font-body text-[1.05rem]">
            Cria uma em{" "}
            <a
              href="https://github.com/settings/personal-access-tokens"
              className="border-b border-clay/60"
            >
              github.com/settings/personal-access-tokens
            </a>{" "}
            (<em>fine-grained</em>), só para o repositório{" "}
            <code>LauraUrbano/joana-web</code>, com <strong>Contents</strong> e{" "}
            <strong>Pull requests</strong> em <em>Read and write</em>. Cola-a
            aqui.
          </p>
        )}

        <form action={porChave} className="mt-5 flex flex-col gap-3">
          <label className="block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              {chave ? "Trocar por outra" : "A chave"}
            </span>
            <input
              name="chave"
              type="password"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder="github_pat_..."
              className="mt-2 w-full border border-clay/40 bg-paper px-3 py-2.5 font-mono text-[0.95rem] outline-offset-2 focus-visible:outline-2 focus-visible:outline-clay"
            />
          </label>
          <Botao>Guardar a chave</Botao>
        </form>

        {chave && (
          <form action={tirarChave} className="mt-3">
            <button
              type="submit"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-70 hover:opacity-100"
            >
              Apagar a chave
            </button>
          </form>
        )}
      </Seccao>

      <Seccao titulo="Quem pode entrar">
        <ul className="font-body text-[1.05rem]">
          {lista.map((p) => (
            <li
              key={p.email}
              className="flex items-baseline justify-between gap-4 border-t border-clay/30 py-2.5"
            >
              <span>
                {p.nome ? `${p.nome} · ` : ""}
                {p.email}
              </span>
              {lista.length > 1 && (
                <form action={retirar}>
                  <input type="hidden" name="email" value={p.email} />
                  <button
                    type="submit"
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
                  >
                    Tirar
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>

        <form action={convidar} className="mt-5 flex flex-col gap-3">
          <label className="block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              Acrescentar um email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              className="mt-2 w-full border border-clay/40 bg-paper px-3 py-2.5 font-body text-[1.05rem] outline-offset-2 focus-visible:outline-2 focus-visible:outline-clay"
            />
          </label>
          <label className="block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              Nome (opcional)
            </span>
            <input
              name="nome"
              type="text"
              autoComplete="off"
              className="mt-2 w-full border border-clay/40 bg-paper px-3 py-2.5 font-body text-[1.05rem] outline-offset-2 focus-visible:outline-2 focus-visible:outline-clay"
            />
          </label>
          <Botao>Acrescentar</Botao>
        </form>
        <p className="mt-3 font-body text-[0.95rem] opacity-70">
          A pessoa cria depois a sua conta em{" "}
          <Link href="/painel/entrar?novo=1" className="border-b border-clay/60">
            /painel/entrar
          </Link>
          , com a palavra-passe que escolher.
        </p>
      </Seccao>
    </>
  );
}

/**
 * Confirma que quem está a pedir tem direito, e devolve o nome para ficar
 * registado em quem fez o quê. Todas as acções passam por aqui: uma página
 * protegida não protege um `POST` que chegue de outro lado.
 */
async function quemPede() {
  const auth = await login();
  if (!auth) return null;
  const { data: sessao } = (await auth.getSession()) ?? { data: null };
  const email = sessao?.user?.email;
  if (!email || !(await podeEntrar(email))) return null;
  return email;
}

async function porChave(form: FormData) {
  "use server";
  const quem = await quemPede();
  if (!quem) redirect("/painel/entrar");

  const chave = String(form.get("chave") ?? "").trim();
  if (chave.length < 20) {
    redirect(
      `/painel?erro=${encodeURIComponent(
        "Isso não parece uma chave do GitHub. Nada foi guardado."
      )}`
    );
  }
  await guardarChave(chave, quem);
  redirect(`/painel?feito=${encodeURIComponent("Chave guardada.")}`);
}

/**
 * Trocar a palavra-passe.
 *
 * Existe porque uma conta pode ser criada por outra pessoa -- foi assim que a
 * da Joana nasceu -- e uma palavra-passe que passou por uma conversa deixa de
 * ser só dela. Isto fecha essa porta sem ninguém ter de me pedir nada.
 */
async function mudarSenha(form: FormData) {
  "use server";
  const quem = await quemPede();
  if (!quem) redirect("/painel/entrar");

  const actual = String(form.get("actual") ?? "");
  const nova = String(form.get("nova") ?? "");
  if (nova.length < 8) {
    redirect(
      `/painel?erro=${encodeURIComponent(
        "A palavra-passe nova precisa de oito caracteres ou mais."
      )}`
    );
  }

  const auth = await login();
  if (!auth) redirect("/painel/entrar");
  const { error } = await auth.changePassword({
    currentPassword: actual,
    newPassword: nova,
    // As outras sessões caem: se a antiga andou por onde não devia, não fica
    // ninguém lá dentro com ela.
    revokeOtherSessions: true,
  });
  if (error) {
    redirect(
      `/painel?erro=${encodeURIComponent(
        error.message?.toLowerCase().includes("password")
          ? "A palavra-passe actual não está certa."
          : error.message || "Não foi possível trocar a palavra-passe."
      )}`
    );
  }
  redirect(
    `/painel?feito=${encodeURIComponent("Palavra-passe trocada. Só tu a sabes.")}`
  );
}

async function tirarChave() {
  "use server";
  const quem = await quemPede();
  if (!quem) redirect("/painel/entrar");
  await apagarChave();
  redirect(
    `/painel?feito=${encodeURIComponent(
      "Chave apagada. O painel de conteúdos deixa de gravar até haver outra."
    )}`
  );
}

async function convidar(form: FormData) {
  "use server";
  const quem = await quemPede();
  if (!quem) redirect("/painel/entrar");

  const email = String(form.get("email") ?? "").trim();
  const nome = String(form.get("nome") ?? "").trim() || null;
  if (!email.includes("@")) {
    redirect(`/painel?erro=${encodeURIComponent("Esse email não se lê.")}`);
  }
  await acrescentarPessoa(email, nome, quem);
  redirect(
    `/painel?feito=${encodeURIComponent(
      `${email} pode agora criar conta e editar.`
    )}`
  );
}

async function retirar(form: FormData) {
  "use server";
  const quem = await quemPede();
  if (!quem) redirect("/painel/entrar");
  await tirarPessoa(String(form.get("email") ?? ""));
  redirect(`/painel?feito=${encodeURIComponent("Lista actualizada.")}`);
}

async function sair() {
  "use server";
  const auth = await login();
  if (auth) await auth.signOut();
  redirect("/painel/entrar");
}

function Seccao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-clay/40 pt-6">
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
        {titulo}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Campo({
  etiqueta,
  nome,
  autoComplete,
  ajuda,
}: {
  etiqueta: string;
  nome: string;
  autoComplete: string;
  ajuda?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
        {etiqueta}
      </span>
      <input
        name={nome}
        type="password"
        autoComplete={autoComplete}
        required
        className="mt-2 w-full border border-clay/40 bg-paper px-3 py-2.5 font-body text-[1.05rem] outline-offset-2 focus-visible:outline-2 focus-visible:outline-clay"
      />
      {ajuda && (
        <span className="mt-1 block font-body text-[0.9rem] opacity-60">
          {ajuda}
        </span>
      )}
    </label>
  );
}

function Botao({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="bg-clay px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-80"
    >
      {children}
    </button>
  );
}

function Recado({
  tom,
  children,
}: {
  tom: "bom" | "mau";
  children: React.ReactNode;
}) {
  return (
    <p
      role="status"
      className={`mt-6 border-l-2 pl-3 font-body text-[1.05rem] ${
        tom === "bom" ? "border-olive" : "border-[#8a2b1f] text-[#8a2b1f]"
      }`}
    >
      {children}
    </p>
  );
}

function porExtenso(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
