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
import { JsonLd } from "@/components/json-ld";

type Params = { params: Promise<{ slug: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostSource(slug);
  const ogImageUrl = `${SITE_URL}/api/og?slug=${slug}`;
  
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
      <article className="prose max-w-none">
      <header className="mb-8">
        <h1>{meta.title}</h1>
        <div className="flex items-center gap-3 text-sm text-foreground/60">
          <time dateTime={meta.dateISO}>
            {new Date(meta.timestamp).toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
          <span>·</span>
          <span>{meta.readingTime} min read</span>
        </div>
        {meta.description ? (
          <p className="mt-2 text-foreground/70">{meta.description}</p>
        ) : null}
        <TagList tags={meta.tags} />
      </header>
      {content}
      <p className="text-sm text-foreground/40 font-bold text-center pt-8">~ FIN ~</p>
      <RelatedPosts posts={relatedPosts} />
    </article>
    </>
  );
}


