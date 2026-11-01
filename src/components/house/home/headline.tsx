import type { RoomId } from "../rooms";

const WORDS: { room: RoomId; word: string }[] = [
  { room: "engineering", word: "Founder," },
  { room: "ring", word: "fighter," },
  { room: "screen", word: "actor," },
  { room: "life", word: "dad." },
];

/**
 * The thesis, set in four faces. Deliberately static: no links, hover, or
 * motion. Hover and entrance effects here strobed between the stacked words
 * and made the page physically uncomfortable. Rooms are reached through the
 * nav and the floor plan instead.
 */
export function HomeHeadline() {
  return (
    <h1 className="ml-hero-head">
      {WORDS.map(({ room, word }, index) => (
        <span key={room} data-room={room} className="ml-hero-word">
          <span className="ml-hero-word-ink">{word}</span>
          {index < WORDS.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
