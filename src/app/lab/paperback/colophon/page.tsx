import Link from "next/link";
import { BookFooter } from "@/components/lab/paperback/book-footer";
import { Ornament } from "@/components/lab/paperback/ornament";
import { RunningHead } from "@/components/lab/paperback/running-head";

// The colophon has no data of its own; force a fresh render so it always picks
// up the shared Paperback shell during local design review.
export const dynamic = "force-dynamic";

/**
 * The back of the book: who wrote it, how it was set, and where to find him.
 * Every fact here comes from the existing About page or the site's own links.
 */
export default function ColophonPage() {
  return (
    <div className="pb-page">
      <RunningHead section="Colophon" />

      <main className="pb-main">
        <div className="pb-wrap">
          <header className="pb-colophon-header">
            <div>
              <p className="pb-kicker">The back of the book</p>
              <h1>Colophon</h1>
            </div>
            <p className="pb-colophon-intro">
              A colophon is the page at the back of a book where the maker
              explains how it was made. This is that page.
            </p>
          </header>

          <div className="pb-colophon-grid">
            <section aria-labelledby="pb-colophon-author">
              <h2 id="pb-colophon-author" className="pb-colophon-label">
                The author
              </h2>
              <div className="pb-colophon-author">
                <p>
                  I&apos;m Marc Uy Dagatan, founder of MAD Software, fighter,
                  actor, hands-on technical leader, and dad. My life is a
                  strange mix of business meetings, boxing rounds, film
                  scripts, and parenting moments that don&apos;t come with a
                  manual.
                </p>
                <p>
                  I write about AI systems, engineering, hiring and teams,
                  entrepreneurship, and the parts of life that shape the work:
                  boxing, acting, film, being a father. The lessons usually
                  arrive the expensive way. This publication is where I keep
                  the receipts.
                </p>
              </div>
            </section>

            <section aria-labelledby="pb-colophon-setting">
              <h2 id="pb-colophon-setting" className="pb-colophon-label">
                The setting
              </h2>
              <dl className="pb-setting-list">
                <div className="pb-setting-row">
                  <dt>Typeface</dt>
                  <dd>
                    Newsreader, a serif drawn for reading on screens, set at
                    nineteen pixels.
                  </dd>
                </div>
                <div className="pb-setting-row">
                  <dt>Measure</dt>
                  <dd>
                    Sixty-five characters. The width of a paperback line, not a
                    browser window.
                  </dd>
                </div>
                <div className="pb-setting-row">
                  <dt>Pagination</dt>
                  <dd>
                    Reading times in place of page numbers. The browser has no
                    pages; the minutes are real.
                  </dd>
                </div>
                <div className="pb-setting-row">
                  <dt>Paper</dt>
                  <dd>
                    #F5EFE4, with a faint grain so the screen has a little
                    tooth.
                  </dd>
                </div>
                <div className="pb-setting-row">
                  <dt>Ornament</dt>
                  <dd>
                    Three diamonds, used at the title page and between scenes.
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <section className="pb-record" aria-labelledby="pb-colophon-record">
            <h2 id="pb-colophon-record" className="pb-colophon-label">
              The record
            </h2>
            <ul className="pb-record-list">
              <li>
                <a href="mailto:marc.dagatan@gmail.com">Email</a>
              </li>
              <li>
                <a
                  href="https://github.com/marcdagatan"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/marc.uyyy/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href="/rss.xml">RSS</a>
              </li>
            </ul>
          </section>

          <div className="pb-colophon-end">
            <Ornament />
            <p className="pb-colophon-return">
              <Link href="/lab/paperback">Return to the title page</Link>
            </p>
          </div>
        </div>
      </main>

      <BookFooter />
    </div>
  );
}
