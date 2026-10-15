"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * Cena de projetos.
 *
 * Segue as notas da Joana no Figma e o mecanismo do gravity-design.de:
 *
 *  - A secção é mais alta do que o ecrã e o seu interior é sticky, por isso
 *    percorre-se a cena em vez de ela passar. É o que o site de referência faz
 *    com camadas fixas sobre um canvas sticky.
 *  - Os cartões gravitam à volta de um centro, uns à frente e outros atrás
 *    ("como se estivessem sempre em movimento, a gravitar"), e podem ser
 *    rodados com o rato ou o dedo ("mas pode-se rodar" / "drag to orbit").
 *  - Clicar num projeto: cresce e desloca-se para o centro enquanto o fundo
 *    escurece. Volta a clicar, ou Escape, e regressa à composição.
 *  - Informação reduzida: título e tipo de trabalho, como ela pediu.
 *
 * Tudo é interpolado num único ciclo de requestAnimationFrame, em vez de
 * transições CSS, para o arrasto e a selecção não lutarem um com o outro.
 *
 * Com prefers-reduced-motion não há órbita nem arrasto: os cartões ficam numa
 * grelha estática e continuam clicáveis, porque isso é navegação e não enfeite.
 */

export type Peca = {
  id: string;
  titulo: string;
  tipo: string;
  src: string;
  w: number;
  h: number;
};

type Estado = { x: number; y: number; s: number; o: number };

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const QUERY = "(prefers-reduced-motion: reduce)";

/** A preferência de movimento é estado externo ao React: subscreve-se. */
function useMovimentoReduzido() {
  return useSyncExternalStore(
    (notificar) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", notificar);
      return () => mq.removeEventListener("change", notificar);
    },
    () => window.matchMedia(QUERY).matches,
    () => false // no servidor não há preferência; assume-se movimento
  );
}

