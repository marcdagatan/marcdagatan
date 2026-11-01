"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type Fuse from "fuse.js";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchResults } from "@/components/search-results";
import type { SearchPost } from "@/components/search-types";
import { SEARCH_OPTIONS } from "@/lib/search";

/**
 * Publication-index search dialog.
 *
 * Fuse.js is lazy-loaded only when the dialog opens and a query is typed, so
 * it never enters the initial site bundle. Results show editorial context:
 * title, thesis, lane, format, date, reading time, topics. Keyboard: ⌘K opens,
 * ↑↓ navigate, Enter selects, Esc closes.
 */

type IndexState = "idle" | "loading" | "ready" | "error";

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const [index, setIndex] = useState<SearchPost[]>([]);
  const [indexState, setIndexState] = useState<IndexState>("idle");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const loadIndex = useCallback(() => {
    setIndexState("loading");
    fetch("/api/posts-index")
      .then((res) => {
        if (!res.ok) throw new Error(`Index request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setIndex(data.posts ?? []);
        setIndexState("ready");
      })
      .catch(() => setIndexState("error"));
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  }, []);

  // ⌘K / Ctrl-K toggles the dialog.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load the index the first time the dialog opens.
  useEffect(() => {
    if (isOpen && indexState === "idle") loadIndex();
  }, [isOpen, indexState, loadIndex]);

  // Keyboard navigation while open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
      if (e.key === "Enter") {
        const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
        if (target) {
          e.preventDefault();
          window.location.href = `/blog/${target.slug}`;
          handleClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleClose]);

  // Lazy-load Fuse.js: not part of the initial bundle for any visitor.
  useEffect(() => {
    let cancelled = false;
    if (!query || index.length === 0 || indexState !== "ready") {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    let fuse: Fuse<SearchPost> | null = null;
    import("fuse.js").then(({ default: FuseModule }) => {
      if (cancelled) return;
      fuse = new FuseModule<SearchPost>(index, SEARCH_OPTIONS);
      setResults(fuse.search(query).slice(0, 6).map((r) => r.item));
      setSelectedIndex(-1);
    });

    return () => {
      cancelled = true;
      fuse = null;
    };
  }, [query, index, indexState]);

  // Keep the selected result visible while navigating.
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Search the publication"
          className="ml-nav-search"
        >
          <SearchIcon size={15} aria-hidden="true" />
          <span className="ml-nav-search-label">Search</span>
          <kbd className="ml-nav-search-kbd">⌘K</kbd>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl gap-0 border-border p-0">
        <DialogTitle className="sr-only">Search the publication</DialogTitle>
        <DialogDescription className="sr-only">
          Search every essay, guide, review, and note by title, thesis, lane,
          or topic.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          {indexState === "loading" ? (
            <Loader2 size={18} className="animate-spin text-accent" aria-hidden="true" />
          ) : (
            <SearchIcon size={18} className="text-muted-foreground" aria-hidden="true" />
          )}
          <input
            type="text"
            placeholder="Search essays, guides, and reviews…"
            aria-label="Search posts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            autoFocus
          />
        </div>

        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
          <SearchResults
            query={query}
            results={results}
            selectedIndex={selectedIndex}
            indexCount={index.length}
            status={indexState === "error" ? "error" : indexState === "loading" ? "loading" : "ready"}
            onRetry={loadIndex}
            onNavigate={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
