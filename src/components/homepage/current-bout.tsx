import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * Current Bout: the featured essay, presented at dominant scale. Crimson
 * marks this as the most important read right now, one scarce accent, not a
 * badge everywhere.
 *
 * Crimson kicker rule (homepage): crimson is reserved for featured/current
 * ("Current Bout") and return-path ("Stay for the Next Round") moments.
 * Structural labels ("The Fight Journal", "Three lanes", "Start here",
 * "Recent rounds") stay muted mono.
 */

interface CurrentBoutProps {
  post: PostMeta;
}

export function CurrentBout({ post }: CurrentBoutProps) {
  return (
    <section className="border-b border-border py-14 lg:py-16">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-accent">
        Current Bout
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <h2 className="font-serif text-3xl font-bold leading-[1.05] tracking-[-0.01em] sm:text-4xl lg:text-5xl [text-wrap:balance]">
            <Link href={`/blog/${post.slug}`} className="hover:text-accent">
              {post.title}
            </Link>
          </h2>
          <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            {post.description}
          </p>
          <Link
            href={`/blog/${post.slug}`}
            className="mt-7 inline-block border-b border-accent pb-0.5 font-mono text-xs uppercase tracking-[0.18em] text-accent hover:opacity-80"
          >
            Read the essay →
          </Link>
        </div>
        <div className="lg:col-span-4 lg:pt-2">
          <dl className="space-y-4 border-l border-border pl-5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <div>
              <dt className="sr-only">Lane</dt>
              <dd>{post.lane}</dd>
            </div>
            <div>
              <dt className="sr-only">Format</dt>
              <dd>{post.format}</dd>
            </div>
            <div>
              <dt className="sr-only">Date</dt>
              <dd>
                <time dateTime={post.dateISO} className="whitespace-nowrap">
                  {post.displayDate}
                </time>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Reading time</dt>
              <dd>{post.readingTime} min read</dd>
            </div>
            <div>
              <dt className="sr-only">Topics</dt>
              <dd className="normal-case tracking-normal">
                {post.topics.map((topic) => `#${topic}`).join("  ")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
