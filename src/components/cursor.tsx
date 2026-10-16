"use client";

import { useEffect, useRef } from "react";

/**
 * O cursor do estúdio.
 *
 * Fui ver o gravity-design.de antes de desenhar isto: não tem cursor
 * personalizado nenhum -- varri-lhe as folhas de estilo e não há uma única
 * regra de `cursor` nem elemento que o siga. Por isso este não imita ninguém;
 * sai da linguagem dela.
 *
 * São duas peças, que é o que faz a coisa ter vida sem ter ruído:
 *
 *  - um ponto que está exactamente onde o rato está, sem atraso nenhum;
 *  - um anel que vem atrás, a interpolar 0,16 por fotograma, e que chega
 *    sempre um instante depois.
 *
 * O anel também diz o que há para fazer: cresce sobre as ligações e, na cena
 * dos projetos, abre com a palavra "arrastar" -- que é literalmente a nota da
 * Joana no Figma, "pode-se rodar".
 *
 * Três cuidados:
 *  - só aparece com ponteiro fino, por isso no telemóvel nem se monta;
 *  - com `prefers-reduced-motion` não se monta de todo, e o cursor do sistema
 *    fica como está -- esconder o cursor a quem precisa dele seria mau;
 *  - só esconde o cursor nativo depois de o seu já estar no ecrã, e devolve-o
 *    ao sair da página.
 */
export default function Cursor() {
  const ponto = useRef<HTMLDivElement>(null);
  const anel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fino = window.matchMedia("(pointer: fine)");
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fino.matches || reduz.matches) return;

    const p = ponto.current;
    const a = anel.current;
    if (!p || !a) return;

    const raiz = document.documentElement;
    let rx = -100;
    let ry = -100;
    let ax = rx;
    let ay = ry;
    let raf = 0;
    let vivo = false;

    const passo = () => {
      // O anel persegue o ponto. 0,16 dá-lhe o atraso de um instante sem o
      // deixar a vaguear quando o rato pára.
      ax += (rx - ax) * 0.16;
      ay += (ry - ay) * 0.16;
      p.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      a.style.transform = `translate3d(${ax}px, ${ay}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(passo);
    };

    const estado = (alvo: EventTarget | null) => {
      const el = alvo instanceof Element ? alvo : null;
      if (el?.closest("a, button, [role='button']")) return "ligacao";
      if (el?.closest("#projetos")) return "arrastar";
      return "";
    };

    const aoMover = (e: PointerEvent) => {
      rx = e.clientX;
      ry = e.clientY;
      if (!vivo) {
        vivo = true;
        ax = rx;
        ay = ry;
        raiz.dataset.cursorVivo = "";
        raf = requestAnimationFrame(passo);
      }
      const s = estado(e.target);
      if (a.dataset.sobre !== s) {
        a.dataset.sobre = s;
        p.dataset.sobre = s;
      }
    };
    // Sai da janela: o cursor do estúdio sai com ele.
    const aoSair = () => {
      a.dataset.fora = "";
      p.dataset.fora = "";
    };
    const aoEntrar = () => {
      delete a.dataset.fora;
      delete p.dataset.fora;
    };
    const aoPremir = () => {
      a.dataset.premido = "";
    };
    const aoLargar = () => {
      delete a.dataset.premido;
    };

    window.addEventListener("pointermove", aoMover, { passive: true });
    document.addEventListener("pointerleave", aoSair);
    document.addEventListener("pointerenter", aoEntrar);
    window.addEventListener("pointerdown", aoPremir, { passive: true });
    window.addEventListener("pointerup", aoLargar, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", aoMover);
      document.removeEventListener("pointerleave", aoSair);
      document.removeEventListener("pointerenter", aoEntrar);
      window.removeEventListener("pointerdown", aoPremir);
      window.removeEventListener("pointerup", aoLargar);
      delete raiz.dataset.cursorVivo;
    };
  }, []);

  return (
    <>
      <div ref={ponto} aria-hidden="true" data-cursor-ponto />
      <div ref={anel} aria-hidden="true" data-cursor-anel>
        <span data-cursor-nota>arrastar</span>
      </div>
    </>
  );
}
