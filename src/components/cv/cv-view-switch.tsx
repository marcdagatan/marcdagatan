import Link from "next/link";
import type { CvView } from "@/lib/cv/view";

const ledgerGrid = "cv-ledger-grid grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8";
const linkClass =
  "inline-flex min-h-11 items-center border-b-2 py-2 font-serif text-xl font-bold leading-none transition-colors duration-150";

/** Renders the shareable, recruiter-first switch between CV readings. */
export function CvViewSwitch({ view }: { view: CvView }) {
  const generalActive = view === "general";

  return (
    <section className={`${ledgerGrid} cv-view-switch border-b border-border py-4`}>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">View</p>
      <div className="min-w-0">
        <nav className="flex items-center gap-3" aria-label="CV view" aria-describedby="cv-view-description">
          <Link
            href="/cv"
            scroll={false}
            aria-current={generalActive ? "page" : undefined}
            className={`${linkClass} ${generalActive ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-accent"}`}
          >
            General
          </Link>
          <span className="font-mono text-sm text-muted-foreground" aria-hidden="true">
            ·
          </span>
          <Link
            href="/cv?view=technical"
            scroll={false}
            aria-current={generalActive ? undefined : "page"}
            className={`${linkClass} ${generalActive ? "border-transparent text-muted-foreground hover:border-border hover:text-accent" : "border-accent text-foreground"}`}
          >
            Technical
          </Link>
        </nav>
        <p id="cv-view-description" className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground">
          General: the brief. Technical: the full account.
        </p>
      </div>
    </section>
  );
}
