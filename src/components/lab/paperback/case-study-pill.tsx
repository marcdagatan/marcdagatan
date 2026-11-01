import Link from "next/link";

/**
 * Fixed case-study marker. Required on every route so the reader can move
 * between the three directions without losing the page they are on.
 */
export function CaseStudyPill() {
  return (
    <Link
      href="/lab"
      className="pb-pill"
      aria-label="Case study 2 of 3: The Paperback. Back to all three case studies."
    >
      Case study 2 of 3 · The Paperback
    </Link>
  );
}
