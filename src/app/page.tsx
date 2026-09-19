import LiquidBackground from "@/components/liquid-background";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-brand-base">
      {/* Gradiente estático: base do design e fallback caso não haja WebGL. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, #b4abfd 0%, #9184f8 38%, #7f6ef4 62%, #6a5cef 100%)",
        }}
      />
      <LiquidBackground />

      <div className="relative flex min-h-dvh w-full flex-col justify-between pb-[9vh] pt-[2vh]">
        <h1 className="sr-only">Joana Domingues — Design Studio</h1>

        <p
          aria-hidden="true"
          className="-ml-[0.015em] select-none text-[length:var(--headline)] font-bold uppercase leading-[0.84] tracking-[-0.025em] text-white/35 [--headline:18.8vw] sm:[--headline:15.6vw]"
        >
          Website
          <br />
          In
          <br className="sm:hidden" /> Progress
        </p>

        <div className="flex flex-col items-end pr-6 text-right sm:pr-[14%] lg:pr-[30%]">
          <p className="text-[clamp(1.5rem,3.7vw,2.75rem)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white">
            Joana
            <br />
            Domingues
          </p>
          <p
            aria-hidden="true"
            className="mt-1 select-none text-[clamp(1.5rem,3.7vw,2.75rem)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white/30"
          >
            Design
            <br />
            Studio
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 pl-[7%] pr-6 text-[clamp(0.625rem,1.05vw,0.8125rem)] font-bold uppercase tracking-[0.08em] text-white sm:pr-[14%] lg:pr-[30%]">
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
