import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./article.css";
import "./article-code.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Matomo } from "@/components/analytics/matomo";
import { JsonLd } from "@/components/json-ld";
import {
  AUTHOR_NAME,
  PUBLICATION_NAME,
  RSS_ALTERNATE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

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

// Only the weights/styles actually used in the UI and prose are declared.
// Remaining weights (100/200/800/900 and extra italics) fall back to the
// closest declared weight instead of shipping as separate font payloads.
const helveticaNeue = localFont({
  variable: "--font-helvetica-neue",
  display: "swap",
  src: [
    { path: "../fonts/HelveticaNeueLight.woff2", weight: "300", style: "normal" },
    { path: "../fonts/HelveticaNeueRoman.woff2", weight: "400", style: "normal" },
    { path: "../fonts/HelveticaNeueItalic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/HelveticaNeueMedium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/HelveticaNeueBold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: PUBLICATION_NAME,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [RSS_ALTERNATE],
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  knowsAbout: [
    "AI systems",
    "software engineering",
    "leadership",
    "entrepreneurship",
    "boxing",
    "acting",
  ],
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
          <Matomo />
          <JsonLd data={personJsonLd} />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="main-content" className="mx-auto min-h-[70vh] max-w-[1100px] px-4 py-10">
            {children}
          </div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
