"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Movimento da home.
 *
 * Não desenha nada: acrescenta comportamento à marcação que o servidor já
 * enviou, através de atributos `data-*`. A página lê-se inteira sem
 * JavaScript, e nada fica escondido à espera de um observador.
 *
 * Três coisas, tiradas do gravity-design.de e das notas da Joana no Figma:
 *
 *  1. Scroll suave (Lenis). É o que faz a navegação sentir-se contínua em vez
 *     de aos saltos -- o site de referência usa a mesma biblioteca.
 *  2. Os tópicos 01/02/03 vão aparecendo à medida que se desce, que é
 *     literalmente a nota dela: "à medida que vamos fazendo scroll vão
 *     aparecendo os tópicos 1, 2 e 3".
 *  3. O progresso do primeiro ecrã, em `--foco`, de 0 a 1. É o que conduz a
 *     saída do hero e a chegada da cortina -- uma só medição para as duas
 *     pontas da passagem, por isso não se podem desencontrar.
 *
 * A órbita dos projetos vive no seu próprio componente (./orbita.tsx), porque
 * precisa de estado e de marcação próprias.
 *
 * Com `prefers-reduced-motion` nada disto corre: o scroll fica nativo e os
 * tópicos ficam visíveis.
 */
export default function HomeMotion() {
  useEffect(() => {
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)");
    const limpar: (() => void)[] = [];

    /* --- 1. scroll suave ------------------------------------------------ */
    if (!reduz.matches) {
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      let raf = 0;
      const passo = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(passo);
      };
      raf = requestAnimationFrame(passo);
      limpar.push(() => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      });
    }

    /* --- 2. os tópicos vão aparecendo ----------------------------------- */
    const alvos = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!reduz.matches && "IntersectionObserver" in window && alvos.length) {
      const abaixo = alvos.filter(
        (el) => el.getBoundingClientRect().top > window.innerHeight * 0.9
      );
      abaixo.forEach((el) => el.setAttribute("data-pre", ""));
      const io = new IntersectionObserver(
        (entradas) =>
          entradas.forEach((e) => {
            if (e.isIntersecting) {
              e.target.removeAttribute("data-pre");
              io.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -15% 0px" }
      );
      abaixo.forEach((el) => io.observe(el));
      // Rede de segurança: numa captura de miniatura, ou num leitor que não
      // faz scroll, ninguém fica com um tópico invisível.
      const rede = window.setTimeout(() => {
        abaixo.forEach((el) => {
          el.removeAttribute("data-pre");
          io.unobserve(el);
        });
      }, 3000);
      limpar.push(() => {
        window.clearTimeout(rede);
        io.disconnect();
      });
    }

    /* --- 3. o progresso do primeiro ecrã -------------------------------- */
    // Vive na raiz do documento para o hero e o capítulo seguinte lerem o
    // mesmo número: a saída de um e a chegada do outro são o mesmo gesto.
    if (!reduz.matches) {
      const raiz = document.documentElement;
      let raf = 0;
      let pendente = false;
      const medir = () => {
        pendente = false;
        const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
        raiz.style.setProperty("--foco", p.toFixed(4));
      };
      const agendar = () => {
        if (pendente) return;
        pendente = true;
        raf = requestAnimationFrame(medir);
      };
      medir();
      window.addEventListener("scroll", agendar, { passive: true });
      window.addEventListener("resize", agendar);
      limpar.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", agendar);
        window.removeEventListener("resize", agendar);
        raiz.style.removeProperty("--foco");
      });
    }

    return () => limpar.forEach((c) => c());
  }, []);

  return null;
}
