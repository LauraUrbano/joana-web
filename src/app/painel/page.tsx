import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Atalho,
  Botao,
  Interruptor,
  Recado,
  Seccao,
  Texto,
} from "@/components/painel/campos";
import {
  apagarLigacao,
  comoDia,
  contacto,
  escritosTodos,
  guardarContacto,
  guardarLigacao,
  ligacoesTodas,
  projetosTodos,
  semear,
} from "@/lib/painel/conteudo-db";
import {
  exigeSessao,
  exigeSessaoNaAccao,
  refrescarSitio,
} from "@/lib/painel/sessao";
import type { Onde } from "@/lib/conteudo";

/**
 * O painel: o conteúdo todo, à vista, assim que se entra.
 *
 * Esteve aqui outra coisa -- a entrada e, por baixo, a chave de uma ferramenta
 * à parte que era quem editava de facto. Eram dois passos e duas ferramentas
 * para uma coisa só. Agora o conteúdo vive na base de dados e edita-se aqui:
 * os projetos e os textos em páginas próprias, as ligações e o contacto nesta
 * mesma, que são pequenos.
 */
export const dynamic = "force-dynamic";

const ONDES: { valor: Onde; label: string }[] = [
  { valor: "rodape", label: "Rodapé" },
  { valor: "menu", label: "Menu" },
  { valor: "investigo", label: "Linha “investigo”" },
  { valor: "escrevo", label: "Linha “escrevo”" },
];

