import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostsByTopic, getAllTopics } from "@/lib/posts";
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
    <main>
      <header className="border-b border-border pb-10">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
          Topic collection
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold leading-none tracking-[-0.01em] sm:text-6xl lg:text-7xl">
          #{topic}
        </h1>
        <p className="mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">
          {TOPIC_INTROS[topic]}
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {posts.length} {posts.length === 1 ? "round" : "rounds"} ·{" "}
          <Link href="/blog" className="text-accent hover:underline">
            ← Back to the record
          </Link>
        </p>
      </header>

      <ul className="divide-y divide-border">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 py-7 sm:grid-cols-[4.5rem_minmax(0,1fr)] lg:grid-cols-[7rem_minmax(0,1fr)] lg:gap-8"
            >
              <span
                aria-hidden="true"
                className="pt-1 font-serif text-4xl font-bold leading-none text-foreground/[0.08] sm:text-5xl lg:text-7xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {post.lane} / {post.format} ·{" "}
                  <time dateTime={post.dateISO} className="whitespace-nowrap">
                    {post.displayDate}
                  </time>
                  {" · "}
                  {post.readingTime} min
                </span>
                <span className="mt-2 block font-serif text-2xl font-bold leading-[1.08] [text-wrap:balance] group-hover:text-accent sm:text-3xl">
                  {post.title}
                </span>
                <span className="mt-2.5 block max-w-[68ch] leading-relaxed text-muted-foreground">
                  {post.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
