import { lerImagem } from "@/lib/painel/imagens";

/**
 * Serve uma imagem carregada pelo painel.
 *
 * O endereço nunca muda de conteúdo -- carregar outra imagem cria outra linha,
 * com outro id --, por isso pode ser guardada para sempre. É isso que o
 * `immutable` diz, e é o que faz com que a base de dados seja consultada uma
 * vez e não a cada visita: a rede da Vercel e o browser ficam com ela.
 */
export async function GET(
  _pedido: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) return new Response("Não encontrado", { status: 404 });

  const imagem = await lerImagem(id);
  if (!imagem) return new Response("Não encontrado", { status: 404 });

  return new Response(new Uint8Array(imagem.bytes), {
    headers: {
      "content-type": imagem.tipo,
      "cache-control": "public, max-age=31536000, immutable",
      "content-length": String(imagem.bytes.length),
    },
  });
}
