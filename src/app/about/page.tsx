import type { Metadata } from "next";
import { getAllPostsWithStats } from "@/components/house/data";
import { HouseAbout } from "@/components/house/about/house";
import { postsInRoom, ROOM_IDS } from "@/components/house/rooms";
import { absoluteUrl, RSS_ALTERNATE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Marc Uy Dagatan: founder, hands-on technical leader, fighter, actor, and dad. Systems, products, operators, and life.",
  alternates: {
    canonical: "/about",
    types: {
      "application/rss+xml": [RSS_ALTERNATE],
    },
  },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description:
      "Marc Uy Dagatan: founder, hands-on technical leader, fighter, actor, and dad. Systems, scars, and selfhood.",
    type: "profile",
    url: absoluteUrl("/about"),
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${SITE_NAME}`,
    description:
      "Marc Uy Dagatan: founder, hands-on technical leader, fighter, actor, and dad. Systems, scars, and selfhood.",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  const posts = getAllPostsWithStats();
  const counts = Object.fromEntries(ROOM_IDS.map((id) => [id, postsInRoom(posts, id).length]));

  return (
    <main className="ml-house">
      <HouseAbout counts={counts} />
    </main>
  );
}
