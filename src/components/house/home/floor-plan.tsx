"use client";

import { Door } from "../door";
import { RoomMotif } from "../motif";
import { RoomLink } from "../room-link";
import { HOUSE_HREF, pad, postHref, ROOM_IDS, ROOMS, roomHref, type RoomId } from "../rooms";

export type PlanRoom = {
  room: RoomId;
  line: string;
  count: number;
  minutes: number;
  featured?: { slug: string; title: string };
};

/**
 * The house as an architectural plan. Hovering or focusing a room switches on
 * that room's own lights; clicking walks in, morphing the room into the
 * destination hero.
 */
export function FloorPlan({ rooms, totalPieces, totalMinutes }: { rooms: PlanRoom[]; totalPieces: number; totalMinutes: number }) {
  const byId = new Map(rooms.map((room) => [room.room, room]));

  return (
    <div className="ml-plan-frame">
      <div aria-hidden="true" className="ml-plan-dim ml-plan-dim-x">
        <span className="ml-plan-dim-line" />
        <span className="ml-plan-dim-label">
          {totalPieces} pieces, {totalMinutes} minutes of reading
        </span>
      </div>
      <div aria-hidden="true" className="ml-plan-dim ml-plan-dim-y">
        <span className="ml-plan-dim-line" />
        <span className="ml-plan-dim-label">4 rooms, 1 occupant</span>
      </div>
      <div aria-hidden="true" className="ml-plan-compass">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M20 4 L25 20 L20 17 L15 20 Z" fill="currentColor" />
          <text x="20" y="35" textAnchor="middle" fontSize="8" fill="currentColor">N</text>
        </svg>
      </div>

      <div className="ml-plan">
        {ROOM_IDS.map((id, index) => {
          const room = byId.get(id);
          if (!room) return null;
          return (
            <article
              key={id}
              data-room={id}
              data-morph
              className="ml-tile"
            >
              <RoomMotif room={id} />
              <div className="ml-tile-top">
                <span className="ml-tile-tag">
                  Rm {pad(index + 1)}, {ROOMS[id].role}
                </span>
                <span className="ml-tile-count">
                  {room.count} {room.count === 1 ? "piece" : "pieces"}, {room.minutes} min
                </span>
              </div>
              <h2 className="ml-tile-name ml-display">
                <RoomLink href={roomHref(id)} morph className="ml-tile-link">
                  {ROOMS[id].name}
                </RoomLink>
              </h2>
              <p className="ml-tile-line">{room.line}</p>
              {room.featured ? (
                <div className="ml-tile-feature">
                  <span className="ml-tile-feature-label">Start with</span>
                  <RoomLink href={postHref(room.featured.slug)} className="ml-tile-post">
                    <span className="ml-u">{room.featured.title}</span>
                  </RoomLink>
                </div>
              ) : null}
              <Door className="ml-tile-door" />
            </article>
          );
        })}

        <div className="ml-hall">
          <span className="ml-hall-label">Hallway</span>
          <RoomLink href={HOUSE_HREF} className="ml-hall-link">
            <span className="ml-u">Who lives here</span>
          </RoomLink>
        </div>
      </div>
    </div>
  );
}
