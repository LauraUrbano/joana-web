"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useMovimentoReduzido } from "./movimento";

/**
 * Um capítulo: um bloco que fica fixo enquanto se percorre.
 *
 * É o mecanismo do gravity-design.de, medido no próprio site: uma moldura
 * `relative` com N ecrãs de altura, e lá dentro um `sticky top-0` de exactamente
 * um ecrã. Percorrem-se os N ecrãs e o bloco não sai do sítio -- o que muda é o
 * conteúdo dele. Daí a sensação de blocos em vez de página corrida.
 *
 * O capítulo não anima nada por si. Escreve duas coisas no elemento fixo e
 * deixa o CSS e os filhos reagirem:
 *
 *   --p          progresso de 0 a 1 dentro do capítulo
 *   data-passo   o passo actual, de 0 a passos-1
 *
 * No site de referência a troca de passo acontece em cerca de 4% do percurso:
 * o conteúdo fica parado muito tempo e troca depressa. É isso que dá "blocos".
 *
 * Sem movimento permitido, o capítulo deixa de ser um bloco fixo: a moldura
 * volta à altura do conteúdo e todos os passos ficam visíveis em sequência.
 * Caso contrário haveria ecrãs de scroll sem nada a acontecer.
 */
export default function Capitulo({
  id,
  ecras = 3,
  passos = 1,
  className = "",
  children,
}: {
  id?: string;
  /** Altura da moldura, em ecrãs. Mais ecrãs = mais tempo parado em cada passo. */
  ecras?: number;
  /** Quantos estados o capítulo atravessa. */
  passos?: number;
  className?: string;
  children: ReactNode;
}) {
  const moldura = useRef<HTMLDivElement>(null);
  const fixo = useRef<HTMLDivElement>(null);
  const reduz = useMovimentoReduzido();

  useEffect(() => {
    if (reduz) return;
    const m = moldura.current;
    const f = fixo.current;
    if (!m || !f) return;

    // Marca que o capítulo está vivo. Sem script, o CSS deixa tudo visível,
    // para a página nunca esconder conteúdo à espera de JavaScript.
    f.dataset.vivo = "";

    let raf = 0;
    let pendente = false;
    let ultimoPasso = -1;

    const medir = () => {
      pendente = false;
      const r = m.getBoundingClientRect();
      const curso = Math.max(r.height - window.innerHeight, 1);
      const p = Math.min(Math.max(-r.top / curso, 0), 1);
      f.style.setProperty("--p", p.toFixed(4));
      // O passo avança em limiares iguais. Trava-se no último, para o fim do
      // capítulo não saltar de volta ao princípio.
      const passo = Math.min(Math.floor(p * passos), passos - 1);
      if (passo !== ultimoPasso) {
        ultimoPasso = passo;
        f.dataset.passo = String(passo);
      }
    };

    const agendar = () => {
      if (pendente) return;
      pendente = true;
      raf = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      delete f.dataset.vivo;
    };
  }, [passos, reduz]);

  return (
    <div
      ref={moldura}
      id={id}
      className="relative"
      style={reduz ? undefined : { height: `${ecras * 100}svh` }}
      data-capitulo
    >
      <div
        ref={fixo}
        data-passo="0"
        data-estatico={reduz ? "" : undefined}
        className={
          reduz
            ? `relative ${className}`
            : `sticky top-0 h-svh overflow-hidden ${className}`
        }
      >
        {children}
      </div>
    </div>
  );
}
