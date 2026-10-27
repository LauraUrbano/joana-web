import { redirect } from "next/navigation";

import {
  Atalho,
  Botao,
  Cabeca,
  Escolha,
  Interruptor,
  Longo,
  Recado,
  Texto,
} from "@/components/painel/campos";
import { Capa, Ficheiro, Galeria } from "@/components/painel/imagens";
import {
  apagarProjeto,
  guardarProjeto,
  projeto,
} from "@/lib/painel/conteudo-db";
import {
  apagarImagem,
  idDoEndereco,
  medidasDa,
  receberImagem,
} from "@/lib/painel/imagens";
import { medir } from "@/lib/medidas";
import {
  exigeSessao,
  exigeSessaoNaAccao,
  refrescarSitio,
} from "@/lib/painel/sessao";

/**
 * Um projeto.
 *
 * `novo` é o endereço do que ainda não existe. Um projeto chamado "novo" seria
 * um caso estranho e improvável, e a alternativa -- uma página à parte só para
 * criar -- era o mesmo formulário escrito duas vezes.
 *
 * As imagens estão fora do formulário dos textos, e aplicam-se logo: é o que se
 * espera de uma galeria, e é também o que o HTML obriga, porque cada botão de
 * imagem é o seu próprio formulário.
 */
export const dynamic = "force-dynamic";

export default async function EditarProjeto({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string; feito?: string }>;
}) {
  await exigeSessao();
  const { slug } = await params;
  const { erro, feito } = await searchParams;
  const novo = slug === "novo";
  const p = novo ? null : await projeto(slug);
  if (!novo && !p) redirect("/painel/projetos?erro=Esse+projeto+não+existe.");

  const imagens = p?.imagens ?? [];

  return (
    <>
      <Cabeca
        titulo={novo ? "Projeto novo" : p!.titulo}
        nota={novo ? "Grava-o primeiro; as imagens acrescentam-se a seguir." : undefined}
        accao={<Atalho para="/painel/projetos">Voltar à lista</Atalho>}
      />

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      <form action={guardar} className="flex flex-col gap-5">
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
        <Longo
          etiqueta="Vídeos"
          nome="videos"
          valor={p?.videos?.map((v) => `${v.src} | ${v.poster}`).join("\n")}
          linhas={3}
          ajuda="Um por linha: o MP4, uma barra vertical, e o cartaz. Os vídeos ainda se põem por caminho — são pesados de mais para passarem por aqui."
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
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-50 hover:opacity-100"
            >
              Apagar este projeto
            </button>
          )}
        </div>
      </form>

      {!novo && (
        <>
          <section className="mt-14 border-t border-clay/20 pt-8">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              Capa
            </h2>
            <p className="mb-5 mt-2 max-w-[52ch] font-body text-[1rem] opacity-70">
              É a imagem que representa o projeto na home. Carrega o ficheiro
              como ele está — é reduzido e convertido aqui, para o sítio não
              ficar pesado no telemóvel.
            </p>
            <Capa
              src={p!.src}
              largura={p!.w}
              altura={p!.h}
              accoes={{
                carregar: porCapa.bind(null, slug),
                remover: tirarCapa.bind(null, slug),
              }}
            />
          </section>

          <section className="mt-14 border-t border-clay/20 pt-8">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              Imagens da página ({imagens.length})
            </h2>
            <p className="mb-5 mt-2 max-w-[52ch] font-body text-[1rem] opacity-70">
              Aparecem pela ordem em que estão. As setas trocam a ordem, a
              estrela usa a imagem como capa, e o ✕ remove-a — tudo aplicado na
              hora, sem precisar de gravar o resto.
            </p>
            <Galeria
              imagens={imagens}
              capa={p!.src}
              accoes={{
                remover: tirarImagem.bind(null, slug),
                mover: moverImagem.bind(null, slug),
                definirCapa: capaDaGaleria.bind(null, slug),
              }}
            />

            <form
              action={porImagens.bind(null, slug)}
              className="mt-8 flex flex-col gap-3 border-t border-clay/20 pt-6"
            >
              <Ficheiro
                etiqueta="Acrescentar imagens"
                nome="ficheiros"
                varios
                ajuda="Podes escolher várias de uma vez."
              />
              <div>
                <Botao>Carregar</Botao>
              </div>
            </form>
          </section>
        </>
      )}
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

