import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * Newer/older navigation after the final bell. The labels are chronological
 * and explicit: "Newer round" points to the next essay toward the present,
 * "Older round" points further back in the record. When there is no older
 * post, the right slot falls back to the archive (the accurate place to
 * keep reading older material) instead of a dead end.
 *
 * Mobile alignment stays consistent: both blocks read left-aligned at the
 * base breakpoint; only at sm+ does the older block move right.
 */

interface ArticlePaginationProps {
  newer: PostMeta | null;
  older: PostMeta | null;
}

export function ArticlePagination({ newer, older }: ArticlePaginationProps) {
  return (
    <nav aria-label="Continue reading" className="border-t border-border py-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {newer ? (
          <Link href={`/blog/${newer.slug}`} className="group block">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              ← Newer round
            </p>
            <p className="mt-2 font-serif text-xl font-bold leading-snug [text-wrap:balance] group-hover:text-accent sm:text-2xl">
              {newer.title}
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <time dateTime={newer.dateISO} className="whitespace-nowrap">
                {newer.displayDate}
              </time>{" "}
              · {newer.readingTime} min
            </p>
          </Link>
        ) : (
          <div />
        )}

        {older ? (
          <Link
            href={`/blog/${older.slug}`}
            className="group block sm:ml-auto sm:max-w-[85%] sm:text-right"
          >
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              Older round →
            </p>
            <p className="mt-2 font-serif text-xl font-bold leading-snug [text-wrap:balance] group-hover:text-accent sm:text-2xl">
              {older.title}
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <time dateTime={older.dateISO} className="whitespace-nowrap">
                {older.displayDate}
              </time>{" "}
              · {older.readingTime} min
            </p>
          </Link>
        ) : (
          <Link href="/blog" className="group block sm:ml-auto sm:max-w-[85%] sm:text-right">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              Older round →
            </p>
            <p className="mt-2 font-serif text-xl font-bold leading-snug group-hover:text-accent sm:text-2xl">
              The fight record
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Browse the full archive
            </p>
          </Link>
        )}
      </div>
    </nav>
  );
}
