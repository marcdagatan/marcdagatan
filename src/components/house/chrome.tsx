"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { PUBLICATION_NAME } from "@/lib/site";
import { RoomLink } from "./room-link";
import { Search } from "@/components/search";
import { ARCHIVE_HREF, HOME_HREF, HOUSE_HREF, ROOM_IDS, ROOMS, roomHref, type Theme } from "./rooms";
import { useShell } from "./shell";

function badgeFor(theme: Theme): string {
  if (theme === "home") return "The house";
  if (theme === "house") return "Who lives here";
  return ROOMS[theme].badge;
}

/**
 * "page" only when the link is the current URL; "true" when the current page
 * merely belongs to that link's room (an essay in the room, /cv under The
 * House).
 */
function currentFor(pathname: string, href: string, themed: boolean): "page" | "true" | undefined {
  if (pathname === href) return "page";
  return themed ? "true" : undefined;
}

/**
 * The shared nav. One structure everywhere; each room restyles it in CSS
 * (sheet title block, fight-card bar, letterbox strip, notebook header).
 */
export function ShellNav() {
  const { theme } = useShell();
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // Sticky room meters and TOCs sit under the nav, whose height changes per
  // room and per breakpoint.
  useLayoutEffect(() => {
    const nav = ref.current;
    const root = nav?.closest<HTMLElement>(".ml-root");
    if (!nav || !root) return;
    const observer = new ResizeObserver(() => {
      root.style.setProperty("--ml-nav-h", `${nav.offsetHeight}px`);
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref} className="ml-nav">
      <div className="ml-nav-inner">
        <div className="ml-nav-id">
          <RoomLink href={HOME_HREF} className="ml-nav-mark">
            Marc Uy Dagatan
          </RoomLink>
          <span key={theme} className="ml-nav-badge" aria-live="polite">
            {badgeFor(theme)}
          </span>
        </div>
        <nav aria-label="Rooms" className="ml-nav-rooms">
          <ul>
            {ROOM_IDS.map((id) => (
              <li key={id} data-room={id}>
                <RoomLink
                  href={roomHref(id)}
                  aria-current={currentFor(pathname, roomHref(id), theme === id)}
                  className="ml-nav-link"
                >
                  <span aria-hidden="true" className="ml-swatch" />
                  <span className="ml-nav-label">{ROOMS[id].name}</span>
                </RoomLink>
              </li>
            ))}
            <li>
              <RoomLink
                href={HOUSE_HREF}
                aria-current={currentFor(pathname, HOUSE_HREF, theme === "house")}
                className="ml-nav-link ml-nav-house"
              >
                <span className="ml-nav-label">The House</span>
              </RoomLink>
            </li>
            <li>
              <RoomLink
                href={ARCHIVE_HREF}
                aria-current={pathname === ARCHIVE_HREF ? "page" : undefined}
                className="ml-nav-link"
              >
                <span className="ml-nav-label">Archive</span>
              </RoomLink>
            </li>
            <li className="ml-nav-search-item">
              <Search />
            </li>
          </ul>
        </nav>
      </div>
      <div aria-hidden="true" className="ml-progress">
        <span className="ml-progress-fill" />
      </div>
    </header>
  );
}

/**
 * Fixed texture layers, one per room. All are mounted; the active theme
 * fades its own in, which also replays that room's entrance choreography.
 */
export function ShellOverlays() {
  return (
    <div aria-hidden="true" className="ml-overlays">
      <div className="ml-ov ml-ov-engineering">
        <span className="ml-ov-ruler ml-ov-ruler-x" />
        <span className="ml-ov-ruler ml-ov-ruler-y" />
        <span className="ml-ov-scan" />
      </div>
      <div className="ml-ov ml-ov-ring">
        <span className="ml-ov-rope" />
        <span className="ml-ov-rope" />
        <span className="ml-ov-rope" />
        <span className="ml-ov-halftone" />
        <span className="ml-ov-flash" />
      </div>
      <div className="ml-ov ml-ov-screen">
        <span className="ml-ov-grain" />
        <span className="ml-ov-vignette" />
        <span className="ml-ov-bar ml-ov-bar-top" />
        <span className="ml-ov-bar ml-ov-bar-bottom" />
      </div>
      <div className="ml-ov ml-ov-life">
        <span className="ml-ov-paper" />
        <span className="ml-ov-bloom" />
      </div>
    </div>
  );
}

export function ShellFooter() {
  return (
    <footer className="ml-footer">
      <div className="ml-footer-inner">
        <div>
          <p className="ml-footer-title">{PUBLICATION_NAME}</p>
          <p className="ml-footer-sub">One archive, four rooms, no apology for the mix.</p>
        </div>
        <ul className="ml-footer-rooms">
          {ROOM_IDS.map((id) => (
            <li key={id} data-room={id}>
              <RoomLink href={roomHref(id)} className="ml-footer-link">
                <span aria-hidden="true" className="ml-swatch" />
                {ROOMS[id].name}
              </RoomLink>
            </li>
          ))}
        </ul>
        <ul className="ml-footer-links">
          <li>
            <a href="mailto:marc.dagatan@gmail.com">Email</a>
          </li>
          <li>
            <a href="https://github.com/marcdagatan" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/marc.uyyy/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <Link href={ARCHIVE_HREF}>Archive</Link>
          </li>
          <li>
            <Link href="/cv">CV</Link>
          </li>
          <li>
            <Link href="/rss.xml">RSS</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
