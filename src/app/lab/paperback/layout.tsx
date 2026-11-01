import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./paperback.css";
import { CaseStudyPill } from "@/components/lab/paperback/case-study-pill";
import { ShellChrome } from "@/components/lab/paperback/shell-chrome";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: {
    default: "The Paperback — Thoughts of a Mastermind in Pajamas",
    template: "%s — The Paperback",
  },
  description:
    "A case study for marcuyyy.com: Thoughts of a Mastermind in Pajamas set as a well-made paperback, with a title page, a contents page, and chapters set for reading.",
  robots: { index: false, follow: false },
};

/**
 * The Paperback's shell. Fixed to the viewport at z-150 so it fully covers the
 * global site header, container, and footer, and scrolls independently.
 */
export default function PaperbackLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id="pb-shell" className={`pb-root ${newsreader.variable}`}>
      <ShellChrome />
      <div id="pb-scroll" className="pb-scroll">
        {children}
      </div>
      <div className="pb-case-strip">
        <CaseStudyPill />
      </div>
    </div>
  );
}
