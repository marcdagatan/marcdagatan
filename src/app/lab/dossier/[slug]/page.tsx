import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeInlineCodeToPre from "@/lib/rehype-inline-code-to-pre";
import {
  getAllPostsMeta,
  getPostSlugs,
  getPostSource,
  PostNotFoundError,
} from "@/lib/posts";
import {
  composeTableOfContents,
  extractTableOfContents,
  TOC_MIN_HEADINGS,
  type TocItem,
} from "@/lib/toc";
import { essayHref, formatDotDate, postNumber } from "@/components/lab/dossier/format";
import { COL_INDEX, FRAME, GRID } from "@/components/lab/dossier/grid";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

function getPostOrNotFound(slug: string) {
  try {
    return getPostSource(slug);
  } catch (error) {
    if (error instanceof PostNotFoundError) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostOrNotFound(slug);
  return { title: `${meta.title} | The Operator's Dossier`, description: meta.description };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Numbers h2 sections as 1, 2, 3 and their h3 children as 1.1, 1.2. */
function numberToc(items: TocItem[]): { item: TocItem; label: string }[] {
  let section = 0;
  let sub = 0;
  return items.map((item) => {
    if (item.level === 2) {
      section += 1;
      sub = 0;
      return { item, label: String(section) };
    }
    sub += 1;
    return { item, label: section === 0 ? `0.${sub}` : `${section}.${sub}` };
  });
}

function TocList({ items }: { items: { item: TocItem; label: string }[] }) {
  return (
    <ol className="text-[0.875rem] leading-snug">
      {items.map(({ item, label }) => (
        <li key={item.id} className={item.level === 3 ? "pl-6" : ""}>
          <a
            href={`#${item.id}`}
            className="dossier-link grid grid-cols-[2.25rem_1fr] border-t border-[var(--d-hair)] py-2"
          >
            <span className="tabular-nums text-[var(--d-mute)]">{label}</span>
            <span className={item.level === 2 ? "font-medium" : ""}>{item.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default async function DossierEssay({ params }: Params) {
  const { slug } = await params;
  const { meta, content: source } = getPostOrNotFound(slug);

  // Same MDX pipeline as /blog/[slug] so headings, ids, and code match.
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeInlineCodeToPre,
          [
            rehypePrettyCode,
            {
              theme: { dark: "github-dark", light: "github-light" },
              keepBackground: false,
              defaultLang: "ts",
            },
          ],
        ],
      },
    },
  });

  const toc = numberToc(composeTableOfContents(extractTableOfContents(source)));
  const showToc = toc.length >= TOC_MIN_HEADINGS;

  const allPosts = getAllPostsMeta();
  const postIndex = allPosts.findIndex((post) => post.slug === slug);
  const newer = postIndex > 0 ? allPosts[postIndex - 1] : null;
  const older = postIndex >= 0 && postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;
  const number = postNumber(meta);

  const specs = [
    { label: "Published", value: formatDotDate(meta.dateISO) },
    ...(meta.updated ? [{ label: "Updated", value: formatDotDate(meta.updated) }] : []),
    { label: "Lane", value: capitalize(meta.lane) },
    { label: "Format", value: capitalize(meta.format) },
    { label: "Reading", value: `${meta.readingTime} min` },
    {
      label: "Topics",
      value: meta.topics.map((topic) => (topic === "ai" ? "AI" : capitalize(topic))).join(", "),
    },
  ];

  return (
    <article>
      <header className={`${FRAME} pb-10 pt-10 md:pb-16 md:pt-16`}>
        <div className={GRID}>
          <div className={COL_INDEX}>
            <Link href="/lab/dossier#writing" className="dossier-link dossier-label">
              Writing
            </Link>
            <p className="mt-6 text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[0.85] tracking-[-0.05em] tabular-nums">
              {number}
            </p>
          </div>
          <div className="col-span-4 mt-8 md:col-span-9 md:mt-0">
            <h1 className="max-w-[18ch] text-[clamp(2.25rem,5vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.04em] [text-wrap:balance]">
              {meta.title}
            </h1>
            <p className="mt-6 max-w-[46ch] text-[1.1875rem] leading-[1.4] text-[var(--d-mute)] md:text-[1.375rem]">
              {meta.description}
            </p>
          </div>
        </div>

        <dl className={`${GRID} mt-10 gap-y-5 border-t border-[var(--d-ink)] pt-4 md:mt-14`}>
          {specs.map((spec, index) => (
            <div
              key={spec.label}
              className={`col-span-2 ${index === 0 || spec.label === "Topics" ? "md:col-span-3" : "md:col-span-2"}`}
            >
              <dt className="dossier-label">{spec.label}</dt>
              <dd className="mt-1 text-[0.9375rem] font-medium tabular-nums">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="border-t-2 border-[var(--d-ink)]">
        <div className={`${FRAME} pb-16 pt-8 md:pb-24 md:pt-12`}>
          <div className={GRID}>
            {showToc ? (
              <>
                <details className="col-span-4 mb-8 border-b border-[var(--d-ink)] md:hidden">
                  <summary className="dossier-label cursor-pointer py-3">
                    Contents, {toc.filter(({ item }) => item.level === 2).length} sections
                  </summary>
                  <div className="pb-4">
                    <TocList items={toc} />
                  </div>
                </details>
                <nav aria-label="Contents" className="hidden md:col-span-3 md:block">
                  <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4 pr-2">
                    <p className="dossier-label mb-3">Contents</p>
                    <TocList items={toc} />
                  </div>
                </nav>
              </>
            ) : null}
            <div className="dossier-prose col-span-4 min-w-0 md:col-span-7 md:col-start-4">
              {content}
            </div>
          </div>

          <div className={`${GRID} mt-16 md:mt-24`}>
            <div className="col-span-4 border-t-2 border-[var(--d-ink)] pt-3 md:col-span-7 md:col-start-4">
              <p className="dossier-label">End of No. {number}</p>
              <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-[1.5]">
                Written by Marc Uy Dagatan, founder and hands-on technical leader.{" "}
                <Link href="/lab/dossier/work" className="dossier-underline">
                  See the work record
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {newer || older ? (
        <nav aria-label="More essays" className="border-t border-[var(--d-ink)]">
          <div className={FRAME}>
            <div className={GRID}>
              {[
                { label: "Previous", post: older },
                { label: "Next", post: newer },
              ].map(({ label, post }, index) => (
                <div
                  key={label}
                  className={`col-span-4 py-6 md:col-span-6 md:py-10 ${index === 1 ? "border-t border-[var(--d-hair)] md:border-l md:border-t-0 md:pl-6" : ""}`}
                >
                  {post ? (
                    <Link href={essayHref(post.slug)} className="dossier-row block">
                      <p className="dossier-label">
                        {label}, No. {postNumber(post)}
                      </p>
                      <p className="dossier-row-title mt-3 max-w-[24ch] text-[1.5rem] font-bold leading-[1.1] tracking-[-0.02em] md:text-[1.875rem]">
                        {post.title}
                      </p>
                    </Link>
                  ) : (
                    <p className="dossier-label">{label}: none, this is the edge of the archive</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </article>
  );
}
