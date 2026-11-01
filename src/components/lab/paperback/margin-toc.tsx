"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/toc";

/**
 * The chapter's table of contents, set in the outer margin.
 *
 * Tracks the heading currently at the top of the reading column so the margin
 * stays a live map of the chapter rather than a static list. Hidden below the
 * desktop breakpoint, where the margin does not exist.
 */
export function MarginToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !active || nav.offsetParent === null) return;

    const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!link) return;

    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const margin = 12;

    if (linkBox.top < navBox.top + margin) {
      nav.scrollTop -= navBox.top + margin - linkBox.top;
    } else if (linkBox.bottom > navBox.bottom - margin) {
      nav.scrollTop += linkBox.bottom - (navBox.bottom - margin);
    }
  }, [active]);

  useEffect(() => {
    const scroller = document.getElementById("pb-scroll");
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (navRef.current && navRef.current.offsetParent === null) return;
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      let current = items[0]?.id ?? null;

      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (!heading) continue;
        if (heading.getBoundingClientRect().top - top <= 140) {
          current = item.id;
        }
      }

      setActive((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    const target = scroller ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav ref={navRef} className="pb-margin-toc" aria-label="In this chapter">
      <p className="pb-margin-label">In this chapter</p>
      <ol className="pb-margin-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              item.level === 3 ? "pb-margin-item pb-margin-item--sub" : "pb-margin-item"
            }
          >
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={active === item.id ? "is-active" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
