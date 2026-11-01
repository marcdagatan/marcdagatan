import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import {
  absoluteUrl,
  AUTHOR_NAME,
  PUBLICATION_NAME,
  RSS_ALTERNATE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";
import { HOME, NOW_ITEMS, NOW_UPDATED, ROOM_COPY } from "@/components/house/content";
import { getAllPostsWithStats, toArchiveEntry } from "@/components/house/data";
import { Archive } from "@/components/house/home/archive";
import { FloorPlan, type PlanRoom } from "@/components/house/home/floor-plan";
import { HomeHeadline } from "@/components/house/home/headline";
import { featuredInRoom, postsInRoom, ROOM_IDS } from "@/components/house/rooms";

export const metadata: Metadata = {
  title: PUBLICATION_NAME,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [RSS_ALTERNATE],
    },
  },
  openGraph: {
    title: `${SITE_NAME} | ${PUBLICATION_NAME}`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${PUBLICATION_NAME}`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  const posts = getAllPostsWithStats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: PUBLICATION_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
  };

  const planRooms: PlanRoom[] = ROOM_IDS.map((room) => {
    const listed = postsInRoom(posts, room);
    const featured = featuredInRoom(posts, room);
    return {
      room,
      line: ROOM_COPY[room].line,
      count: listed.length,
      minutes: listed.reduce((sum, post) => sum + post.readingTime, 0),
      featured: featured ? { slug: featured.slug, title: featured.title } : undefined,
    };
  });

  const entries = posts.map(toArchiveEntry);

  return (
    <main className="ml-home">
      <JsonLd data={jsonLd} />
      <section className="ml-wrap ml-home-open">
        <HomeHeadline />
        <div className="ml-home-intro">
          <p className="ml-home-lede">{HOME.intro}</p>
          <p className="ml-home-note">{HOME.planNote}</p>
        </div>
      </section>

      <section aria-label="The house" className="ml-wrap ml-home-plan">
        <FloorPlan
          rooms={planRooms}
          totalPieces={posts.length}
          totalMinutes={posts.reduce((sum, post) => sum + post.readingTime, 0)}
        />
      </section>

      <section className="ml-wrap ml-home-lower">
        <aside className="ml-now ml-reveal" aria-labelledby="ml-now-title">
          <div className="ml-now-head">
            <h2 id="ml-now-title" className="ml-now-title">Now</h2>
            <p className="ml-now-stamp">Edited by hand, {NOW_UPDATED}</p>
          </div>
          <dl className="ml-now-list">
            {NOW_ITEMS.map((item) => (
              <div key={item.label} data-room={item.room} className="ml-now-item">
                <dt>
                  <span aria-hidden="true" className="ml-swatch" />
                  {item.label}
                </dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="ml-home-archive">
          <h2 className="ml-section-title ml-reveal">Every piece, every room</h2>
          <Archive entries={entries} />
        </div>
      </section>
    </main>
  );
}
