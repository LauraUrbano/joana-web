import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

import type { Escrito, Familia } from "@/lib/escritos";
import { medir } from "@/lib/medidas";
import { base } from "@/lib/painel/neon";
import type { Preparacao } from "@/lib/projetos";
import type { Rede } from "@/lib/redes";
import type { Ligacao, Onde } from "@/lib/conteudo";

/**
 * O conteúdo, agora na base de dados.
 *
 * Isto devolve exactamente as mesmas formas que `lib/conteudo.ts` devolvia a
 * partir dos ficheiros -- `Preparacao`, `Escrito`, `Ligacao`, o contacto --,
 * de propósito: a troca da origem não obriga a mexer no desenho de nada.
 *
 * As medidas das imagens vêm gravadas na linha em vez de serem lidas dos bytes
 * a cada construção. Era o que se fazia quando tudo vivia no repositório, e só
 * funciona para ficheiros que estejam lá dentro.
 */

/* ------------------------------------------------------------- projetos */

type LinhaProjeto = {
  slug: string;
  titulo: string;
  tipo: string;
  ano: string | null;
  descricao: string | null;
  capa: string | null;
  capa_w: number | null;
  capa_h: number | null;
  imagens: string[];
  videos: { src: string; poster: string; w?: number; h?: number }[];
  na_home: boolean;
  ordem: number;
  estado: "rascunho" | "publicado";
};

function comoPreparacao(l: LinhaProjeto): Preparacao {
  return {
    slug: l.slug,
    titulo: l.titulo,
    tipo: l.tipo,
    ano: l.ano ?? undefined,
    descricao: l.descricao || undefined,
    naCena: l.na_home,
    src: l.capa ?? undefined,
    w: l.capa_w ?? 1200,
    h: l.capa_h ?? 1200,
    imagens: l.imagens?.length ? l.imagens : undefined,
    videos: l.videos?.length
      ? l.videos.map((v) => ({
          src: v.src,
          poster: v.poster,
          w: v.w ?? 1600,
          h: v.h ?? 900,
        }))
      : undefined,
    ordem: l.ordem,
    estado: l.estado,
  };
}

/** Os projetos publicados, pela ordem dela. É o que o sítio mostra. */
export async function projetosPublicados(): Promise<Preparacao[]> {
  const sql = base();
  if (!sql) return [];
  const linhas = (await sql`
    select * from conteudo_projetos
    where estado = 'publicado' order by ordem, titulo
  `) as unknown as LinhaProjeto[];
  return linhas.map(comoPreparacao);
}

/** Todos, rascunhos incluídos. É o que o painel mostra. */
export async function projetosTodos(): Promise<Preparacao[]> {
  const sql = base();
  if (!sql) return [];
  const linhas = (await sql`
    select * from conteudo_projetos order by ordem, titulo
  `) as unknown as LinhaProjeto[];
  return linhas.map(comoPreparacao);
}

export async function projeto(slug: string): Promise<Preparacao | null> {
  const sql = base();
  if (!sql) return null;
  const linhas = (await sql`
    select * from conteudo_projetos where slug = ${slug} limit 1
  `) as unknown as LinhaProjeto[];
  return linhas[0] ? comoPreparacao(linhas[0]) : null;
}

export type ProjetoEntrada = {
  slug: string;
  titulo: string;
  tipo: string;
  ano: string | null;
  descricao: string | null;
  capa: string | null;
  capaW: number | null;
  capaH: number | null;
  imagens: string[];
  videos: { src: string; poster: string; w?: number; h?: number }[];
  naHome: boolean;
  ordem: number;
  estado: "rascunho" | "publicado";
};

