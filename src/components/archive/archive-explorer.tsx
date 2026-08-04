"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { PostMeta, Topic } from "@/lib/posts";
import {
  buildFilterQuery,
  countPostsByLane,
  filterPosts,
  parseLaneParam,
  parseTopicParam,
  UNKNOWN_LANE,
  UNKNOWN_TOPIC,
  type ArchiveFilters,
} from "@/lib/archive";
import { LANES } from "@/lib/topics";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TopicsDialogContent } from "@/components/topics-dialog";
import { cn } from "@/lib/utils";

/**
 * The archive as a fight record, with URL-backed filtering.
 *
 * The URL is the single source of truth: `?lane=systems&topic=ai`. Lane
 * filters and topic selection update the URL, so states are shareable and
 * back/forward restores them. One topics dialog instance serves the whole
 * page.
 */

interface ArchiveExplorerProps {
  posts: PostMeta[];
  allTopics: { topic: Topic; count: number }[];
}

export function ArchiveExplorer({ posts, allTopics }: ArchiveExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [topicsOpen, setTopicsOpen] = useState(false);

  const filters: ArchiveFilters = useMemo(() => {
    const lane = parseLaneParam(searchParams.get("lane"));
    const topic = parseTopicParam(searchParams.get("topic"));
    return {
      lane: lane === UNKNOWN_LANE ? null : lane,
      topic: topic === UNKNOWN_TOPIC ? null : topic,
    };
  }, [searchParams]);

  const unknownLane = parseLaneParam(searchParams.get("lane")) === UNKNOWN_LANE;
  const unknownTopic = parseTopicParam(searchParams.get("topic")) === UNKNOWN_TOPIC;

  const filteredPosts = useMemo(() => filterPosts(posts, filters), [posts, filters]);
  const visiblePosts = unknownLane || unknownTopic ? [] : filteredPosts;
  const laneCounts = useMemo(() => countPostsByLane(posts), [posts]);

  const hasFilters = filters.lane !== null || filters.topic !== null;

  const setFilters = useCallback(
    (next: ArchiveFilters) => {
      router.replace(`/blog${buildFilterQuery(next)}`, { scroll: false });
    },
    [router]
  );

  const setLane = (lane: ArchiveFilters["lane"]) => setFilters({ ...filters, lane });
  const setTopic = (topic: Topic | null) => setFilters({ ...filters, topic });

  const laneButton = (lane: ArchiveFilters["lane"], label: string, count: number) => {
    const active = filters.lane === lane;
    return (
      <button
        type="button"
        onClick={() => setLane(active ? null : lane)}
        aria-pressed={active}
        className={cn(
          "min-h-11 rounded-sm border px-3 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-150 sm:min-h-9",
          active
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
        )}
      >
        {label}
        <span aria-hidden="true" className={cn("ml-2", active ? "text-accent" : "text-muted-foreground/60")}>
          {count}
        </span>
      </button>
    );
  };

  return (
    <main>
      {/* Fight-record header */}
      <header className="border-b border-border pb-10">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
          The complete record
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-7xl">
          The Fight
          <br />
          Record
        </h1>
        <p className="mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">
          Every round so far (systems, operators, and life), newest first.
          Filter by lane, then by topic, and the record follows.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {posts.length} rounds · {allTopics.length} topics ·{" "}
          <Link href="/rss.xml" className="text-accent hover:underline">
            RSS
          </Link>
        </p>
      </header>

      {/* Filters */}
      <section aria-label="Filter the archive" className="border-b border-border py-5">
        <div className="flex flex-wrap items-center gap-2">
          {laneButton(null, "All", posts.length)}
          {LANES.map((lane) => (
            <span key={lane} className="contents">
              {laneButton(lane, lane, laneCounts[lane])}
            </span>
          ))}

          <span aria-hidden="true" className="mx-2 hidden h-5 w-px bg-border sm:block" />

          <Dialog open={topicsOpen} onOpenChange={setTopicsOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={cn(
                  "min-h-11 rounded-sm border px-3 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-150 sm:min-h-9",
                  filters.topic
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                )}
                aria-haspopup="dialog"
              >
                {filters.topic ? `#${filters.topic}` : "Topics"}
              </button>
            </DialogTrigger>
            <TopicsDialogContent
              topics={allTopics}
              postCount={posts.length}
              selectedTopic={filters.topic}
              onSelect={setTopic}
              onClose={() => setTopicsOpen(false)}
            />
          </Dialog>

          {hasFilters ? (
            <button
              type="button"
              onClick={() => setFilters({ lane: null, topic: null })}
              className="min-h-11 rounded-sm px-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-accent sm:min-h-9"
            >
              Clear filters ×
            </button>
          ) : null}
        </div>
        {filters.topic ? (
          <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            Topic: <span className="text-accent">#{filters.topic}</span>
            {filters.lane ? <> · Lane: <span className="text-accent">{filters.lane}</span></> : null}
          </p>
        ) : null}
      </section>

      {/* Entries */}
      {visiblePosts.length === 0 ? (
        <section className="py-20 text-center">
          <p className="font-serif text-3xl font-bold">No rounds in this corner.</p>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
            {unknownLane || unknownTopic
              ? "That filter is not part of the record; the URL may be hand-typed or stale."
              : "The lane and topic together are too narrow. Widen the search or start over."}
          </p>
          <button
            type="button"
            onClick={() => setFilters({ lane: null, topic: null })}
            className="mt-6 border border-border px-5 py-2.5 text-sm text-foreground hover:border-accent hover:text-accent"
          >
            View all rounds
          </button>
        </section>
      ) : (
        <ul className="divide-y divide-border">
          {visiblePosts.map((post, index) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 py-7 sm:grid-cols-[4.5rem_minmax(0,1fr)] lg:grid-cols-[7rem_minmax(0,1fr)] lg:gap-8"
              >
                <span
                  aria-hidden="true"
                  className="pt-1 font-serif text-4xl font-bold leading-none text-foreground/[0.08] transition-colors duration-150 group-hover:text-accent/25 sm:text-5xl lg:text-7xl"
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
                  <span className="mt-2 block font-serif text-2xl font-bold leading-[1.08] tracking-[-0.005em] [text-wrap:balance] group-hover:text-accent sm:text-3xl lg:text-4xl">
                    {post.title}
                  </span>
                  <span className="mt-2.5 block max-w-[68ch] leading-relaxed text-muted-foreground">
                    {post.description}
                  </span>
                  {post.topics.length > 0 ? (
                    <span className="mt-3 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                      {post.topics.map((topic) => `#${topic}`).join("  ")}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Record footer */}
      <section className="mt-4 flex flex-col gap-3 border-t border-border py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {visiblePosts.length} of {posts.length} rounds
          {filters.lane ? <> · lane <span className="text-accent">{filters.lane}</span></> : null}
          {filters.topic ? <> · topic <span className="text-accent">#{filters.topic}</span></> : null}
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.16em]">
          Newest first ·{" "}
          <Link href="/rss.xml" className="text-accent hover:underline">
            Subscribe via RSS
          </Link>
        </p>
      </section>
    </main>
  );
}
