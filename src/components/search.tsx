"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search as SearchIcon, X, FileText, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < results.length - 1 ? prev + 1 : prev
          );
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
        if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault();
          window.location.href = `/blog/${results[selectedIndex].slug}`;
          handleClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleClose]);

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
      setSelectedIndex(-1);
      return;
    }

    const fuse = new Fuse(index, {
      keys: ["title", "description", "tags"],
      threshold: 0.3,
      includeScore: true,
    });

    const searchResults = fuse.search(query).slice(0, 5).map((r) => r.item);
    setResults(searchResults);
    setSelectedIndex(-1);
  }, [query, index]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground border border-border rounded-md transition-all duration-200 hover:border-accent/50 hover:bg-accent/5"
      >
        <SearchIcon size={16} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-xs bg-foreground/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-xl mx-4 bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          {loading ? (
            <Loader2 size={20} className="text-accent animate-spin" />
          ) : (
            <SearchIcon size={20} className="text-muted-foreground" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
            autoFocus
          />
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-foreground/10 rounded-md transition-colors"
            aria-label="Close search"
          >
            <X size={18} className="text-muted-foreground hover:text-foreground" />
          </button>
        </div>
        
        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 && (
            <ul className="py-2">
              {results.map((post, index) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={handleClose}
                    className={`block px-4 py-3 mx-2 rounded-lg transition-all duration-150 ${
                      index === selectedIndex 
                        ? "bg-accent/10 border border-accent/30" 
                        : "hover:bg-foreground/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${index === selectedIndex ? "text-accent" : "text-foreground"}`}>
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            {post.description}
                          </p>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="muted" className="text-[10px]">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          
          {query && results.length === 0 && !loading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 mb-4">
                <SearchIcon size={24} className="text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">No results found</p>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}
          
          {!query && !loading && (
            <div className="px-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                <Sparkles size={24} className="text-accent" />
              </div>
              <p className="text-foreground font-medium mb-1">Search posts</p>
              <p className="text-sm text-muted-foreground mb-4">
                Type to search {index.length > 0 ? `${index.length} posts` : "posts"}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <kbd className="px-2 py-1 text-xs bg-foreground/10 rounded">↑↓</kbd>
                <span className="text-xs text-muted-foreground">to navigate</span>
                <kbd className="px-2 py-1 text-xs bg-foreground/10 rounded">↵</kbd>
                <span className="text-xs text-muted-foreground">to select</span>
                <kbd className="px-2 py-1 text-xs bg-foreground/10 rounded">esc</kbd>
                <span className="text-xs text-muted-foreground">to close</span>
              </div>
            </div>
          )}
        </div>
        
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-border bg-foreground/5 flex items-center justify-between text-xs text-muted-foreground">
            <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-background rounded border">↑↓</kbd>
              <span>navigate</span>
              <kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd>
              <span>select</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
