import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import { TagList } from "@/components/tag-list";
import { JsonLd } from "@/components/json-ld";
import { Clock } from "lucide-react";

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
      <main className="space-y-10">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
            Thoughts of a Mastermind in Pajamas
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            It&apos;s hard to plot world domination when your coffee&apos;s still brewing… but I&apos;m making it work.
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li key={post.slug} className="py-6 first:pt-0">
                <article className="flex flex-col gap-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="hover:text-accent transition-colors duration-200"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.description ? (
                    <p className="text-muted-foreground leading-relaxed max-w-prose">
                      {post.description}
                    </p>
                  ) : null}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <time dateTime={post.dateISO}>
                      {new Date(post.timestamp).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readingTime} min read
                    </span>
                  </div>
                  <TagList tags={post.tags} />
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}


