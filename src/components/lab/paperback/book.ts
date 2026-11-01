/**
 * The Paperback's book structure: published posts arranged into parts and
 * numbered chapters, in the order the book reads.
 *
 * Server-only (it reaches the filesystem through `@/lib/posts`).
 */

import { getAllPostsMeta, type PostMeta } from "@/lib/posts";

/** A numbered chapter in the book. */
export type BookChapter = {
  /** Reading-order number, 1-based. */
  number: number;
  /** The same number as a word, for chapter openers. */
  numberWord: string;
  post: PostMeta;
};

/** A part of the book, grouping chapters by lane and naming their topics. */
export type BookPart = {
  index: number;
  numeral: string;
  title: string;
  /** The curated topics present in this part, in reading order. */
  topics: string[];
  chapters: BookChapter[];
};

/** A chapter with its part attached, for running heads and navigation. */
export type ChapterWithPart = BookChapter & { part: BookPart };

export type Book = {
  parts: BookPart[];
  chapters: ChapterWithPart[];
  totalMinutes: number;
};

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
] as const;

const PART_NUMERALS = ["One", "Two", "Three", "Four"] as const;

/** Part definitions. Lane is the grouping key because every post has exactly
 * one lane; the topic list below each part title is derived from the posts. */
const PART_DEFS = [
  {
    lane: "systems",
    title: "The Machine Room",
  },
  {
    lane: "operators",
    title: "The Operator's Chair",
  },
  {
    lane: "life",
    title: "The Rest of Being Alive",
  },
] as const;

const TOPIC_LABELS: Record<string, string> = {
  ai: "AI",
  governance: "governance",
  engineering: "engineering",
  tools: "tools",
  hiring: "hiring",
  leadership: "leadership",
  entrepreneurship: "entrepreneurship",
  relationships: "relationships",
  creativity: "creativity",
  boxing: "boxing",
  acting: "acting",
  film: "film",
};

function topicLabel(topic: string): string {
  return TOPIC_LABELS[topic] ?? topic;
}

/**
 * Builds the book from published posts.
 *
 * Chapters run oldest-first within each part, so the guide that introduces a
 * subject comes before the essays that argue about it.
 */
export function getBook(): Book {
  const posts = getAllPostsMeta().sort((a, b) => a.timestamp - b.timestamp);

  let chapterNumber = 0;

  const parts: BookPart[] = PART_DEFS.map((definition, index) => {
    const partPosts = posts.filter((post) => post.lane === definition.lane);

    const chapters = partPosts.map((post) => {
      chapterNumber += 1;
      return {
        number: chapterNumber,
        numberWord: NUMBER_WORDS[chapterNumber] ?? String(chapterNumber),
        post,
      };
    });

    const seen = new Set<string>();
    const topics: string[] = [];
    for (const post of partPosts) {
      for (const topic of post.topics) {
        if (seen.has(topic)) continue;
        seen.add(topic);
        topics.push(topicLabel(topic));
      }
    }

    return {
      index,
      numeral: PART_NUMERALS[index] ?? String(index + 1),
      title: definition.title,
      topics,
      chapters,
    };
  }).filter((part) => part.chapters.length > 0);

  const chapters: ChapterWithPart[] = parts.flatMap((part) =>
    part.chapters.map((chapter) => ({ ...chapter, part }))
  );

  return {
    parts,
    chapters,
    totalMinutes: chapters.reduce(
      (total, chapter) => total + chapter.post.readingTime,
      0
    ),
  };
}

/** Finds a chapter by slug. */
export function findChapter(
  book: Book,
  slug: string
): { chapter: ChapterWithPart; index: number } | null {
  const index = book.chapters.findIndex(
    (chapter) => chapter.post.slug === slug
  );
  if (index === -1) return null;
  return { chapter: book.chapters[index], index };
}

/** Formats the book's total reading time as running prose. */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) return `about ${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = hours === 1 ? "an hour" : `${hours} hours`;
  if (rest === 0) return `about ${hourLabel}`;
  return `about ${hourLabel} and ${rest} minutes`;
}

/**
 * Replaces hyphens with non-breaking hyphens for display.
 *
 * Why: chapter titles like "When GPT-5 Becomes..." otherwise break after the
 * hyphen, leaving "GPT-" stranded at the end of a display line. The underlying
 * title stays untouched for metadata, links, and screen readers.
 */
export function typesetTitle(title: string): string {
  return title.replace(/-/g, "\u2011");
}

/** Joins topics with an Oxford comma, for the part descriptions. */
export function joinTopics(topics: readonly string[]): string {
  if (topics.length === 0) return "";
  if (topics.length === 1) return topics[0];
  if (topics.length === 2) return `${topics[0]} and ${topics[1]}`;
  return `${topics.slice(0, -1).join(", ")}, and ${topics[topics.length - 1]}`;
}
