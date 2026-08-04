import Link from "next/link";

/**
 * Short editorial author block at the end of every essay. A person, not a
 * résumé card: one line, one link to About, quiet external links.
 */

export function ArticleAuthor() {
  return (
    <section className="border-t border-border py-8">
      <p className="font-serif text-2xl font-bold tracking-tight">Marc Uy Dagatan</p>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-muted-foreground">
        Writes about AI systems, building teams, and the lessons usually learned
        the expensive way. Founder of MAD Software. Fighter, actor, dad: the
        three lanes are the same fight.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.14em]">
        <Link href="/about" className="text-accent hover:underline">
          More about Marc
        </Link>
        <a
          href="https://github.com/marcdagatan"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-accent"
        >
          GitHub
        </a>
        <a
          href="https://www.instagram.com/marc.uyyy/"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-accent"
        >
          Instagram
        </a>
        <a href="mailto:marc.dagatan@gmail.com" className="text-muted-foreground hover:text-accent">
          Email
        </a>
      </div>
    </section>
  );
}
