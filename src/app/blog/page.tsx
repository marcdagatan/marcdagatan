import type { Metadata } from "next";
import { getAllPostsWithStats, toArchiveEntry } from "@/components/house/data";
import { Archive } from "@/components/house/home/archive";
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
  title: "Archive",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [RSS_ALTERNATE],
    },
  },
  openGraph: {
    title: `${SITE_NAME} | Archive`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: absoluteUrl("/blog"),
    images: [
      {
        url: "/blog/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Marc Uy Dagatan - Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Archive`,
    description: SITE_DESCRIPTION,
    images: ["/blog/opengraph-image"],
  },
};

export default function BlogIndex() {
  const posts = getAllPostsWithStats();

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
    <main className="ml-page">
      <JsonLd data={jsonLd} />
      <header className="ml-wrap ml-page-head">
        <p className="ml-eyebrow">The archive</p>
        <h1 className="ml-page-title">Every piece, every room</h1>
        <p className="ml-page-lede">
          {posts.length} pieces across four rooms. Filter by room below, or search everything from the
          nav.
        </p>
      </header>
      <section aria-label="All pieces" className="ml-wrap ml-page-body">
        <Archive entries={posts.map(toArchiveEntry)} />
      </section>
    </main>
  );
}
