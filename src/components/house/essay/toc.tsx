"use client";

import type { TocItem } from "@/lib/toc";
import { useActiveSection, useReadingProgress } from "../hooks";
import { pad, type RoomId } from "../rooms";

export const ARTICLE_ID = "ml-article";

const TITLES: Record<RoomId, string> = {
  engineering: "Outline",
  ring: "Rounds",
  screen: "Scene list",
  life: "In this entry",
};

const EMPTY: Record<RoomId, string> = {
  engineering: "One file, no sections.",
  ring: "One long round. No bell until the end.",
  screen: "One continuous take.",
  life: "One page, no breaks.",
};

function label(room: RoomId, index: number): string {
  if (room === "engineering") return `#${index + 1}`;
  if (room === "ring") return `R${index + 1}`;
  if (room === "screen") return `Sc.${pad(index + 1)}`;
  return `${index + 1}.`;
}

/** The room's table of contents, tracking the section being read. */
export function EssayToc({
  room,
  sections,
  minuteAt,
}: {
  room: RoomId;
  sections: TocItem[];
  minuteAt: Record<string, number>;
}) {
  const active = useActiveSection(sections.map((section) => section.id));

  return (
    <nav aria-label={TITLES[room]} className="ml-toc" style={{ "--active": Math.max(0, active) } as React.CSSProperties}>
      <p className="ml-toc-title">{TITLES[room]}</p>
      {sections.length === 0 ? (
        <p className="ml-toc-empty">{EMPTY[room]}</p>
      ) : (
        <ol className="ml-toc-list">
          {sections.map((section, index) => (
            <li key={section.id} data-state={index < active ? "done" : index === active ? "now" : undefined}>
              <a href={`#${section.id}`} aria-current={index === active ? "location" : undefined}>
                <span className="ml-toc-n">{label(room, index)}</span>
                <span className="ml-toc-text">{section.text}</span>
                {room === "engineering" && minuteAt[section.id] !== undefined ? (
                  <span className="ml-toc-min">{minuteAt[section.id]}′</span>
                ) : null}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}

function timecode(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

/**
 * Ring and Screen carry a sticky meter under the nav: a round counter with
 * a bell that shakes when the round changes, or a projector timecode.
 */
export function StickyMeter({
  room,
  sections,
  readingTime,
}: {
  room: "ring" | "screen";
  sections: TocItem[];
  readingTime: number;
}) {
  const active = useActiveSection(sections.map((section) => section.id));
  const progress = useReadingProgress(ARTICLE_ID);
  const total = Math.max(1, sections.length);
  const current = sections.length === 0 ? (progress > 0 ? 1 : 0) : Math.max(0, active + 1);

  if (room === "ring") {
    return (
      <div className="ml-meter ml-meter-ring" aria-hidden="true">
        <div className="ml-meter-inner">
          <svg key={current} className="ml-meter-bell" viewBox="0 0 64 64">
            <path d="M32 8a4 4 0 0 1 4 4v2.4c8 1.8 13 8.6 13 17.6v10l5 6H10l5-6V32c0-9 5-15.8 13-17.6V12a4 4 0 0 1 4-4Z" fill="currentColor" />
            <circle cx="32" cy="54" r="5" fill="currentColor" />
          </svg>
          <span className="ml-meter-label">
            {current === 0 ? "Walkout" : progress >= 0.995 ? "Final bell" : `Round ${current} of ${total}`}
          </span>
          <ol className="ml-meter-rounds">
            {Array.from({ length: total }, (_, index) => (
              <li key={index} data-state={index + 1 < current || progress >= 0.995 ? "done" : index + 1 === current ? "now" : undefined} />
            ))}
          </ol>
        </div>
      </div>
    );
  }

  const runtime = readingTime * 60;
  return (
    <div className="ml-meter ml-meter-screen" aria-hidden="true">
      <div className="ml-meter-inner">
        <span className="ml-meter-rec" data-on={progress > 0 && progress < 1 ? "true" : undefined} />
        <span className="ml-meter-label">{current === 0 ? "Opening titles" : `Scene ${pad(current)}`}</span>
        <span className="ml-meter-tc">
          {timecode(progress * runtime)} <span>/ {timecode(runtime)}</span>
        </span>
      </div>
    </div>
  );
}
