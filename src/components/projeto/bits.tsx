"use client";

import { useEffect, useRef, useState } from "react";

/** Paleta do projeto. Clicar copia o valor. */
export function Swatches({ valores }: { valores: string[] }) {
  const [copiado, setCopiado] = useState<string | null>(null);

  async function copiar(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiado(hex);
      window.setTimeout(() => setCopiado(null), 1400);
    } catch {
      // Sem permissão para a área de transferência: não finge que copiou.
      setCopiado(null);
    }
  }

  return (
    <ul className="mt-3.5 grid grid-cols-5 gap-1.5">
      {valores.map((hex) => (
        <li key={hex}>
          <button
            type="button"
            onClick={() => copiar(hex)}
            title={`Copiar ${hex}`}
            className="grid w-full gap-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span
              aria-hidden="true"
              style={{ background: hex }}
              className="block h-12 ring-1 ring-inset ring-ink/15"
            />
            <span
              className={`text-[0.5rem] uppercase tracking-[0.08em] tabular-nums ${
                copiado === hex ? "font-bold opacity-100" : "opacity-55"
              }`}
            >
              {copiado === hex ? "copiado" : hex}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * A grelha do projeto, desenhada. Uma coluna por plano de mobilidade herdado,
 * e a faixa de sinal na coluna que exige decisão.
 */
export function GridArt({
  colunas,
  sinal,
  label,
}: {
  colunas: number;
  sinal: number;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const desenhar = () => {
      const ctx = cv.getContext("2d");
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (!ctx || !w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const pad = 8;
      const gap = 4;
      const cw = (w - pad * 2 - gap * (colunas - 1)) / colunas;
      for (let i = 0; i < colunas; i++) {
        ctx.fillStyle = i === sinal ? "#f4ef93" : "rgba(171,153,207,0.28)";
        ctx.fillRect(pad + i * (cw + gap), pad, cw, h - pad * 2);
      }
    };

    desenhar();
    window.addEventListener("resize", desenhar);
    return () => window.removeEventListener("resize", desenhar);
  }, [colunas, sinal]);

  return (
    <canvas
      ref={ref}
      aria-label={label}
      role="img"
      className="mt-3.5 block h-28 w-full ring-1 ring-inset ring-ink/15"
    />
  );
}
