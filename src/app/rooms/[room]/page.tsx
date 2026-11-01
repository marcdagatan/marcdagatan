import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { absoluteUrl, RSS_ALTERNATE, SITE_NAME } from "@/lib/site";
import { ROOM_COPY } from "@/components/house/content";
import { getAllPostsWithStats, toPiece } from "@/components/house/data";
import { EngineeringRoom } from "@/components/house/engineering/room";
import { LifeRoom } from "@/components/house/life/room";
import { RingRoom } from "@/components/house/ring/room";
import { RoomsNextDoor } from "@/components/house/next-door";
import { ScreenRoom } from "@/components/house/screen/room";
import { featuredInRoom, isRoomId, postsInRoom, ROOM_IDS, ROOMS } from "@/components/house/rooms";

type Params = { params: Promise<{ room: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ROOM_IDS.map((room) => ({ room }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { room } = await params;
  if (!isRoomId(room)) return {};
  const title = `${ROOMS[room].name} room`;
  const description = ROOM_COPY[room].line;
  const path = `/rooms/${room}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": [RSS_ALTERNATE],
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: absoluteUrl(path),
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function RoomPage({ params }: Params) {
  const { room } = await params;
  if (!isRoomId(room)) notFound();

  const all = getAllPostsWithStats();
  const pieces = postsInRoom(all, room).map(toPiece);
  const featuredPost = featuredInRoom(all, room);
  const featured = featuredPost ? toPiece(featuredPost) : undefined;
  const props = { pieces, featured, allPieces: all.map(toPiece) };

  return (
    <main data-room={room} className="ml-room">
      {room === "engineering" ? <EngineeringRoom {...props} /> : null}
      {room === "ring" ? <RingRoom {...props} /> : null}
      {room === "screen" ? <ScreenRoom {...props} /> : null}
      {room === "life" ? <LifeRoom {...props} /> : null}
      <RoomsNextDoor current={room} />
    </main>
  );
}
