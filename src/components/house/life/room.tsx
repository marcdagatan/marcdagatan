import { LIFE_BELIEFS, LIFE_QUOTES, NOW_ITEMS, NOW_UPDATED, ROOM_COPY } from "../content";
import type { RoomProps } from "../data";
import { RoomLink } from "../room-link";
import { postHref, ROOMS } from "../rooms";
import { GrowthRings } from "./growth-rings";

/**
 * Life is a notebook: a journal page, a short letter, the house's growth
 * rings, entries written like diary pages, and the beliefs kept in the
 * margin.
 */
export function LifeRoom({ pieces, featured, allPieces }: RoomProps) {
  const now = NOW_ITEMS.find((item) => item.room === "life");

  return (
    <>
      <header className="ml-life-hero ml-hero-morph">
        <div aria-hidden="true" className="ml-life-ink" />
        <div aria-hidden="true" className="ml-life-sprig">
          <svg viewBox="0 0 120 220" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path className="ml-life-draw" d="M60 215 C58 160 62 110 60 20" />
            <path className="ml-life-draw" d="M60 170 C40 160 28 146 22 128 C40 132 54 146 60 160" />
            <path className="ml-life-draw" d="M60 130 C80 120 92 104 98 86 C80 92 66 106 60 122" />
            <path className="ml-life-draw" d="M60 90 C44 80 36 66 34 50 C48 56 58 70 60 82" />
            <path className="ml-life-draw" d="M60 52 C70 44 76 34 78 22 C68 28 62 38 60 46" />
          </svg>
        </div>
        <div className="ml-wrap ml-life-hero-inner">
          <p className="ml-life-date">{NOW_UPDATED}</p>
          <p className="ml-life-kicker">Marc, the {ROOMS.life.role.toLowerCase()} · pages kept for no one in particular</p>
          <h1 className="ml-life-title ml-display">Life</h1>
          <p className="ml-life-line">{ROOM_COPY.life.line}</p>
        </div>
      </header>

      <section className="ml-wrap ml-life-letter-wrap" aria-label="A note">
        <div className="ml-life-letter ml-reveal">
          <p className="ml-life-salute">Dear whoever is reading,</p>
          {ROOM_COPY.life.manifesto.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {now ? <p>Right now: {now.text}</p> : null}
          <p className="ml-life-sign">Marc</p>
        </div>
        <aside className="ml-life-margin ml-reveal" aria-label="Margin notes">
          {LIFE_QUOTES.map((quote) => (
            <p key={quote.text} className="ml-life-note">
              “{quote.text}”
              {quote.slug ? (
                <RoomLink href={postHref(quote.slug)} className="ml-life-note-src">
                  {quote.source}
                </RoomLink>
              ) : null}
            </p>
          ))}
        </aside>
      </section>

      <section className="ml-wrap ml-life-rings" aria-labelledby="ml-life-rings-title">
        <h2 id="ml-life-rings-title" className="ml-life-h2 ml-display ml-reveal">Growth rings</h2>
        <p className="ml-life-sub ml-reveal">
          Everything written in the house, read like a cross-section of a trunk. The inked rings are this room.
        </p>
        <GrowthRings pieces={allPieces} room="life" />
      </section>

      <section className="ml-wrap ml-life-entries" aria-labelledby="ml-life-entries-title">
        <h2 id="ml-life-entries-title" className="ml-life-h2 ml-display ml-reveal">Entries</h2>
        <ol className="ml-life-entry-list">
          {pieces.map((piece, index) => (
            <li key={piece.slug} className="ml-life-entry ml-reveal" data-lead={piece.slug === featured?.slug || undefined}>
              <p className="ml-life-entry-date">
                <time dateTime={piece.dateISO}>{piece.displayDate}</time>
              </p>
              <div>
                <h3 className="ml-life-entry-title ml-display">
                  <RoomLink href={postHref(piece.slug)} className="ml-u">
                    {piece.title}
                  </RoomLink>
                </h3>
                <p className="ml-life-entry-desc">{piece.description}</p>
                <p className="ml-life-entry-meta">
                  {piece.readingTime} minutes · page {index + 1}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ml-wrap ml-life-beliefs" aria-labelledby="ml-life-beliefs-title">
        <h2 id="ml-life-beliefs-title" className="ml-life-h2 ml-display ml-reveal">Things I’m fairly sure of</h2>
        <ul className="ml-life-belief-list">
          {LIFE_BELIEFS.map((belief, index) => (
            <li key={belief} className="ml-reveal" style={{ "--i": index } as React.CSSProperties}>
              {belief}
            </li>
          ))}
        </ul>
        <p className="ml-life-closing ml-reveal">More pages when there is something worth writing down.</p>
      </section>
    </>
  );
}
