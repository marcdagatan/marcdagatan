import type { ReactNode } from "react";
import { pad, type RoomId } from "../rooms";

const TAG: Record<RoomId, (n: number) => string> = {
  engineering: (n) => String(n),
  ring: (n) => `Round ${n}`,
  screen: (n) => `Scene ${pad(n)}`,
  life: (n) => `no. ${n}`,
};

/**
 * A post's section heading, dressed in its room's grammar: editor lines with
 * a gutter, rounds, scene slates, or numbered journal notes. Engineering and Life
 * also annotate the margin with the reading minute the section starts at.
 */
export function SectionHeading({
  room,
  level,
  index,
  minute,
  id,
  children,
}: {
  room: RoomId;
  level: 2 | 3;
  index: number;
  minute?: number;
  id?: string;
  children?: ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  const margin =
    minute === undefined
      ? null
      : room === "engineering"
        ? minute === 0
          ? "// start"
          : `// ${minute} min in`
        : room === "life"
          ? minute === 0
            ? "right at the start"
            : `about ${minute} min in`
          : null;

  return (
    <Tag id={id} className="ml-sec" data-level={level}>
      <span className="ml-sec-tag" aria-hidden="true">
        {room === "screen" ? <span className="ml-sec-clap" /> : null}
        {TAG[room](index + 1)}
      </span>
      <span className="ml-sec-text">{children}</span>
      {margin ? (
        <span className="ml-sec-margin" aria-hidden="true">
          {margin}
        </span>
      ) : null}
    </Tag>
  );
}
