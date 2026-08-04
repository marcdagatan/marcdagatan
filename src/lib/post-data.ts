/**
 * Pure content-data logic: building post metadata from frontmatter, filtering
 * drafts, selecting related posts, and indexing topics.
 *
 * This module is deliberately free of filesystem access and the `server-only`
 * guard so the rules can be unit-tested directly.
 */

import { validatePostFrontmatter, type ValidatedFrontmatter } from "./content-validation";
import { CURATED_TOPICS, normalizeTopic, type Topic } from "./topics";

/** Fully resolved metadata for a single post. */
export type PostMeta = {
  slug: string;
  title: string;
  /** Raw frontmatter date value as authored. */
  date: string;
  /** Machine-readable ISO 8601 string with Asia/Manila offset. */
  dateISO: string;
  /** Epoch milliseconds of the post instant. */
  timestamp: number;
  /** Server-formatted display string; client components must not reformat it. */
  displayDate: string;
  description: string;
  lane: "systems" | "operators" | "life";
  format: "essay" | "guide" | "review" | "note";
  topics: Topic[];
  readingTime: number;
  featured: boolean;
  draft: boolean;
  /** Header image path when the post has one. */
  headerImage?: string;
  /** ISO 8601 update date when the post was meaningfully updated. */
  updated?: string;
  /** Server-formatted display string for the update date. */
  updatedDisplayDate?: string;
};

const WORDS_PER_MINUTE = 200;

/**
 * Builds a PostMeta from raw frontmatter and MDX body.
 *
 * @param slug - Post slug.
 * @param frontmatter - Raw gray-matter frontmatter object.
 * @param content - MDX body used for the reading-time estimate.
 * @returns Validated post metadata.
 * @throws PostValidationError when frontmatter is invalid.
 */
export function buildPostMeta(
  slug: string,
  frontmatter: Record<string, unknown>,
  content: string
): PostMeta {
  const validated: ValidatedFrontmatter = validatePostFrontmatter(slug, frontmatter);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return {
    slug,
    title: validated.title,
    date: validated.date,
    dateISO: validated.dateISO,
    timestamp: validated.timestamp,
    displayDate: validated.displayDate,
    description: validated.description,
    lane: validated.lane,
    format: validated.format,
    topics: validated.topics,
    readingTime,
    featured: validated.featured,
    draft: validated.draft,
    ...(validated.headerImage !== undefined ? { headerImage: validated.headerImage } : {}),
    ...(validated.updated !== undefined
      ? { updated: validated.updated.dateISO, updatedDisplayDate: validated.updated.displayDate }
      : {}),
  };
}

/**
 * Filters a post list down to published posts.
 *
 * @param posts - All posts including drafts.
 * @returns Posts with `draft: false`.
 */
export function selectPublishedPosts(posts: readonly PostMeta[]): PostMeta[] {
  return posts.filter((post) => !post.draft);
}

/**
 * Sorts posts newest-first by timestamp.
 *
 * @param posts - Posts to sort (not mutated).
 * @returns A new array sorted by descending timestamp.
 */
export function sortPostsNewestFirst(posts: readonly PostMeta[]): PostMeta[] {
  return [...posts].sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Selects related posts by curated-topic overlap.
 *
 * Posts sharing more topics rank first; ties break on recency. When no topics
 * are supplied or nothing overlaps, the newest posts win so the section never
 * renders empty.
 *
 * @param allPosts - Candidate posts, typically all published posts.
 * @param slug - Current post slug, which is always excluded.
 * @param topics - Curated topics of the current post.
 * @param limit - Maximum number of related posts to return.
 * @returns Ranked related posts, newest-first within each score tier.
 */
export function selectRelatedPosts(
  allPosts: readonly PostMeta[],
  slug: string,
  topics: readonly string[],
  limit = 3
): PostMeta[] {
  const candidates = allPosts.filter((post) => post.slug !== slug);
  if (candidates.length === 0) return [];

  const normalizedTopics = topics.map((topic) => normalizeTopic(topic)).filter(Boolean) as string[];

  const scored = candidates.map((post) => {
    const overlap = post.topics.filter((topic) => normalizedTopics.includes(topic)).length;
    return { post, score: overlap };
  });

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.timestamp - a.post.timestamp;
    })
    .slice(0, limit)
    .map((entry) => entry.post);
}

/**
 * Builds the curated topic index with post counts.
 *
 * @param posts - Published posts.
 * @returns Curated topics present in the content, sorted by count (desc) then
 *   alphabetically. One-off keywords are excluded.
 */
export function buildTopicsIndex(
  posts: readonly PostMeta[]
): { topic: Topic; count: number }[] {
  const counts = new Map<Topic, number>();
  for (const post of posts) {
    for (const topic of post.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return CURATED_TOPICS.filter((topic) => counts.has(topic))
    .map((topic) => ({ topic, count: counts.get(topic) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}
