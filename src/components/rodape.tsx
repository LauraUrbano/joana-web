import Image from "next/image";

import { lerRedes } from "@/lib/conteudo";
import { ALVO, CAPS, GUTTER } from "@/lib/tipo";

/**
 * O rodapé: a marca, as redes, e as duas páginas legais.
 *
 * Igual em todas as páginas que o ficheiro desenha com rodapé -- a home e a da
 * escrita.
 */
export default async function Rodape() {
  const redes = await lerRedes();
  return (
    <footer
      className={`bg-olive-deep pb-10 pt-[clamp(2.5rem,6vw,6.5rem)] text-paper ${GUTTER}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-y-10">
        <Image
          src="/home/marca-rodape.svg"
          alt="Joana Domingues Design"
          width={527}
          height={306}
          unoptimized
          className="h-auto w-[clamp(7rem,13.8vw,14.5rem)]"
        />
        <nav className="flex flex-wrap gap-x-[clamp(1.5rem,3.2vw,3.5rem)] gap-y-3">
          {redes.map((r) =>
            r.href ? (
              <a
                key={r.nome}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer me"
                className={`${CAPS} ${ALVO} opacity-70 transition-opacity hover:opacity-100`}
              >
                {r.nome}
              </a>
            ) : (
              <span key={r.nome} className={`${CAPS} opacity-70`}>
                {r.nome}
              </span>
            )
          )}
        </nav>
      </div>
      <div className="mt-[clamp(2.5rem,5vw,5rem)] flex flex-wrap justify-between gap-y-2 border-t border-paper/20 pt-5 font-body text-[clamp(0.75rem,1vw,1rem)] opacity-70">
        <p>© 2026 Joana Domingues Design</p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="/aviso-legal"
            className={`${ALVO} transition-opacity hover:opacity-100`}
          >
            Aviso legal
          </a>
          <a
            href="/politica-de-privacidade"
            className={`${ALVO} transition-opacity hover:opacity-100`}
          >
            Política de Privacidade
          </a>
        </p>
      </div>
    </footer>
  );
}
