import { describe, expect, it } from "vitest";
import {
  buildFilterQuery,
  countPostsByLane,
  filterPosts,
  parseLaneParam,
  parseTopicParam,
  UNKNOWN_LANE,
  UNKNOWN_TOPIC,
} from "@/lib/archive";
import type { PostMeta } from "@/lib/post-data";

function makePost(overrides: Partial<PostMeta> & { slug: string }): PostMeta {
  return {
    title: overrides.slug,
    date: "2025-08-10T21:30:00+08:00",
    dateISO: "2025-08-10T21:30:00+08:00",
    timestamp: Date.parse("2025-08-10T13:30:00.000Z"),
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
  makePost({ slug: "010-skills-router", lane: "systems", topics: ["ai", "governance"] }),
  makePost({ slug: "004-ai-vibe-coding", lane: "systems", topics: ["ai", "tools"] }),
  makePost({ slug: "003-how-not-to-hire", lane: "operators", topics: ["hiring"] }),
  makePost({ slug: "001-the-first-bell", lane: "life", topics: ["boxing"] }),
];

describe("parseLaneParam", () => {
  it("parses valid lanes", () => {
    expect(parseLaneParam("systems")).toBe("systems");
    expect(parseLaneParam("operators")).toBe("operators");
    expect(parseLaneParam("life")).toBe("life");
  });

  it("treats absent or empty params as no filter", () => {
    expect(parseLaneParam(null)).toBeNull();
    expect(parseLaneParam("")).toBeNull();
  });

  it("marks unknown lanes instead of guessing", () => {
    expect(parseLaneParam("gaming")).toBe(UNKNOWN_LANE);
    expect(parseLaneParam("SYSTEMS")).toBe(UNKNOWN_LANE);
  });
});

describe("parseTopicParam", () => {
  it("parses curated topics (case-insensitive)", () => {
    expect(parseTopicParam("ai")).toBe("ai");
    expect(parseTopicParam("BOXING")).toBe("boxing");
  });

  it("treats absent params as no filter", () => {
    expect(parseTopicParam(null)).toBeNull();
    expect(parseTopicParam("")).toBeNull();
  });

  it("marks non-curated topics as unknown", () => {
    expect(parseTopicParam("quantum")).toBe(UNKNOWN_TOPIC);
  });
});

describe("buildFilterQuery", () => {
  it("returns an empty string when unfiltered", () => {
    expect(buildFilterQuery({ lane: null, topic: null })).toBe("");
  });

  it("serializes lane and topic filters", () => {
    expect(buildFilterQuery({ lane: "systems", topic: "ai" })).toBe("?lane=systems&topic=ai");
    expect(buildFilterQuery({ lane: "life", topic: null })).toBe("?lane=life");
  });
});

describe("filterPosts", () => {
  it("returns everything when no filters are active", () => {
    expect(filterPosts(posts, { lane: null, topic: null })).toHaveLength(4);
  });

  it("filters by lane", () => {
    const filtered = filterPosts(posts, { lane: "systems", topic: null });
    expect(filtered.map((p) => p.slug)).toEqual(["010-skills-router", "004-ai-vibe-coding"]);
  });

  it("filters by topic", () => {
    const filtered = filterPosts(posts, { lane: null, topic: "boxing" });
    expect(filtered.map((p) => p.slug)).toEqual(["001-the-first-bell"]);
  });

  it("combines lane and topic filters", () => {
    const filtered = filterPosts(posts, { lane: "systems", topic: "tools" });
    expect(filtered.map((p) => p.slug)).toEqual(["004-ai-vibe-coding"]);
  });

  it("returns an empty list for an impossible combination", () => {
    expect(filterPosts(posts, { lane: "life", topic: "ai" })).toEqual([]);
  });
});

describe("countPostsByLane", () => {
  it("counts every lane including empty ones", () => {
    expect(countPostsByLane(posts)).toEqual({ systems: 2, operators: 1, life: 1 });
    expect(countPostsByLane([])).toEqual({ systems: 0, operators: 0, life: 0 });
  });
});