export async function guardarProjeto(p: ProjetoEntrada, por: string) {
  const sql = base();
  if (!sql) return;
  await sql`
    insert into conteudo_projetos
      (slug, titulo, tipo, ano, descricao, capa, capa_w, capa_h, imagens,
       videos, na_home, ordem, estado, actualizado_por)
    values
      (${p.slug}, ${p.titulo}, ${p.tipo}, ${p.ano}, ${p.descricao}, ${p.capa},
       ${p.capaW}, ${p.capaH}, ${JSON.stringify(p.imagens)}::jsonb,
       ${JSON.stringify(p.videos)}::jsonb, ${p.naHome}, ${p.ordem},
       ${p.estado}, ${por})
    on conflict (slug) do update set
      titulo = excluded.titulo, tipo = excluded.tipo, ano = excluded.ano,
      descricao = excluded.descricao, capa = excluded.capa,
      capa_w = excluded.capa_w, capa_h = excluded.capa_h,
      imagens = excluded.imagens, videos = excluded.videos,
      na_home = excluded.na_home, ordem = excluded.ordem,
      estado = excluded.estado, actualizado_em = now(),
      actualizado_por = excluded.actualizado_por
  `;
}

export async function apagarProjeto(slug: string) {
  const sql = base();
  if (!sql) return;
  await sql`delete from conteudo_projetos where slug = ${slug}`;
}

/* ----------------------------------------------------------------- blog */

type LinhaEscrito = {
  slug: string;
  titulo: string;
  familia: Familia;
  data: string;
  resumo: string;
  imagem: string | null;
  publicado: string | null;
  endereco_externo: string | null;
  corpo: string | null;
  estado: "rascunho" | "publicado";
};

/**
 * Uma data de coluna `date`, em AAAA-MM-DD.
 *
 * O driver devolve estas colunas como `Date`, e `String(data).slice(0, 10)` dá
 * "Sat Oct 17" -- que não é uma data para o `<input type="date">` nem para o
 * `<time dateTime>`. Com o campo vazio, o browser bloqueava a gravação sem
 * dizer nada, e levei um bom bocado a perceber porquê. Lê-se em UTC porque é
 * em UTC que o driver constrói o dia; com os getters locais, um servidor a
 * oeste de Greenwich recuava a data um dia.
 */
export function comoDia(v: unknown): string {
  if (v instanceof Date) {
    const dois = (n: number) => String(n).padStart(2, "0");
    return `${v.getUTCFullYear()}-${dois(v.getUTCMonth() + 1)}-${dois(
      v.getUTCDate()
    )}`;
  }
  return String(v ?? "").slice(0, 10);
}

function comoEscrito(l: LinhaEscrito): Escrito {
  return {
    titulo: l.titulo,
    resumo: l.resumo,
    familia: l.familia,
    data: comoDia(l.data),
    href: l.endereco_externo || `/escrita/${l.slug}`,
    publicado: l.publicado ?? undefined,
    imagem: l.imagem ?? undefined,
    estado: l.estado,
  };
}

export async function escritosPublicados(): Promise<Escrito[]> {
  const sql = base();
  if (!sql) return [];
  const linhas = (await sql`
    select * from conteudo_escritos where estado = 'publicado'
    order by data desc
  `) as unknown as LinhaEscrito[];
  return linhas.map(comoEscrito);
}

/** Todos, rascunhos incluídos, com a data já em AAAA-MM-DD. */
export async function escritosTodos(): Promise<LinhaEscrito[]> {
  const sql = base();
  if (!sql) return [];
  const linhas = (await sql`
    select * from conteudo_escritos order by data desc
  `) as unknown as LinhaEscrito[];
  return linhas.map((l) => ({ ...l, data: comoDia(l.data) }));
}

export type EscritoEntrada = {
  slug: string;
  titulo: string;
  familia: Familia;
  data: string;
  resumo: string;
  imagem: string | null;
  publicado: string | null;
  enderecoExterno: string | null;
  corpo: string | null;
  estado: "rascunho" | "publicado";
};

