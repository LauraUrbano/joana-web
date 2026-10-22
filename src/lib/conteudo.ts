import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

import type { Escrito, Familia } from "@/lib/escritos";
import { medir } from "@/lib/medidas";
import type { Preparacao } from "@/lib/projetos";
import type { Rede } from "@/lib/redes";

/**
 * A porta de entrada do conteúdo.
 *
 * Tudo o que a Joana edita vive em `content/`, em ficheiros de texto que o
 * painel escreve no GitHub: os projetos e as ligações em JSON, o blog em
 * Markdown com cabeçalho. Esta camada lê-os na construção e devolve-os com a
 * forma que os componentes já esperavam -- foi de propósito, para a mudança
 * para o painel não obrigar a mexer no desenho de nada.
 *
 * Corre só no servidor, na construção. Nenhum componente do browser importa
 * este ficheiro: as páginas lêem aqui e passam o resultado como propriedade.
 */

const RAIZ = join(process.cwd(), "content");

function lerJson<T>(caminho: string): T {
  return JSON.parse(readFileSync(join(RAIZ, caminho), "utf8")) as T;
}

function ficheiros(pasta: string, extensao: string) {
  try {
    return readdirSync(join(RAIZ, pasta))
      .filter((f) => f.endsWith(extensao))
      .sort();
  } catch {
    return [];
  }
}

/* --------------------------------------------------------------- projetos */

type ProjetoFicheiro = {
  titulo: string;
  tipo: string;
  ano?: string;
  descricao?: string;
  capa?: string;
  imagens?: string[];
  videos?: { src: string; poster: string }[];
  naHome?: boolean;
  ordem?: number;
  estado?: "rascunho" | "publicado";
};

export function lerProjetos(): Preparacao[] {
  return ficheiros("projetos", ".json")
    .map((f) => {
      const d = lerJson<ProjetoFicheiro>(join("projetos", f));
      const slug = f.replace(/\.json$/, "");
      const capa = d.capa ? medir(d.capa) : null;
      return {
        slug,
        titulo: d.titulo,
        tipo: d.tipo,
        ano: d.ano,
        descricao: d.descricao || undefined,
        naCena: Boolean(d.naHome),
        src: d.capa,
        // Medidas lidas do próprio ficheiro. Sem capa legível, um quadrado:
        // é melhor reservar espaço a mais do que a página saltar.
        w: capa?.w ?? 1200,
        h: capa?.h ?? 1200,
        imagens: d.imagens?.length ? d.imagens : undefined,
        videos: d.videos?.length
          ? d.videos.map((v) => {
              // O cartaz do vídeo é um fotograma dele, por isso tem a mesma
              // proporção: mede-se o cartaz e fica-se a saber a do vídeo.
              const cartaz = medir(v.poster);
              return {
                src: v.src,
                poster: v.poster,
                w: cartaz?.w ?? 1600,
                h: cartaz?.h ?? 900,
              };
            })
          : undefined,
        ordem: d.ordem ?? 99,
        estado: d.estado ?? "publicado",
      };
    })
    .filter((p) => p.estado === "publicado")
    .sort((a, b) => a.ordem - b.ordem);
}

/* ------------------------------------------------------------------- blog */

type EscritoFicheiro = {
  titulo: string;
  familia: Familia;
  data: string | Date;
  resumo: string;
  imagem?: string;
  publicado?: string;
  enderecoExterno?: string;
  estado?: "rascunho" | "publicado";
};

export function lerEscritos(): Escrito[] {
  return ficheiros("escritos", ".md")
    .map((f) => {
      const bruto = readFileSync(join(RAIZ, "escritos", f), "utf8");
      const { data: d } = matter(bruto) as unknown as { data: EscritoFicheiro };
      const slug = f.replace(/\.md$/, "");
      return {
        titulo: d.titulo,
        resumo: d.resumo,
        familia: d.familia,
        // O cabeçalho pode trazer a data já como data, conforme quem a
        // escreveu; fica sempre em AAAA-MM-DD.
        data:
          d.data instanceof Date
            ? d.data.toISOString().slice(0, 10)
            : String(d.data).slice(0, 10),
        // Publicado noutro sítio, a ligação é para lá. Escrito aqui, é para a
        // página do artigo -- que é a fase seguinte.
        href: d.enderecoExterno || `/escrita/${slug}`,
        publicado: d.publicado,
        imagem: d.imagem,
        estado: d.estado ?? "publicado",
      };
    })
    .filter((e) => e.estado === "publicado");
}

/* -------------------------------------------------------------- ligações */

export type Onde = "rodape" | "menu" | "investigo" | "escrevo";

export type Ligacao = {
  nome: string;
  endereco: string;
  onde: Onde[];
  activa: boolean;
};

export function lerLigacoes(onde?: Onde): Ligacao[] {
  const { ligacoes } = lerJson<{ ligacoes: Ligacao[] }>("ligacoes.json");
  return ligacoes.filter(
    (l) => l.activa && l.endereco && (!onde || l.onde.includes(onde))
  );
}

/**
 * As ligações do rodapé e do menu, na forma que esses componentes já usavam.
 * O `href` continua a aceitar `null` -- uma ligação desligada no painel volta
 * a aparecer como texto em vez de levar a lado nenhum.
 */
export function lerRedes(onde: Onde = "rodape"): Rede[] {
  return lerLigacoes(onde).map((l) => ({ nome: l.nome, href: l.endereco }));
}

/* -------------------------------------------------------------- contacto */

export function lerContacto() {
  return lerJson<{ email: string; telefone?: string }>("contacto.json");
}
