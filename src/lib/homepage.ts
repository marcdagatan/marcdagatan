/**
 * Homepage editorial selection logic (pure, testable).
 *
 * The front door needs deterministic "next reads": one featured Current Bout,
 * and three Start Here posts, one per lane. Prefer explicit editorial picks
 * with graceful fallbacks so the homepage never renders empty or duplicative.
 */

import type { PostMeta } from "./post-data";
import { sortPostsNewestFirst } from "./post-data";

/** Editorial Start Here picks: the natural first read in each lane. */
const START_HERE_PICKS: Record<string, string> = {
  systems: "010-skills-router",
  operators: "003-how-not-to-hire",
  life: "001-the-first-bell",
};

/**
 * Selects the Current Bout post: the featured post when one exists, otherwise
 * the newest post.
 *
 * @param posts - All published posts.
 * @returns The featured post, or the newest post.
 */
export function selectCurrentBout(posts: readonly PostMeta[]): PostMeta | null {
  if (posts.length === 0) return null;
  return posts.find((post) => post.featured) ?? sortPostsNewestFirst(posts)[0];
}

/**
 * Selects the three Start Here posts (one per lane).
 *
 * Prefers the editorial pick per lane; falls back to the newest post in that
 * lane when the pick is missing.
 *
 * @param posts - All published posts.
 * @param exclude - Slugs already used in a more prominent homepage slot.
 * @returns Three posts, one per lane, editorial order (systems, operators,
 *   life). Fewer when a lane has no published posts.
 */
export function selectStartHerePosts(
  posts: readonly PostMeta[],
  exclude: readonly string[] = []
): PostMeta[] {
  const excluded = new Set(exclude);
  const byLane = (lane: string) =>
    posts.filter((post) => post.lane === lane && !excluded.has(post.slug));

  return (["systems", "operators", "life"] as const)
    .map((lane) => {
      const candidates = byLane(lane);
      if (candidates.length === 0) return null;
      const pick = candidates.find((post) => post.slug === START_HERE_PICKS[lane]);
      return pick ?? sortPostsNewestFirst(candidates)[0];
    })
    .filter((post): post is PostMeta => post !== null);
}

/**
 * Selects Recent Rounds: the newest posts not already featured above, newest
 * first, compact list.
 *
 * @param posts - All published posts.
 * @param exclude - Slugs already shown in Current Bout / Start Here.
 * @param limit - Maximum number of recent rounds.
 * @returns Remaining posts, newest first.
 */
export function selectRecentRounds(
  posts: readonly PostMeta[],
  exclude: readonly string[],
  limit = 4
): PostMeta[] {
  const excluded = new Set(exclude);
  return sortPostsNewestFirst(posts)
    .filter((post) => !excluded.has(post.slug))
    .slice(0, limit);
}
