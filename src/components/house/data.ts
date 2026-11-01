import "server-only";

import { getAllPostsMeta, getPostSource, type PostMeta } from "@/lib/posts";
import { extractTableOfContents, type TocItem } from "@/lib/toc";
import type { ArchiveEntry } from "./home/archive";
import { primaryRoom, roomsForPost, type RoomId } from "./rooms";

/** Structural facts about one post, derived from its MDX source. */
export type PostStats = {
  /** Section headings at the post's top heading level (h2, or h3 when no h2). */
  sections: TocItem[];
  sectionLevel: 2 | 3;
  words: number;
  /** Reading minute at which each section starts, keyed by heading id. */
  minuteAt: Record<string, number>;
};

export type PostWithStats = PostMeta & { stats: PostStats; room: RoomId };

const WORDS_PER_MINUTE = 200;

/**
 * Derives sections, word count, and section start minutes from raw MDX.
 * Heading ids come from the shared TOC extractor so they match rehype-slug.
 */
export function buildStats(source: string): PostStats {
  const toc = extractTableOfContents(source);
  const sectionLevel: 2 | 3 = toc.some((item) => item.level === 2) ? 2 : 3;
  const sections = toc.filter((item) => item.level === sectionLevel);

  // Walk the source line by line, skipping fenced code, to find where each
  // h2/h3 starts. The order matches the extractor's h2/h3 order.
  const minuteAt: Record<string, number> = {};
  let words = 0;
  let inFence = false;
  let headingIndex = 0;
  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence && /^#{2,3}\s/.test(line)) {
      const item = toc[headingIndex];
      headingIndex += 1;
      if (item && item.level === sectionLevel) {
        minuteAt[item.id] = Math.floor(words / WORDS_PER_MINUTE);
      }
    }
    words += line.split(/\s+/).filter(Boolean).length;
  }

  return { sections, sectionLevel, words, minuteAt };
}

export function getPostWithStats(slug: string): { post: PostWithStats; content: string } {
  const { meta, content } = getPostSource(slug);
  return { post: { ...meta, stats: buildStats(content), room: primaryRoom(meta) }, content };
}

/** Every published post with structural stats, newest first. */
export function getAllPostsWithStats(): PostWithStats[] {
  return getAllPostsMeta().map((meta) => getPostWithStats(meta.slug).post);
}

/** The serializable slice of a post that room components render. */
/** A row in the cross-room archive (home and /blog). */
export function toArchiveEntry(post: PostWithStats): ArchiveEntry {
  return {
    slug: post.slug,
    title: post.title,
    room: post.room,
    rooms: roomsForPost(post),
    dateISO: post.dateISO,
    displayDate: post.displayDate,
    readingTime: post.readingTime,
  };
}

export type Piece = {
  slug: string;
  title: string;
  description: string;
  displayDate: string;
  dateISO: string;
  readingTime: number;
  format: PostMeta["format"];
  room: RoomId;
  featured: boolean;
  sections: number;
  words: number;
  topics: PostMeta["topics"];
  headerImage?: string;
};

export function toPiece(post: PostWithStats): Piece {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    displayDate: post.displayDate,
    dateISO: post.dateISO,
    readingTime: post.readingTime,
    format: post.format,
    room: post.room,
    featured: post.featured,
    sections: post.stats.sections.length,
    words: post.stats.words,
    topics: post.topics,
    ...(post.headerImage !== undefined ? { headerImage: post.headerImage } : {}),
  };
}

/** What every room landing receives. */
export type RoomProps = {
  /** Pieces listed in this room, newest first. */
  pieces: Piece[];
  featured?: Piece;
  /** Every piece in the house, newest first. */
  allPieces: Piece[];
};
