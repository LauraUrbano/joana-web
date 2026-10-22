import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A largura e a altura de uma imagem, lidas dos próprios bytes.
 *
 * Isto existe para não ser preciso pedir à Joana as medidas de cada fotografia
 * no painel -- ninguém sabe de cor que a capa do Authentic tem 1024 por 1123,
 * e ninguém devia ter de saber. O `next/image` precisa delas para reservar o
 * espaço antes de a imagem chegar; a construção lê-as do ficheiro.
 *
 * Só precisa de perceber os formatos que o sítio usa: WEBP (que é o que as
 * fotografias dos projetos são), PNG e JPEG. Confirmei contra as medidas que
 * estavam escritas à mão: dão exactamente o mesmo.
 *
 * Corre só na construção, nunca no browser.
 */
export type Medida = { w: number; h: number };

const cache = new Map<string, Medida>();

export function medir(caminhoPublico: string): Medida | null {
  const guardado = cache.get(caminhoPublico);
  if (guardado) return guardado;

  let b: Buffer;
  try {
    b = readFileSync(join(process.cwd(), "public", caminhoPublico));
  } catch {
    return null;
  }

  const m = dosBytes(b);
  if (m) cache.set(caminhoPublico, m);
  return m;
}

function dosBytes(b: Buffer): Medida | null {
  // WEBP: RIFF....WEBP, e depois um de três sabores
  if (
    b.length > 30 &&
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP"
  ) {
    const sabor = b.toString("ascii", 12, 16);
    if (sabor === "VP8 ")
      return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (sabor === "VP8L") {
      const n = b.readUInt32LE(21);
      return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
    }
    if (sabor === "VP8X") {
      const tresBytes = (o: number) => b[o] | (b[o + 1] << 8) | (b[o + 2] << 16);
      return { w: tresBytes(24) + 1, h: tresBytes(27) + 1 };
    }
  }

  // PNG: o IHDR vem sempre primeiro
  if (b.length > 24 && b.toString("ascii", 12, 16) === "IHDR")
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };

  // JPEG: procura-se o marcador de início de quadro
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) {
        i++;
        continue;
      }
      const marca = b[i + 1];
      const quadro =
        marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca);
      if (quadro) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }

  return null;
}