export default function Orbita({ pecas }: { pecas: Peca[] }) {
  const palco = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activo, setActivo] = useState<number | null>(null);
  const activoRef = useRef<number | null>(null);
  const reduz = useMovimentoReduzido();

  // O ciclo de animação lê o projeto aberto sem depender de um novo render.
  useEffect(() => {
    activoRef.current = activo;
  }, [activo]);

  const fechar = useCallback(() => setActivo(null), []);

  /* Escape fecha o projeto aberto. */
  useEffect(() => {
    if (activo === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activo, fechar]);

  /* ---------------------------------------------------- a órbita em si --- */
  useEffect(() => {
    if (reduz) return;
    const cena = palco.current;
    if (!cena) return;

    const n = pecas.length;
    let theta = 0; // onde a órbita está
    let alvoArrasto = 0; // o que o arrasto pediu
    let arrastando = false;
    let xInicio = 0;
    let thetaInicio = 0;
    let raf = 0;
    let visivel = true;
    let ultimo = performance.now();

    const estados: Estado[] = pecas.map(() => ({ x: 0, y: 0, s: 1, o: 1 }));
    let iniciado = false;

    const passo = (agora: number) => {
      const dt = Math.min((agora - ultimo) / 1000, 0.05);
      ultimo = agora;

      const r = cena.getBoundingClientRect();
      // Quanto da cena já foi percorrido: soma à rotação, para descer a página
      // fazer a órbita avançar.
      const progresso = Math.min(
        Math.max(-r.top / Math.max(r.height - window.innerHeight, 1), 0),
        1
      );

      if (!arrastando) theta += dt * 0.055; // gravita sempre, devagar
      const alvo = theta + alvoArrasto + progresso * 1.15;

      const sel = activoRef.current;
      const cx = r.width / 2;
      const cy = r.height * 0.54;
      const rx = r.width * (r.width < 760 ? 0.3 : 0.33);
      const ry = r.height * (r.width < 760 ? 0.21 : 0.24);

      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + alvo;
        const prof = (Math.sin(a) + 1) / 2; // 0 atrás, 1 à frente
        let tx = cx + Math.cos(a) * rx;
        let ty = cy + Math.sin(a) * ry * 0.55;
        let ts = 0.58 + prof * 0.42;
        let to = 0.82 + prof * 0.18;

        if (sel !== null) {
          if (sel === i) {
            tx = cx;
            ty = r.height * 0.5;
            const el = refs.current[i];
            const alturaAlvo = r.height * 0.56;
            ts = el ? alturaAlvo / Math.max(el.offsetHeight, 1) : 1.6;
            to = 1;
          } else {
            to = 0.1;
            ts *= 0.82;
          }
        }

        const e = estados[i];
        const k = iniciado ? 1 - Math.pow(0.0001, dt) : 1; // suave, e exacto à entrada
        e.x = lerp(e.x, tx, k);
        e.y = lerp(e.y, ty, k);
        e.s = lerp(e.s, ts, k);
        e.o = lerp(e.o, to, k);

        const el = refs.current[i];
        if (el) {
          el.style.transform = `translate3d(${e.x - el.offsetWidth / 2}px, ${
            e.y - el.offsetHeight / 2
          }px, 0) scale(${e.s.toFixed(3)})`;
          el.style.opacity = e.o.toFixed(3);
          el.style.zIndex = String(sel === i ? 50 : Math.round(prof * 20));
        }
      }
      iniciado = true;
      raf = requestAnimationFrame(passo);
    };

    const arrancar = () => {
      if (!raf && visivel) {
        ultimo = performance.now();
        raf = requestAnimationFrame(passo);
      }
    };
    const parar = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    /* arrastar para rodar */
    const aoPremir = (e: PointerEvent) => {
      if (activoRef.current !== null) return;
      arrastando = true;
      xInicio = e.clientX;
      thetaInicio = alvoArrasto;
      cena.dataset.arrastando = "";
    };
    const aoMover = (e: PointerEvent) => {
      if (!arrastando) return;
      const d = (e.clientX - xInicio) / Math.max(cena.clientWidth, 1);
      alvoArrasto = thetaInicio + d * TAU * 0.6;
    };
    const aoLargar = () => {
      arrastando = false;
      delete cena.dataset.arrastando;
    };

    cena.addEventListener("pointerdown", aoPremir);
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerup", aoLargar);
    window.addEventListener("pointercancel", aoLargar);

    const olho = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (visivel) arrancar();
        else parar();
      },
      { rootMargin: "10% 0px" }
    );
    olho.observe(cena);
    arrancar();

    return () => {
      parar();
      olho.disconnect();
      cena.removeEventListener("pointerdown", aoPremir);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoLargar);
      window.removeEventListener("pointercancel", aoLargar);
    };
  }, [pecas, reduz]);

  const seleccionada = activo === null ? null : pecas[activo];

  return (
    <section
      id="projetos"
      className={reduz ? "relative bg-mauve" : "relative h-[280vh] bg-mauve"}
    >
      <div
        ref={palco}
        className={
          reduz
            ? "relative overflow-hidden"
            : "sticky top-0 h-dvh overflow-hidden"
        }
        style={reduz ? undefined : { touchAction: "pan-y" }}
      >
        {/* Fundo: a própria composição desfocada, para manter cor e textura. */}
        <Image
          src="/home/projetos/fundo-cena.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Escurece quando um projeto está aberto, como na nota dela. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-[5] bg-[#2b2328] transition-opacity duration-700"
          style={{ opacity: activo === null ? 0 : 0.55 }}
        />

        <h2
          className={`pointer-events-none absolute left-[clamp(1.25rem,6.8vw,7.5rem)] top-[clamp(2rem,8.4vw,9rem)] z-40 max-w-[min(90vw,38rem)] font-serif text-[clamp(2.25rem,8.09vw,8.4rem)] leading-[0.95] text-paper transition-opacity duration-500 ${
            activo === null ? "opacity-100" : "opacity-0"
          }`}
        >
          Há coisas que <em>faço</em>.
        </h2>

        {/* Os cartões. Em repouso ficam numa grelha legível; a órbita só
            reposiciona quando há movimento permitido. */}
        <ul
          className={
            reduz
              ? "relative grid grid-cols-2 gap-4 px-[clamp(1.25rem,6.8vw,7.5rem)] pb-[clamp(2.5rem,6vw,6rem)] pt-[clamp(10rem,22vw,20rem)] sm:grid-cols-3"
              : "absolute inset-0"
          }
        >
          {pecas.map((p, i) => (
            <li key={p.id} className={reduz ? "" : "contents"}>
              <button
                type="button"
                ref={(el) => {
                  refs.current[i] = el;
                }}
                onClick={() => setActivo(activo === i ? null : i)}
                aria-pressed={activo === i}
                className={
                  reduz
                    ? "block w-full text-left"
                    : "absolute left-0 top-0 block w-[clamp(9rem,22vw,26rem)] origin-center will-change-transform"
                }
              >
                <Image
                  src={p.src}
                  alt={`${p.titulo} — ${p.tipo}`}
                  width={p.w}
                  height={p.h}
                  sizes="(max-width: 760px) 45vw, 20vw"
                  draggable={false}
                  className="h-auto w-full select-none shadow-[0_1.5rem_3rem_-1rem_rgba(43,35,40,0.45)]"
                />
              </button>
            </li>
          ))}
        </ul>

        {/* O anel central: no desenho é "explorar projetos"; aqui diz também
            que a composição se arrasta, que é o que o gravity faz. */}
        {!reduz && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 top-[54%] z-30 flex aspect-square w-[clamp(6rem,11vw,10rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-paper/70 text-center font-sans text-[clamp(0.5rem,0.62vw,0.7rem)] font-semibold uppercase leading-[1.5] tracking-[0.18em] text-paper transition-opacity duration-500 ${
              activo === null ? "opacity-95" : "opacity-0"
            }`}
          >
            <span>Explorar</span>
            <span>projetos</span>
          </div>
        )}

        {/* Legenda do projeto aberto: título e tipo, nada mais. */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-6 pb-[clamp(1.5rem,4vw,4rem)] text-center transition-opacity duration-500 ${
            seleccionada ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-serif text-[clamp(1.5rem,3.6vw,3.75rem)] leading-tight text-paper">
            {seleccionada?.titulo ?? " "}
          </p>
          <p className="font-sans text-[clamp(0.5625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] text-paper/75">
            {seleccionada?.tipo ?? " "}
          </p>
        </div>

        {/* Fechar: cobre a cena por trás do cartão aberto. */}
        {activo !== null && (
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar projeto"
            className="absolute inset-0 z-[45] cursor-zoom-out"
          />
        )}
      </div>
    </section>
  );
}
