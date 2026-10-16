import type { Metadata, Viewport } from "next";
import {
  EB_Garamond,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import Cursor from "@/components/cursor";
import { SITIO } from "@/lib/sitio";

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

const TITULO = "Joana Domingues Design — Comunicação, investigação e escrita";
const DESCRICAO =
  "Design de comunicação, investigação e escrita. Mais de 14 anos a construir identidades e a comunicar marcas. O novo site está a chegar.";

export const metadata: Metadata = {
  // Base dos endereços absolutos: sem isto, a imagem de partilha e o canónico
  // saem relativos e nenhuma rede os consegue ir buscar.
  metadataBase: new URL(SITIO),
  title: TITULO,
  description: DESCRICAO,
  applicationName: "Joana Domingues Design",
  authors: [{ name: "Joana Domingues" }],
  creator: "Joana Domingues",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "/",
    siteName: "Joana Domingues Design",
    title: TITULO,
    description: DESCRICAO,
  },
  // A imagem em si é o ficheiro opengraph-image.jpg que está ao lado deste:
  // o Next encontra-o sozinho e escreve as etiquetas, incluindo as medidas.
  // Sem `twitter:image` próprio, o X usa a do Open Graph.
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
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
      <body className="min-h-full">
        {children}
        <Cursor />
      </body>
    </html>
  );
}
