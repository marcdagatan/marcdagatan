import type { Metadata } from "next";
import { getAllPostsMeta } from "@/lib/posts";
import {
  selectCurrentBout,
  selectRecentRounds,
  selectStartHerePosts,
} from "@/lib/homepage";
import { countPostsByLane } from "@/lib/archive";
import { OpeningBell } from "@/components/homepage/opening-bell";
import { CurrentBout } from "@/components/homepage/current-bout";
import { LaneRows } from "@/components/homepage/lane-rows";
import { StartHere } from "@/components/homepage/start-here";
import { RecentRounds } from "@/components/homepage/recent-rounds";
import { StayForNextRound } from "@/components/homepage/stay-for-next-round";
import {
  absoluteUrl,
  AUTHOR_NAME,
  PUBLICATION_NAME,
  RSS_ALTERNATE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

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
  const posts = getAllPostsMeta();
  const currentBout = selectCurrentBout(posts);
  const startHere = selectStartHerePosts(
    posts,
    currentBout ? [currentBout.slug] : []
  );
  const featuredSlugs = [
    ...(currentBout ? [currentBout.slug] : []),
    ...startHere.map((post) => post.slug),
  ];
  const recentRounds = selectRecentRounds(posts, featuredSlugs, 4);
  const laneCounts = countPostsByLane(posts);

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

  return (
    <main>
      <JsonLd data={jsonLd} />
      <OpeningBell />
      {currentBout ? <CurrentBout post={currentBout} /> : null}
      {/* Start Here precedes taxonomy at every breakpoint so visual, keyboard,
          and screen-reader order stay aligned. */}
      <StartHere posts={startHere} />
      <LaneRows counts={laneCounts} />
      <RecentRounds posts={recentRounds} />
      <StayForNextRound />
    </main>
  );
}
