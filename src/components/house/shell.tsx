"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveKind, resolveTheme, ROOMS, type RoomId, type Theme } from "./rooms";

type NavigateOptions = {
  /** Element that should morph into the destination hero. */
  morph?: HTMLElement | null;
  /** Viewport point the transition grows from (Life's ink spread). */
  point?: { x: number; y: number };
};

type ShellApi = {
  /**
   * Theme painted on the shell. It follows the route only: the site changes
   * palette when you walk into a room, never from pointer movement or filters.
   */
  theme: Theme;
  navigate: (href: string, options?: NavigateOptions) => void;
};

const ShellContext = createContext<ShellApi | null>(null);

export function useShell(): ShellApi {
  const api = useContext(ShellContext);
  if (!api) throw new Error("useShell must be used inside ManyLivesShell");
  return api;
}

const NAV_TIMEOUT_MS = 3000;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The persistent frame of The Many Lives. It survives route changes, owns
 * the painted theme, and runs room-to-room navigation through the View
 * Transitions API so the whole site appears to transform. Without View
 * Transitions, the registered color properties still animate.
 */
export function ManyLivesShell({
  slugRooms,
  children,
}: {
  slugRooms: Record<string, RoomId>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = resolveTheme(pathname, slugRooms);
  const finishNavigation = useRef<(() => void) | null>(null);

  const kind = resolveKind(pathname);

  // New route committed (the router has already reset window scroll): release
  // any view transition waiting on this navigation.
  useLayoutEffect(() => {
    finishNavigation.current?.();
    finishNavigation.current = null;
  }, [pathname]);

  useFavicon(theme);

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      const html = document.documentElement;
      const url = new URL(href, window.location.href);
      const here = window.location;
      // Same path: nothing to transition into. The new route would never
      // commit a pathname change, so a transition would sit out the timeout.
      if (url.pathname === here.pathname) {
        if (url.search !== here.search) router.push(href);
        return;
      }
      const target = resolveTheme(url.pathname, slugRooms);
      if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      html.dataset.mlTo = target;
      const point = options.point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      html.style.setProperty("--ml-vt-x", `${point.x}px`);
      html.style.setProperty("--ml-vt-y", `${point.y}px`);
      // The source carries the name for the old snapshot only. The target hero
      // is named (via html[data-ml-morph]) inside the update callback, after
      // the old snapshot, so no capture phase ever sees "ml-hero" twice.
      if (options.morph) options.morph.style.viewTransitionName = "ml-hero";

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            if (options.morph) {
              options.morph.style.viewTransitionName = "";
              html.dataset.mlMorph = "true";
            }
            const timer = window.setTimeout(resolve, NAV_TIMEOUT_MS);
            finishNavigation.current = () => {
              window.clearTimeout(timer);
              resolve();
            };
            router.push(href);
          })
      );
      transition.finished.finally(() => {
        delete html.dataset.mlTo;
        delete html.dataset.mlMorph;
      });
    },
    [router, slugRooms]
  );

  const api = useMemo<ShellApi>(
    () => ({
      theme,
      navigate,
    }),
    [theme, navigate]
  );

  return (
    <ShellContext.Provider value={api}>
      <div
        data-theme={theme}
        data-route={theme}
        data-kind={kind}
        className="ml-root"
      >
        {children}
      </div>
    </ShellContext.Provider>
  );
}

/* Favicon ------------------------------------------------------------------- */

function faviconFor(theme: Theme): string {
  let body: string;
  if (theme === "home" || theme === "house") {
    body = [
      `<rect width="16" height="16" fill="${ROOMS.engineering.field}"/>`,
      `<rect x="16" width="16" height="16" fill="${ROOMS.ring.field}"/>`,
      `<rect y="16" width="16" height="16" fill="#0f1626"/>`,
      `<rect x="16" y="16" width="16" height="16" fill="${ROOMS.life.field}"/>`,
    ].join("");
  } else {
    const room = ROOMS[theme];
    // Engineering wears a shell prompt; the other rooms their initial.
    const glyph = theme === "engineering" ? "&gt;_" : room.name[0];
    const font = theme === "engineering" ? "Menlo,Consolas,monospace" : "Helvetica,Arial,sans-serif";
    const size = theme === "engineering" ? 15 : 20;
    const baseline = theme === "engineering" ? 21 : 23;
    body = `<rect width="32" height="32" rx="${theme === "life" ? 16 : 3}" fill="${room.field}"/><text x="16" y="${baseline}" text-anchor="middle" font-family="${font}" font-weight="700" font-size="${size}" fill="${room.ink}">${glyph}</text>`;
  }
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${body}</svg>`)}`;
}

/** Swaps in a room favicon while the prototype is mounted. */
function useFavicon(theme: Theme) {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[data-ml-icon]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.dataset.mlIcon = "true";
      document.head.appendChild(link);
    }
    link.href = faviconFor(theme);
  }, [theme]);

  useEffect(
    () => () => {
      document.querySelector("link[data-ml-icon]")?.remove();
    },
    []
  );
}
