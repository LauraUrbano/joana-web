/**
 * O Neon Auth, montado onde o SDK espera: /api/auth/*.
 *
 * Não é uma página nossa -- é o proxy que leva os pedidos de registo, entrada,
 * sessão e saída ao serviço de autenticação, no mesmo domínio, para que os
 * cookies de sessão funcionem. A página de entrada é /painel/entrar e a
 * entrega da chave ao painel de conteúdos é /api/painel.
 *
 * O handler é construído a pedido porque o segredo dos cookies vem da base de
 * dados. Sem Neon configurado -- o sítio está publicado em dois projetos e só
 * um o tem -- isto responde 503 em vez de estoirar na construção.
 */
import { login } from "@/lib/painel/neon";

type Ctx = { params: Promise<{ path: string[] }> };
type Metodo = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function despachar(metodo: Metodo, pedido: Request, ctx: Ctx) {
  const auth = await login();
  if (!auth) {
    return Response.json(
      { erro: "Este endereço não tem o Neon configurado." },
      { status: 503 }
    );
  }
  return auth.handler()[metodo](pedido, ctx);
}

export const GET = (pedido: Request, ctx: Ctx) =>
  despachar("GET", pedido, ctx);
export const POST = (pedido: Request, ctx: Ctx) =>
  despachar("POST", pedido, ctx);
export const PUT = (pedido: Request, ctx: Ctx) =>
  despachar("PUT", pedido, ctx);
export const DELETE = (pedido: Request, ctx: Ctx) =>
  despachar("DELETE", pedido, ctx);
export const PATCH = (pedido: Request, ctx: Ctx) =>
  despachar("PATCH", pedido, ctx);
