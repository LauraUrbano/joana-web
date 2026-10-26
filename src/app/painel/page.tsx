import { redirect } from "next/navigation";

/**
 * O painel não tem página de rosto: abre nos projetos.
 *
 * Um painel de quatro secções não precisa de um resumo à entrada -- precisa de
 * começar no que se mexe mais. O endereço `/painel` continua a existir porque
 * está em marcadores e no que já escrevi à Laura.
 */
/* Dinâmica como as outras: a moldura do painel lê a sessão dos cookies, e sem
   isto o Next tenta construir esta página de antemão e queixa-se. */
export const dynamic = "force-dynamic";

export default function Painel() {
  redirect("/painel/projetos");
}
