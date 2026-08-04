"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

/**
 * Table of contents for long essays.
 *
 * Desktop: quiet sticky rail beside the prose column with a bounded height and
 * thin scrollbar; the active item scrolls itself into view inside the rail.
 * Mobile: "In this essay (N sections)" disclosure whose expanded list is
 * bounded to half the viewport and scrolls internally. One small client island
 * tracks the active section with an IntersectionObserver and highlights it
 * (border + color, not color-only). Motion is limited to the disclosure and
 * current-section feedback and respects reduced motion.
 */

interface ArticleTocProps {
  headings: TocItem[];
}

export function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);
        if (visible.length > 0) setActiveId(visible[visible.length - 1]);
      },
      // A heading counts as "current" while it sits in the upper reading band.
      { rootMargin: "-10% 0px -65% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  // Keep the active rail item visible inside the bounded rail without ever
  // scrolling the page itself.
  useEffect(() => {
    const rail = railRef.current;
    const item = rail?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!rail || !item || rail.clientHeight === 0) return;

    const railRect = rail.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const top = itemRect.top - railRect.top;
    const bottom = itemRect.bottom - railRect.top;

    if (top < 0) {
      rail.scrollTop += top;
    } else if (bottom > rail.clientHeight) {
      rail.scrollTop += bottom - rail.clientHeight;
    }
  }, [activeId]);

  const itemClass = (id: string) =>
    cn(
      "block whitespace-normal break-words border-l py-1 pl-3 font-sans text-[0.8125rem] leading-snug transition-colors duration-150",
      id === activeId
        ? "border-accent text-foreground"
        : "border-border text-muted-foreground hover:text-foreground"
    );

  const levelClass = (level: number) => (level === 3 ? "pl-6" : "pl-3");

  return (
    <nav aria-label="In this essay" className="font-sans">
      {/* Mobile disclosure */}
      <div className="border-b border-border lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={regionId}
          className="flex w-full items-center justify-between py-3 text-left"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            In this essay · {headings.length} {headings.length === 1 ? "section" : "sections"}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
              open ? "rotate-90" : "rotate-0"
            )}
          >
            ›
          </span>
        </button>
        <div
          id={regionId}
          className={cn(
            "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="toc-mobile-scroll pb-3">
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      aria-current={heading.id === activeId ? "true" : undefined}
                      title={heading.text}
                      className={cn(itemClass(heading.id), levelClass(heading.level))}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop rail */}
      <div
        ref={railRef}
        className="toc-rail hidden lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-x-hidden lg:overflow-y-auto lg:pr-2"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          In this essay
        </p>
        <ul className="mt-4 space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={heading.id === activeId ? "true" : undefined}
                title={heading.text}
                className={cn(itemClass(heading.id), levelClass(heading.level))}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
