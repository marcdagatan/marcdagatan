import type { Metadata } from "next";
import { CV } from "@/lib/cv/cv";
import { CasePill } from "@/components/lab/dossier/case-pill";
import { Colophon } from "@/components/lab/dossier/colophon";
import { formatDotDate } from "@/components/lab/dossier/format";
import { GridOverlay } from "@/components/lab/dossier/grid-overlay";
import { Masthead } from "@/components/lab/dossier/masthead";
import "./dossier.css";

export const metadata: Metadata = {
  title: "The Operator's Dossier",
  robots: { index: false, follow: false },
};

/**
 * Full-viewport shell for case study 1. It sits above the global header,
 * container, and footer so the prototype reads as its own site.
 */
export default function DossierLayout({ children }: { children: React.ReactNode }) {
  const revision = formatDotDate(CV.lastUpdated);

  return (
    <div className="dossier fixed inset-0 z-[150] overflow-y-auto">
      <a
        href="#dossier-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-40 focus:bg-[var(--d-ink)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--d-paper)]"
      >
        Skip to content
      </a>
      <div className="relative min-h-full">
        <GridOverlay />
        <div className="relative">
          <Masthead revision={revision} />
          <main id="dossier-main">{children}</main>
          <Colophon updated={revision} />
        </div>
      </div>
      <CasePill />
    </div>
  );
}
