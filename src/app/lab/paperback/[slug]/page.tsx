import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeInlineCodeToPre from "@/lib/rehype-inline-code-to-pre";
import { getPostSource, PostNotFoundError } from "@/lib/posts";
import {
  composeTableOfContents,
  extractTableOfContents,
  TOC_MIN_HEADINGS,
} from "@/lib/toc";
import { BookFooter } from "@/components/lab/paperback/book-footer";
import {
  findChapter,
  getBook,
  typesetTitle,
} from "@/components/lab/paperback/book";
import { MarginToc } from "@/components/lab/paperback/margin-toc";
import { RunningHead } from "@/components/lab/paperback/running-head";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBook().chapters.map((chapter) => ({ slug: chapter.post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const found = findChapter(getBook(), slug);
  if (!found) return {};

  return {
    title: `Chapter ${found.chapter.numberWord}: ${found.chapter.post.title}`,
    description: found.chapter.post.description,
  };
}

/**
 * A chapter. The reading column is the book; the margin holds its table of
 * contents on desktop; the end matter closes the chapter and moves the reader
 * to the next one.
 */
export default async function PaperbackChapterPage({ params }: Params) {
  const { slug } = await params;
  const book = getBook();
  const found = findChapter(book, slug);
  if (!found) notFound();

  const { chapter, index } = found;

  let source: string;
  try {
    source = getPostSource(slug).content;
  } catch (error) {
    if (error instanceof PostNotFoundError) notFound();
    throw error;
  }

  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeInlineCodeToPre],
      },
    },
  });

  const toc = composeTableOfContents(extractTableOfContents(source));
  const showToc = toc.length >= TOC_MIN_HEADINGS;

  const previous = index > 0 ? book.chapters[index - 1] : null;
  const next = index < book.chapters.length - 1 ? book.chapters[index + 1] : null;

  return (
    <div className="pb-page">
      <RunningHead section={`Chapter ${chapter.numberWord}`} />

      <main className="pb-main">
        <div className="pb-chapter-grid" data-toc={showToc ? "true" : "false"}>
          {showToc ? <MarginToc items={toc} /> : null}

          <article className="pb-article">
            <header className="pb-chapter-opening">
              <p className="pb-chapter-kicker">
                <span>Chapter {chapter.numberWord}</span>
                <span className="pb-chapter-part">
                  Part {chapter.part.numeral}, {chapter.part.title}
                </span>
              </p>

              <h1>{typesetTitle(chapter.post.title)}</h1>
              <p className="pb-chapter-epigraph">
                {chapter.post.description}
              </p>

              <p className="pb-chapter-meta">
                <span>by Marc Uy Dagatan</span>
                <span className="pb-meta-sep" aria-hidden="true" />
                <time dateTime={chapter.post.dateISO}>
                  {chapter.post.displayDate}
                </time>
                <span className="pb-meta-sep" aria-hidden="true" />
                <span>{chapter.post.readingTime} min read</span>
              </p>
            </header>

            <div className="pb-prose">{content}</div>

            <footer className="pb-chapter-end">
              <p className="pb-fin">~ Fin ~</p>

              {previous || next ? (
                <nav className="pb-chapter-nav" aria-label="Chapter navigation">
                  {previous ? (
                    <Link
                      href={`/lab/paperback/${previous.post.slug}`}
                      className="pb-nav-prev"
                    >
                      <span className="pb-nav-label">Previous chapter</span>
                      <span className="pb-nav-title">
                        {previous.numberWord}. {typesetTitle(previous.post.title)}
                      </span>
                    </Link>
                  ) : null}

                  {next ? (
                    <Link
                      href={`/lab/paperback/${next.post.slug}`}
                      className="pb-nav-next"
                    >
                      <span className="pb-nav-label">Next chapter</span>
                      <span className="pb-nav-title">
                        {next.numberWord}. {typesetTitle(next.post.title)}
                      </span>
                    </Link>
                  ) : null}
                </nav>
              ) : null}

              {next ? (
                <p className="pb-return">
                  <Link href="/lab/paperback#contents">Return to contents</Link>
                </p>
              ) : (
                <p className="pb-book-end">
                  This is the last chapter. Thank you for reading to the end.
                  <br />
                  <Link href="/lab/paperback">Return to the title page</Link>
                </p>
              )}
            </footer>
          </article>
        </div>
      </main>

      <BookFooter />
    </div>
  );
}
