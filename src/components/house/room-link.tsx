"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useShell } from "./shell";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Morph the closest `[data-morph]` ancestor (or the link) into the next hero. */
  morph?: boolean;
};

/** A link that navigates through the shell's room transition. */
export function RoomLink({ href, morph, onClick, ...rest }: Props) {
  const { navigate } = useShell();

  return (
    <Link
      href={href}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        const target = event.currentTarget;
        const morphEl = morph ? (target.closest<HTMLElement>("[data-morph]") ?? target) : null;
        const point =
          event.clientX || event.clientY
            ? { x: event.clientX, y: event.clientY }
            : (() => {
                const rect = target.getBoundingClientRect();
                return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
              })();
        navigate(href, { morph: morphEl, point });
      }}
    />
  );
}
