import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import { TagList } from "@/components/tag-list";
import { JsonLd } from "@/components/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

export const metadata = {
  title: "Marc Uy Dagatan | Thoughts of a Mastermind in Pajamas",
  description: "It's hard to plot world domination when your coffee's still brewing… but I'm making it work",
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Marc — Blog",
    description: "Thoughts of a Mastermind in Pajamas",
    url: `${SITE_URL}/blog`,
    author: {
      "@type": "Person",
      name: "Marc Uy Dagatan",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description ?? undefined,
      datePublished: post.dateISO,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="space-y-8">
      <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] xl:text-[7rem] leading-[1.03] font-bold tracking-[-0.02em]">
        Thoughts of a Mastermind in Pajamas
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-foreground/70">It&apos;s hard to plot world domination when your coffee&apos;s still brewing… but I&apos;m making it work.</p>
      <ul className="divide-y divide-white/10">
        {posts.map((post) => (
          <li key={post.slug} className="py-4">
            <article className="flex flex-col gap-1">
              <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] leading-[1.1] font-bold tracking-[-0.01em]">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              {post.description ? (
                <p className="text-sm text-foreground/70">{post.description}</p>
              ) : null}
              <div className="flex items-center gap-3 text-xs text-foreground/50">
                <time dateTime={post.dateISO}>
                  {new Date(post.timestamp).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </div>
              <TagList tags={post.tags} />
            </article>
          </li>
        ))}
      </ul>
    </main>
    </>
  );
}


