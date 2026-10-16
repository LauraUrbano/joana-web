import type { Metadata, Viewport } from "next";
import {
  EB_Garamond,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";

// Tipo de letra do design (Figma). É variável: o eixo de peso vai até 700,
// que é o que o "Bold / 900" do ficheiro acaba por desenhar.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

// Par serifado do mesmo desenhador, usado nos contrastes de /home.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Corpo de texto da /home. O ficheiro do Figma usa EB Garamond nos parágrafos
// e no subtítulo do hero, em itálico.
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joana Domingues — Design Studio",
  description:
    "Design de comunicação, investigação e escrita. O site está em construção — brevemente por aqui.",
  openGraph: {
    title: "Joana Domingues — Design Studio",
    description: "Website em construção. Brevemente.",
    type: "website",
    locale: "pt_PT",
  },
};

export const viewport: Viewport = {
  themeColor: "#656545",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
