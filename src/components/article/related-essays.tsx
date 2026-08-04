import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * Related essays: restrained, text-forward recommendations. No cards, no
 * bullets, no prose-link leakage: each row carries a quiet sequence marker,
 * lane/format/date metadata, the title, and the thesis.
 */

interface RelatedEssaysProps {
  posts: PostMeta[];
}

export function RelatedEssays({ posts }: RelatedEssaysProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border py-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Related essays
      </p>
      <ul className="mt-6 divide-y divide-border">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
            >
              <span
                aria-hidden="true"
                className="pt-0.5 font-serif text-2xl font-bold text-foreground/[0.15] sm:text-3xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {post.lane} / {post.format} ·{" "}
                  <time dateTime={post.dateISO} className="whitespace-nowrap">
                    {post.displayDate}
                  </time>
                  {" · "}
                  {post.readingTime} min
                </span>
                <span className="mt-1.5 block font-serif text-lg font-bold leading-snug [text-wrap:balance] group-hover:text-accent sm:text-xl">
                  {post.title}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </span>
                <span className="mt-2 block font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground/80">
                  {post.topics.map((topic) => `#${topic}`).join("  ")}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
