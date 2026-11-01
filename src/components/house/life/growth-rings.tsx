"use client";

import { useState } from "react";
import type { Piece } from "../data";
import { useSeen } from "../hooks";
import { RoomLink } from "../room-link";
import { postHref, ROOMS, type RoomId } from "../rooms";

/**
 * Every piece in the house as a growth ring, oldest at the heart. Rings
 * from this room are inked; the rest are pencil. Hover or focus a ring (or
 * its entry in the list) to read which year of the tree it is.
 */
export function GrowthRings({ pieces, room }: { pieces: Piece[]; room: RoomId }) {
  const [ref, seen] = useSeen<HTMLDivElement>(0.3);
  const oldestFirst = [...pieces].reverse();
  const [active, setActive] = useState<string | null>(null);
  const current = oldestFirst.find((piece) => piece.slug === active);
  const step = 172 / Math.max(1, oldestFirst.length);

  return (
    <div ref={ref} className="ml-growth" data-seen={seen ? "true" : undefined}>
      <div className="ml-growth-art">
        <svg viewBox="0 0 400 400" className="ml-growth-svg" aria-hidden="true">
          {oldestFirst.map((piece, index) => {
            const r = 22 + step * (index + 1);
            // A little wobble per ring, so it reads as grown, not plotted.
            const wobble = 1 + ((index * 37) % 7) / 220;
            return (
              <ellipse
                key={piece.slug}
                cx="200"
                cy="200"
                rx={r * wobble}
                ry={r}
                className="ml-growth-ring"
                data-mine={piece.room === room || undefined}
                data-active={active === piece.slug || undefined}
                style={{ "--i": index } as React.CSSProperties}
                onMouseEnter={() => setActive(piece.slug)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
          <circle cx="200" cy="200" r="9" className="ml-growth-heart" />
        </svg>
        <p className="ml-growth-caption" aria-live="polite">
          {current ? (
            <>
              <span className="ml-growth-year">{current.displayDate}</span>
              {current.title}
            </>
          ) : (
            <span className="ml-growth-hint">One ring per piece. Oldest in the middle.</span>
          )}
        </p>
      </div>

      <ol className="ml-growth-list" onMouseLeave={() => setActive(null)}>
        {oldestFirst.map((piece, index) => (
          <li key={piece.slug} data-mine={piece.room === room || undefined}>
            <RoomLink
              href={postHref(piece.slug)}
              className="ml-growth-link"
              onMouseEnter={() => setActive(piece.slug)}
              onFocus={() => setActive(piece.slug)}
              onBlur={() => setActive(null)}
            >
              <span className="ml-growth-n">Ring {index + 1}</span>
              <span className="ml-growth-title">{piece.title}</span>
              <span className="ml-growth-room">{ROOMS[piece.room].name}</span>
            </RoomLink>
          </li>
        ))}
      </ol>
    </div>
  );
}
