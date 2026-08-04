import { describe, expect, it } from "vitest";
import Fuse from "fuse.js";
import { SEARCH_OPTIONS } from "@/lib/search";
import type { SearchPost } from "@/components/search-types";

/**
 * Locks the publication-index ranking contract (TASKLIST 5.3 polish):
 * - title and topics are the strongest fields, description secondary, lane
 *   weakest;
 * - the query "glm" must rank the GLM review first and must not surface the
 *   Superman review through a fuzzy topic match on "film";
 * - useful fuzzy matching for longer queries ("skils" → "skills") survives
 *   the tightened threshold.
 */

const INDEX: SearchPost[] = [
  {
    slug: "001-the-first-bell",
    title: "The First Bell",
    description:
      "Every fight starts with a bell. This is your cue to step forward, swing, and keep swinging.",
    lane: "life",
    format: "essay",
    topics: ["boxing", "acting", "entrepreneurship"],
    dateISO: "2025-08-10T21:30:00+08:00",
    displayDate: "August 10, 2025",
    readingTime: 6,
  },
  {
    slug: "003-how-not-to-hire",
    title: "How Not to Hire",
    description: "The hiring mistakes that cost more than the salary ever would.",
    lane: "operators",
    format: "essay",
    topics: ["hiring", "leadership"],
    dateISO: "2025-08-11T13:00:00+08:00",
    displayDate: "August 11, 2025",
    readingTime: 9,
  },
  {
    slug: "006-exploring-glm-4-5",
    title: "GLM-4.5 vs Claude Opus: The Price Gap That Feels Illegal",
    description:
      "A full teardown of GLM-4.5 vs Claude Opus across light coding, heavy reasoning, and scale.",
    lane: "systems",
    format: "review",
    topics: ["ai", "tools"],
    dateISO: "2025-08-21T02:30:00+08:00",
    displayDate: "August 21, 2025",
    readingTime: 6,
  },
  {
    slug: "007-openrouter-integration-on-cursor",
    title: "How to Add OpenRouter.ai to Cursor",
    description:
      "Step-by-step guide to integrating OpenRouter.ai into your Cursor IDE and unlocking custom LLMs like GLM-4.5.",
    lane: "systems",
    format: "guide",
    topics: ["ai", "tools"],
    dateISO: "2025-08-21T11:20:00+08:00",
    displayDate: "August 21, 2025",
    readingTime: 8,
  },
  {
    slug: "009-superman-2025",
    title: "When Superman Fails to Soar",
    description:
      "The new Superman film tries to be colorful and human, but falls flat with weak acting, rushed pacing, and shallow storytelling.",
    lane: "life",
    format: "review",
    topics: ["film"],
    dateISO: "2025-09-14T22:58:00+08:00",
    displayDate: "September 14, 2025",
    readingTime: 4,
  },
  {
    slug: "010-skills-router",
    title: "The Skills Router",
    description:
      "A governed AI-coding system that routes coding work to the model that can actually do it.",
    lane: "systems",
    format: "guide",
    topics: ["ai", "engineering", "tools"],
    dateISO: "2025-10-02T10:00:00+08:00",
    displayDate: "October 2, 2025",
    readingTime: 12,
  },
];

function search(query: string): SearchPost[] {
  const fuse = new Fuse(INDEX, SEARCH_OPTIONS);
  return fuse.search(query).slice(0, 6).map((result) => result.item);
}

describe("publication search ranking", () => {
  it("ranks the GLM review first for the query `glm`", () => {
    const results = search("glm");
    expect(results[0]?.slug).toBe("006-exploring-glm-4-5");
  });

  it("does not surface the Superman review for the query `glm`", () => {
    const results = search("glm");
    expect(results.map((post) => post.slug)).not.toContain("009-superman-2025");
  });

  it("keeps title matches dominant for `skills`", () => {
    const results = search("skills");
    expect(results[0]?.slug).toBe("010-skills-router");
  });

  it("keeps useful fuzzy matching for longer queries", () => {
    const results = search("skils");
    expect(results[0]?.slug).toBe("010-skills-router");
  });

  it("ranks exact topic matches before incidental substring noise", () => {
    const results = search("ai");
    expect(results[0]?.topics).toContain("ai");
    // The Superman review (no "ai" topic) only matches the "ai" inside
    // "pacing"; every curated "ai"-topic post must outrank it.
    const supermanIndex = results.findIndex((post) => post.slug === "009-superman-2025");
    const lastTopicIndex = Math.max(
      ...results
        .map((post, index) => (post.topics.includes("ai") ? index : -1))
        .filter((index) => index >= 0)
    );
    expect(supermanIndex).toBeGreaterThan(lastTopicIndex);
  });
});
