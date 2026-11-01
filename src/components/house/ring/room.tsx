import { CORNER_QUOTES, ROOM_COPY, TALE_OF_THE_TAPE } from "../content";
import type { RoomProps } from "../data";
import { RoomLink } from "../room-link";
import { pad, postHref, ROOMS } from "../rooms";
import { RoundTimer } from "./round-timer";

/**
 * Ring is a fight night: a bout poster, the tale of the tape, a working
 * round clock, the card of pieces as bouts, and words from the corner.
 */
export function RingRoom({ pieces, featured }: RoomProps) {
  return (
    <>
      <header className="ml-ring-hero ml-hero-morph">
        <div aria-hidden="true" className="ml-ring-burst" />
        <div aria-hidden="true" className="ml-ring-halftone" />
        <div className="ml-wrap ml-ring-hero-inner">
          <p className="ml-ring-billing">
            <span className="ml-ring-tag">Main event</span>
            <span>Live from the gym · Marc, the {ROOMS.ring.role.toLowerCase()}</span>
          </p>
          <h1 className="ml-ring-title ml-display ml-rope-head">
            <span className="ml-ring-title-a">The</span>
            <span className="ml-ring-title-b">Ring</span>
          </h1>
          <div className="ml-ring-vs">
            <span className="ml-ring-name">Marc Uy Dagatan</span>
            <span aria-hidden="true" className="ml-ring-vs-mark">vs.</span>
            <span className="ml-ring-name">Whatever answers the next bell</span>
          </div>
          <p className="ml-ring-line">{ROOM_COPY.ring.line}</p>
        </div>
        <div aria-hidden="true" className="ml-ring-marquee">
          {[0, 1, 2, 3].map((copy) => (
            <span key={copy}>Answer the bell · Step forward · Throw something · Adjust ·&nbsp;</span>
          ))}
        </div>
      </header>

      <section className="ml-wrap ml-ring-weighin" aria-labelledby="ml-ring-tape-title">
        <div className="ml-ring-tape ml-reveal">
          <h2 id="ml-ring-tape-title" className="ml-ring-h2 ml-display">Tale of the tape</h2>
          <dl>
            {TALE_OF_THE_TAPE.map((row, index) => (
              <div key={row.label} className="ml-ring-tape-row" style={{ "--i": index } as React.CSSProperties}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="ml-ring-prefight ml-reveal">
          <h2 className="ml-ring-h2 ml-display">Pre-fight</h2>
          {ROOM_COPY.ring.manifesto.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="ml-ring-clock-band" aria-labelledby="ml-ring-clock-title">
        <div className="ml-wrap">
          <h2 id="ml-ring-clock-title" className="ml-ring-h2 ml-display ml-reveal">The round clock</h2>
          <p className="ml-ring-clock-note ml-reveal">Three minutes on, one minute off. It is a real timer. Use it.</p>
          <RoundTimer />
        </div>
      </section>

      <section className="ml-wrap ml-ring-card" aria-labelledby="ml-ring-card-title">
        <h2 id="ml-ring-card-title" className="ml-ring-h2 ml-display ml-reveal">Fight card</h2>
        <ol className="ml-ring-bouts">
          {pieces.map((piece, index) => {
            const main = featured?.slug === piece.slug;
            const rounds = Math.max(1, piece.sections);
            return (
              <li key={piece.slug} className="ml-ring-bout ml-reveal" data-main={main ? "true" : undefined}>
                <span className="ml-ring-bout-n">Bout {pad(index + 1)}</span>
                <div className="ml-ring-bout-main">
                  {main ? <span className="ml-ring-bout-flag">Main event</span> : null}
                  <h3 className="ml-ring-bout-title ml-display">
                    <RoomLink href={postHref(piece.slug)}>{piece.title}</RoomLink>
                  </h3>
                  <p className="ml-ring-bout-desc">{piece.description}</p>
                </div>
                <dl className="ml-ring-bout-stats">
                  <div><dt>Rounds</dt><dd>{rounds}</dd></div>
                  <div><dt>Fight time</dt><dd>{piece.readingTime} min</dd></div>
                  <div><dt>Date</dt><dd><time dateTime={piece.dateISO}>{piece.displayDate}</time></dd></div>
                </dl>
              </li>
            );
          })}
        </ol>
        {pieces.length < 3 ? (
          <p className="ml-ring-undercard ml-reveal">
            Undercard to be announced. The gym takes more of the calendar than the keyboard does.
          </p>
        ) : null}
      </section>

      <section className="ml-ring-corner" aria-labelledby="ml-ring-corner-title">
        <div className="ml-wrap">
          <h2 id="ml-ring-corner-title" className="ml-ring-h2 ml-display ml-reveal">From the corner</h2>
          <ul className="ml-ring-quotes">
            {CORNER_QUOTES.map((quote, index) => (
              <li key={quote.text} className="ml-ring-quote ml-reveal" style={{ "--i": index } as React.CSSProperties}>
                <blockquote>
                  <p>{quote.text}</p>
                </blockquote>
                {quote.slug ? (
                  <RoomLink href={postHref(quote.slug)} className="ml-ring-quote-src">
                    {quote.source}
                  </RoomLink>
                ) : (
                  <span className="ml-ring-quote-src">{quote.source}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
