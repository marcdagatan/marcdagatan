"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Clears the global site's chrome out of the accessibility tree while the
 * Paperback shell is open. The shell covers the header and footer visually;
 * inert also stops a keyboard reader from tabbing into the hidden site.
 *
 * Also resets the shell's own scroll on navigation. The layout persists
 * between chapters, so without this a reader could land halfway down the
 * next essay.
 */
export function ShellChrome() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = [
      document.querySelector<HTMLElement>(".site-header"),
      document.querySelector<HTMLElement>(".site-footer"),
      document.querySelector<HTMLElement>('body > a[href="#main-content"]'),
    ].filter((target): target is HTMLElement => Boolean(target));

    for (const target of targets) target.setAttribute("inert", "");

    return () => {
      for (const target of targets) target.removeAttribute("inert");
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    const shell = document.getElementById("pb-scroll");
    if (shell) shell.scrollTop = 0;
  }, [pathname]);

  return null;
}
