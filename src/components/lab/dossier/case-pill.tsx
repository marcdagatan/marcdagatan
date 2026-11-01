import Link from "next/link";

/** Fixed link back to the case-study index. */
export function CasePill() {
  return (
    <Link
      href="/lab"
      className="fixed bottom-4 right-4 z-30 border border-[var(--d-ink)] bg-[var(--d-ink)] px-3 py-2 text-[0.75rem] font-medium leading-none text-[var(--d-paper)] hover:bg-[var(--d-accent)] hover:border-[var(--d-accent)] md:bottom-6 md:right-6"
    >
      Case study 1 of 3 · The Operator&apos;s Dossier
    </Link>
  );
}
