import LiquidBackground from "@/components/liquid-background";

/**
 * Página temporária do estúdio.
 *
 * As medidas vêm do ficheiro do Figma, numa moldura de 1851 x 1072:
 *   headline  282px / entrelinha 219px / espacejamento -2.8px  -> 15.23vw
 *   nome       60px / entrelinha  57px / espacejamento  +2px
 *   estúdio    60px / entrelinha  50px / espacejamento -2.8px
 * O "in" e o "studio" têm opacidade própria (spans no ficheiro original).
 */
export default function Home() {
  return (
    <main className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-brand-base">
      {/* Gradiente estático: base do design e fallback caso não haja WebGL. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, #a7a5e6 0%, #928ff4 38%, #857ef9 62%, #786bff 100%)",
        }}
      />
      <LiquidBackground />

      <div className="relative flex min-h-dvh w-full flex-col justify-between pb-[11vh] pt-[2vh]">
        <h1 className="sr-only">Joana Domingues — Design Studio</h1>

        <p
          aria-hidden="true"
          className="select-none text-[length:var(--headline)] font-bold uppercase leading-[0.7766] tracking-[-0.0099em] text-white/40 [--headline:18.8vw] sm:[--headline:15.23vw]"
        >
          Website
          <br />
          <span className="text-white/80">In</span>
          <br className="sm:hidden" /> Progress
        </p>

        <div className="flex flex-col items-end pr-6 text-right sm:pr-[14%] lg:pr-[30.6%]">
          <p className="text-[clamp(1.75rem,3.24vw,3.75rem)] font-bold uppercase leading-[0.95] tracking-[0.0333em] text-brand-ink">
            Joana
            <br />
            Domingues
          </p>
          <p
            aria-hidden="true"
            className="mt-[0.8vw] select-none text-[clamp(1.75rem,3.24vw,3.75rem)] font-bold uppercase leading-[0.8333] tracking-[-0.0467em] text-white/[0.22]"
          >
            Design
            <br />
            <span className="text-white/[0.35]">Studio</span>
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 pl-[7.2%] pr-6 text-[clamp(0.6875rem,1.62vw,1.875rem)] font-bold uppercase tracking-[0.02em] text-brand-ink sm:pr-[14%] lg:pr-[30.9%]">
          <p>Brevemente</p>
          <a
            href="mailto:jcm@linear.com.pt"
            className="transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            jcm@linear.com.pt
          </a>
        </div>
      </div>
    </main>
  );
}
