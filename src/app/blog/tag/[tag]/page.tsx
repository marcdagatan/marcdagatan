import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostsByTopic, getAllTopics } from "@/lib/posts";
import { postHref, primaryRoom, ROOMS } from "@/components/house/rooms";
import { TOPIC_INTROS, normalizeTopic } from "@/lib/topics";
import { absoluteUrl, RSS_ALTERNATE, SITE_NAME } from "@/lib/site";

type Params = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = getAllTopics();
  return tags.map(({ topic }) => ({ tag: topic }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const topic = normalizeTopic(tag);
  if (topic === null) notFound();

  return {
    title: `#${topic}`,
    description: TOPIC_INTROS[topic],
    alternates: {
      canonical: `/blog/tag/${topic}`,
      types: {
        "application/rss+xml": [RSS_ALTERNATE],
      },
    },
    openGraph: {
      title: `#${topic} | ${SITE_NAME}`,
      description: TOPIC_INTROS[topic],
      type: "website",
      url: absoluteUrl(`/blog/tag/${topic}`),
    },
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const topic = normalizeTopic(tag);
  const posts = topic === null ? [] : getPostsByTopic(topic);

  if (topic === null || posts.length === 0) {
    notFound();
  }

  return (
    <main className="ml-page">
      <header className="ml-wrap ml-page-head">
        <p className="ml-eyebrow">Topic collection</p>
        <h1 className="ml-page-title">#{topic}</h1>
        <p className="ml-page-lede">{TOPIC_INTROS[topic]}</p>
        <p className="ml-page-meta">
          {posts.length} {posts.length === 1 ? "piece" : "pieces"} ·{" "}
          <Link href="/blog" className="ml-u">
            Back to the archive
          </Link>
        </p>
      </header>

      <section aria-label={`Pieces tagged ${topic}`} className="ml-wrap ml-page-body">
        <ol className="ml-archive-list">
          {posts.map((post) => {
            const room = primaryRoom(post);
            return (
              <li key={post.slug} data-room={room} className="ml-archive-row">
                <Link href={postHref(post.slug)} className="ml-archive-link">
                  <span className="ml-archive-room">
                    <span aria-hidden="true" className="ml-swatch" />
                    {ROOMS[room].name}
                  </span>
                  <span className="ml-archive-title">{post.title}</span>
                  <span className="ml-archive-meta">
                    <time dateTime={post.dateISO}>{post.displayDate}</time>
                    <span>{post.readingTime} min</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
