import { redirect } from "next/navigation";

import {
  BotaoLigacao,
  Botao,
  Cabeca,
  Linha,
  Recado,
  Vazio,
} from "@/components/painel/campos";
import {
  contacto,
  escritosTodos,
  ligacoesTodas,
  projetosTodos,
  semear,
} from "@/lib/painel/conteudo-db";
import { exigeSessao, exigeSessaoNaAccao, refrescarSitio } from "@/lib/painel/sessao";

/** A lista de projetos, que é por onde o painel abre. */
export const dynamic = "force-dynamic";

export default async function Projetos({
  searchParams,
}: {
  searchParams: Promise<{ feito?: string; erro?: string }>;
}) {
  await exigeSessao();
  const { feito, erro } = await searchParams;
  const projetos = await projetosTodos();

  // Antes da primeira importação não há nada em lado nenhum. Em vez de quatro
  // listas vazias, uma explicação e um botão.
  const [escritos, ligacoes, contactos] = await Promise.all([
    escritosTodos(),
    ligacoesTodas(),
    contacto(),
  ]);
  const vazioDeTudo =
    projetos.length === 0 &&
    escritos.length === 0 &&
    ligacoes.length === 0 &&
    !contactos;

  return (
    <>
      <Cabeca
        titulo="Projetos"
        nota="A ordem é a da home, do menor para o maior — não é a data."
        accao={<BotaoLigacao para="/painel/projetos/novo">Novo projeto</BotaoLigacao>}
      />

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      {vazioDeTudo ? (
        <>
          <p className="font-body text-[1.05rem]">
            A base de dados está vazia. O conteúdo que está no ar ainda vive nos
            ficheiros do repositório — importa-o uma vez e passa a editar-se
            aqui.
          </p>
          <form action={importar} className="mt-5">
            <Botao>Importar o conteúdo dos ficheiros</Botao>
          </form>
        </>
      ) : projetos.length === 0 ? (
        <Vazio>Ainda não há projetos. O primeiro cria-se ali em cima.</Vazio>
      ) : (
        <ul>
          {projetos.map((p) => (
            <Linha
              key={p.slug}
              para={`/painel/projetos/${p.slug}`}
              titulo={p.titulo}
              detalhe={`${p.ano ?? "sem ano"} · ordem ${p.ordem}`}
              etiqueta={
                p.estado === "rascunho"
                  ? "Rascunho"
                  : p.naCena
                    ? "Na home"
                    : "Fora da home"
              }
              esmorecido={p.estado === "rascunho"}
            />
          ))}
        </ul>
      )}
    </>
  );
}

async function importar() {
  "use server";
  const quem = await exigeSessaoNaAccao();
  const r = await semear(quem);
  refrescarSitio();
  redirect(
    `/painel/projetos?feito=${encodeURIComponent(
      r.feito ? `Importado: ${r.resumo}.` : "Não foi possível importar."
    )}`
  );
}