/** As medidas de uma imagem, venha ela da base de dados ou do repositório. */
async function medidasDoEndereco(src: string) {
  const id = idDoEndereco(src);
  if (id) {
    const m = await medidasDa(id);
    return { w: m?.largura ?? null, h: m?.altura ?? null };
  }
  const m = medir(src);
  return { w: m?.w ?? null, h: m?.h ?? null };
}

/** Lê o projeto ou volta para trás: toda a acção de imagem precisa dele. */
async function exigeProjeto(slug: string) {
  const p = await projeto(slug);
  if (!p) redirect("/painel/projetos?erro=Esse+projeto+não+existe.");
  return p;
}

/** Grava a lista de imagens e a capa, deixando o resto do projeto como está. */
async function gravarImagens(
  slug: string,
  quem: string,
  mudanca: { imagens?: string[]; capa?: string | null; capaW?: number | null; capaH?: number | null }
) {
  const p = await exigeProjeto(slug);
  await guardarProjeto(
    {
      slug,
      titulo: p.titulo,
      tipo: p.tipo,
      ano: p.ano ?? null,
      descricao: p.descricao ?? null,
      capa: mudanca.capa !== undefined ? mudanca.capa : (p.src ?? null),
      capaW: mudanca.capa !== undefined ? (mudanca.capaW ?? null) : (p.w ?? null),
      capaH: mudanca.capa !== undefined ? (mudanca.capaH ?? null) : (p.h ?? null),
      imagens: mudanca.imagens ?? p.imagens ?? [],
      videos: p.videos ?? [],
      naHome: p.naCena ?? false,
      ordem: p.ordem ?? 99,
      estado: p.estado ?? "publicado",
    },
    quem
  );
  refrescarSitio();
}

function voltar(slug: string, recado: string, mau = false) {
  redirect(
    `/painel/projetos/${slug}?${mau ? "erro" : "feito"}=${encodeURIComponent(recado)}`
  );
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
    voltar(original || "novo", "O título e o endereço são precisos.", true);
  }

  const videos = linhas(form.get("videos")).map((l) => {
    const [src, poster] = l.split("|").map((x) => x.trim());
    return { src, poster: poster ?? "" };
  });
  const estado =
    String(form.get("estado")) === "rascunho" ? "rascunho" : "publicado";

  // A exigência só morde ao publicar. Num rascunho, recusar a gravação era
  // deitar fora o que já estava escrito no formulário.
  if (estado === "publicado" && videos.some((v) => !v.poster)) {
    voltar(
      original || "novo",
      "Para publicar, cada vídeo precisa de cartaz: o MP4, uma barra vertical, e o cartaz. Sem ele a página fica com um rectângulo preto a carregar.",
      true
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
      capa: antigo?.src ?? null,
      capaW: antigo?.w ?? null,
      capaH: antigo?.h ?? null,
      imagens: antigo?.imagens ?? [],
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
  redirect(
    `/painel/projetos?feito=${encodeURIComponent(`“${titulo}” guardado.`)}`
  );
}

async function apagar(form: FormData) {
  "use server";
  await exigeSessaoNaAccao();
  const original = String(form.get("original") ?? "");
  if (original) await apagarProjeto(original);
  refrescarSitio();
  redirect(`/painel/projetos?feito=${encodeURIComponent("Projeto apagado.")}`);
}

async function porCapa(slug: string, form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const ficheiro = form.get("ficheiro");
  if (!(ficheiro instanceof File)) voltar(slug, "Não veio nenhum ficheiro.", true);

  const r = await receberImagem(ficheiro as File, "capa", `projeto:${slug}`, quem);
  if (!r.ok) voltar(slug, r.razao, true);

  const antiga = (await exigeProjeto(slug)).src;
  await gravarImagens(slug, quem, {
    capa: r.ok ? r.endereco : null,
    capaW: r.ok ? r.largura : null,
    capaH: r.ok ? r.altura : null,
  });

  // A capa anterior, se tiver sido carregada aqui e não estiver na galeria,
  // deixa de servir para alguma coisa.
  const id = idDoEndereco(antiga);
  if (id && !(await exigeProjeto(slug)).imagens?.includes(antiga!)) {
    await apagarImagem(id);
  }
  voltar(slug, "Capa trocada.");
}

async function tirarCapa(slug: string) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const antiga = (await exigeProjeto(slug)).src;
  await gravarImagens(slug, quem, { capa: null, capaW: null, capaH: null });
  const id = idDoEndereco(antiga);
  if (id && !(await exigeProjeto(slug)).imagens?.includes(antiga!)) {
    await apagarImagem(id);
  }
  voltar(slug, "Capa removida.");
}

