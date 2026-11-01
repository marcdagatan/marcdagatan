import type { PostMeta } from "@/lib/posts";

/** Spec-sheet date: 2025-08-10 becomes 2025.08.10. */
export function formatDotDate(dateISO: string): string {
  return dateISO.slice(0, 10).replaceAll("-", ".");
}

/** Issue number from the slug prefix, e.g. "010-skills-router" becomes "010". */
export function postNumber(post: Pick<PostMeta, "slug">): string {
  return post.slug.match(/^\d+/)?.[0] ?? "—";
}

/** Essay URL inside the case study. */
export function essayHref(slug: string): string {
  return `/lab/dossier/${slug}`;
}

/** Two-digit sequence label, e.g. 1 becomes "01". */
export function seq(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/** Year span for a CV record, e.g. "2023–Now". */
export function yearSpan(start: string, end?: string): string {
  const from = start.slice(0, 4);
  const to = end === undefined ? "Now" : end.slice(0, 4);
  return from === to ? from : `${from}–${to}`;
}
