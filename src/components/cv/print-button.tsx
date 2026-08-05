"use client";

/** Small client island for the browser's native print dialog. */
export function PrintButton() {
  return (
    <button
      type="button"
      className="cv-print-control w-fit border border-accent px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-accent hover:bg-accent/10"
      onClick={() => window.print()}
    >
      Print / Save as PDF
    </button>
  );
}
