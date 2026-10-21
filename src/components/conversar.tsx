import Image from "next/image";

import Seta from "@/components/seta";
import { ALVO_CIMA, CAPS, GUTTER } from "@/lib/tipo";

/**
 * "Vamos conversar?" -- o convite que fecha as páginas, antes do rodapé.
 *
 * Vinha da home e é o mesmo bloco que o ficheiro põe ao fim da página da
 * escrita. As medidas do telemóvel são as da moldura estreita (85/681 no
 * título, 32/681 no corpo).
 */
export default function Conversar() {
  return (
    <section className="relative isolate bg-olive" id="conversar">
      <Image
        src="/home/fundo-azeitona.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className={`py-[clamp(3.5rem,10vw,11rem)] ${GUTTER}`}>
        <h2 className="font-serif text-[min(12.48vw,55px)] uppercase leading-[0.95] text-paper md:text-[clamp(2rem,6.53vw,6.8rem)]">
          Vamos conversar?
        </h2>
        <p className="mt-[clamp(1rem,2vw,2rem)] max-w-[34ch] font-body text-[min(4.7vw,21px)] leading-snug text-paper md:text-[clamp(1rem,1.92vw,2rem)]">
          Disponível para novos projetos e colaborações em design e comunicação.
        </p>
        <a
          href="mailto:jcm@linear.com.pt"
          className={`${CAPS} ${ALVO_CIMA} mt-[clamp(1.75rem,3.5vw,3.5rem)] inline-flex items-center gap-3 border-b border-paper pb-1 text-paper transition-opacity hover:opacity-70`}
        >
          Entrar em contacto <Seta />
        </a>
      </div>
    </section>
  );
}
