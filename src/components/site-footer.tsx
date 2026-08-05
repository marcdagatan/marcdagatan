import Link from "next/link";

/**
 * Publication footer: dry, self-aware, and useful. Implementation-note copy
 * stays out; About, CV, Archive, RSS, and the external profiles remain.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const linkClass =
    "font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-150 hover:text-accent";

  return (
    <footer className="site-footer mt-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-serif text-xl font-bold">Thoughts of a Mastermind in Pajamas</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              I write my own stuff. Sometimes it&apos;s good, sometimes it&apos;s…
              a war crime against grammar. ChatGPT cleans up the mess. Judge
              accordingly.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/about" className={linkClass}>
              About
            </Link>
            <Link href="/cv" className={linkClass}>
              CV
            </Link>
            <Link href="/blog" className={linkClass}>
              Archive
            </Link>
            <Link href="/rss.xml" className={linkClass}>
              RSS
            </Link>
            <a href="mailto:marc.dagatan@gmail.com" className={linkClass}>
              Email
            </a>
            <a href="https://github.com/marcdagatan" target="_blank" rel="noreferrer" className={linkClass}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/marcdagatan/" target="_blank" rel="noreferrer" className={linkClass}>
              LinkedIn ↗
            </a>
            <a href="https://www.instagram.com/marc.uyyy/" target="_blank" rel="noreferrer" className={linkClass}>
              Instagram
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Marc Uy Dagatan. All rights reserved.</p>
          <p>Systems, scars, and selfhood: from the corner.</p>
        </div>
      </div>
    </footer>
  );
}
