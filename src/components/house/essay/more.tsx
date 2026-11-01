import { RoomLink } from "../room-link";
import { postHref, ROOMS, type RoomId } from "../rooms";

export type MoreLink = { slug: string; title: string; room: RoomId; displayDate: string; readingTime: number };

const LABELS: Record<RoomId, { related: string; older: string; newer: string }> = {
  engineering: { related: "See also", older: "Older commit", newer: "Newer commit" },
  ring: { related: "Also on the card", older: "Previous bout", newer: "Next bout" },
  screen: { related: "Coming attractions", older: "Previous reel", newer: "Next reel" },
  life: { related: "Other pages", older: "Earlier page", newer: "Later page" },
};

/** Related pieces and chronological neighbours, named in the room's terms. */
export function EssayMore({
  room,
  related,
  older,
  newer,
}: {
  room: RoomId;
  related: MoreLink[];
  older?: MoreLink;
  newer?: MoreLink;
}) {
  const labels = LABELS[room];

  return (
    <section className="ml-wrap ml-more" aria-label="Keep reading">
      {related.length > 0 ? (
        <div className="ml-more-related">
          <h2 className="ml-more-title ml-display ml-reveal">{labels.related}</h2>
          <ul className="ml-more-list">
            {related.map((post) => (
              <li key={post.slug} data-room={post.room} className="ml-reveal">
                <RoomLink href={postHref(post.slug)} className="ml-more-link">
                  <span className="ml-more-room">
                    <span aria-hidden="true" className="ml-swatch" />
                    {ROOMS[post.room].name}
                  </span>
                  <span className="ml-more-name">{post.title}</span>
                  <span className="ml-more-meta">
                    {post.displayDate} · {post.readingTime} min
                  </span>
                </RoomLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <nav aria-label="Chronological" className="ml-more-pager">
        {older ? (
          <RoomLink href={postHref(older.slug)} className="ml-more-page" data-dir="older">
            <span className="ml-more-page-label">← {labels.older}</span>
            <span className="ml-more-page-title">{older.title}</span>
          </RoomLink>
        ) : (
          <span />
        )}
        {newer ? (
          <RoomLink href={postHref(newer.slug)} className="ml-more-page" data-dir="newer">
            <span className="ml-more-page-label">{labels.newer} →</span>
            <span className="ml-more-page-title">{newer.title}</span>
          </RoomLink>
        ) : null}
      </nav>
    </section>
  );
}
