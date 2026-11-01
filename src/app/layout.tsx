import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./article-code.css";
import "@/components/house/styles/base.css";
import "@/components/house/styles/chrome.css";
import "@/components/house/styles/transitions.css";
import "@/components/house/styles/home.css";
import "@/components/house/styles/prose.css";
import "@/components/house/styles/engineering.css";
import "@/components/house/styles/ring.css";
import "@/components/house/styles/screen.css";
import "@/components/house/styles/life.css";
import "@/components/house/styles/house.css";
import "@/components/house/styles/pages.css";
import { Matomo } from "@/components/analytics/matomo";
import { JsonLd } from "@/components/json-ld";
import { ShellFooter, ShellNav, ShellOverlays } from "@/components/house/chrome";
import { roomFontVariables } from "@/components/house/fonts";
import { primaryRoom, type RoomId } from "@/components/house/rooms";
import { ManyLivesShell } from "@/components/house/shell";
import { getAllPostsMeta } from "@/lib/posts";
import {
  AUTHOR_NAME,
  PUBLICATION_NAME,
  RSS_ALTERNATE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

// The shared frame is set in Helvetica Neue; each room adds its own accent
// face (see components/house/fonts.ts). Only the weights in use are declared.
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
  // Essays take their room from frontmatter; the shell needs the map to theme
  // /blog/[slug] before the page renders.
  const slugRooms: Record<string, RoomId> = Object.fromEntries(
    getAllPostsMeta().map((post) => [post.slug, primaryRoom(post)])
  );

  return (
    <html lang="en">
      <body className={`${helveticaNeue.variable} ${roomFontVariables} antialiased`}>
        <Matomo />
        <JsonLd data={personJsonLd} />
        <ManyLivesShell slugRooms={slugRooms}>
          <a href="#main-content" className="ml-skip">
            Skip to content
          </a>
          <ShellOverlays />
          <ShellNav />
          <div id="main-content" className="ml-stage">
            {children}
          </div>
          <ShellFooter />
        </ManyLivesShell>
      </body>
    </html>
  );
}
