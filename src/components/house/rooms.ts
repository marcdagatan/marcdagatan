import type { PostMeta, Topic } from "@/lib/posts";

/**
 * The four rooms of "The Many Lives". Each room claims a set of curated
 * topics; a post lives primarily in the room of its first topic and is also
 * listed in every other room one of its topics touches.
 */
export const ROOM_IDS = ["engineering", "ring", "screen", "life"] as const;

export type RoomId = (typeof ROOM_IDS)[number];

/** A shell theme: one of the rooms, or the neutral house frame. */
export type Theme = RoomId | "home" | "house";

export type Room = {
  id: RoomId;
  name: string;
  /** Who Marc is in this room. */
  role: string;
  topics: readonly Topic[];
  /** Small label the nav wears inside this room. */
  badge: string;
  /** Field and ink colors, used where CSS variables cannot reach (favicon). */
  field: string;
  ink: string;
};

export const ROOMS: Record<RoomId, Room> = {
  engineering: {
    id: "engineering",
    name: "Engineering",
    role: "Founder",
    topics: ["ai", "governance", "engineering", "tools", "hiring", "leadership", "entrepreneurship"],
    badge: "On branch main",
    field: "#101815",
    ink: "#6ee7a0",
  },
  ring: {
    id: "ring",
    name: "Ring",
    role: "Fighter",
    topics: ["boxing"],
    badge: "Main event",
    field: "#f2c230",
    ink: "#15130f",
  },
  screen: {
    id: "screen",
    name: "Screen",
    role: "Actor",
    topics: ["acting", "film"],
    badge: "Now showing",
    field: "#05070c",
    ink: "#eaa53e",
  },
  life: {
    id: "life",
    name: "Life",
    role: "Dad",
    topics: ["relationships", "creativity"],
    badge: "Notebook",
    field: "#c7d6bd",
    ink: "#8a3a5d",
  },
};

const TOPIC_TO_ROOM = new Map<Topic, RoomId>(
  ROOM_IDS.flatMap((id) => ROOMS[id].topics.map((topic) => [topic, id] as const))
);

export function isRoomId(value: string): value is RoomId {
  return (ROOM_IDS as readonly string[]).includes(value);
}

/** The room a post opens into: the room of its first curated topic. */
export function primaryRoom(post: PostMeta): RoomId {
  for (const topic of post.topics) {
    const room = TOPIC_TO_ROOM.get(topic);
    if (room) return room;
  }
  return post.lane === "life" ? "life" : "engineering";
}

/** Every room a post belongs to, primary room first. */
export function roomsForPost(post: PostMeta): RoomId[] {
  const rooms = new Set<RoomId>([primaryRoom(post)]);
  for (const topic of post.topics) {
    const room = TOPIC_TO_ROOM.get(topic);
    if (room) rooms.add(room);
  }
  return [...rooms];
}

/** Posts listed in a room, input order preserved. */
export function postsInRoom<T extends PostMeta>(posts: T[], room: RoomId): T[] {
  return posts.filter((post) => roomsForPost(post).includes(room));
}

/** The room's lead story: a featured post, else its newest native post. */
export function featuredInRoom<T extends PostMeta>(posts: T[], room: RoomId): T | undefined {
  const listed = postsInRoom(posts, room);
  return (
    listed.find((post) => post.featured && primaryRoom(post) === room) ??
    listed.find((post) => primaryRoom(post) === room) ??
    listed[0]
  );
}

export const HOME_HREF = "/";
export const ARCHIVE_HREF = "/blog";
export const HOUSE_HREF = "/about";

export function postHref(slug: string): string {
  return `/blog/${slug}`;
}

export function roomHref(room: RoomId): string {
  return `/rooms/${room}`;
}

/**
 * Resolves the shell theme for a pathname. Essay routes need the slug-to-room
 * map because the room lives in post frontmatter. Everything that is not a
 * room or an essay (home, archive, tags, 404) wears the neutral home frame;
 * the about page and CV wear the house frame.
 */
export function resolveTheme(pathname: string, slugRooms: Record<string, RoomId>): Theme {
  const [first, second] = pathname.split("/").filter(Boolean);
  if (first === "about" || first === "cv") return "house";
  if (first === "rooms" && second && isRoomId(second)) return second;
  if (first === "blog" && second && second !== "tag") return slugRooms[second] ?? "home";
  return "home";
}

/** What kind of page a pathname is, for chrome that differs by page type. */
export function resolveKind(pathname: string): "home" | "house" | "room" | "essay" | "page" {
  const [first, second] = pathname.split("/").filter(Boolean);
  if (!first) return "home";
  if (first === "about") return "house";
  if (first === "rooms" && second) return "room";
  if (first === "blog" && second && second !== "tag") return "essay";
  return "page";
}

/** Two-digit numbering (reels, bouts, entries) used across rooms. */
export function pad(value: number): string {
  return String(value).padStart(2, "0");
}
