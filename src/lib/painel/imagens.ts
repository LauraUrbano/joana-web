import sharp from "sharp";

import { base } from "@/lib/painel/neon";

/**
 * As imagens que entram pelo painel.
 *
 * O que isto resolve, e é a razão de existir: antes, pôr uma fotografia nova
 * era escrever um caminho à mão para um ficheiro que alguém tinha de converter
 * e meter no repositório. A Joana não conseguia trocar nem remover nenhuma.
 *
 * O que acontece a cada ficheiro que entra:
 *
 *  1. é lido e medido;
 *  2. é reduzido ao limite da sua função e convertido para WEBP -- uma
 *     fotografia de 8 MB da câmara sai daqui com 200 kB, e é esse o ponto: uma
 *     imagem pesada é o que faz o sítio demorar segundos a abrir no telemóvel;
 *  3. fica na base de dados com as medidas já gravadas, que é o que a página
 *     precisa para reservar o espaço certo e não saltar enquanto carrega.
 *
 * O endereço de cada imagem é `/api/imagens/<id>`. É um caminho deste sítio,
 * por isso o optimizador de imagens do Next trata dele como trata das outras.
 */

/** Até onde se reduz, conforme a função da imagem. */
const LIMITES = {
  /** A capa vai à órbita da home, onde nunca passa de uns 600 px no ecrã. */
  capa: 1600,
  /** As da galeria aparecem a largura inteira numa página de projeto. */
  galeria: 2000,
  /** A do cartão de um texto é pequena e nunca passa de meia coluna. */
  cartao: 1400,
} as const;

export type Funcao = keyof typeof LIMITES;

/** O maior ficheiro que se aceita receber, antes de converter. */
const MAXIMO = 25 * 1024 * 1024;

export type Imagem = {
  id: string;
  ficheiro: string;
  largura: number | null;
  altura: number | null;
  criado_em: string;
};

/** O endereço por onde a imagem é servida. */
export function enderecoDa(id: string | number) {
  return `/api/imagens/${id}`;
}

/** É uma imagem nossa, da base de dados, ou um ficheiro do repositório? */
export function idDoEndereco(endereco: string | null | undefined) {
  const m = endereco?.match(/^\/api\/imagens\/(\d+)$/);
  return m ? m[1] : null;
}

/**
 * Recebe um ficheiro do formulário, converte-o e guarda-o.
 *
 * Devolve o endereço e as medidas, ou uma razão em português para mostrar a
 * quem carregou -- um PDF arrastado para o sítio errado é um engano comum, e
 * "erro ao processar" não ajuda ninguém.
 */
export async function receberImagem(
  ficheiro: File,
  funcao: Funcao,
  dono: string,
  por: string
): Promise<
  | { ok: true; endereco: string; largura: number; altura: number }
  | { ok: false; razao: string }
> {
  const sql = base();
  if (!sql) return { ok: false, razao: "Sem base de dados." };

  if (!ficheiro || ficheiro.size === 0) {
    return { ok: false, razao: "Não veio nenhum ficheiro." };
  }
  if (ficheiro.size > MAXIMO) {
    return {
      ok: false,
      razao: `Esse ficheiro tem ${Math.round(
        ficheiro.size / 1024 / 1024
      )} MB e o limite é 25 MB.`,
    };
  }

  const cru = Buffer.from(await ficheiro.arrayBuffer());

  let convertida: Buffer;
  let largura = 0;
  let altura = 0;
  try {
    const imagem = sharp(cru, { failOn: "error" }).rotate();
    const antes = await imagem.metadata();
    if (!antes.width || !antes.height) {
      return { ok: false, razao: "Isso não parece uma imagem." };
    }
    const saida = await imagem
      .resize({ width: LIMITES[funcao], withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    convertida = saida.data;
    largura = saida.info.width;
    altura = saida.info.height;
  } catch {
    return {
      ok: false,
      razao: "Não consegui ler essa imagem. JPEG, PNG, WEBP ou HEIC servem.",
    };
  }

  const linhas = (await sql`
    insert into conteudo_imagens
      (dono, ficheiro, tipo, largura, altura, bytes, criado_por)
    values
      (${dono}, ${ficheiro.name || "imagem"}, 'image/webp', ${largura},
       ${altura}, ${convertida.toString("base64")}, ${por})
    returning id::text
  `) as unknown as { id: string }[];

  return {
    ok: true,
    endereco: enderecoDa(linhas[0].id),
    largura,
    altura,
  };
}

/** Os bytes de uma imagem, para quem a pedir pelo endereço. */
export async function lerImagem(id: string) {
  const sql = base();
  if (!sql) return null;
  const linhas = (await sql`
    select tipo, bytes from conteudo_imagens where id = ${Number(id)} limit 1
  `) as unknown as { tipo: string; bytes: string }[];
  if (!linhas[0]) return null;
  return {
    tipo: linhas[0].tipo,
    bytes: Buffer.from(linhas[0].bytes, "base64"),
  };
}

/** As medidas, sem trazer os bytes atrás. */
export async function medidasDa(id: string) {
  const sql = base();
  if (!sql) return null;
  const linhas = (await sql`
    select largura, altura from conteudo_imagens where id = ${Number(id)} limit 1
  `) as unknown as { largura: number | null; altura: number | null }[];
  return linhas[0] ?? null;
}

/**
 * Apaga uma imagem.
 *
 * Não verifica se ainda está a ser usada: quem apaga está a olhar para ela na
 * grelha e carregou no ✕. O que fica por fazer é a limpeza das órfãs -- as que
 * foram carregadas e nunca entraram em lado nenhum --, e isso é uma consulta
 * por `dono` quando houver muitas.
 */
export async function apagarImagem(id: string) {
  const sql = base();
  if (!sql) return;
  await sql`delete from conteudo_imagens where id = ${Number(id)}`;
}
