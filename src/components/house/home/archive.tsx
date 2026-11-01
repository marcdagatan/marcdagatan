"use client";

import { useState } from "react";
import { RoomLink } from "../room-link";
import { postHref, ROOM_IDS, ROOMS, type RoomId } from "../rooms";

export type ArchiveEntry = {
  slug: string;
  title: string;
  room: RoomId;
  rooms: RoomId[];
  dateISO: string;
  displayDate: string;
  readingTime: number;
};

/** Every piece across the house. Choosing a room filters the list. */
export function Archive({ entries }: { entries: ArchiveEntry[] }) {
  const [filter, setFilter] = useState<RoomId | "all">("all");
  const visible = filter === "all" ? entries : entries.filter((entry) => entry.rooms.includes(filter));

  return (
    <div className="ml-archive">
      <div role="group" aria-label="Filter by room" className="ml-archive-filters">
        <button type="button" aria-pressed={filter === "all"} className="ml-chip" onClick={() => setFilter("all")}>
          All rooms <span className="ml-chip-count">{entries.length}</span>
        </button>
        {ROOM_IDS.map((id) => (
          <button
            key={id}
            type="button"
            data-room={id}
            aria-pressed={filter === id}
            className="ml-chip"
            onClick={() => setFilter(id)}
          >
            <span aria-hidden="true" className="ml-swatch" />
            {ROOMS[id].name}
            <span className="ml-chip-count">{entries.filter((entry) => entry.rooms.includes(id)).length}</span>
          </button>
        ))}
      </div>

      <ol key={filter} className="ml-archive-list" aria-live="polite">
        {visible.map((entry, index) => (
          <li key={entry.slug} data-room={entry.room} className="ml-archive-row" style={{ "--i": index } as React.CSSProperties}>
            <RoomLink href={postHref(entry.slug)} className="ml-archive-link">
              <span className="ml-archive-room">
                <span aria-hidden="true" className="ml-swatch" />
                {ROOMS[entry.room].name}
              </span>
              <span className="ml-archive-title">{entry.title}</span>
              <span className="ml-archive-meta">
                <time dateTime={entry.dateISO}>{entry.displayDate}</time>
                <span>{entry.readingTime} min</span>
              </span>
            </RoomLink>
          </li>
        ))}
      </ol>
    </div>
  );
}
