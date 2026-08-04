import { describe, expect, it } from "vitest";
import {
  selectCurrentBout,
  selectRecentRounds,
  selectStartHerePosts,
} from "@/lib/homepage";
import type { PostMeta } from "@/lib/post-data";

function makePost(overrides: Partial<PostMeta> & { slug: string }): PostMeta {
  return {
    title: overrides.slug,
    date: "2025-08-10T21:30:00+08:00",
    dateISO: "2025-08-10T21:30:00+08:00",
    timestamp: 0,
    displayDate: "August 10, 2025",
    description: "A test post.",
    lane: "life",
    format: "essay",
    topics: ["relationships"],
    readingTime: 2,
    featured: false,
    draft: false,
    ...overrides,
  };
}

const posts: PostMeta[] = [
  makePost({ slug: "010-skills-router", timestamp: 1000, lane: "systems", featured: true }),
  makePost({ slug: "009-superman", timestamp: 900, lane: "life" }),
  makePost({ slug: "003-how-not-to-hire", timestamp: 800, lane: "operators" }),
  makePost({ slug: "001-the-first-bell", timestamp: 700, lane: "life" }),
  makePost({ slug: "006-glm", timestamp: 600, lane: "systems" }),
];

describe("selectCurrentBout", () => {
  it("prefers the featured post", () => {
    expect(selectCurrentBout(posts)?.slug).toBe("010-skills-router");
  });

  it("falls back to the newest post when nothing is featured", () => {
    const unfetured = posts.map((p) => ({ ...p, featured: false }));
    expect(selectCurrentBout(unfetured)?.slug).toBe("010-skills-router");
  });

  it("returns null for an empty archive", () => {
    expect(selectCurrentBout([])).toBeNull();
  });
});

describe("selectStartHerePosts", () => {
  it("returns one editorial pick per lane", () => {
    const picks = selectStartHerePosts(posts);
    expect(picks.map((p) => p.slug)).toEqual([
      "010-skills-router",
      "003-how-not-to-hire",
      "001-the-first-bell",
    ]);
  });

  it("falls back to the newest post in a lane when the pick is missing", () => {
    const withoutPicks = posts.filter((p) => p.slug !== "001-the-first-bell");
    const picks = selectStartHerePosts(withoutPicks);
    expect(picks.map((p) => p.slug)).toEqual([
      "010-skills-router",
      "003-how-not-to-hire",
      "009-superman",
    ]);
  });

  it("never repeats the same post across lanes", () => {
    const picks = selectStartHerePosts(posts);
    expect(new Set(picks.map((p) => p.slug)).size).toBe(picks.length);
  });

  it("excludes the Current Bout from Start Here", () => {
    const picks = selectStartHerePosts(posts, ["010-skills-router"]);
    expect(picks.map((post) => post.slug)).toEqual([
      "006-glm",
      "003-how-not-to-hire",
      "001-the-first-bell",
    ]);
  });
});

describe("selectRecentRounds", () => {
  it("returns newest-first posts excluding featured ones", () => {
    const recent = selectRecentRounds(posts, ["010-skills-router", "003-how-not-to-hire"], 4);
    expect(recent.map((p) => p.slug)).toEqual(["009-superman", "001-the-first-bell", "006-glm"]);
  });

  it("respects the limit", () => {
    const recent = selectRecentRounds(posts, [], 2);
    expect(recent.map((p) => p.slug)).toEqual(["010-skills-router", "009-superman"]);
  });
});
