import { Anton, Fraunces, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

// One accent face per room, plus a hand for Life's margin notes. The shared
// frame stays in Helvetica Neue, which the root layout already loads as
// --font-helvetica-neue.

const plexMono = IBM_Plex_Mono({
  variable: "--ml-font-engineering",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const anton = Anton({
  variable: "--ml-font-ring",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--ml-font-screen",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--ml-font-life",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

// Self-hosted: Google intermittently serves Caveat from extensionless
// `/l/font?kit=` URLs, which breaks next/font/google in both build and dev.
const caveat = localFont({
  variable: "--ml-font-hand",
  src: "../../fonts/Caveat-Variable-latin.woff2",
  weight: "400 700",
  display: "swap",
});

export const roomFontVariables = [
  plexMono.variable,
  anton.variable,
  instrumentSerif.variable,
  fraunces.variable,
  caveat.variable,
].join(" ");
