import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * Start Here: one curated first read per lane. Text-forward rows with the
 * lane, date, and reading time up front so a new reader can commit fast.
 */

interface StartHereProps {
  posts: PostMeta[];
}

export function StartHere({ posts }: StartHereProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-b border-border py-14">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-muted-foreground">
        Start here
      </p>
      <h2 className="mt-3 font-serif text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
        New? Begin with one per lane.
      </h2>

      <ul className="mt-10 divide-y divide-border">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-1 py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6"
            >
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {post.lane} · {post.readingTime} min
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-xl font-bold leading-snug [text-wrap:balance] group-hover:text-accent sm:text-2xl">
                  {post.title}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
