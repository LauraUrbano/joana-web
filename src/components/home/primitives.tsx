import type { ReactNode } from "react";

/** Etiqueta pequena em maiúsculas que abre várias secções do design. */
export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[0.625rem] font-medium uppercase tracking-[0.18em] opacity-50 ${className}`}
    >
      {children}
    </p>
  );
}

/** Botão em cápsula, escuro por omissão. */
export function Pill({
  children,
  href,
  tone = "dark",
}: {
  children: ReactNode;
  href: string;
  tone?: "dark" | "lilac" | "outline";
}) {
  const tones = {
    dark: "bg-ink text-paper hover:opacity-85",
    lilac: "bg-lilac text-ink hover:opacity-85",
    outline: "border border-current hover:opacity-60",
  } as const;
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] transition-opacity ${tones[tone]}`}
    >
      {children}
    </a>
  );
}

/** Seta "→" usada nas listas e nas chamadas para ação. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`h-[1em] w-[1em] ${className}`}
    >
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Lugar reservado para uma imagem do Figma que ainda não temos em ficheiro.
 * Assim que a imagem chegar, troca-se por <Image /> — o enquadramento fica.
 */
export function ImageSlot({
  label,
  className = "",
  ratio = "3 / 4",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className={`flex items-center justify-center bg-ink/5 text-center text-[0.625rem] uppercase tracking-[0.14em] text-ink/35 ring-1 ring-inset ring-ink/10 ${className}`}
    >
      {label}
    </div>
  );
}
