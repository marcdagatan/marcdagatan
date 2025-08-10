import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import StagewiseDevToolbar from "@/components/stagewise-dev-toolbar";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const helveticaNeue = localFont({
  variable: "--font-helvetica-neue",
  display: "swap",
  src: [
    { path: "../fonts/HelveticaNeueThin.otf", weight: "100", style: "normal" },
    { path: "../fonts/HelveticaNeueThinItalic.otf", weight: "100", style: "italic" },
    { path: "../fonts/HelveticaNeueUltraLight.otf", weight: "200", style: "normal" },
    { path: "../fonts/HelveticaNeueUltraLightItalic.otf", weight: "200", style: "italic" },
    { path: "../fonts/HelveticaNeueLight.otf", weight: "300", style: "normal" },
    { path: "../fonts/HelveticaNeueLightItalic.otf", weight: "300", style: "italic" },
    { path: "../fonts/HelveticaNeueRoman.otf", weight: "400", style: "normal" },
    { path: "../fonts/HelveticaNeueItalic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/HelveticaNeueMedium.otf", weight: "500", style: "normal" },
    { path: "../fonts/HelveticaNeueMediumItalic.otf", weight: "500", style: "italic" },
    { path: "../fonts/HelveticaNeueBold.otf", weight: "700", style: "normal" },
    { path: "../fonts/HelveticaNeueBoldItalic.otf", weight: "700", style: "italic" },
    { path: "../fonts/HelveticaNeueHeavy.otf", weight: "800", style: "normal" },
    { path: "../fonts/HelveticaNeueHeavyItalic.otf", weight: "800", style: "italic" },
    { path: "../fonts/HelveticaNeueBlack.otf", weight: "900", style: "normal" },
    { path: "../fonts/HelveticaNeueBlackItalic.otf", weight: "900", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Marc — Blog",
    template: "%s · Marc — Blog",
  },
  description: "Minimal, dark, MDX-powered blog.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${geistMono.variable} ${helveticaNeue.variable} ${helveticaNeue.className} antialiased`}>
        <ThemeProvider>
          <StagewiseDevToolbar />
          <SiteHeader />
          <div className="mx-auto max-w-[1100px] px-4 py-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
