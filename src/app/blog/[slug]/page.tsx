import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPostsMeta,
  getPostSlugs,
  getPostSource,
  getRelatedPosts,
  PostNotFoundError,
} from "@/lib/posts";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeInlineCodeToPre from "@/lib/rehype-inline-code-to-pre";
import {
  composeTableOfContents,
  extractTableOfContents,
  TOC_MIN_HEADINGS,
} from "@/lib/toc";
import { ArticleOpening } from "@/components/article/article-opening";
import { ArticleToc } from "@/components/article/article-toc";
import { ArticleAuthor } from "@/components/article/article-author";
import { ArticlePagination } from "@/components/article/article-pagination";
import { RelatedEssays } from "@/components/article/related-essays";
import { SocialShare } from "@/components/social-share";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, AUTHOR_NAME, RSS_ALTERNATE, SITE_NAME } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
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

  const canonical = `/blog/${slug}`;
  const ogImageUrl = `${canonical}/opengraph-image`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": [RSS_ALTERNATE],
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: meta.dateISO,
      modifiedTime: meta.updated,
      authors: [AUTHOR_NAME],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const { meta, content: source } = getPostOrNotFound(slug);

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
              // Dual-theme tokens switch with next-themes' `.light` class;
              // CSS in article.css resolves --shiki-dark/--shiki-light.
              theme: { dark: "github-dark", light: "github-light" },
              keepBackground: false,
              defaultLang: "ts",
            },
          ],
        ],
      },
    },
  });

  const toc = composeTableOfContents(extractTableOfContents(source));
  const showToc = toc.length >= TOC_MIN_HEADINGS;

  const allPosts = getAllPostsMeta();
  const postIndex = allPosts.findIndex((post) => post.slug === slug);
  const newerPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
  const olderPost =
    postIndex >= 0 && postIndex < allPosts.length - 1
      ? allPosts[postIndex + 1]
      : null;

  const relatedPosts = getRelatedPosts(slug, meta.topics, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.dateISO,
    ...(meta.updated ? { dateModified: meta.updated } : {}),
    articleSection: meta.lane,
    keywords: meta.topics,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${slug}`),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Bottom padding keeps the fixed share bar clear of the ending; the
          footer adds its own clearance on article routes via body:has(). */}
      <article className="pb-24">
        <ArticleOpening meta={meta} />

        {showToc ? (
          <div className="mt-10 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ArticleToc headings={toc} />
            </div>
            <div className="prose article-prose mx-auto min-w-0 lg:mx-0">{content}</div>
          </div>
        ) : (
          <div className="prose article-prose mx-auto mt-10">{content}</div>
        )}

        <div className="article-prose mx-auto">
          <div className="mt-16 flex items-center gap-4 border-t border-border pt-10">
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
              ~ FIN ~
            </p>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>

          <ArticleAuthor />
          <ArticlePagination newer={newerPost} older={olderPost} />
          <RelatedEssays posts={relatedPosts} />
        </div>
      </article>
      <SocialShare title={meta.title} slug={slug} />
    </>
  );
}