async function porImagens(slug: string, form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const ficheiros = form
    .getAll("ficheiros")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (ficheiros.length === 0) voltar(slug, "Não veio nenhum ficheiro.", true);

  const p = await exigeProjeto(slug);
  const novas: string[] = [];
  const falhas: string[] = [];
  for (const f of ficheiros) {
    const r = await receberImagem(f, "galeria", `projeto:${slug}`, quem);
    if (r.ok) novas.push(r.endereco);
    else falhas.push(`${f.name}: ${r.razao}`);
  }

  if (novas.length) {
    await gravarImagens(slug, quem, {
      imagens: [...(p.imagens ?? []), ...novas],
    });
  }
  if (falhas.length) voltar(slug, falhas.join(" · "), true);
  voltar(
    slug,
    novas.length === 1 ? "Imagem acrescentada." : `${novas.length} imagens acrescentadas.`
  );
}

async function tirarImagem(slug: string, form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const p = await exigeProjeto(slug);
  const lista = [...(p.imagens ?? [])];
  const i = Number(form.get("indice"));
  if (!Number.isInteger(i) || i < 0 || i >= lista.length) {
    voltar(slug, "Essa imagem já não está aí.", true);
  }
  const [fora] = lista.splice(i, 1);

  // Era também a capa: a capa fica vazia em vez de apontar para o nada.
  const eraCapa = p.src === fora;
  await gravarImagens(slug, quem, {
    imagens: lista,
    ...(eraCapa ? { capa: null, capaW: null, capaH: null } : {}),
  });

  const id = idDoEndereco(fora);
  if (id && !lista.includes(fora)) await apagarImagem(id);
  voltar(slug, "Imagem removida.");
}

async function moverImagem(slug: string, form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const p = await exigeProjeto(slug);
  const lista = [...(p.imagens ?? [])];
  const i = Number(form.get("indice"));
  const j = String(form.get("sentido")) === "cima" ? i - 1 : i + 1;
  if (i < 0 || i >= lista.length || j < 0 || j >= lista.length) {
    voltar(slug, "Essa imagem já está na ponta.", true);
  }
  [lista[i], lista[j]] = [lista[j], lista[i]];
  await gravarImagens(slug, quem, { imagens: lista });
  voltar(slug, "Ordem trocada.");
}

async function capaDaGaleria(slug: string, form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const p = await exigeProjeto(slug);
  const lista = p.imagens ?? [];
  const i = Number(form.get("indice"));
  if (!Number.isInteger(i) || i < 0 || i >= lista.length) {
    voltar(slug, "Essa imagem já não está aí.", true);
  }
  const escolhida = lista[i];
  const { w, h } = await medidasDoEndereco(escolhida);
  await gravarImagens(slug, quem, { capa: escolhida, capaW: w, capaH: h });
  voltar(slug, "Capa trocada.");
}
