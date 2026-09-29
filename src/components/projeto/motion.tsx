"use client";

import { useEffect } from "react";

/**
 * Movimento da página de projeto.
 *
 * Não desenha nada: acrescenta comportamento à marcação que o servidor já
 * enviou, através de atributos `data-*`. Assim a página continua a ler-se
 * inteira sem JavaScript, e o que este módulo faz é só ritmo.
 *
 * Três coisas, e não mais: a metade serifada do título chega um tempo depois
 * da grotesca, a capa líquida dissolve-se ao entrar na primeira faixa, e a
 * faixa das peças anda na horizontal enquanto se desce. Em telemóvel, ou com
 * `prefers-reduced-motion`, a faixa é arrastável com o dedo e nada anima.
 */
export default function CaseMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups: (() => void)[] = [];

    /* --- 1. a metade serifada chega um tempo depois --------------------- */
    const splits = Array.from(
      document.querySelectorAll<HTMLElement>("[data-split]")
    );
    if (!reduce.matches && "IntersectionObserver" in window) {
      const abaixo = splits.filter(
        (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92
      );
      abaixo.forEach((el) => el.setAttribute("data-pre", ""));
      const io = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (e.isIntersecting) {
              e.target.removeAttribute("data-pre");
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px" }
      );
      abaixo.forEach((el) => io.observe(el));
      // Rede de segurança: se o observador não disparar -- miniatura, leitor
      // que não faz scroll -- ninguém fica com meia frase. A frase ganha
      // sempre ao efeito.
      const rede = window.setTimeout(() => {
        abaixo.forEach((el) => {
          el.removeAttribute("data-pre");
          io.unobserve(el);
        });
      }, 3000);
      cleanups.push(() => {
        window.clearTimeout(rede);
        io.disconnect();
      });
    }

    /* --- 2. a capa dissolve-se; 3. a faixa anda na horizontal ----------- */
    const capa = document.querySelector<HTMLElement>("[data-cover]");
    const véu = document.querySelector<HTMLElement>("[data-cover-veil]");
    const faixa = document.querySelector<HTMLElement>("[data-lat]");
    const carril = document.querySelector<HTMLElement>("[data-lat-track]");

    let lateralAtiva = false;
    const prepararFaixa = () => {
      if (!faixa || !carril) return;
      const querer = window.innerWidth >= 980 && !reduce.matches;
      if (querer === lateralAtiva) return;
      lateralAtiva = querer;
      if (querer) {
        faixa.setAttribute("data-lat-jack", "");
        // medir depois de a classe entrar, senão as molduras ainda têm a
        // largura antiga
        const excesso = Math.max(carril.scrollWidth - window.innerWidth, 0);
        faixa.style.height = `${window.innerHeight + excesso * 1.05}px`;
      } else {
        faixa.removeAttribute("data-lat-jack");
        faixa.style.height = "";
        carril.style.transform = "";
      }
    };

    const mover = () => {
      if (véu && capa) {
        const altura = capa.offsetHeight || 1;
        const p = Math.min(Math.max(window.scrollY / altura, 0), 1);
        véu.style.opacity = String(1 - p * 0.92);
      }
      if (lateralAtiva && faixa && carril) {
        const total = faixa.offsetHeight - window.innerHeight;
        if (total > 0) {
          const p = Math.min(Math.max(-faixa.getBoundingClientRect().top / total, 0), 1);
          const excesso = Math.max(carril.scrollWidth - window.innerWidth, 0);
          carril.style.transform = `translate3d(${-p * excesso}px,0,0)`;
        }
      }
    };

    let agendado = false;
    const aoScroll = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        mover();
      });
    };
    const aoRedimensionar = () => {
      prepararFaixa();
      mover();
    };

    window.addEventListener("scroll", aoScroll, { passive: true });
    window.addEventListener("resize", aoRedimensionar);
    cleanups.push(() => {
      window.removeEventListener("scroll", aoScroll);
      window.removeEventListener("resize", aoRedimensionar);
    });
    prepararFaixa();
    mover();

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
