"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
 *
 * E deixa de ser fixo também quando o conteúdo não cabe na caixa. Um bloco
 * fixo tem `overflow: hidden`: o que não cabe não fica escondido à espera de
 * scroll, fica cortado. Medido num telemóvel: o capítulo dos percursos pede
 * 770px e um ecrã de 375x667 só tem 667 -- perdiam-se as últimas linhas. Em
 * vez de escolher um ponto de rutura à mão, o capítulo mede-se a si próprio:
 * resolve-se sozinho em qualquer largura, de lado, e com o corpo de letra
 * aumentado por quem precisa.
 *
 * Solto, o capítulo perderia a revelação dos passos, que é o que lhe dá vida
 * -- e é no telemóvel que a maior parte das pessoas o vai ver. Por isso em
 * vez de nada, revela cada passo quando ele entra no ecrã.
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
  const [naoCabe, setNaoCabe] = useState(false);
  const naoCabeRef = useRef(false);
  const solto = reduz || naoCabe;

  /* Cabe na caixa?
     A medida é contra `100svh`, que é a altura que a caixa tem quando está
     fixa -- e não contra `innerHeight`. No telemóvel a janela cresce e encolhe
     ao esconder a barra do browser; o `svh` não, e usá-lo evita o capítulo
     ficar a prender e a soltar-se a meio de um scroll.

     O estado é um ferrolho: solto, o conteúdo passa a ser outro (os passos
     deixam de estar empilhados um sobre o outro) e medi-lo outra vez daria
     sempre "não cabe". Quando o `svh` muda -- mudar de orientação, rodar o
     tablete -- volta a prender para se poder medir de novo com honestidade. */
  useEffect(() => {
    const f = fixo.current;
    if (!f) return;

    const sonda = document.createElement("div");
    sonda.style.cssText =
      "position:absolute;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    document.body.appendChild(sonda);

    let svhAnterior = -1;
    const aplicar = (v: boolean) => {
      if (naoCabeRef.current === v) return;
      naoCabeRef.current = v;
      setNaoCabe(v);
    };
    const medir = () => {
      const svh = sonda.getBoundingClientRect().height || window.innerHeight;
      if (svh !== svhAnterior) {
        svhAnterior = svh;
        // Volta a prender e remede no retorno do observador, já com a caixa
        // na altura certa.
        if (naoCabeRef.current) return aplicar(false);
      }
      /* O `data-medindo` desliga o deslocamento dos passos que ainda não
         entraram. Sem isso media-se a animação e não o conteúdo: os passos
         por revelar estão 3rem abaixo do lugar, o que dava 49px a mais e
         punha o capítulo a prender e a soltar-se em ciclo. */
      f.dataset.medindo = "";
      const pede = f.scrollHeight;
      delete f.dataset.medindo;
      aplicar(pede > svh + 4);
    };

    // Preso, a caixa tem altura fixa: o observador não acorda quando é o
    // conteúdo que cresce. As letras a chegar são a única coisa que o faz
    // crescer aqui, e isso dá-se uma vez.
    const olho = new ResizeObserver(medir);
    olho.observe(f);
    window.addEventListener("resize", medir);
    document.fonts?.ready.then(medir);
    const tarde = setTimeout(medir, 400);
    return () => {
      olho.disconnect();
      window.removeEventListener("resize", medir);
      clearTimeout(tarde);
      sonda.remove();
    };
  }, []);

  /* Solto: cada passo aparece quando entra no ecrã. A classe só é posta por
     script, para quem não o tenha ver tudo em vez de ver nada. */
  useEffect(() => {
    const f = fixo.current;
    if (!f || !solto) return;
    const alvos = f.querySelectorAll<HTMLElement>("[data-quando],[data-desde]");
    if (!alvos.length) return;
    f.dataset.revela = "";
    const olho = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.visto = "";
          olho.unobserve(e.target);
        }
      },
      // Revela quando já entrou um pedaço do passo, não à primeira aresta.
      { rootMargin: "0px 0px -18% 0px" },
    );
    alvos.forEach((a) => olho.observe(a));
    return () => {
      olho.disconnect();
      delete f.dataset.revela;
      alvos.forEach((a) => delete a.dataset.visto);
    };
  }, [solto]);

  useEffect(() => {
    if (solto) return;
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
  }, [passos, solto]);

  return (
    <div
      ref={moldura}
      id={id}
      className="relative"
      style={solto ? undefined : { height: `${ecras * 100}svh` }}
      data-capitulo
    >
      <div
        ref={fixo}
        data-passo="0"
        data-estatico={solto ? "" : undefined}
        className={
          solto
            ? `relative ${className}`
            : `sticky top-0 h-svh overflow-hidden ${className}`
        }
      >
        {children}
      </div>
    </div>
  );
}
