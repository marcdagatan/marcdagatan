import Image from "next/image";
import Link from "next/link";
import type { Piece } from "../data";
import { Door } from "../door";
import { PointerField } from "../pointer-field";
import { RoomLink } from "../room-link";
import { pad, ROOMS, roomHref, type RoomId } from "../rooms";

export type EssayInfo = {
  piece: Piece;
  /** Position of the piece in its room's list, 1-based. */
  number: number;
  alsoIn: RoomId[];
  updatedDisplayDate?: string;
};

function BackToRoom({ room, label }: { room: RoomId; label: string }) {
  return (
    <RoomLink href={roomHref(room)} className="ml-ess-back ml-door-host">
      <Door className="ml-ess-back-door" />
      <span className="ml-u">{label}</span>
    </RoomLink>
  );
}

function AlsoIn({ rooms, label }: { rooms: RoomId[]; label: string }) {
  if (rooms.length === 0) return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd className="ml-ess-also">
        {rooms.map((id) => (
          <RoomLink key={id} href={roomHref(id)} className="ml-u">
            {ROOMS[id].name}
          </RoomLink>
        ))}
      </dd>
    </div>
  );
}

/** Topic links into the public /blog/tag collections. */
function Topics({ topics, label }: { topics: Piece["topics"]; label: string }) {
  if (topics.length === 0) return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd className="ml-ess-also">
        {topics.map((topic) => (
          <Link key={topic} href={`/blog/tag/${encodeURIComponent(topic)}`} className="ml-u">
            #{topic}
          </Link>
        ))}
      </dd>
    </div>
  );
}

/** The frontmatter header image, framed by the room's hero styles. */
function HeaderPlate({ piece }: { piece: Piece }) {
  if (!piece.headerImage) return null;
  return (
    <figure className="ml-ess-plate">
      <Image
        src={piece.headerImage}
        alt={`Header image for ${piece.title}`}
        fill
        priority
        sizes="(min-width: 1280px) 1184px, 100vw"
        className="ml-ess-plate-img"
      />
    </figure>
  );
}

/** Each room's essay opening. */
export function EssayHero({ room, info }: { room: RoomId; info: EssayInfo }) {
  const { piece } = info;
  const sections = piece.sections;

  if (room === "engineering") {
    return (
      <PointerField className="ml-ess-hero ml-eng-hero ml-hero-morph">
        <div aria-hidden="true" className="ml-eng-grid" />
        <div aria-hidden="true" className="ml-eng-cross">
          <span className="ml-eng-cross-x" />
          <span className="ml-eng-cross-y" />
        </div>
        <div className="ml-wrap ml-eng-hero-inner">
          <BackToRoom room={room} label="Drawing set" />
          <p className="ml-eng-kicker">
            Sheet A-{pad(info.number)} · {piece.format}
          </p>
          <h1 className="ml-ess-title ml-display">{piece.title}</h1>
          <p className="ml-ess-desc">{piece.description}</p>
          <dl className="ml-eng-block" aria-label="Title block">
            <div><dt>Issued</dt><dd><time dateTime={piece.dateISO}>{piece.displayDate}</time></dd></div>
            {info.updatedDisplayDate ? <div><dt>Revised</dt><dd>{info.updatedDisplayDate}</dd></div> : null}
            <div><dt>Sections</dt><dd>{sections || "—"}</dd></div>
            <div><dt>Words</dt><dd>{piece.words.toLocaleString("en-US")}</dd></div>
            <div><dt>Est. read</dt><dd>{piece.readingTime} min</dd></div>
            <AlsoIn rooms={info.alsoIn} label="Cross-ref" />
            <Topics topics={piece.topics} label="Tags" />
          </dl>
          <HeaderPlate piece={piece} />
        </div>
      </PointerField>
    );
  }

  if (room === "ring") {
    const rounds = Math.max(1, sections);
    return (
      <header className="ml-ess-hero ml-ring-hero ml-hero-morph">
        <div aria-hidden="true" className="ml-ring-burst" />
        <div aria-hidden="true" className="ml-ring-halftone" />
        <div className="ml-wrap ml-ring-hero-inner">
          <BackToRoom room={room} label="Back to the card" />
          <p className="ml-ring-billing">
            <span className="ml-ring-tag">Bout {pad(info.number)}</span>
            <span>Scheduled for {rounds} {rounds === 1 ? "round" : "rounds"}</span>
          </p>
          <h1 className="ml-ess-title ml-display ml-rope-head">{piece.title}</h1>
          <p className="ml-ess-desc">{piece.description}</p>
          <dl className="ml-ring-stats">
            <div><dt>Rounds</dt><dd>{rounds}</dd></div>
            <div><dt>Weigh-in</dt><dd>{piece.words.toLocaleString("en-US")} words</dd></div>
            <div><dt>Fight time</dt><dd>{piece.readingTime} min</dd></div>
            <div><dt>Date</dt><dd><time dateTime={piece.dateISO}>{piece.displayDate}</time></dd></div>
            <AlsoIn rooms={info.alsoIn} label="Also fights in" />
            <Topics topics={piece.topics} label="Topics" />
          </dl>
          <HeaderPlate piece={piece} />
        </div>
      </header>
    );
  }

  if (room === "screen") {
    const scenes = Math.max(1, sections);
    return (
      <PointerField className="ml-ess-hero ml-scr-hero ml-hero-morph">
        <div aria-hidden="true" className="ml-scr-spot" />
        <div className="ml-wrap ml-scr-hero-inner">
          <BackToRoom room={room} label="Back to the program" />
          <p className="ml-scr-presents">A Marc Uy Dagatan picture</p>
          <h1 className="ml-ess-title ml-display">{piece.title}</h1>
          <p className="ml-ess-desc">{piece.description}</p>
          <dl className="ml-scr-stats">
            <div><dt>Running time</dt><dd>{piece.readingTime} min</dd></div>
            <div><dt>Scenes</dt><dd>{scenes}</dd></div>
            <div><dt>Genre</dt><dd>{piece.format}</dd></div>
            <div><dt>Premiered</dt><dd><time dateTime={piece.dateISO}>{piece.displayDate}</time></dd></div>
            <AlsoIn rooms={info.alsoIn} label="Also screening in" />
            <Topics topics={piece.topics} label="Topics" />
          </dl>
          <HeaderPlate piece={piece} />
        </div>
      </PointerField>
    );
  }

  return (
    <header className="ml-ess-hero ml-life-hero ml-hero-morph">
      <div aria-hidden="true" className="ml-life-ink" />
      <div className="ml-wrap ml-life-hero-inner">
        <BackToRoom room={room} label="Back to the notebook" />
        <p className="ml-life-date">
          <time dateTime={piece.dateISO}>{piece.displayDate}</time>
        </p>
        <h1 className="ml-ess-title ml-display">{piece.title}</h1>
        <p className="ml-ess-desc">{piece.description}</p>
        <dl className="ml-life-stats">
          <div><dt>Page</dt><dd>{info.number}</dd></div>
          <div><dt>Reading</dt><dd>about {piece.readingTime} minutes</dd></div>
          <AlsoIn rooms={info.alsoIn} label="Also kept in" />
          <Topics topics={piece.topics} label="Filed under" />
        </dl>
        <HeaderPlate piece={piece} />
      </div>
    </header>
  );
}
