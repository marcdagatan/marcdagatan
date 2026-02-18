import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { TagList } from "@/components/tag-list";

type Params = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({ tag: t.tag }));
}

export async function generateMetadata({ params }: Params) {
  const { tag } = await params;
  return {
    title: `#${tag} | Marc — Blog`,
    description: `Posts tagged with ${tag}`,
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] leading-[1.03] font-bold tracking-[-0.02em]">
          #{tag}
        </h1>
        <p className="text-base sm:text-lg text-foreground/70">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </header>
      <ul className="divide-y divide-white/10">
        {posts.map((post) => (
          <li key={post.slug} className="py-4">
            <article className="flex flex-col gap-1">
              <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold tracking-[-0.01em]">
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
  );
}
