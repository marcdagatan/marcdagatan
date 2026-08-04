"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchPost } from "@/components/search-types";

/**
 * Search results panel: publication-index rows with lane/format/date/reading
 * time, plus the loading, empty, and error states. Rendered inside the search
 * dialog; keyboard selection is handled by the parent.
 */

interface SearchResultsProps {
  query: string;
  results: SearchPost[];
  selectedIndex: number;
  indexCount: number;
  status: "loading" | "ready" | "error";
  onRetry: () => void;
  onNavigate: () => void;
}

export function SearchResults({
  query,
  results,
  selectedIndex,
  indexCount,
  status,
  onRetry,
  onNavigate,
}: SearchResultsProps) {
  if (status === "error") {
    return (
      <div className="px-6 py-12 text-center">
        <p className="font-medium text-foreground">The index failed to load.</p>
        <p className="mt-1 text-sm text-muted-foreground">Check the connection, or try again.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 border border-border px-4 py-2 text-sm text-foreground hover:border-accent hover:text-accent"
        >
          Retry
        </button>
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <ul className="divide-y divide-border py-1">
        {results.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              onClick={onNavigate}
              aria-current={index === selectedIndex ? "true" : undefined}
              className={cn(
                "block px-4 py-3.5 transition-colors duration-150",
                index === selectedIndex ? "bg-accent/10" : "hover:bg-foreground/5"
              )}
            >
              <div className="flex items-start gap-3">
                <FileText size={16} className="mt-1 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {post.lane} / {post.format} ·{" "}
                    <time dateTime={post.dateISO} className="whitespace-nowrap">
                      {post.displayDate}
                    </time>
                    {" · "}
                    {post.readingTime} min
                  </p>
                  <h3 className={cn("mt-1 truncate font-serif text-lg font-bold", index === selectedIndex ? "text-accent" : "text-foreground")}>
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  {post.topics.length > 0 ? (
                    <p className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                      {post.topics.slice(0, 3).map((topic) => `#${topic}`).join("  ")}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (query && status === "ready") {
    return (
      <div className="px-6 py-12 text-center">
        <p className="font-medium text-foreground">No rounds found.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a broader term, or browse the archive by lane and topic.
        </p>
        <Link href="/blog" onClick={onNavigate} className="mt-4 inline-block text-accent hover:underline">
          Browse the fight record →
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 text-center">
      <p className="font-medium text-foreground">
        {status === "loading" ? "Loading the index…" : "Search the publication"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Every essay, guide, review, and note: by title, thesis, lane, or topic.
        {indexCount > 0 ? ` ${indexCount} posts indexed.` : ""}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span><kbd className="rounded-sm bg-foreground/10 px-1.5 py-0.5 font-mono">↑↓</kbd> navigate</span>
        <span><kbd className="rounded-sm bg-foreground/10 px-1.5 py-0.5 font-mono">↵</kbd> select</span>
        <span><kbd className="rounded-sm bg-foreground/10 px-1.5 py-0.5 font-mono">esc</kbd> close</span>
      </div>
    </div>
  );
}
