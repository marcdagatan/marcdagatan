"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { TagList } from "@/components/tag-list";
import { Clock, Hash, Search, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BlogContentProps {
  posts: PostMeta[];
  allTags: { tag: string; count: number }[];
}

export function BlogContent({ posts, allTags }: BlogContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [posts, selectedTag]);

  const filteredTags = useMemo(() => {
    if (!searchQuery) return allTags;
    return allTags.filter(({ tag }) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allTags, searchQuery]);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setIsModalOpen(false);
    setSearchQuery("");
  };

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
            <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <FolderOpen size={14} />
                  {allTags.length} topics
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
                <div className="p-6 border-b border-border">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <FolderOpen size={20} className="text-accent" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">Browse Topics</DialogTitle>
                        <DialogDescription>
                          {allTags.length} topics · {posts.length} posts
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  
                  {/* Search */}
                  <div className="relative mt-4">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-foreground/5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Tags List */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                  {/* All Option */}
                  <button
                    onClick={() => handleTagSelect(null)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 mb-3 ${
                      selectedTag === null
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50 hover:bg-foreground/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedTag === null ? "bg-accent text-accent-foreground" : "bg-foreground/10"
                        }`}
                      >
                        <Hash size={14} />
                      </div>
                      <span className="font-medium">All Posts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{posts.length} posts</span>
                  </button>

                  {/* Divider */}
                  <div className="h-px bg-border my-4" />

                  {/* Tag List */}
                  <div className="space-y-2">
                    {filteredTags.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No topics found matching &ldquo;{searchQuery}&rdquo;
                      </div>
                    ) : (
                      filteredTags.map(({ tag, count }) => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${
                            selectedTag === tag
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50 hover:bg-foreground/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                selectedTag === tag
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-foreground/10 group-hover:bg-accent/20"
                              }`}
                            >
                              <span className="text-xs font-bold">#</span>
                            </div>
                            <span className="font-medium capitalize">{tag}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {count} {count === 1 ? "post" : "posts"}
                            </span>
                            {selectedTag === tag && (
                              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  className="text-accent-foreground"
                                >
                                  <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-foreground/5 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Click a topic to filter posts · Press ESC to close
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Active Filter Indicator */}
      {selectedTag && (
        <section className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <Badge variant="default" className="gap-1">
            {selectedTag}
            <button
              onClick={() => setSelectedTag(null)}
              className="ml-1 hover:text-accent-foreground/80"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L6 6M6 6L10 10M6 6L10 2M6 6L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </Badge>
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
                <span className="absolute -left-4 lg:-left-16 top-0 text-7xl sm:text-8xl lg:text-9xl font-serif font-bold text-foreground/[0.08] select-none pointer-events-none">
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
          <div className="flex items-center gap-4">
            <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <button className="text-accent hover:underline flex items-center gap-1">
                  <Hash size={14} />
                  Browse topics
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
                <div className="p-6 border-b border-border">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <FolderOpen size={20} className="text-accent" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">Browse Topics</DialogTitle>
                        <DialogDescription>
                          {allTags.length} topics · {posts.length} posts
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  
                  {/* Search */}
                  <div className="relative mt-4">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-foreground/5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Tags List */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                  {/* All Option */}
                  <button
                    onClick={() => handleTagSelect(null)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 mb-3 ${
                      selectedTag === null
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50 hover:bg-foreground/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedTag === null ? "bg-accent text-accent-foreground" : "bg-foreground/10"
                        }`}
                      >
                        <Hash size={14} />
                      </div>
                      <span className="font-medium">All Posts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{posts.length} posts</span>
                  </button>

                  {/* Divider */}
                  <div className="h-px bg-border my-4" />

                  {/* Tag List */}
                  <div className="space-y-2">
                    {filteredTags.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No topics found matching &ldquo;{searchQuery}&rdquo;
                      </div>
                    ) : (
                      filteredTags.map(({ tag, count }) => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${
                            selectedTag === tag
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50 hover:bg-foreground/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                selectedTag === tag
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-foreground/10 group-hover:bg-accent/20"
                              }`}
                            >
                              <span className="text-xs font-bold">#</span>
                            </div>
                            <span className="font-medium capitalize">{tag}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {count} {count === 1 ? "post" : "posts"}
                            </span>
                            {selectedTag === tag && (
                              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  className="text-accent-foreground"
                                >
                                  <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-foreground/5 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Click a topic to filter posts · Press ESC to close
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Link
              href="/rss.xml"
              className="text-accent hover:underline flex items-center gap-1"
            >
              Subscribe via RSS
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
