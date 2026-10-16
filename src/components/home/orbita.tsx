"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import TiraProjetos from "./tira-projetos";

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
  /** Página do projeto. Com ela, o cartão aberto leva lá. */
  href?: string;
  /** As imagens do projeto, para a passagem automática dentro da peça. */
  imagens?: string[];
};

type Estado = { x: number; y: number; z: number; s: number; o: number; b: number };

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
  const moldura = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const guias = useRef<(HTMLSpanElement | null)[]>([]);
  // Um arrasto acaba num `pointerup` que o browser também conta como clique.
  // Sem isto, rodar a composição abria -- e agora navegava -- um projeto.
  const arrastou = useRef(false);
  const router = useRouter();
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
    const quadro = moldura.current;
    if (!cena || !quadro) return;

    const n = pecas.length;
    let theta = 0; // onde a órbita está
    let alvoArrasto = 0; // o que o arrasto pediu
    let arrastando = false;
    let xInicio = 0;
    let thetaInicio = 0;
    let raf = 0;
    let visivel = true;
    let ultimo = performance.now();

    const estados: Estado[] = pecas.map(() => ({ x: 0, y: 0, z: 0, s: 1, o: 0, b: 0 }));
    let iniciado = false;
    // A captura: quando a cena entra no ecrã pela primeira vez, as peças vêm
    // de fora e espiralam para a órbita. Medi isto no gravity-design.de, que é
    // o exemplo que a Joana deu: lá os corpos entram a 447 e 526px do centro,
    // o raio cai para 94 e 132 em 2,2 segundos, e as linhas de trajetória
    // estão desenhadas só enquanto eles ainda andam -- apagam-se quando
    // assentam. A diferença é o fim: lá tudo pára aos 7 segundos, aqui
    // continua a gravitar, porque a nota dela diz "sempre em movimento".
    let tEntrada = 0;
    const DUR_ENTRADA = 2400;

    const passo = (agora: number) => {
      const dt = Math.min((agora - ultimo) / 1000, 0.05);
      ultimo = agora;

      const r = cena.getBoundingClientRect();
      // O progresso mede-se na MOLDURA, não no palco: o palco é sticky, o seu
      // top fica colado a zero enquanto está fixo, e media sempre progresso 0.
      const q = quadro.getBoundingClientRect();
      const progresso = Math.min(
        Math.max(-q.top / Math.max(q.height - window.innerHeight, 1), 0),
        1
      );

      // Quanto da captura já passou, de 0 a 1, com travagem no fim.
      const bruto = tEntrada === 0 ? 0 : Math.min((agora - tEntrada) / DUR_ENTRADA, 1);
      const ent = 1 - Math.pow(1 - bruto, 2.4);
      const fora = Math.pow(1 - ent, 1.7); // 1 no início da entrada, 0 no fim

      // Gravita sempre, e o scroll faz a composição dar quase duas voltas ao
      // longo do capítulo. Antes eram 1.15 rad no total -- 66 graus, menos de
      // um passo de cartão, e por isso não se via andar. Durante a captura
      // roda muito mais depressa, como no exemplo, e vai travando.
      if (!arrastando) theta += dt * (0.13 + 3.4 * fora);
      const alvo = theta + alvoArrasto + progresso * TAU * 1.75;

      const sel = activoRef.current;
      const cx = r.width / 2;
      const cy = r.height * 0.54;
      // Carrossel em 3D: os cartões andam num círculo no plano XZ e a
      // perspectiva do palco trata do tamanho. É o que o site de referência
      // faz -- perspective no palco, matrix3d em cada cartão -- em vez de
      // fingir profundidade com escala.
      const raio = r.width * (r.width < 760 ? 0.34 : 0.4);
      const persp = r.width * 1.26;

      // Durante a captura as peças chegam de longe: afastadas no eixo Z, e por
      // isso pequenas e desfocadas, e um pouco mais abertas em X. Afastar em
      // vez de aproximar é deliberado -- vindas para a frente passariam pelo
      // plano da câmara e explodiam no ecrã. E chegam fora de foco, que é a
      // linguagem das fotografias dela.
      const recuo = raio * 2.4 * fora;
      const abertura = 1 + 0.9 * fora;

      // As linhas de trajetória. No exemplo são círculos no plano do ecrã, não
      // deitados no plano da órbita: tentei deitados e ficam quase de perfil,
      // uma linha invisível. Assim lêem-se como anéis à volta da composição,
      // que é o que lá se vê. Desenham a órbita de destino -- é para lá que as
      // peças vão -- e apagam-se quando elas assentam.
      const opGuia = Math.pow(1 - ent, 0.85) * 0.5;
      for (let k = 0; k < 2; k++) {
        const g = guias.current[k];
        if (!g) continue;
        if (opGuia < 0.004) {
          if (g.style.opacity !== "0") g.style.opacity = "0";
          continue;
        }
        const rg = raio * (k === 0 ? 0.52 : 0.74) * (1 + 0.5 * fora);
        g.style.width = `${(rg * 2).toFixed(0)}px`;
        g.style.height = `${(rg * 2).toFixed(0)}px`;
        g.style.transform =
          `translate3d(${(cx - rg).toFixed(1)}px, ${(cy - rg).toFixed(1)}px, 0)`;
        g.style.opacity = opGuia.toFixed(3);
      }

      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + alvo;
        let tx = cx + Math.cos(a) * raio * abertura;
        let tz = Math.sin(a) * raio - recuo;
        let ty = cy + Math.sin(a * 2) * r.height * 0.045;
        let to = Math.min(ent * 1.7, 1);
        // Desfoque por profundidade. Travado aos 9px: durante a captura o
        // recuo levava isto a 15 e as peças chegavam como manchas.
        let tb = Math.min(Math.max(0, -tz / raio) * 4.5, 9);
        let ts = 1;

        if (sel !== null) {
          if (sel === i) {
            tx = cx;
            ty = r.height * 0.5;
            tz = 0;
            tb = 0;
            const el = refs.current[i];
            ts = el ? (r.height * 0.56) / Math.max(el.offsetHeight, 1) : 1.6;
          } else {
            to = 0.12;
            tb = 6;
            tz = Math.min(tz, -raio * 0.5);
          }
        }

        const e = estados[i];
        const k = iniciado ? 1 - Math.pow(0.0001, dt) : 1;
        e.x = lerp(e.x, tx, k);
        e.y = lerp(e.y, ty, k);
        e.z = lerp(e.z, tz, k);
        e.s = lerp(e.s, ts, k);
        e.o = lerp(e.o, to, k);
        e.b = lerp(e.b, tb, k);

        const el = refs.current[i];
        if (el) {
          el.style.transform =
            `translate3d(${(e.x - el.offsetWidth / 2).toFixed(1)}px, ` +
            `${(e.y - el.offsetHeight / 2).toFixed(1)}px, ${e.z.toFixed(1)}px)` +
            (sel === i ? ` scale(${e.s.toFixed(3)})` : "");
          el.style.opacity = e.o.toFixed(3);
          el.style.filter = e.b > 0.15 ? `blur(${e.b.toFixed(2)}px)` : "";
          el.style.zIndex = String(sel === i ? 50 : Math.round(20 + e.z / 40));
        }
      }
      // A perspectiva vive no palco, como na referência.
      cena.style.perspective = `${persp.toFixed(0)}px`;
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
      arrastou.current = false;
      xInicio = e.clientX;
      thetaInicio = alvoArrasto;
      cena.dataset.arrastando = "";
    };
    const aoMover = (e: PointerEvent) => {
      if (!arrastando) return;
      const d = (e.clientX - xInicio) / Math.max(cena.clientWidth, 1);
      if (Math.abs(e.clientX - xInicio) > 6) arrastou.current = true;
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
        if (visivel) {
          if (tEntrada === 0) tEntrada = performance.now();
          arrancar();
        } else parar();
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
      ref={moldura}
      id="projetos"
      className={
        reduz
          ? "relative z-10 bg-mauve"
          : "relative z-10 bg-mauve md:h-[300vh]"
      }
    >
      {/* Telemóvel: a tira que se arrasta de lado, como a Joana mostrou. A
          órbita em três dimensões é para ecrã grande -- num telemóvel não há
          rato para a rodar nem espaço para a profundidade se ler. */}
      <div className="relative isolate overflow-hidden py-[clamp(3rem,12vw,6rem)] md:hidden">
        <Image
          src="/home/projetos/fundo-cena.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <h2 className="mb-[clamp(1.75rem,7vw,3rem)] max-w-[11ch] px-[22px] font-serif text-[clamp(2.25rem,11vw,3.5rem)] leading-[0.95] text-paper">
          Há coisas que <em>faço</em>.
        </h2>
        <TiraProjetos pecas={pecas} />
      </div>

      <div
        ref={palco}
        className={
          reduz
            ? "relative hidden overflow-hidden md:block"
            : "hidden md:sticky md:top-0 md:block md:h-dvh md:overflow-hidden"
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

        {/* As linhas de trajetória da captura. São círculos deitados no plano
            da órbita -- `rotateX(90deg)` dentro do palco, que já tem a
            perspectiva --, por isso vêem-se como elipses sem ter de calcular
            nenhuma. Filhas directas do palco: a perspectiva só se aplica aos
            filhos directos. */}
        {!reduz &&
          [0, 1].map((k) => (
            <span
              key={k}
              aria-hidden="true"
              ref={(el) => {
                guias.current[k] = el;
              }}
              className="pointer-events-none absolute left-0 top-0 z-0 rounded-full border border-paper opacity-0"
            />
          ))}

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
                onClick={() => {
                  // Rodar a composição também dispara clique: ignora-se.
                  if (arrastou.current) return;
                  // Primeiro clique abre; com a peça já aberta, o clique leva
                  // para a página do projeto, que foi o que a Joana pediu.
                  // Para voltar à composição há o fundo, o Escape e o "fechar"
                  // da legenda.
                  if (activo === i && p.href) router.push(p.href);
                  else setActivo(activo === i ? null : i);
                }}
                aria-label={
                  activo === i && p.href
                    ? `Ver o projeto ${p.titulo}`
                    : `Abrir ${p.titulo}`
                }
                className={
                  reduz
                    ? "block w-full text-left"
                    : `absolute left-0 top-0 block w-[clamp(9rem,22vw,26rem)] origin-center will-change-transform ${
                        activo === i && p.href ? "cursor-pointer" : ""
                      }`
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

          {/* A legenda em si não apanha o rato -- senão tapava a cena --, por
              isso só estas duas coisas é que o apanham. O "ver o projeto" é
              uma ligação a sério: abre em separador novo, copia-se, indexa-se.
              O "fechar" existe porque o clique no cartão deixou de fechar. */}
          <div
            className={`mt-[clamp(0.5rem,1.4vw,1.4rem)] flex flex-wrap items-center justify-center gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-2 ${
              seleccionada ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {seleccionada?.href && (
              <Link
                href={seleccionada.href}
                className="flex items-center gap-3 border-b border-paper pb-0.5 font-sans text-[clamp(0.5625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-70"
              >
                Ver o projeto
                <span aria-hidden="true" className="inline-block -rotate-45">
                  →
                </span>
              </Link>
            )}
            {seleccionada && (
              <button
                type="button"
                onClick={fechar}
                className="font-sans text-[clamp(0.5625rem,0.84vw,1rem)] font-semibold uppercase tracking-[0.18em] text-paper/70 transition-opacity hover:opacity-100"
              >
                Fechar
              </button>
            )}
          </div>
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
