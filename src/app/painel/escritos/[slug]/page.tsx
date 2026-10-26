import { redirect } from "next/navigation";

import {
  Atalho,
  Botao,
  Escolha,
  Longo,
  Recado,
  Texto,
} from "@/components/painel/campos";
import {
  apagarEscrito,
  comoDia,
  escritosTodos,
  guardarEscrito,
} from "@/lib/painel/conteudo-db";
import {
  exigeSessao,
  exigeSessaoNaAccao,
  refrescarSitio,
} from "@/lib/painel/sessao";
import type { Familia } from "@/lib/escritos";

/**
 * Um texto do blog.
 *
 * Há dois tipos, e a diferença é toda: um texto que vive aqui tem corpo e abre
 * uma página do próprio sítio -- é o único que trabalha o SEO dela, porque o
 * Google dá o crédito ao domínio onde o texto está. Um texto publicado noutro
 * sítio tem endereço externo e o cartão aponta para fora; vale pelo crédito,
 * não pela busca.
 */
export const dynamic = "force-dynamic";

const FAMILIAS: { valor: Familia; label: string }[] = [
  { valor: "Artigo de opinião", label: "Artigo de opinião" },
  { valor: "Texto original", label: "Texto original" },
  { valor: "Paper", label: "Paper" },
];

export default async function EditarEscrito({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  await exigeSessao();
  const { slug } = await params;
  const { erro } = await searchParams;
  const novo = slug === "novo";
  const e = novo ? null : (await escritosTodos()).find((x) => x.slug === slug);
  if (!novo && !e) redirect("/painel?erro=Esse+texto+não+existe.");

  return (
    <>
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-[2rem] leading-tight">
          {novo ? "Texto novo" : e!.titulo}
        </h1>
        <Atalho para="/painel">Voltar</Atalho>
      </header>

      {erro && <Recado tom="mau">{erro}</Recado>}

      <form action={guardar} className="mt-10 flex flex-col gap-5">
        <input type="hidden" name="original" value={novo ? "" : slug} />

        <Texto etiqueta="Título" nome="titulo" valor={e?.titulo} obrigatorio />
        <Texto
          etiqueta="Endereço"
          nome="slug"
          valor={novo ? "" : slug}
          obrigatorio
          ajuda="Minúsculas e traços."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Escolha
            etiqueta="Família"
            nome="familia"
            valor={e?.familia ?? "Artigo de opinião"}
            opcoes={FAMILIAS.map((f) => ({ valor: f.valor, label: f.label }))}
            ajuda="São os filtros da página /escrita."
          />
          <Texto
            etiqueta="Data"
            nome="data"
            tipo="date"
            valor={e ? comoDia(e.data) : ""}
            obrigatorio
          />
        </div>
        <Longo
          etiqueta="Resumo"
          nome="resumo"
          valor={e?.resumo}
          linhas={3}
          ajuda="Duas linhas. Sai no cartão e é a descrição que o Google mostra — não é enfeite."
        />
        <Texto
          etiqueta="Imagem"
          nome="imagem"
          valor={e?.imagem}
          ajuda="Proporção 3:2, mínimo 1200×800. Sem ela fica a ilustração do desenho."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Texto
            etiqueta="Publicado em"
            nome="publicado"
            valor={e?.publicado}
            placeholder="Marketeer"
            ajuda="Preenchido, o cartão diz onde saiu."
          />
          <Texto
            etiqueta="Endereço externo"
            nome="enderecoExterno"
            valor={e?.endereco_externo}
            tipo="url"
            ajuda="Só se o texto vive noutro sítio. Com isto preenchido, o corpo não é usado."
          />
        </div>

        <Longo
          etiqueta="Corpo"
          nome="corpo"
          valor={e?.corpo}
          linhas={16}
          ajuda="Markdown: ## para títulos, linha em branco entre parágrafos, [texto](endereço) para ligações."
        />

        <Escolha
          etiqueta="Estado"
          nome="estado"
          valor={e?.estado ?? "publicado"}
          opcoes={[
            { valor: "publicado", label: "Publicado" },
            { valor: "rascunho", label: "Rascunho" },
          ]}
          ajuda="Rascunho não aparece na lista nem no Google."
        />

        <div className="mt-2 flex items-center gap-6">
          <Botao>{novo ? "Criar texto" : "Guardar"}</Botao>
          {!novo && (
            <button
              type="submit"
              formAction={apagar}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
            >
              Apagar este texto
            </button>
          )}
        </div>
      </form>
    </>
  );
}

/* --------------------------------------------------------------- acções */

async function guardar(form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();

  const original = String(form.get("original") ?? "");
  const slug = String(form.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const titulo = String(form.get("titulo") ?? "").trim();
  const data = String(form.get("data") ?? "").trim();
  const volta = `/painel/escritos/${original || "novo"}`;

  if (!slug || !titulo || !data) {
    redirect(
      `${volta}?erro=${encodeURIComponent(
        "O título, o endereço e a data são precisos."
      )}`
    );
  }

  const corpo = String(form.get("corpo") ?? "").trim() || null;
  const externo = String(form.get("enderecoExterno") ?? "").trim() || null;
  const estado =
    String(form.get("estado")) === "rascunho" ? "rascunho" : "publicado";

  // Um texto publicado tem de levar a algum lado -- ou tem corpo, ou tem
  // endereço externo. Um rascunho não: está a ser escrito, e recusar-lhe a
  // gravação era mandar fora o que já lá estava escrito. Por isso a regra só
  // morde ao publicar, e aí o que falta é uma linha, não um artigo inteiro.
  if (estado === "publicado" && !corpo && !externo) {
    redirect(
      `${volta}?erro=${encodeURIComponent(
        "Para publicar, o texto precisa de corpo ou de endereço externo: sem um dos dois, o cartão não leva a lado nenhum. Grava como rascunho enquanto escreves."
      )}`
    );
  }

  await guardarEscrito(
    {
      slug,
      titulo,
      familia: String(form.get("familia") ?? "Artigo de opinião") as Familia,
      data,
      resumo: String(form.get("resumo") ?? "").trim(),
      imagem: String(form.get("imagem") ?? "").trim() || null,
      publicado: String(form.get("publicado") ?? "").trim() || null,
      enderecoExterno: externo,
      corpo,
      estado,
    },
    quem
  );

  if (original && original !== slug) await apagarEscrito(original);

  refrescarSitio();

  redirect(`/painel?feito=${encodeURIComponent(`“${titulo}” guardado.`)}`);
}

async function apagar(form: FormData) {
  "use server";
  await exigeSessaoNaAccao();
  const original = String(form.get("original") ?? "");
  if (original) await apagarEscrito(original);
  refrescarSitio();
  redirect(`/painel?feito=${encodeURIComponent("Texto apagado.")}`);
}
