import type { RoomId } from "../rooms";
import type { EssayInfo } from "./heroes";

/**
 * How each room closes a piece: a revision block, the final bell, a credits
 * roll, or a signed note.
 */
export function EssayEnding({ room, info }: { room: RoomId; info: EssayInfo }) {
  const { piece } = info;

  if (room === "engineering") {
    return (
      <section className="ml-wrap ml-end ml-end-eng" aria-label="End of specification">
        <div className="ml-end-eng-inner ml-reveal">
          <p className="ml-end-eng-title">End of specification</p>
          <table className="ml-eng-table ml-end-eng-table">
            <thead>
              <tr>
                <th scope="col">Rev</th>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>{piece.displayDate}</td>
                <td>Issued for reading</td>
                <td>MUD</td>
              </tr>
              {info.updatedDisplayDate ? (
                <tr>
                  <td>B</td>
                  <td>{info.updatedDisplayDate}</td>
                  <td>Revised after it met reality</td>
                  <td>MUD</td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <p className="ml-end-eng-check">
            Checked by: <span>you, hopefully</span>
          </p>
        </div>
      </section>
    );
  }

  if (room === "ring") {
    const rounds = Math.max(1, piece.sections);
    return (
      <section className="ml-end ml-end-ring" aria-label="Final bell">
        <div className="ml-wrap ml-end-ring-inner">
          <svg aria-hidden="true" className="ml-end-ring-bell ml-reveal" viewBox="0 0 64 64">
            <path d="M32 8a4 4 0 0 1 4 4v2.4c8 1.8 13 8.6 13 17.6v10l5 6H10l5-6V32c0-9 5-15.8 13-17.6V12a4 4 0 0 1 4-4Z" fill="currentColor" />
            <circle cx="32" cy="54" r="5" fill="currentColor" />
          </svg>
          <p className="ml-end-ring-title ml-display ml-reveal">Final bell</p>
          <p className="ml-end-ring-line ml-reveal">
            {rounds} {rounds === 1 ? "round" : "rounds"}, {piece.readingTime} minutes. You went the distance.
          </p>
          <p className="ml-end-ring-card ml-reveal">Decision: yours. No judges here, just the next round.</p>
        </div>
      </section>
    );
  }

  if (room === "screen") {
    const credits: [string, string][] = [
      ["Written by", "Marc Uy Dagatan"],
      ["Starring", "Marc Uy Dagatan"],
      ["Also starring", "You, for reading this far"],
      ["Running time", `${piece.readingTime} minutes`],
      ["Premiered", piece.displayDate],
      ["Filmed on location", "The Screen room"],
      ["No stunt doubles", "Were harmed or hired"],
    ];
    return (
      <section className="ml-end ml-end-screen" aria-label="Credits">
        <p className="ml-end-screen-fin ml-display ml-reveal">Fin.</p>
        <div className="ml-credits">
          <dl className="ml-credits-roll">
            {credits.map(([role, name]) => (
              <div key={role}>
                <dt>{role}</dt>
                <dd>{name}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  return (
    <section className="ml-wrap ml-end ml-end-life" aria-label="Closing note">
      <div className="ml-end-life-card ml-reveal">
        <p>Thanks for staying to the end of the page. Whatever room you came from, there is a lot of you left to meet.</p>
        <p className="ml-end-life-sign">Marc</p>
        <p className="ml-end-life-date">{piece.displayDate}</p>
      </div>
    </section>
  );
}