export default async function Painel({
  searchParams,
}: {
  searchParams: Promise<{ feito?: string; erro?: string }>;
}) {
  const quem = await exigeSessao();
  const { feito, erro } = await searchParams;

  const [projetos, escritos, ligacoes, contactos] = await Promise.all([
    projetosTodos(),
    escritosTodos(),
    ligacoesTodas(),
    contacto(),
  ]);

  const vazio =
    projetos.length === 0 &&
    escritos.length === 0 &&
    ligacoes.length === 0 &&
    !contactos;

  return (
    <>
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-[2rem] leading-tight">Conteúdo</h1>
        <nav className="flex gap-4">
          <Atalho para="/painel/ajuda">Ajuda</Atalho>
          <Atalho para="/painel/definicoes">Definições</Atalho>
          <form action={sair}>
            <Botao discreto>Sair</Botao>
          </form>
        </nav>
      </header>
      <p className="mt-1 font-body text-[1.05rem] opacity-70">
        {quem.nome || quem.email}
      </p>

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      {vazio && (
        <Seccao titulo="Primeiro arranque">
          <p className="font-body text-[1.05rem]">
            A base de dados está vazia. O conteúdo que está no ar ainda vive nos
            ficheiros do repositório — importa-o uma vez e passa a editar-se
            aqui.
          </p>
          <form action={importar} className="mt-5">
            <Botao>Importar o conteúdo dos ficheiros</Botao>
          </form>
        </Seccao>
      )}

      <Seccao
        titulo={`Projetos (${projetos.length})`}
        acao={<Atalho para="/painel/projetos/novo">Novo projeto</Atalho>}
      >
        {projetos.length === 0 ? (
          <Nada>Ainda não há projetos.</Nada>
        ) : (
          <ul>
            {projetos.map((p) => (
              <li
                key={p.slug}
                className="flex items-baseline justify-between gap-4 border-t border-clay/20 py-3 first:border-t-0"
              >
                <Link
                  href={`/painel/projetos/${p.slug}`}
                  className="font-body text-[1.05rem] hover:opacity-70"
                >
                  {p.titulo}
                  <span className="opacity-50">
                    {" "}
                    · {p.ano ?? "sem ano"} · {p.ordem}
                  </span>
                </Link>
                <Estado
                  estado={p.estado}
                  nota={p.naCena ? "na home" : "fora da home"}
                />
              </li>
            ))}
          </ul>
        )}
      </Seccao>

      <Seccao
        titulo={`Textos (${escritos.length})`}
        acao={<Atalho para="/painel/escritos/novo">Novo texto</Atalho>}
      >
        {escritos.length === 0 ? (
          <Nada>Ainda não há textos.</Nada>
        ) : (
          <ul>
            {escritos.map((e) => (
              <li
                key={e.slug}
                className="flex items-baseline justify-between gap-4 border-t border-clay/20 py-3 first:border-t-0"
              >
                <Link
                  href={`/painel/escritos/${e.slug}`}
                  className="font-body text-[1.05rem] hover:opacity-70"
                >
                  {e.titulo}
                  <span className="opacity-50">
                    {" "}
                    · {comoDia(e.data)}
                  </span>
                </Link>
                <Estado
                  estado={e.estado}
                  nota={e.endereco_externo ? "fora" : "aqui"}
                />
              </li>
            ))}
          </ul>
        )}
      </Seccao>

      <Seccao titulo={`Ligações (${ligacoes.length})`}>
        <ul>
          {ligacoes.map((l) => (
            <li key={l.id} className="border-t border-clay/20 py-4 first:border-t-0">
              <form action={porLigacao} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={l.id} />
                <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                  <Texto etiqueta="Nome" nome="nome" valor={l.nome} obrigatorio />
                  <Texto
                    etiqueta="Endereço"
                    nome="endereco"
                    valor={l.endereco}
                    tipo="url"
                    obrigatorio
                  />
                </div>
                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
                    Onde aparece
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                    {ONDES.map((o) => (
                      <label
                        key={o.valor}
                        className="flex items-center gap-2 font-body text-[1rem]"
                      >
                        <input
                          type="checkbox"
                          name="onde"
                          value={o.valor}
                          defaultChecked={l.onde.includes(o.valor)}
                          className="size-4 accent-clay"
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Interruptor etiqueta="Activa" nome="activa" ligado={l.activa} />
                  <Texto etiqueta="Ordem" nome="ordem" valor={l.ordem} tipo="number" />
                </div>
                <div className="flex items-center gap-6">
                  <Botao>Guardar</Botao>
                  <button
                    type="submit"
                    formAction={tirarLigacao}
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
                  >
                    Apagar
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>

        <form
          action={porLigacao}
          className="mt-8 flex flex-col gap-3 border-t border-clay/40 pt-6"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
            Acrescentar uma ligação
          </p>
          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <Texto etiqueta="Nome" nome="nome" obrigatorio />
            <Texto etiqueta="Endereço" nome="endereco" tipo="url" obrigatorio />
          </div>
          <fieldset>
            <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              Onde aparece
            </legend>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {ONDES.map((o) => (
                <label
                  key={o.valor}
                  className="flex items-center gap-2 font-body text-[1rem]"
                >
                  <input
                    type="checkbox"
                    name="onde"
                    value={o.valor}
                    className="size-4 accent-clay"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Interruptor etiqueta="Activa" nome="activa" ligado />
            <Texto etiqueta="Ordem" nome="ordem" valor={ligacoes.length} tipo="number" />
          </div>
          <div>
            <Botao>Acrescentar</Botao>
          </div>
        </form>
      </Seccao>

      <Seccao titulo="Contacto">
        <p className="font-body text-[1.05rem]">
          O email aparece em cinco sítios do site e o telefone em três. Nas
          páginas legais é o contacto do responsável pelo tratamento de dados,
          que o RGPD obriga a estar certo — trocar sim, apagar não.
        </p>
        <form action={porContacto} className="mt-5 flex flex-col gap-3">
          <Texto
            etiqueta="Email"
            nome="email"
            valor={contactos?.email}
            tipo="email"
            obrigatorio
          />
          <Texto
            etiqueta="Telefone"
            nome="telefone"
            valor={contactos?.telefone}
            ajuda="Sai como WhatsApp nas redes e por extenso nas páginas legais."
          />
          <div>
            <Botao>Guardar</Botao>
          </div>
        </form>
      </Seccao>
    </>
  );
}

function Nada({ children }: { children: React.ReactNode }) {
  return <p className="font-body text-[1.05rem] opacity-60">{children}</p>;
}

function Estado({ estado, nota }: { estado?: string; nota: string }) {
  return (
    <span className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-60">
      {estado === "rascunho" ? "Rascunho" : nota}
    </span>
  );
}

/* --------------------------------------------------------------- acções */

async function importar() {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const r = await semear(quem);
  refrescarSitio();
  redirect(
    `/painel?feito=${encodeURIComponent(
      r.feito ? `Importado: ${r.resumo}.` : "Não foi possível importar."
    )}`
  );
}

function ondeDoForm(form: FormData): Onde[] {
  return form.getAll("onde").map((o) => String(o) as Onde);
}

async function porLigacao(form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const nome = String(form.get("nome") ?? "").trim();
  const endereco = String(form.get("endereco") ?? "").trim();
  if (!nome || !endereco) {
    redirect(`/painel?erro=${encodeURIComponent("Nome e endereço são precisos.")}`);
  }
  await guardarLigacao(
    {
      id: String(form.get("id") ?? "") || undefined,
      nome,
      endereco,
      onde: ondeDoForm(form),
      activa: form.get("activa") === "1",
      ordem: Number(form.get("ordem") ?? 0) || 0,
    },
    quem
  );
  refrescarSitio();
  redirect(`/painel?feito=${encodeURIComponent(`Ligação “${nome}” guardada.`)}`);
}

async function tirarLigacao(form: FormData) {
  "use server";
  await exigeSessaoNaAccao();
  const id = String(form.get("id") ?? "");
  if (id) await apagarLigacao(id);
  refrescarSitio();
  redirect(`/painel?feito=${encodeURIComponent("Ligação apagada.")}`);
}

async function porContacto(form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const email = String(form.get("email") ?? "").trim();
  const telefone = String(form.get("telefone") ?? "").trim() || null;
  if (!email.includes("@")) {
    redirect(
      `/painel?erro=${encodeURIComponent(
        "Sem um email válido as páginas legais ficam incompletas. Nada foi gravado."
      )}`
    );
  }
  await guardarContacto(email, telefone, quem);
  refrescarSitio();
  redirect(`/painel?feito=${encodeURIComponent("Contacto guardado.")}`);
}

async function sair() {
  "use server";
  const { login } = await import("@/lib/painel/neon");
  const auth = await login();
  if (auth) await auth.signOut();
  redirect("/painel/entrar");
}
