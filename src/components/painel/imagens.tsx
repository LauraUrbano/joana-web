import Image from "next/image";

import { Botao, Etiqueta } from "@/components/painel/campos";

/**
 * O gestor de imagens.
 *
 * Esteve aqui uma caixa de texto com um caminho por linha. Funcionava para quem
 * soubesse os caminhos de cor, e a Joana não conseguia ver, trocar nem remover
 * nenhuma -- que é o trabalho todo.
 *
 * Agora vê-se cada imagem e mexe-se nela ali mesmo. Cada acção é o seu próprio
 * formulário, e por isso tem de viver fora do formulário grande do projeto: um
 * formulário dentro de outro não é HTML válido, e o browser ignora o de dentro.
 * Sai daí uma coisa boa -- as imagens aplicam-se logo, sem depender do
 * "Guardar" lá de baixo, que é o que se espera de uma galeria.
 */

export function Galeria({
  imagens,
  capa,
  accoes,
}: {
  imagens: string[];
  capa?: string | null;
  accoes: {
    remover: (form: FormData) => Promise<void>;
    mover: (form: FormData) => Promise<void>;
    definirCapa: (form: FormData) => Promise<void>;
  };
}) {
  if (imagens.length === 0) {
    return (
      <p className="font-body text-[1.02rem] opacity-60">
        Ainda não há imagens neste projeto.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {imagens.map((src, i) => (
        <li key={`${src}-${i}`} className="border border-clay/20">
          <div className="relative aspect-square bg-clay/5">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 640px) 12rem, 40vw"
              className="object-cover"
            />
            {src === capa && (
              <span className="absolute left-0 top-0 bg-clay px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-paper">
                Capa
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-1 px-2 py-1.5">
            <div className="flex items-center gap-1">
              <Mini accao={accoes.mover} nome="indice" valor={i} extra={{ sentido: "cima" }} titulo="Mover para trás" desactivado={i === 0}>
                ↑
              </Mini>
              <Mini accao={accoes.mover} nome="indice" valor={i} extra={{ sentido: "baixo" }} titulo="Mover para a frente" desactivado={i === imagens.length - 1}>
                ↓
              </Mini>
            </div>
            <div className="flex items-center gap-1">
              {src !== capa && (
                <Mini accao={accoes.definirCapa} nome="indice" valor={i} titulo="Usar como capa">
                  ★
                </Mini>
              )}
              <Mini accao={accoes.remover} nome="indice" valor={i} titulo="Remover">
                ✕
              </Mini>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Um botão pequeno com a sua própria acção, para caber por baixo da imagem. */
function Mini({
  accao,
  nome,
  valor,
  extra,
  titulo,
  desactivado = false,
  children,
}: {
  accao: (form: FormData) => Promise<void>;
  nome: string;
  valor: number;
  extra?: Record<string, string>;
  titulo: string;
  desactivado?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={accao}>
      <input type="hidden" name={nome} value={valor} />
      {extra &&
        Object.entries(extra).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      <button
        type="submit"
        title={titulo}
        aria-label={titulo}
        disabled={desactivado}
        className="px-1.5 py-0.5 text-[0.95rem] leading-none transition-opacity hover:opacity-100 disabled:opacity-20 opacity-55"
      >
        {children}
      </button>
    </form>
  );
}

/** A capa, com o que fazer a seguir conforme exista ou não. */
export function Capa({
  src,
  largura,
  altura,
  accoes,
  ajuda = "Quadrada, de preferência. É a imagem que vai à órbita da home.",
  proporcao = "aspect-square",
  nada = "Sem capa",
}: {
  src?: string | null;
  largura?: number;
  altura?: number;
  accoes: {
    carregar: (form: FormData) => Promise<void>;
    remover: () => Promise<void>;
  };
  ajuda?: string;
  proporcao?: string;
  nada?: string;
}) {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-40 shrink-0">
        {src ? (
          <>
            <div className={`relative ${proporcao} border border-clay/20 bg-clay/5`}>
              <Image
                src={src}
                alt=""
                fill
                sizes="10rem"
                className="object-cover"
              />
            </div>
            {largura && altura && (
              <p className="mt-1.5 font-body text-[0.85rem] opacity-50">
                {largura}×{altura}
              </p>
            )}
          </>
        ) : (
          <div
            className={`grid ${proporcao} place-items-center border border-dashed border-clay/30 text-center font-body text-[0.9rem] opacity-50`}
          >
            {nada}
          </div>
        )}
      </div>

      <div className="flex min-w-[14rem] flex-1 flex-col gap-3">
        <form action={accoes.carregar} className="flex flex-col gap-3">
          <Ficheiro
            etiqueta={src ? "Trocar a imagem" : "Escolher a imagem"}
            nome="ficheiro"
            ajuda={ajuda}
          />
          <div>
            <Botao>Carregar</Botao>
          </div>
        </form>
        {src && (
          <form action={accoes.remover}>
            <button
              type="submit"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-50 hover:opacity-100"
            >
              Remover a imagem
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/** Um campo de ficheiro com o aspecto dos outros campos. */
export function Ficheiro({
  etiqueta,
  nome,
  ajuda,
  varios = false,
}: {
  etiqueta: string;
  nome: string;
  ajuda?: string;
  varios?: boolean;
}) {
  return (
    <label className="block">
      <Etiqueta ajuda={ajuda}>{etiqueta}</Etiqueta>
      <input
        type="file"
        name={nome}
        multiple={varios}
        accept="image/*"
        required
        className="mt-2 block w-full cursor-pointer border border-clay/40 bg-paper px-3 py-2.5 font-body text-[0.98rem] file:mr-3 file:cursor-pointer file:border-0 file:bg-clay file:px-3 file:py-1.5 file:text-[0.7rem] file:font-semibold file:uppercase file:tracking-[0.14em] file:text-paper"
      />
    </label>
  );
}
