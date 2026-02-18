import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostSlugs, getPostSource, getRelatedPosts } from "@/lib/posts";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeInlineCodeToPre from "@/lib/rehype-inline-code-to-pre";
import { TagList } from "@/components/tag-list";
import { RelatedPosts } from "@/components/related-posts";
import { SocialShare } from "@/components/social-share";
import { JsonLd } from "@/components/json-ld";

type Params = { params: Promise<{ slug: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostSource(slug);
  const ogImageUrl = `${SITE_URL}/blog/${slug}/opengraph-image`;
  
  return {
    title: `${meta.title} | Marc Uy Dagatan`,
    description: meta.description ?? undefined,
    openGraph: {
      title: meta.title,
      description: meta.description ?? undefined,
      type: "article",
      publishedTime: meta.dateISO,
      authors: ["Marc Uy Dagatan"],
      url: `${SITE_URL}/blog/${slug}`,
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
      description: meta.description ?? undefined,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const { meta, content: source } = getPostSource(slug);

  if (!source) notFound();

  const { content } = await compileMDX<{ title: string; date: string; description?: string }>({
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
              theme: "github-dark",
              keepBackground: false,
              defaultLang: "ts",
            },
          ],
        ],
      },
    },
  });

  const relatedPosts = getRelatedPosts(slug, meta.tags, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description ?? undefined,
    datePublished: meta.dateISO,
    dateModified: meta.dateISO,
    author: {
      "@type": "Person",
      name: "Marc Uy Dagatan",
    },
    publisher: {
      "@type": "Organization",
      name: "Marc Uy Dagatan",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="prose max-w-none pb-24">
        <header className="mb-10 pb-8 border-b border-border">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
            {meta.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={meta.dateISO}>
              {new Date(meta.timestamp).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{meta.readingTime} min read</span>
          </div>
          {meta.description ? (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-prose">
              {meta.description}
            </p>
          ) : null}
          <TagList tags={meta.tags} />
        </header>
        {content}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground font-medium text-center">~ FIN ~</p>
        </div>
        <RelatedPosts posts={relatedPosts} />
      </article>
      <SocialShare title={meta.title} slug={slug} />
    </>
  );
}


