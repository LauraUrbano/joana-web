import { redirect } from "next/navigation";

import {
  Atalho,
  Botao,
  Escolha,
  Interruptor,
  Longo,
  Recado,
  Texto,
} from "@/components/painel/campos";
import {
  apagarProjeto,
  guardarProjeto,
  projeto,
} from "@/lib/painel/conteudo-db";
import {
  exigeSessao,
  exigeSessaoNaAccao,
  refrescarSitio,
} from "@/lib/painel/sessao";

/**
 * Um projeto.
 *
 * `novo` é o endereço do que ainda não existe -- não é um slug reservado por
 * acaso: um projeto chamado "novo" seria um caso estranho e improvável, e a
 * alternativa (uma página à parte para criar) era o mesmo formulário duas
 * vezes.
 *
 * As imagens são caminhos, por agora: as que já existem vivem em `public/` e
 * foram convertidas à mão. Carregar ficheiros novos pelo painel é o passo
 * seguinte, e vai para o armazenamento de objetos do Neon.
 */
export const dynamic = "force-dynamic";

export default async function EditarProjeto({
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
  const p = novo ? null : await projeto(slug);
  if (!novo && !p) redirect("/painel/projetos?erro=Esse+projeto+não+existe.");

  return (
    <>
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-[2rem] leading-tight">
          {novo ? "Projeto novo" : p!.titulo}
        </h1>
        <Atalho para="/painel/projetos">Voltar à lista</Atalho>
      </header>

      {erro && <Recado tom="mau">{erro}</Recado>}

      <form action={guardar} className="mt-10 flex flex-col gap-5">
        <input type="hidden" name="original" value={novo ? "" : slug} />

        <Texto etiqueta="Título" nome="titulo" valor={p?.titulo} obrigatorio />
        <Texto
          etiqueta="Endereço"
          nome="slug"
          valor={novo ? "" : slug}
          obrigatorio
          ajuda={
            novo
              ? "Minúsculas e traços: authentic-studio-pilates."
              : "Num projeto que já está no ar, mudar isto parte as ligações que andem por aí."
          }
        />
        <Texto
          etiqueta="Tipo"
          nome="tipo"
          valor={p?.tipo}
          placeholder="Marca · Identidade visual"
          ajuda="Sai no cartão, em maiúsculas."
        />
        <Texto etiqueta="Ano" nome="ano" valor={p?.ano} placeholder="2024" />
        <Longo
          etiqueta="Descrição"
          nome="descricao"
          valor={p?.descricao}
          linhas={5}
          ajuda="Um a três parágrafos. Sem descrição, a página diz que o texto está a chegar."
        />

        <Texto
          etiqueta="Capa"
          nome="capa"
          valor={p?.src}
          placeholder="/home/projetos/nome-do-projeto/1.webp"
          ajuda="Quadrada. É a que vai à órbita da home e à tira do telemóvel."
        />
        <Longo
          etiqueta="Imagens da página"
          nome="imagens"
          valor={p?.imagens?.join("\n")}
          linhas={6}
          ajuda="Um caminho por linha, pela ordem em que aparecem."
        />
        <Longo
          etiqueta="Vídeos"
          nome="videos"
          valor={p?.videos?.map((v) => `${v.src} | ${v.poster}`).join("\n")}
          linhas={3}
          ajuda="Um por linha: o MP4, uma barra vertical, e o cartaz. Sem cartaz fica um rectângulo preto a carregar."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Texto
            etiqueta="Ordem"
            nome="ordem"
            valor={p?.ordem ?? 99}
            tipo="number"
            ajuda="A ordem na home, do menor para o maior."
          />
          <Escolha
            etiqueta="Estado"
            nome="estado"
            valor={p?.estado ?? "publicado"}
            opcoes={[
              { valor: "publicado", label: "Publicado" },
              { valor: "rascunho", label: "Rascunho" },
            ]}
            ajuda="Rascunho não aparece em lado nenhum, nem no Google."
          />
        </div>
        <Interruptor
          etiqueta="Aparece na home"
          nome="naHome"
          ligado={p?.naCena ?? true}
          ajuda="Se entra na órbita e na tira do telemóvel."
        />

        <div className="mt-2 flex items-center gap-6">
          <Botao>{novo ? "Criar projeto" : "Guardar"}</Botao>
          {!novo && (
            <button
              type="submit"
              formAction={apagar}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
            >
              Apagar este projeto
            </button>
          )}
        </div>
      </form>
    </>
  );
}

/* --------------------------------------------------------------- acções */

function linhas(valor: FormDataEntryValue | null) {
  return String(valor ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

async function guardar(form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();

  const original = String(form.get("original") ?? "");
  const slug = String(form.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const titulo = String(form.get("titulo") ?? "").trim();
  if (!slug || !titulo) {
    redirect(
      `/painel/projetos/${original || "novo"}?erro=${encodeURIComponent(
        "O título e o endereço são precisos."
      )}`
    );
  }

  const videos = linhas(form.get("videos")).map((l) => {
    const [src, poster] = l.split("|").map((x) => x.trim());
    return { src, poster: poster ?? "" };
  });
  const estado =
    String(form.get("estado")) === "rascunho" ? "rascunho" : "publicado";

  // Como no blog: a exigência só morde ao publicar. Num rascunho, recusar a
  // gravação era deitar fora o que já estava escrito no formulário.
  if (estado === "publicado" && videos.some((v) => !v.poster)) {
    redirect(
      `/painel/projetos/${original || "novo"}?erro=${encodeURIComponent(
        "Para publicar, cada vídeo precisa de cartaz: o MP4, uma barra vertical, e o cartaz. Sem ele a página fica com um rectângulo preto a carregar."
      )}`
    );
  }

  const antigo = original ? await projeto(original) : null;

  await guardarProjeto(
    {
      slug,
      titulo,
      tipo: String(form.get("tipo") ?? "").trim(),
      ano: String(form.get("ano") ?? "").trim() || null,
      descricao: String(form.get("descricao") ?? "").trim() || null,
      capa: String(form.get("capa") ?? "").trim() || null,
      // As medidas da capa só se sabem medindo o ficheiro. Enquanto as imagens
      // vierem do repositório, mantém-se o que já estava; quando o painel
      // passar a receber ficheiros, medem-se no momento do carregamento.
      capaW: antigo?.w ?? null,
      capaH: antigo?.h ?? null,
      imagens: linhas(form.get("imagens")),
      videos: videos.map((v) => {
        const igual = antigo?.videos?.find((a) => a.poster === v.poster);
        return { ...v, w: igual?.w, h: igual?.h };
      }),
      naHome: form.get("naHome") === "1",
      ordem: Number(form.get("ordem") ?? 99) || 99,
      estado,
    },
    quem
  );

  // Mudou de endereço: o antigo sai, para não ficarem dois.
  if (original && original !== slug) await apagarProjeto(original);

  refrescarSitio();

  redirect(`/painel/projetos?feito=${encodeURIComponent(`“${titulo}” guardado.`)}`);
}

async function apagar(form: FormData) {
  "use server";
  await exigeSessaoNaAccao();
  const original = String(form.get("original") ?? "");
  if (original) await apagarProjeto(original);
  refrescarSitio();
  redirect(`/painel/projetos?feito=${encodeURIComponent("Projeto apagado.")}`);
}
