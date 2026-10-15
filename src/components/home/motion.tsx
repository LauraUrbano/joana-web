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
 *  3. A composição de projetos gravita devagar e pode ser rodada com o rato
 *     ou o dedo: "como se estivessem sempre em movimento, a gravitar, mas
 *     pode-se rodar", com o "drag to orbit" do gravity como exemplo.
 *
 * Com `prefers-reduced-motion` nada disto corre: o scroll fica nativo, os
 * tópicos ficam visíveis e a composição fica parada.
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

    /* --- 3. a composição gravita, e pode ser rodada ---------------------- */
    const orbe = document.querySelector<HTMLElement>("[data-orbit]");
    const plano = document.querySelector<HTMLElement>("[data-orbit-plane]");
    if (orbe && plano && !reduz.matches) {
      const MAX = 7; // graus; mais do que isto e os cantos da foto aparecem
      let alvo = 0; // para onde o arrasto quer levar
      let atual = 0; // onde está, a perseguir o alvo
      let deriva = 0; // o movimento lento de fundo
      let arrastando = false;
      let xInicio = 0;
      let alvoInicio = 0;
      let raf = 0;
      let visivel = true;

      const desenhar = () => {
        if (!arrastando) deriva += 0.00035;
        atual += (alvo - atual) * 0.07;
        const g = atual + Math.sin(deriva) * 1.6;
        plano.style.transform = `rotate(${g.toFixed(3)}deg) scale(1.18)`;
        raf = requestAnimationFrame(desenhar);
      };
      const comecar = () => {
        if (!raf && visivel) raf = requestAnimationFrame(desenhar);
      };
      const parar = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      const aoPremir = (e: PointerEvent) => {
        arrastando = true;
        xInicio = e.clientX;
        alvoInicio = alvo;
        orbe.setPointerCapture(e.pointerId);
        orbe.dataset.dragging = "";
      };
      const aoMover = (e: PointerEvent) => {
        if (!arrastando) return;
        const d = (e.clientX - xInicio) / orbe.clientWidth;
        alvo = Math.max(-MAX, Math.min(MAX, alvoInicio + d * MAX * 2.2));
      };
      const aoLargar = (e: PointerEvent) => {
        if (!arrastando) return;
        arrastando = false;
        delete orbe.dataset.dragging;
        try {
          orbe.releasePointerCapture(e.pointerId);
        } catch {
          /* o ponteiro já pode ter sido libertado */
        }
      };

      orbe.addEventListener("pointerdown", aoPremir);
      orbe.addEventListener("pointermove", aoMover);
      orbe.addEventListener("pointerup", aoLargar);
      orbe.addEventListener("pointercancel", aoLargar);

      // Não gasta bateria quando a composição está fora do ecrã.
      const olho = new IntersectionObserver(
        ([e]) => {
          visivel = e.isIntersecting;
          if (visivel) comecar();
          else parar();
        },
        { rootMargin: "20% 0px" }
      );
      olho.observe(orbe);
      comecar();

      limpar.push(() => {
        parar();
        olho.disconnect();
        orbe.removeEventListener("pointerdown", aoPremir);
        orbe.removeEventListener("pointermove", aoMover);
        orbe.removeEventListener("pointerup", aoLargar);
        orbe.removeEventListener("pointercancel", aoLargar);
      });
    }

    return () => limpar.forEach((c) => c());
  }, []);

  return null;
}