export async function guardarEscrito(e: EscritoEntrada, por: string) {
  const sql = base();
  if (!sql) return;
  await sql`
    insert into conteudo_escritos
      (slug, titulo, familia, data, resumo, imagem, publicado,
       endereco_externo, corpo, estado, actualizado_por)
    values
      (${e.slug}, ${e.titulo}, ${e.familia}, ${e.data}, ${e.resumo},
       ${e.imagem}, ${e.publicado}, ${e.enderecoExterno}, ${e.corpo},
       ${e.estado}, ${por})
    on conflict (slug) do update set
      titulo = excluded.titulo, familia = excluded.familia,
      data = excluded.data, resumo = excluded.resumo, imagem = excluded.imagem,
      publicado = excluded.publicado,
      endereco_externo = excluded.endereco_externo, corpo = excluded.corpo,
      estado = excluded.estado, actualizado_em = now(),
      actualizado_por = excluded.actualizado_por
  `;
}

export async function apagarEscrito(slug: string) {
  const sql = base();
  if (!sql) return;
  await sql`delete from conteudo_escritos where slug = ${slug}`;
}

/* ------------------------------------------------------------- ligações */

export type LinhaLigacao = {
  id: string;
  nome: string;
  endereco: string;
  onde: Onde[];
  activa: boolean;
  ordem: number;
};

export async function ligacoesTodas(): Promise<LinhaLigacao[]> {
  const sql = base();
  if (!sql) return [];
  return (await sql`
    select id::text, nome, endereco, onde, activa, ordem
    from conteudo_ligacoes order by ordem, nome
  `) as unknown as LinhaLigacao[];
}

/** As activas, filtradas por sítio -- a forma que o sítio já usava. */
export async function ligacoesDe(onde?: Onde): Promise<Ligacao[]> {
  const todas = await ligacoesTodas();
  return todas
    .filter((l) => l.activa && l.endereco && (!onde || l.onde.includes(onde)))
    .map((l) => ({
      nome: l.nome,
      endereco: l.endereco,
      onde: l.onde,
      activa: l.activa,
    }));
}

export async function redesDe(onde: Onde = "rodape"): Promise<Rede[]> {
  return (await ligacoesDe(onde)).map((l) => ({
    nome: l.nome,
    href: l.endereco,
  }));
}

export async function guardarLigacao(
  l: { id?: string; nome: string; endereco: string; onde: Onde[]; activa: boolean; ordem: number },
  por: string
) {
  const sql = base();
  if (!sql) return;
  if (l.id) {
    await sql`
      update conteudo_ligacoes set
        nome = ${l.nome}, endereco = ${l.endereco},
        onde = ${JSON.stringify(l.onde)}::jsonb, activa = ${l.activa},
        ordem = ${l.ordem}, actualizado_em = now(), actualizado_por = ${por}
      where id = ${Number(l.id)}
    `;
    return;
  }
  await sql`
    insert into conteudo_ligacoes (nome, endereco, onde, activa, ordem, actualizado_por)
    values (${l.nome}, ${l.endereco}, ${JSON.stringify(l.onde)}::jsonb,
            ${l.activa}, ${l.ordem}, ${por})
  `;
}

export async function apagarLigacao(id: string) {
  const sql = base();
  if (!sql) return;
  await sql`delete from conteudo_ligacoes where id = ${Number(id)}`;
}

/* ------------------------------------------------------------- contacto */

export async function contacto(): Promise<{
  email: string;
  telefone?: string;
} | null> {
  const sql = base();
  if (!sql) return null;
  const linhas = (await sql`
    select email, telefone from conteudo_contacto where id = 1 limit 1
  `) as unknown as { email: string; telefone: string | null }[];
  if (!linhas[0]) return null;
  return { email: linhas[0].email, telefone: linhas[0].telefone ?? undefined };
}

export async function guardarContacto(
  email: string,
  telefone: string | null,
  por: string
) {
  const sql = base();
  if (!sql) return;
  await sql`
    insert into conteudo_contacto (id, email, telefone, actualizado_por)
    values (1, ${email}, ${telefone}, ${por})
    on conflict (id) do update set
      email = excluded.email, telefone = excluded.telefone,
      actualizado_em = now(), actualizado_por = excluded.actualizado_por
  `;
}

/* -------------------------------------------------------------- semente */

