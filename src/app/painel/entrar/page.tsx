import Link from "next/link";
import { redirect } from "next/navigation";

import { podeEntrar } from "@/lib/painel/dados";
import { ambiente, login } from "@/lib/painel/neon";

/**
 * A entrada do painel: email e palavra-passe, como em qualquer sítio.
 *
 * É um formulário do servidor, sem JavaScript do nosso lado: o navegador manda
 * o formulário, a server action chama o Neon Auth, e a sessão fica num cookie.
 * Se o JavaScript não carregar, a página continua a funcionar.
 *
 * Quem pode entrar está na tabela `painel_pessoas`. O registo tem de ser aberto
 * -- é a única forma de a primeira conta existir -- e por isso a lista é a porta
 * a seguir: criar conta com um email que não esteja lá não dá acesso a nada.
 */
export const dynamic = "force-dynamic";

export default async function Entrar({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; novo?: string; voltar?: string }>;
}) {
  const amb = ambiente();
  if (!amb.pronto) return <SemNeon falta={amb.falta} />;

  const { erro, novo, voltar } = await searchParams;
  const criar = novo === "1";
  const destino = aqui(voltar);

  const auth = await login();
  const { data: sessao } = (await auth!.getSession()) ?? { data: null };
  if (sessao?.user) redirect(destino);

  return (
    <>
      <h1 className="font-serif text-[2rem] leading-tight">Painel</h1>
      <p className="mt-1 font-body text-[1.05rem] opacity-70">
        Joana Domingues Design
      </p>

      <form
        action={criar ? criarConta : entrar}
        className="mt-10 flex flex-col gap-4"
      >
        <input type="hidden" name="voltar" value={destino} />
        {criar && (
          <Campo
            etiqueta="Nome"
            nome="nome"
            tipo="text"
            autoComplete="name"
            obrigatorio={false}
          />
        )}
        <Campo
          etiqueta="Email"
          nome="email"
          tipo="email"
          autoComplete="email"
        />
        <Campo
          etiqueta="Palavra-passe"
          nome="senha"
          tipo="password"
          autoComplete={criar ? "new-password" : "current-password"}
          ajuda={criar ? "Oito caracteres ou mais." : undefined}
        />

        <button
          type="submit"
          className="mt-2 bg-clay px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-80"
        >
          {criar ? "Criar conta" : "Entrar"}
        </button>

        {erro && (
          <p className="text-[0.95rem] text-[#8a2b1f]" role="alert">
            {erro}
          </p>
        )}
      </form>

      <p className="mt-8 font-body text-[0.95rem] opacity-70">
        {criar ? (
          <>
            Já tens conta?{" "}
            <Atalho para={`/painel/entrar?voltar=${encodeURIComponent(destino)}`}>
              Entrar
            </Atalho>
            .
          </>
        ) : (
          <>
            Primeira vez?{" "}
            <Atalho
              para={`/painel/entrar?novo=1&voltar=${encodeURIComponent(destino)}`}
            >
              Criar a conta
            </Atalho>{" "}
            com o teu email. Só os endereços autorizados chegam ao conteúdo.
          </>
        )}
      </p>
    </>
  );
}

/**
 * Só caminhos deste sítio.
 *
 * O `voltar` vem do endereço, e um endereço é coisa que qualquer pessoa
 * escreve: sem isto, um `?voltar=https://...` transformava a nossa página de
 * entrada num trampolim para outro sítio, com a credibilidade do domínio dela
 * emprestada a quem o montasse. Duas barras também não -- `//outro.sitio` é um
 * endereço completo para o browser.
 */
function aqui(caminho: string | undefined) {
  if (!caminho || !caminho.startsWith("/") || caminho.startsWith("//")) {
    return "/painel";
  }
  return caminho;
}

/** Cria a sessão e segue; devolve o erro à própria página. */
async function entrar(form: FormData) {
  "use server";
  const destino = aqui(String(form.get("voltar") ?? ""));
  const auth = await login();
  if (!auth) redirect("/painel/entrar");

  const { error } = await auth.signIn.email({
    email: String(form.get("email") ?? ""),
    password: String(form.get("senha") ?? ""),
  });
  if (error) {
    redirect(
      `/painel/entrar?erro=${encodeURIComponent(
        traduzir(error.message) ?? "Não foi possível entrar."
      )}&voltar=${encodeURIComponent(destino)}`
    );
  }
  redirect(destino);
}

/**
 * Cria a conta. O email tem de estar na lista antes: assim uma pessoa de fora
 * que descubra este endereço não fica com uma conta a olhar para a chave.
 */
async function criarConta(form: FormData) {
  "use server";
  const destino = aqui(String(form.get("voltar") ?? ""));
  const auth = await login();
  if (!auth) redirect("/painel/entrar");

  const email = String(form.get("email") ?? "").trim();
  const senha = String(form.get("senha") ?? "");
  const nome = String(form.get("nome") ?? "").trim();

  if (!(await podeEntrar(email))) {
    redirect(
      `/painel/entrar?novo=1&erro=${encodeURIComponent(
        "Este email não está autorizado. Pede a quem já entra para o acrescentar."
      )}`
    );
  }
  if (senha.length < 8) {
    redirect(
      `/painel/entrar?novo=1&erro=${encodeURIComponent(
        "A palavra-passe precisa de oito caracteres ou mais."
      )}`
    );
  }

  const { error } = await auth.signUp.email({
    email,
    password: senha,
    name: nome || email,
  });
  if (error) {
    redirect(
      `/painel/entrar?novo=1&erro=${encodeURIComponent(
        traduzir(error.message) ?? "Não foi possível criar a conta."
      )}&voltar=${encodeURIComponent(destino)}`
    );
  }
  redirect(destino);
}

/** As mensagens que o Neon devolve em inglês, ditas em português. */
function traduzir(mensagem?: string) {
  if (!mensagem) return undefined;
  const m = mensagem.toLowerCase();
  if (m.includes("invalid email or password")) {
    return "Email ou palavra-passe errados.";
  }
  if (m.includes("already exists")) {
    return "Já existe uma conta com este email. Entra em vez de criar.";
  }
  if (m.includes("password")) return "A palavra-passe não serve.";
  return mensagem;
}

function Campo({
  etiqueta,
  nome,
  tipo,
  autoComplete,
  ajuda,
  obrigatorio = true,
}: {
  etiqueta: string;
  nome: string;
  tipo: string;
  autoComplete: string;
  ajuda?: string;
  obrigatorio?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
        {etiqueta}
      </span>
      <input
        name={nome}
        type={tipo}
        autoComplete={autoComplete}
        required={obrigatorio}
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

function Atalho({
  para,
  children,
}: {
  para: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={para} className="border-b border-clay/60 hover:opacity-70">
      {children}
    </Link>
  );
}

/** Quando este endereço não é o que tem o Neon configurado. */
function SemNeon({ falta }: { falta: string[] }) {
  return (
    <>
      <h1 className="font-serif text-[2rem] leading-tight">
        O painel não é aqui
      </h1>
      <p className="mt-4 font-body text-[1.05rem]">
        Este endereço serve o sítio, mas não guarda as chaves do painel. A
        entrada é em{" "}
        <a
          href="https://joana-painel.vercel.app/painel/entrar"
          className="border-b border-clay/60"
        >
          joana-painel.vercel.app
        </a>
        .
      </p>
      <p className="mt-4 font-body text-[0.95rem] opacity-70">
        Em falta aqui: {falta.join(", ")}.
      </p>
    </>
  );
}
