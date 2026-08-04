import Link from "next/link";

/**
 * Stay for the Next Round: the return path. RSS is real; there is no invented
 * newsletter. Quiet, honest, one line.
 *
 * Crimson kicker rule (homepage): this return-path moment earns crimson,
 * alongside the featured "Current Bout". Structural labels stay muted.
 */

export function StayForNextRound() {
  return (
    <section className="py-16">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-accent">
        Stay for the next round
      </p>
      <h2 className="mt-3 max-w-[24ch] font-serif text-3xl font-bold leading-tight tracking-[-0.01em] sm:text-4xl">
        New essays when there is something worth saying.
      </h2>
      <p className="mt-4 max-w-[52ch] leading-relaxed text-muted-foreground">
        No content treadmill. When a round matters, it lands in the archive and
        in the feed.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/rss.xml"
          className="border border-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors duration-150 hover:bg-accent/10"
        >
          Subscribe via RSS
        </Link>
        <Link
          href="/blog"
          className="px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-accent"
        >
          Browse the record →
        </Link>
      </div>
    </section>
  );
}
