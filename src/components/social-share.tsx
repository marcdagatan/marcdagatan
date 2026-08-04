"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { SITE_URL } from "@/lib/site";

/**
 * Permanently fixed share bar for article pages.
 *
 * Publication apparatus, not a social widget: slim, flat, safe-area aware,
 * monochrome until the copy state needs feedback. Copy Link reports both
 * success and failure (offering the raw URL when the clipboard is blocked).
 * All controls carry accessible names; article pages add bottom padding so the
 * bar never covers the ending.
 */

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type CopyState = "idle" | "copied" | "failed";

interface SocialShareProps {
  title: string;
  slug: string;
}

export function SocialShare({ title, slug }: SocialShareProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `${SITE_URL}/blog/${slug}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
    }
  };

  const actionClass =
    "inline-flex min-h-11 items-center gap-2 border border-transparent px-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:border-border hover:text-foreground sm:min-h-9";

  return (
    <div className="share-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <span className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground md:block">
          Share this round
        </span>

        <div className="ml-auto flex items-center gap-1">
          <span role="status" className="sr-only">
            {copyState === "copied"
              ? "Link copied"
              : copyState === "failed"
                ? "Copying failed: use the link below"
                : ""}
          </span>
          {copyState === "failed" ? (
            <span className="mr-2 hidden max-w-[28rem] truncate font-mono text-[0.6875rem] text-muted-foreground sm:block">
              Copy blocked; the link: {url}
            </span>
          ) : null}

          <button type="button" onClick={() => handleShare("twitter")} className={actionClass} aria-label={`Share "${title}" on X`}>
            <XIcon size={15} />
            <span className="hidden sm:inline">X</span>
          </button>

          <button type="button" onClick={() => handleShare("linkedin")} className={actionClass} aria-label={`Share "${title}" on LinkedIn`}>
            <LinkedinIcon />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-border sm:block" />

          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={copyState === "copied" ? "Link copied" : "Copy article link"}
            className={`${actionClass} ${
              copyState === "copied"
                ? "border-accent/60 text-accent"
                : copyState === "failed"
                  ? "border-border text-error"
                  : ""
            }`}
          >
            {copyState === "copied" ? <Check size={15} /> : <Link2 size={15} />}
            <span className="hidden sm:inline">
              {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy Link"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  );
}
