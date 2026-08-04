import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * Recent Rounds: compact newest-first list of everything not already featured
 * above. Numbers, titles, and lane/reading-time metadata, a quiet table of
 * contents for the record. Titles may wrap to two lines (never truncated) and
 * the metadata line rides beneath each title on mobile so the list stays
 * scannable without hiding the context.
 *
 * Structural label: the "Recent rounds" kicker is muted. Crimson on the
 * homepage is reserved for featured/current/return-path moments only.
 */

interface RecentRoundsProps {
  posts: PostMeta[];
}

export function RecentRounds({ posts }: RecentRoundsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-b border-border py-14">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
          Recent rounds
        </h2>
        <Link
          href="/blog"
          className="hidden font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-accent sm:block"
        >
          Full record →
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-border">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 py-4 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto] sm:gap-4"
            >
              <span
                aria-hidden="true"
                className="font-mono text-sm text-foreground/[0.25]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-lg font-bold leading-snug [text-wrap:balance] group-hover:text-accent">
                  {post.title}
                </span>
                <span className="mt-1 block font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:hidden">
                  {post.lane} · {post.readingTime} min
                </span>
              </span>
              <span className="hidden font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:block">
                {post.lane} · {post.readingTime} min
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
