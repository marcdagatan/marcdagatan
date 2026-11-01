import Link from "next/link";
import { BookFooter } from "@/components/lab/paperback/book-footer";
import {
  formatReadingTime,
  getBook,
  joinTopics,
  typesetTitle,
} from "@/components/lab/paperback/book";
import { Ornament } from "@/components/lab/paperback/ornament";
import { RunningHead } from "@/components/lab/paperback/running-head";

/**
 * The title page. A reader lands on the book itself: publication name, author,
 * a short introduction, then the contents set as a real contents page.
 */
export default function PaperbackHomePage() {
  const book = getBook();

  return (
    <div className="pb-page">
      <RunningHead right={{ href: "/lab/paperback/colophon", label: "Colophon" }} />

      <main className="pb-main">
        <div className="pb-wrap">
          <section className="pb-titleplate" aria-labelledby="pb-title">
            <div>
              <p className="pb-kicker">Essays, guides, and field notes</p>
              <h1 id="pb-title" className="pb-display">
                <span className="pb-display-line">Thoughts of a</span>
                <span className="pb-display-line">Mastermind</span>
                <span className="pb-display-line">
                  <em>in Pajamas</em>
                </span>
              </h1>
            </div>

            <div className="pb-title-aside">
              <p className="pb-byline">by Marc Uy Dagatan</p>
              <p className="pb-intro">
                I&apos;m Marc Uy Dagatan, founder of MAD Software, fighter,
                actor, and dad. I write about the systems I build, the teams I
                build them with, and the life that happens in between.
              </p>
            </div>
          </section>

          <Ornament className="pb-title-ornament" />

          <section id="contents" aria-labelledby="pb-contents">
            <header className="pb-contents-head">
              <h2 id="pb-contents">Contents</h2>
              <p className="pb-contents-note">
                {book.chapters.length} chapters, {book.parts.length} parts.
                <br />
                {formatReadingTime(book.totalMinutes)} of reading.
              </p>
            </header>

            {book.parts.map((part) => (
              <section
                key={part.title}
                className="pb-part"
                aria-labelledby={`pb-part-${part.index}`}
              >
                <div className="pb-part-label">
                  <p className="pb-part-numeral">Part {part.numeral}</p>
                  <h3 id={`pb-part-${part.index}`} className="pb-part-title">
                    {part.title}
                  </h3>
                  <p className="pb-part-topics">{joinTopics(part.topics)}</p>
                </div>

                <ol className="pb-chapter-list">
                  {part.chapters.map((chapter) => (
                    <li key={chapter.post.slug}>
                      <Link
                        href={`/lab/paperback/${chapter.post.slug}`}
                        className="pb-toc-row"
                      >
                        <span className="pb-toc-num">{chapter.number}</span>
                        <span className="pb-toc-title">
                          {typesetTitle(chapter.post.title)}
                        </span>
                        <span
                          className="pb-toc-leader"
                          aria-hidden="true"
                        />
                        <span className="pb-toc-time">
                          {chapter.post.readingTime} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </section>
        </div>
      </main>

      <BookFooter />
    </div>
  );
}
