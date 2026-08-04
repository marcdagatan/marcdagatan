"use client";

import { useState } from "react";
import type { Topic } from "@/lib/posts";
import { TOPIC_INTROS } from "@/lib/topics";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TopicsDialogContentProps {
  topics: { topic: Topic; count: number }[];
  postCount: number;
  selectedTopic: Topic | null;
  onSelect: (topic: Topic | null) => void;
  onClose: () => void;
}

/**
 * The single topics browsing dialog content.
 *
 * Only one Dialog instance exists on the archive page; both the lane row and
 * the footer trigger open it. Flat editorial rows: topic, one-line intro,
 * post count. Selection applies the URL filter and closes.
 */
export function TopicsDialogContent({
  topics,
  postCount,
  selectedTopic,
  onSelect,
  onClose,
}: TopicsDialogContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = searchQuery
    ? topics.filter(({ topic }) => topic.includes(searchQuery.toLowerCase()))
    : topics;

  const handleSelect = (topic: Topic | null) => {
    onSelect(topic);
    onClose();
  };

  return (
    <DialogContent className="max-w-xl gap-0 border-border p-0">
      <div className="border-b border-border px-6 pb-5 pt-6">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-bold tracking-tight">
            Browse topics
          </DialogTitle>
          <DialogDescription className="mt-1 font-mono text-xs uppercase tracking-[0.16em]">
            {topics.length} curated topics · {postCount} posts
          </DialogDescription>
        </DialogHeader>

        <label className="mt-4 block">
          <span className="sr-only">Search topics</span>
          <input
            type="text"
            placeholder="Find a topic…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-sm border border-border bg-elevated px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-accent"
            autoFocus
          />
        </label>
      </div>

      <div className="max-h-[55vh] overflow-y-auto px-2 py-2">
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={cn(
            "flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left transition-colors duration-150",
            selectedTopic === null
              ? "bg-accent/10 text-foreground"
              : "hover:bg-foreground/5"
          )}
        >
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
            All topics
          </span>
          <span className="font-mono text-xs text-muted-foreground">{postCount} posts</span>
        </button>

        <div className="divide-y divide-border">
          {filteredTopics.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No topics match &ldquo;{searchQuery}&rdquo;
            </p>
          ) : (
            filteredTopics.map(({ topic, count }) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleSelect(topic)}
                aria-pressed={selectedTopic === topic}
                className={cn(
                  "flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left transition-colors duration-150",
                  selectedTopic === topic
                    ? "bg-accent/10 text-foreground"
                    : "hover:bg-foreground/5"
                )}
              >
                <span className="min-w-0">
                  <span className="block font-serif text-lg font-bold leading-snug">
                    <span className="text-accent">#</span>
                    {topic}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {TOPIC_INTROS[topic]}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {count} {count === 1 ? "post" : "posts"}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <p className="border-t border-border px-6 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
        Pick a topic to filter the record · Esc closes
      </p>
    </DialogContent>
  );
}
