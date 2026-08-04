import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPostsMeta, getAllTopics } from "@/lib/posts";
import { ArchiveExplorer } from "@/components/archive/archive-explorer";
import { JsonLd } from "@/components/json-ld";
import {
  absoluteUrl,
  AUTHOR_NAME,
  PUBLICATION_NAME,
  RSS_ALTERNATE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "The Fight Record",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [RSS_ALTERNATE],
    },
  },
  openGraph: {
    title: `${SITE_NAME} | The Fight Record`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: absoluteUrl("/blog"),
    images: [
      {
        url: "/blog/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Marc Uy Dagatan - The Fight Record",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | The Fight Record`,
    description: SITE_DESCRIPTION,
    images: ["/blog/opengraph-image"],
  },
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  const allTopics = getAllTopics();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: PUBLICATION_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/blog"),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.dateISO,
      articleSection: post.lane,
      keywords: post.topics,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Suspense keeps the static shell while the client syncs filter state
          with the URL on hydration and back/forward navigation. */}
      <Suspense fallback={<ArchiveExplorerFallback />}>
        <ArchiveExplorer posts={posts} allTopics={allTopics} />
      </Suspense>
    </>
  );
}

function ArchiveExplorerFallback() {
  return (
    <main>
      <p className="pt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Loading the record…
      </p>
    </main>
  );
}
