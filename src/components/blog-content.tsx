"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { TagList } from "@/components/tag-list";
import { Clock, Hash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogContentProps {
  posts: PostMeta[];
  allTags: { tag: string; count: number }[];
}

export function BlogContent({ posts, allTags }: BlogContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [posts, selectedTag]);

  return (
    <main className="space-y-16">
      {/* Asymmetric Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95]">
            Thoughts of a
            <br />
            <span className="text-accent">Mastermind</span>
            <br />
            in Pajamas
          </h1>
        </div>
        <div className="lg:col-span-5 lg:pt-8">
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light">
            It&apos;s hard to plot world domination when your coffee&apos;s still brewing…
            <br />
            <span className="text-foreground">but I&apos;m making it work.</span>
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{posts.length} posts</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{allTags.length} topics</span>
          </div>
        </div>
      </section>

      {/* Tag Filter Bar */}
      {allTags.length > 0 && (
        <section className="border-y border-border py-6 -mx-4 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Hash size={14} />
              Filter by topic
            </span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map(({ tag, count }) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                  <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
                </Badge>
              ))}
            </div>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={12} />
                Clear filter
              </button>
            )}
          </div>
        </section>
      )}

      {/* Posts List */}
      <section className="space-y-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground text-lg">
              No posts found for &ldquo;{selectedTag}&rdquo;
            </p>
            <button
              onClick={() => setSelectedTag(null)}
              className="text-accent hover:underline"
            >
              View all posts
            </button>
          </div>
        ) : (
          <ul className="space-y-16">
            {filteredPosts.map((post, index) => (
              <li key={post.slug} className="relative">
                {/* Post Number */}
                <span className="absolute -left-4 lg:-left-12 top-0 text-6xl lg:text-8xl font-serif font-bold text-foreground/[0.03] select-none pointer-events-none">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <article className="relative space-y-4 pl-0 lg:pl-0">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={post.dateISO}>
                      {new Date(post.timestamp).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readingTime} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-accent transition-colors duration-300"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  {post.description && (
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl line-clamp-3">
                      {post.description}
                    </p>
                  )}

                  {/* Tags */}
                  <TagList tags={post.tags} />

                  {/* Read More Link */}
                  <div className="pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm text-accent hover:underline group"
                    >
                      Read article
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Footer Stats */}
      <section className="border-t border-border pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Showing {filteredPosts.length} of {posts.length} posts
            {selectedTag && (
              <span className="ml-2">
                tagged with <span className="text-accent">&ldquo;{selectedTag}&rdquo;</span>
              </span>
            )}
          </p>
          <Link
            href="/rss.xml"
            className="text-accent hover:underline flex items-center gap-1"
          >
            Subscribe via RSS
          </Link>
        </div>
      </section>
    </main>
  );
}
