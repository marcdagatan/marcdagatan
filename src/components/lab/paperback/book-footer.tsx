import Link from "next/link";

/**
 * The book's back matter strip. Kept to the three things a reader needs at the
 * end of a chapter: who made it, how it was set, and where the feed is.
 */
export function BookFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="pb-footer">
      <div className="pb-footer-inner">
        <p className="pb-footer-title">
          Thoughts of a Mastermind in Pajamas
        </p>

        <nav aria-label="Book" className="pb-footer-nav">
          <Link href="/lab/paperback">Title page</Link>
          <Link href="/lab/paperback/colophon">Colophon</Link>
          <a href="/rss.xml">RSS</a>
        </nav>

        <p className="pb-footer-copy">© {year} Marc Uy Dagatan</p>
      </div>
    </footer>
  );
}
