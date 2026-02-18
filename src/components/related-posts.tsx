"use client";

import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RelatedPostsProps {
  posts: PostMeta[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-2xl font-bold mb-6 font-serif tracking-tight">Related Posts</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block group">
              <Card className="h-full group-hover:border-accent/30 transition-all duration-300">
                <CardContent className="p-5 flex flex-col h-full">
                  <CardTitle className="text-base leading-snug mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </CardTitle>
                  <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={post.dateISO}>
                      {new Date(post.timestamp).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readingTime} min
                    </span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="muted" className="text-[10px] px-1.5 py-0">
                          #{tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="muted" className="text-[10px] px-1.5 py-0">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
