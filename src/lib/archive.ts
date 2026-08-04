/**
 * Pure archive filtering helpers for the fight-record page.
 *
 * Filter state is reflected in the URL (`?lane=systems&topic=ai`) so a
 * filtered archive can be shared, reopened, and restored via back/forward.
 * These helpers keep param parsing and filtering deterministic and testable
 * without React.
 */

import type { PostMeta } from "./post-data";
import { normalizeTopic, type Lane, type Topic } from "./topics";

/** URL search-param name for the primary lane filter. */
export const LANE_PARAM = "lane";

/** URL search-param name for the secondary curated-topic filter. */
export const TOPIC_PARAM = "topic";

/** Validated archive filter state. */
export type ArchiveFilters = {
  lane: Lane | null;
  topic: Topic | null;
};

/** A filter that is present in the URL but not recognized. */
export const UNKNOWN_LANE = "__unknown_lane__" as const;
export const UNKNOWN_TOPIC = "__unknown_topic__" as const;

/**
 * Parses the `lane` search param.
 *
 * @param raw - Raw URL value.
 * @returns The lane when valid, null when absent, UNKNOWN_LANE when invalid.
 */
export function parseLaneParam(raw: string | null): Lane | null | typeof UNKNOWN_LANE {
  if (raw === null || raw === "") return null;
  return raw === "systems" || raw === "operators" || raw === "life"
    ? raw
    : UNKNOWN_LANE;
}

/**
 * Parses the `topic` search param against the curated topic list.
 *
 * @param raw - Raw URL value.
 * @returns The topic when curated, null when absent, UNKNOWN_TOPIC otherwise.
 */
export function parseTopicParam(raw: string | null): Topic | null | typeof UNKNOWN_TOPIC {
  if (raw === null || raw === "") return null;
  return normalizeTopic(raw) ?? UNKNOWN_TOPIC;
}

/**
 * Builds a URL search string for a filter state (empty when no filters).
 *
 * @param filters - Desired filter state.
 * @returns Query string without the leading "?", or "" when unfiltered.
 */
export function buildFilterQuery(filters: ArchiveFilters): string {
  const params = new URLSearchParams();
  if (filters.lane) params.set(LANE_PARAM, filters.lane);
  if (filters.topic) params.set(TOPIC_PARAM, filters.topic);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Filters posts by the validated archive state.
 *
 * @param posts - All published posts.
 * @param filters - Parsed filter state.
 * @returns Posts matching every active filter.
 */
export function filterPosts(posts: readonly PostMeta[], filters: ArchiveFilters): PostMeta[] {
  return posts.filter((post) => {
    if (filters.lane !== null && post.lane !== filters.lane) return false;
    if (filters.topic !== null && !post.topics.includes(filters.topic)) return false;
    return true;
  });
}

/**
 * Builds per-lane post counts for the lane filter row.
 *
 * @param posts - All published posts.
 * @returns Lane → published post count, including lanes with zero posts.
 */
export function countPostsByLane(posts: readonly PostMeta[]): Record<Lane, number> {
  const counts: Record<Lane, number> = { systems: 0, operators: 0, life: 0 };
  for (const post of posts) counts[post.lane] += 1;
  return counts;
}
