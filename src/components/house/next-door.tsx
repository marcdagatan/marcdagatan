import { Door } from "./door";
import { RoomMotif } from "./motif";
import { RoomLink } from "./room-link";
import { ROOM_IDS, ROOMS, roomHref, type RoomId } from "./rooms";
import { ROOM_COPY } from "./content";

/** The other three rooms, as lit tiles off the current one. */
export function RoomsNextDoor({ current, label = "Next door" }: { current: RoomId; label?: string }) {
  const others = ROOM_IDS.filter((id) => id !== current);

  return (
    <nav aria-label="Other rooms" className="ml-nextdoor">
      <ul className="ml-nextdoor-list">
        {others.map((id) => (
          <li key={id} data-room={id} data-morph className="ml-tile ml-nextdoor-tile">
            <RoomMotif room={id} detail={false} />
            <span className="ml-tile-tag">{label}</span>
            <RoomLink href={roomHref(id)} morph className="ml-tile-link ml-nextdoor-name ml-display">
              {ROOMS[id].name}
            </RoomLink>
            <p className="ml-tile-line">{ROOM_COPY[id].line}</p>
            <Door className="ml-tile-door" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
