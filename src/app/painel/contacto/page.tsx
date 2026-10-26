import { redirect } from "next/navigation";

import { Botao, Cabeca, Recado, Texto } from "@/components/painel/campos";
import { contacto, guardarContacto } from "@/lib/painel/conteudo-db";
import {
  exigeSessao,
  exigeSessaoNaAccao,
  refrescarSitio,
} from "@/lib/painel/sessao";

/** Um registo só: há um email e um telefone, não vários. */
export const dynamic = "force-dynamic";

export default async function Contacto({
  searchParams,
}: {
  searchParams: Promise<{ feito?: string; erro?: string }>;
}) {
  await exigeSessao();
  const { feito, erro } = await searchParams;
  const c = await contacto();

  return (
    <>
      <Cabeca
        titulo="Contacto"
        nota="O email aparece em cinco sítios do site e o telefone em três."
      />

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      <p className="max-w-[56ch] font-body text-[1.05rem]">
        Nas páginas legais não é decoração: é o contacto do responsável pelo
        tratamento de dados, que o RGPD obriga a estar lá e a estar certo. Trocar
        sim; apagar sem pôr outro, o painel recusa.
      </p>

      <form action={guardar} className="mt-8 flex max-w-[30rem] flex-col gap-5">
        <Texto
          etiqueta="Email"
          nome="email"
          valor={c?.email}
          tipo="email"
          obrigatorio
        />
        <Texto
          etiqueta="Telefone"
          nome="telefone"
          valor={c?.telefone}
          ajuda="Sai como WhatsApp nas redes e por extenso nas páginas legais."
        />
        <div>
          <Botao>Guardar</Botao>
        </div>
      </form>
    </>
  );
}

async function guardar(form: FormData) {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const email = String(form.get("email") ?? "").trim();
  const telefone = String(form.get("telefone") ?? "").trim() || null;
  if (!email.includes("@")) {
    redirect(
      `/painel/contacto?erro=${encodeURIComponent(
        "Sem um email válido as páginas legais ficam incompletas. Nada foi gravado."
      )}`
    );
  }
  await guardarContacto(email, telefone, quem);
  refrescarSitio();
  redirect(`/painel/contacto?feito=${encodeURIComponent("Contacto guardado.")}`);
}
