import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/posts";

/**
 * Loud article opening apparatus: back link, lane/format kicker, oversized
 * Playfair title, mono metadata, thesis block, and optional header image.
 *
 * The title is intentionally loud; the body below stays controlled. "Mastermind"
 * level crimson is reserved for links and current state; the kicker stays
 * muted mono.
 */

interface ArticleOpeningProps {
  meta: PostMeta;
}

export function ArticleOpening({ meta }: ArticleOpeningProps) {
  return (
    <header className="border-b border-border pb-10">
      <Link
        href="/blog"
        className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent"
      >
        ← Back to the archive
      </Link>

      <p className="mt-8 font-mono text-[0.75rem] uppercase tracking-[0.22em] text-muted-foreground">
        {meta.lane} <span aria-hidden="true">/</span> {meta.format}
      </p>

      <h1 className="mt-4 max-w-[22ch] font-serif text-4xl font-bold leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-6xl xl:text-7xl [text-wrap:balance]">
        {meta.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <time dateTime={meta.dateISO} className="whitespace-nowrap">
          {meta.displayDate}
        </time>
        <span aria-hidden="true">·</span>
        <span>{meta.readingTime} min read</span>
        {meta.updated && meta.updatedDisplayDate ? (
          <>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">
              Updated <time dateTime={meta.updated}>{meta.updatedDisplayDate}</time>
            </span>
          </>
        ) : null}
      </div>

      {meta.topics.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          {meta.topics.map((topic) => (
            <li key={topic}>
              <Link
                href={`/blog/tag/${encodeURIComponent(topic)}`}
                className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-accent"
              >
                #{topic}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-8 max-w-[52ch] border-l-2 border-accent/60 pl-4 font-serif text-xl italic leading-relaxed text-foreground/90 sm:text-2xl">
        {meta.description}
      </p>

      {meta.headerImage ? (
        <div className="article-plate relative mt-10 aspect-[21/9] w-full overflow-hidden">
          <Image
            src={meta.headerImage}
            alt={`Header image for ${meta.title}`}
            fill
            priority
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </header>
  );
}
