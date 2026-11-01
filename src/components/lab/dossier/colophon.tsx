import { PUBLICATION_NAME } from "@/lib/site";
import { FRAME, GRID } from "./grid";

/** Closing spec line for every Dossier page. */
export function Colophon({ updated }: { updated: string }) {
  return (
    <footer className="border-t-2 border-[var(--d-ink)] pb-24 pt-5 md:pb-28">
      <div className={FRAME}>
        <dl className={`${GRID} gap-y-4 text-[0.8125rem] leading-snug`}>
          <div className="col-span-2 md:col-span-3">
            <dt className="dossier-label">Author</dt>
            <dd className="mt-1">Marc Uy Dagatan</dd>
          </div>
          <div className="col-span-2 md:col-span-3">
            <dt className="dossier-label">Publication</dt>
            <dd className="mt-1">{PUBLICATION_NAME}</dd>
          </div>
          <div className="col-span-2 md:col-span-3">
            <dt className="dossier-label">Typeface</dt>
            <dd className="mt-1">Helvetica Neue, 12 columns</dd>
          </div>
          <div className="col-span-2 md:col-span-3">
            <dt className="dossier-label">Record updated</dt>
            <dd className="mt-1 tabular-nums">{updated}</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
