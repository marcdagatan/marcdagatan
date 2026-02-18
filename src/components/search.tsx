"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchPost {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  dateISO: string;
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const [index, setIndex] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && index.length === 0) {
      setLoading(true);
      fetch("/api/posts-index")
        .then((res) => res.json())
        .then((data) => {
          setIndex(data.posts);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, index.length]);

  useEffect(() => {
    if (!query || index.length === 0) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(index, {
      keys: ["title", "description", "tags"],
      threshold: 0.3,
      includeScore: true,
    });

    const searchResults = fuse.search(query).slice(0, 5).map((r) => r.item);
    setResults(searchResults);
  }, [query, index]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground/80 border border-foreground/10 rounded-md transition-colors"
      >
        <SearchIcon size={16} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-xs bg-foreground/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative w-full max-w-lg mx-4 bg-[color:var(--background)] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <SearchIcon size={20} className="text-foreground/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground/40"
            autoFocus
          />
          {loading && <span className="text-xs text-foreground/40">Loading...</span>}
          <button onClick={handleClose}>
            <X size={20} className="text-foreground/50 hover:text-foreground" />
          </button>
        </div>
        {results.length > 0 && (
          <ul className="py-2">
            {results.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  onClick={handleClose}
                  className="block px-4 py-2 hover:bg-white/5"
                >
                  <h3 className="font-medium text-foreground">{post.title}</h3>
                  {post.description && (
                    <p className="text-sm text-foreground/50 line-clamp-1 mt-0.5">
                      {post.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {query && results.length === 0 && !loading && (
          <div className="px-4 py-8 text-center text-foreground/50">
            No results found
          </div>
        )}
        {!query && index.length > 0 && (
          <div className="px-4 py-2 text-xs text-foreground/40">
            Type to search {index.length} posts
          </div>
        )}
      </div>
    </div>
  );
}
