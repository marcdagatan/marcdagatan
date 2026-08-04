/**
 * Filesystem-backed post access. Server-only.
 *
 * All parsing and validation rules live in the pure modules (dates, topics,
 * content-validation, post-data); this module is the thin file/gray-matter
 * layer plus the public API used by routes and components.
 */

import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  buildPostMeta,
  buildTopicsIndex,
  selectPublishedPosts,
  selectRelatedPosts,
  sortPostsNewestFirst,
  type PostMeta,
} from "./post-data";
import { normalizeTopic, type Topic } from "./topics";

export type { PostMeta } from "./post-data";
export type { Lane, PostFormat, Topic } from "./topics";
export { CURATED_TOPICS, LANES, POST_FORMATS, TOPIC_INTROS } from "./topics";
export { POST_TIME_ZONE, POST_TIME_ZONE_OFFSET } from "./dates";
export { PostValidationError } from "./content-validation";

const postsDirectory = path.join(process.cwd(), "content", "posts");

/** Expected error for a slug that has no matching MDX file. */
export class PostNotFoundError extends Error {
  constructor(slug: string) {
    super(`Post not found: ${slug}`);
    this.name = "PostNotFoundError";
  }
}

/**
 * Lists every post slug from the content directory.
 *
 * @returns Slugs in filesystem order (callers sort as needed).
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Reads and validates a single post.
 *
 * @param slug - Post slug (filename without `.mdx`).
 * @returns The validated metadata and raw MDX body.
 * @throws If the file is missing or frontmatter is invalid.
 */
export function getPostSource(slug: string): { meta: PostMeta; content: string } {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    throw new PostNotFoundError(slug);
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const meta = buildPostMeta(slug, data, content);
  if (meta.headerImage) {
    const imagePath = path.join(process.cwd(), "public", meta.headerImage);
    if (!fs.existsSync(imagePath)) {
      throw new Error(
        `Post "${slug}" references missing header image "${meta.headerImage}"`
      );
    }
  }
  return { meta, content };
}

/**
 * Returns all posts with validated metadata, newest first.
 *
 * Drafts are excluded. In production, the presence of any draft post fails
 * loudly so unpublished content can never ship by accident.
 *
 * @param options - Pass `includeDrafts: true` to include draft posts.
 * @returns Published posts sorted newest-first.
 */
export function getAllPostsMeta(options?: { includeDrafts?: boolean }): PostMeta[] {
  const includeDrafts = options?.includeDrafts ?? false;
  const allPosts = getPostSlugs().map((slug) => getPostSource(slug).meta);
  const published = selectPublishedPosts(allPosts);

  if (!includeDrafts && process.env.NODE_ENV === "production" && published.length < allPosts.length) {
    const drafts = allPosts.filter((post) => post.draft).map((post) => post.slug);
    throw new Error(
      `Draft posts present in production build: ${drafts.join(", ")}. Set "draft: false" to publish or remove the posts.`
    );
  }

  return sortPostsNewestFirst(includeDrafts ? allPosts : published);
}

/**
 * Returns published posts for a topic, newest first.
 *
 * @param topic - Curated topic label (case-insensitive).
 * @returns Matching posts; empty when the topic is not curated or unused.
 */
export function getPostsByTopic(topic: string): PostMeta[] {
  const normalized = normalizeTopic(topic);
  if (normalized === null) return [];
  return getAllPostsMeta().filter((post) => post.topics.includes(normalized));
}

/**
 * Selects related posts for a slug by curated-topic overlap.
 *
 * @param slug - Current post slug.
 * @param topics - Topics of the current post.
 * @param limit - Maximum related posts.
 * @returns Ranked related posts.
 */
export function getRelatedPosts(slug: string, topics: string[], limit = 3): PostMeta[] {
  return selectRelatedPosts(getAllPostsMeta(), slug, topics, limit);
}

/**
 * Builds the curated topic index from published posts.
 *
 * @returns Curated topics with post counts, sorted by count then alphabetically.
 */
export function getAllTopics(): { topic: Topic; count: number }[] {
  return buildTopicsIndex(getAllPostsMeta());
}

/**
 * Validates every post file and returns per-post issues.
 *
 * @returns List of posts with validation issues (empty issues means valid).
 */
export function validateAllPosts(): { slug: string; issues: string[] }[] {
  return getPostSlugs().map((slug) => {
    try {
      getPostSource(slug);
      return { slug, issues: [] };
    } catch (error) {
      return {
        slug,
        issues: [error instanceof Error ? error.message : String(error)],
      };
    }
  });
}
