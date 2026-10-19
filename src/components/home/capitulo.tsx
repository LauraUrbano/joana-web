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
 * No telemóvel há capítulos que é melhor não prender de todo: a Joana pediu
 * que a secção dos percursos não fosse aparecendo um tópico de cada vez. Para
 * esses, `soltoNoTelemovel`.
 */
export default function Capitulo({
  id,
  ecras = 3,
  passos = 1,
  soltoNoTelemovel = false,
  className = "",
  children,
}: {
  id?: string;
  /** Altura da moldura, em ecrãs. Mais ecrãs = mais tempo parado em cada passo. */
  ecras?: number;
  /** Quantos estados o capítulo atravessa. */
  passos?: number;
  /** No telemóvel fica em sequência, sem prender e sem revelar por passos. */
  soltoNoTelemovel?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const moldura = useRef<HTMLDivElement>(null);
  const fixo = useRef<HTMLDivElement>(null);
  const reduz = useMovimentoReduzido();
  const [naoCabe, setNaoCabe] = useState(false);
  const naoCabeRef = useRef(false);
  const [telemovel, setTelemovel] = useState(false);
  const solto = reduz || naoCabe || (soltoNoTelemovel && telemovel);

  /* Abaixo do `md` do Tailwind, que é onde o resto da página também troca de
     desenho. Começa em falso para o servidor e o cliente desenharem o mesmo. */
  useEffect(() => {
    if (!soltoNoTelemovel) return;
    const mq = window.matchMedia("(max-width: 47.99rem)");
    const ler = () => setTelemovel(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, [soltoNoTelemovel]);

  /* Cabe na caixa?
     A medida é contra `100svh`, que é a altura que a caixa tem quando está
     presa -- e não contra `innerHeight`. No telemóvel a janela cresce e encolhe
     ao esconder a barra do browser; o `svh` não, e usá-lo evita o capítulo
     ficar a prender e a soltar-se a meio de um scroll.

     Durante a medição o `data-medindo` dá à caixa a geometria de presa, esteja
     ela como estiver (ver o CSS). Assim a resposta é sempre à mesma pergunta,
     e um engano -- medir antes de as letras chegarem, por exemplo -- corrige-se
     na medição seguinte em vez de ficar preso para sempre. */
  useEffect(() => {
    const f = fixo.current;
    if (!f) return;

    const sonda = document.createElement("div");
    sonda.style.cssText =
      "position:absolute;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    document.body.appendChild(sonda);

    let aMedir = false;
    const medir = () => {
      // A própria medição mexe na caixa, e isso acorda o observador: sem esta
      // guarda ficava a medir-se a si mesma.
      if (aMedir) return;
      aMedir = true;
      const svh = sonda.getBoundingClientRect().height || window.innerHeight;
      f.dataset.medindo = "";
      const pede = f.scrollHeight;
      delete f.dataset.medindo;
      aMedir = false;
      const naoCabeAgora = pede > svh + 4;
      if (naoCabeRef.current === naoCabeAgora) return;
      naoCabeRef.current = naoCabeAgora;
      setNaoCabe(naoCabeAgora);
    };

    // Presa, a caixa tem altura fixa: o observador não acorda quando é o
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
