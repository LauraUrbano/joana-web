"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * A preferência de movimento do sistema é estado externo ao React: subscreve-se
 * em vez de a copiar para dentro de um `useState`.
 *
 * No servidor devolve `false` -- assume-se movimento, e o primeiro render no
 * cliente corrige se for preciso.
 */
export function useMovimentoReduzido() {
  return useSyncExternalStore(
    (notificar) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", notificar);
      return () => mq.removeEventListener("change", notificar);
    },
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
