import { redirect } from "next/navigation";

import { login } from "@/lib/painel/neon";

/**
 * O botão de sair, com a acção ao lado.
 *
 * Está num ficheiro próprio porque vive na moldura, e a moldura é partilhada
 * por todas as secções: assim há uma acção de sair em vez de uma por página.
 */
export default function Sair() {
  return (
    <form action={sair}>
      <button
        type="submit"
        className="w-full rounded-sm px-3 py-2 text-left text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-60 transition-opacity hover:opacity-100"
      >
        Sair
      </button>
    </form>
  );
}

async function sair() {
  "use server";
  const auth = await login();
  if (auth) await auth.signOut();
  redirect("/painel/entrar");
}
