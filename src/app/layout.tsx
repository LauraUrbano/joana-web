import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

// Tipo de letra do design (Figma). É variável: o eixo de peso vai até 700,
// que é o que o "Bold / 900" do ficheiro acaba por desenhar.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joana Domingues — Design Studio",
  description:
    "Website em construção. Brevemente por aqui. Para já, fale connosco em jcm@linear.com.pt.",
  openGraph: {
    title: "Joana Domingues — Design Studio",
    description: "Website em construção. Brevemente.",
    type: "website",
    locale: "pt_PT",
  },
};

export const viewport: Viewport = {
  themeColor: "#8a84f9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      className={`${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