/**
 * A primeira importação: lê `content/` e escreve o que lá está.
 *
 * Só mexe nas tabelas que estiverem vazias, por isso pode correr-se duas vezes
 * sem fazer mal. Serve de arranque e de rede: se um dia a base de dados tiver
 * de ser refeita de raiz, os ficheiros ainda estão no repositório, e cada um é
 * a versão que estava no ar quando se mudou de casa.
 */
export async function semear(por: string) {
  const sql = base();
  if (!sql) return { feito: false as const, razao: "sem base de dados" };

  const raiz = join(process.cwd(), "content");
  const conta = async (t: string) =>
    Number(
      (
        (await sql.query(`select count(*)::int as n from ${t}`)) as unknown as {
          n: number;
        }[]
      )[0].n
    );

  const resumo: string[] = [];

  if ((await conta("conteudo_projetos")) === 0) {
    const ficheiros = readdirSync(join(raiz, "projetos")).filter((f) =>
      f.endsWith(".json")
    );
    for (const f of ficheiros.sort()) {
      const d = JSON.parse(readFileSync(join(raiz, "projetos", f), "utf8"));
      const capa = d.capa ? medir(d.capa) : null;
      await guardarProjeto(
        {
          slug: f.replace(/\.json$/, ""),
          titulo: d.titulo,
          tipo: d.tipo ?? "",
          ano: d.ano ?? null,
          descricao: d.descricao || null,
          capa: d.capa ?? null,
          capaW: capa?.w ?? null,
          capaH: capa?.h ?? null,
          imagens: d.imagens ?? [],
          videos: (d.videos ?? []).map(
            (v: { src: string; poster: string }) => {
              const cartaz = medir(v.poster);
              return {
                src: v.src,
                poster: v.poster,
                w: cartaz?.w ?? 1600,
                h: cartaz?.h ?? 900,
              };
            }
          ),
          naHome: Boolean(d.naHome),
          ordem: d.ordem ?? 99,
          estado: d.estado ?? "publicado",
        },
        por
      );
    }
    resumo.push(`${ficheiros.length} projetos`);
  }

  if ((await conta("conteudo_escritos")) === 0) {
    const ficheiros = readdirSync(join(raiz, "escritos")).filter((f) =>
      f.endsWith(".md")
    );
    for (const f of ficheiros.sort()) {
      const bruto = readFileSync(join(raiz, "escritos", f), "utf8");
      const { data: d, content } = matter(bruto);
      await guardarEscrito(
        {
          slug: f.replace(/\.md$/, ""),
          titulo: d.titulo,
          familia: d.familia,
          data:
            d.data instanceof Date
              ? d.data.toISOString().slice(0, 10)
              : String(d.data).slice(0, 10),
          resumo: d.resumo ?? "",
          imagem: d.imagem ?? null,
          publicado: d.publicado ?? null,
          enderecoExterno: d.enderecoExterno ?? null,
          corpo: content.trim() || null,
          estado: d.estado ?? "publicado",
        },
        por
      );
    }
    resumo.push(`${ficheiros.length} textos`);
  }

  if ((await conta("conteudo_ligacoes")) === 0) {
    const { ligacoes } = JSON.parse(
      readFileSync(join(raiz, "ligacoes.json"), "utf8")
    ) as { ligacoes: { nome: string; endereco: string; onde: Onde[]; activa: boolean }[] };
    let ordem = 0;
    for (const l of ligacoes) {
      await guardarLigacao({ ...l, ordem: ordem++ }, por);
    }
    resumo.push(`${ligacoes.length} ligações`);
  }

  if ((await conta("conteudo_contacto")) === 0) {
    const c = JSON.parse(
      readFileSync(join(raiz, "contacto.json"), "utf8")
    ) as { email: string; telefone?: string };
    await guardarContacto(c.email, c.telefone ?? null, por);
    resumo.push("o contacto");
  }

  return {
    feito: true as const,
    resumo: resumo.length ? resumo.join(", ") : "já lá estava tudo",
  };
}
