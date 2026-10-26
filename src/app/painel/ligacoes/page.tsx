import { redirect } from "next/navigation";

import {
  Botao,
  Cabeca,
  Interruptor,
  Recado,
  Texto,
} from "@/components/painel/campos";
import {
  apagarLigacao,
  guardarLigacao,
  ligacoesTodas,
} from "@/lib/painel/conteudo-db";
import {
  exigeSessao,
  exigeSessaoNaAccao,
  refrescarSitio,
} from "@/lib/painel/sessao";
import type { Onde } from "@/lib/conteudo";

/**
 * As ligações externas: LinkedIn, Substack, ORCID, e as que vierem.
 *
 * São poucas e pequenas, por isso editam-se todas na mesma página em vez de
 * uma a uma -- é mais rápido corrigir três endereços do que entrar e sair de
 * três páginas.
 */
export const dynamic = "force-dynamic";

const ONDES: { valor: Onde; label: string }[] = [
  { valor: "rodape", label: "Rodapé" },
  { valor: "menu", label: "Menu" },
  { valor: "investigo", label: "Linha “investigo”" },
  { valor: "escrevo", label: "Linha “escrevo”" },
];

export default async function Ligacoes({
  searchParams,
}: {
  searchParams: Promise<{ feito?: string; erro?: string }>;
}) {
  await exigeSessao();
  const { feito, erro } = await searchParams;
  const ligacoes = await ligacoesTodas();

  return (
    <>
      <Cabeca
        titulo="Ligações"
        nota="Para esconder uma, desliga a “activa” e grava. Não é preciso apagá-la."
      />

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      <ul className="flex flex-col gap-3">
        {ligacoes.map((l) => (
          <li key={l.id} className="border border-clay/20 p-4">
            <form action={porLigacao} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={l.id} />
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <Texto etiqueta="Nome" nome="nome" valor={l.nome} obrigatorio />
                <Texto
                  etiqueta="Endereço"
                  nome="endereco"
                  valor={l.endereco}
                  tipo="url"
                  obrigatorio
                />
              </div>
              <Ondes marcados={l.onde} />
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  <Interruptor etiqueta="Activa" nome="activa" ligado={l.activa} />
                  <div className="w-24">
                    <Texto etiqueta="Ordem" nome="ordem" valor={l.ordem} tipo="number" />
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <button
                    type="submit"
                    formAction={tirarLigacao}
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-50 hover:opacity-100"
                  >
                    Apagar
                  </button>
                  <Botao>Guardar</Botao>
                </div>
              </div>
            </form>
          </li>
        ))}
      </ul>

      <form
        action={porLigacao}
        className="mt-10 flex flex-col gap-4 border-t border-clay/20 pt-8"
      >
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
          Acrescentar uma ligação
        </h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          <Texto etiqueta="Nome" nome="nome" obrigatorio />
          <Texto etiqueta="Endereço" nome="endereco" tipo="url" obrigatorio />
        </div>
        <Ondes marcados={[]} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Interruptor etiqueta="Activa" nome="activa" ligado />
            <div className="w-24">
              <Texto
                etiqueta="Ordem"
                nome="ordem"
                valor={ligacoes.length}
                tipo="number"
              />
            </div>
          </div>
          <Botao>Acrescentar</Botao>
        </div>
      </form>
    </>
  );
}

function Ondes({ marcados }: { marcados: Onde[] }) {
  return (
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
              defaultChecked={marcados.includes(o.valor)}
              className="size-4 accent-clay"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* --------------------------------------------------------------- acções */

async function porLigacao(form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const nome = String(form.get("nome") ?? "").trim();
  const endereco = String(form.get("endereco") ?? "").trim();
  if (!nome || !endereco) {
    redirect(
      `/painel/ligacoes?erro=${encodeURIComponent("Nome e endereço são precisos.")}`
    );
  }
  await guardarLigacao(
    {
      id: String(form.get("id") ?? "") || undefined,
      nome,
      endereco,
      onde: form.getAll("onde").map((o) => String(o) as Onde),
      activa: form.get("activa") === "1",
      ordem: Number(form.get("ordem") ?? 0) || 0,
    },
    quem
  );
  refrescarSitio();
  redirect(
    `/painel/ligacoes?feito=${encodeURIComponent(`Ligação “${nome}” guardada.`)}`
  );
}

async function tirarLigacao(form: FormData) {
  "use server";
  await exigeSessaoNaAccao();
  const id = String(form.get("id") ?? "");
  if (id) await apagarLigacao(id);
  refrescarSitio();
  redirect(`/painel/ligacoes?feito=${encodeURIComponent("Ligação apagada.")}`);
}
