import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface RelatedPostsProps {
  posts: PostMeta[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-white/10">
      <h2 className="text-xl font-bold mb-4">Related Posts</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
            >
              <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
                {post.title}
              </h3>
              <time className="text-xs text-foreground/50">
                {new Date(post.timestamp).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
