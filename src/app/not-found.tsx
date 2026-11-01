import Link from "next/link";
import { roomHref, ROOM_IDS, ROOMS } from "@/components/house/rooms";

/**
 * Global 404, in the house voice: a door that is not on the plan, with the
 * real rooms listed as the way back.
 */
export default function NotFound() {
  return (
    <main className="ml-page ml-lost">
      <header className="ml-wrap ml-page-head">
        <p className="ml-eyebrow">404</p>
        <h1 className="ml-page-title">There is no room here.</h1>
        <p className="ml-page-lede">
          This door is not on the plan. It may have been moved, renamed, or never built.
        </p>
      </header>
      <nav aria-label="Ways back" className="ml-wrap ml-page-body">
        <ul className="ml-lost-rooms">
          {ROOM_IDS.map((id) => (
            <li key={id} data-room={id}>
              <Link href={roomHref(id)} className="ml-lost-room">
                <span aria-hidden="true" className="ml-swatch" />
                {ROOMS[id].name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="ml-page-meta">
          <Link href="/" className="ml-u">
            Front door
          </Link>
          {" · "}
          <Link href="/blog" className="ml-u">
            The archive
          </Link>
        </p>
      </nav>
    </main>
  );
}
