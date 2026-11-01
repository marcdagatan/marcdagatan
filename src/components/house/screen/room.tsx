import { ACTING_QUOTES, ROOM_COPY } from "../content";
import type { RoomProps } from "../data";
import { PointerField } from "../pointer-field";
import { RoomLink } from "../room-link";
import { pad, postHref, ROOMS } from "../rooms";

/**
 * Screen is a picture house: a letterboxed title card under a projector
 * spotlight, a director's note, a lit marquee for the feature, the program
 * as reels, and lines delivered as subtitles.
 */
export function ScreenRoom({ pieces, featured }: RoomProps) {
  const program = pieces.filter((piece) => piece.slug !== featured?.slug);

  return (
    <>
      <PointerField className="ml-scr-hero ml-hero-morph">
        <div aria-hidden="true" className="ml-scr-spot" />
        <div aria-hidden="true" className="ml-scr-leader">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
            <path className="ml-scr-sweep" d="M100 100 L100 12 A88 88 0 0 1 188 100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="ml-wrap ml-scr-hero-inner">
          <p className="ml-scr-presents">A Marc Uy Dagatan picture</p>
          <h1 className="ml-scr-title ml-display">Screen</h1>
          <p className="ml-scr-line">{ROOM_COPY.screen.line}</p>
          <p className="ml-scr-credit">
            Starring Marc, the {ROOMS.screen.role.toLowerCase()} · {pieces.length} {pieces.length === 1 ? "reel" : "reels"} ·{" "}
            {pieces.reduce((sum, piece) => sum + piece.readingTime, 0)} min running time
          </p>
        </div>
      </PointerField>

      <section className="ml-wrap ml-scr-note" aria-labelledby="ml-scr-note-title">
        <h2 id="ml-scr-note-title" className="ml-scr-h2 ml-display ml-reveal">Director’s note</h2>
        <div className="ml-scr-note-body ml-reveal">
          {ROOM_COPY.screen.manifesto.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {featured ? (
        <section className="ml-wrap ml-scr-feature" aria-labelledby="ml-scr-feature-title">
          <p id="ml-scr-feature-title" className="ml-scr-eyebrow ml-reveal">Now showing</p>
          <article className="ml-marquee ml-reveal">
            <span aria-hidden="true" className="ml-marquee-bulbs ml-marquee-bulbs-top" />
            <span aria-hidden="true" className="ml-marquee-bulbs ml-marquee-bulbs-bottom" />
            <div className="ml-marquee-inner">
              <p className="ml-marquee-meta">
                {featured.format} · {featured.readingTime} min · {Math.max(1, featured.sections)}{" "}
                {featured.sections === 1 ? "scene" : "scenes"}
              </p>
              <h3 className="ml-marquee-title ml-display">
                <RoomLink href={postHref(featured.slug)} className="ml-marquee-link">
                  {featured.title}
                </RoomLink>
              </h3>
              <p className="ml-marquee-desc">{featured.description}</p>
              <p className="ml-marquee-date">
                Premiered <time dateTime={featured.dateISO}>{featured.displayDate}</time>
              </p>
            </div>
          </article>
        </section>
      ) : null}

      {program.length > 0 ? (
        <section className="ml-wrap ml-scr-program" aria-labelledby="ml-scr-program-title">
          <h2 id="ml-scr-program-title" className="ml-scr-h2 ml-display ml-reveal">Also on the program</h2>
          <ol className="ml-scr-reels">
            {program.map((piece, index) => (
              <li key={piece.slug} className="ml-scr-reel ml-reveal">
                <span aria-hidden="true" className="ml-scr-reel-edge" />
                <div className="ml-scr-reel-body">
                  <p className="ml-scr-reel-n">
                    Reel {pad(index + 2)}
                    {piece.room !== "screen" ? `, cross-cut from ${ROOMS[piece.room].name}` : ""}
                  </p>
                  <h3 className="ml-scr-reel-title ml-display">
                    <RoomLink href={postHref(piece.slug)} className="ml-u">
                      {piece.title}
                    </RoomLink>
                  </h3>
                  <p className="ml-scr-reel-desc">{piece.description}</p>
                </div>
                <p className="ml-scr-reel-run">
                  <span>{piece.readingTime}</span> min
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="ml-scr-subs" aria-labelledby="ml-scr-subs-title">
        <div className="ml-wrap">
          <h2 id="ml-scr-subs-title" className="ml-scr-eyebrow ml-reveal">Lines from the cutting room</h2>
          <ul className="ml-scr-sub-list">
            {ACTING_QUOTES.map((quote) => (
              <li key={quote.text} className="ml-scr-sub ml-reveal">
                <blockquote>
                  <p>{quote.text}</p>
                </blockquote>
                {quote.slug ? (
                  <RoomLink href={postHref(quote.slug)} className="ml-scr-sub-src">
                    {quote.source}
                  </RoomLink>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
