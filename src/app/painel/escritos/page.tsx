import {
  BotaoLigacao,
  Cabeca,
  Linha,
  Recado,
  Vazio,
} from "@/components/painel/campos";
import { comoDia, escritosTodos } from "@/lib/painel/conteudo-db";
import { exigeSessao } from "@/lib/painel/sessao";

/** A lista de textos do blog. */
export const dynamic = "force-dynamic";

export default async function Escritos({
  searchParams,
}: {
  searchParams: Promise<{ feito?: string; erro?: string }>;
}) {
  await exigeSessao();
  const { feito, erro } = await searchParams;
  const escritos = await escritosTodos();

  return (
    <>
      <Cabeca
        titulo="Textos"
        nota="Um texto escrito aqui trabalha o teu SEO; um publicado noutro sítio trabalha o de lá."
        accao={<BotaoLigacao para="/painel/escritos/novo">Novo texto</BotaoLigacao>}
      />

      {feito && <Recado tom="bom">{feito}</Recado>}
      {erro && <Recado tom="mau">{erro}</Recado>}

      {escritos.length === 0 ? (
        <Vazio>Ainda não há textos.</Vazio>
      ) : (
        <ul>
          {escritos.map((e) => (
            <Linha
              key={e.slug}
              para={`/painel/escritos/${e.slug}`}
              titulo={e.titulo}
              detalhe={`${comoDia(e.data)} · ${e.familia}`}
              etiqueta={
                e.estado === "rascunho"
                  ? "Rascunho"
                  : e.endereco_externo
                    ? `Em ${e.publicado || "outro sítio"}`
                    : "Aqui"
              }
              esmorecido={e.estado === "rascunho"}
            />
          ))}
        </ul>
      )}
    </>
  );
}
