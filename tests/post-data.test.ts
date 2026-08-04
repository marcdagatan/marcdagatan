import { describe, expect, it } from "vitest";
import {
  buildPostMeta,
  selectPublishedPosts,
  selectRelatedPosts,
  sortPostsNewestFirst,
  buildTopicsIndex,
  type PostMeta,
} from "@/lib/post-data";

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

describe("buildPostMeta", () => {
  it("derives reading time from content word count", () => {
    const content = Array.from({ length: 40 }, () => "word").join(" ");
    const meta = buildPostMeta("x", {
      title: "T",
      date: "2025-08-10T21:30:00+08:00",
      description: "D",
      lane: "life",
      format: "essay",
      topics: ["acting"],
    }, content);
    expect(meta.readingTime).toBe(1);
  });

  it("validates frontmatter while building", () => {
    expect(() =>
      buildPostMeta("x", {
        title: "T",
        date: "nope",
        description: "D",
        lane: "life",
        format: "essay",
        topics: ["acting"],
      }, "body")
    ).toThrow();
  });
});

describe("selectPublishedPosts", () => {
  it("excludes drafts from published collections", () => {
    const draft = makePost({ slug: "draft-post", draft: true });
    const published = makePost({ slug: "published-post" });
    expect(selectPublishedPosts([draft, published])).toEqual([published]);
  });
});

describe("sortPostsNewestFirst", () => {
  it("orders by timestamp descending", () => {
    const older = makePost({ slug: "older", timestamp: 100 });
    const newer = makePost({ slug: "newer", timestamp: 200 });
    expect(sortPostsNewestFirst([older, newer]).map((p) => p.slug)).toEqual([
      "newer",
      "older",
    ]);
  });
});

describe("selectRelatedPosts", () => {
  const base = [
    makePost({
      slug: "current",
      topics: ["ai", "governance"],
      timestamp: 500,
    }),
    makePost({ slug: "shared-ai", topics: ["ai"], timestamp: 400 }),
    makePost({ slug: "shared-governance", topics: ["governance"], timestamp: 300 }),
    makePost({ slug: "unrelated", topics: ["film"], timestamp: 200 }),
  ];

  it("scores posts by topic overlap", () => {
    const related = selectRelatedPosts(base, "current", ["ai", "governance"], 3);
    expect(related.map((p) => p.slug)).toEqual([
      "shared-ai",
      "shared-governance",
      "unrelated",
    ]);
  });

  it("never includes the current post", () => {
    const related = selectRelatedPosts(base, "current", ["ai"], 5);
    expect(related.some((p) => p.slug === "current")).toBe(false);
  });

  it("respects the limit", () => {
    const related = selectRelatedPosts(base, "current", ["ai", "governance"], 1);
    expect(related).toHaveLength(1);
  });

  it("falls back to newest posts when there is no overlap", () => {
    const related = selectRelatedPosts(
      base,
      "current",
      ["boxing", "acting"],
      2
    );
    expect(related.map((p) => p.slug)).toEqual(["shared-ai", "shared-governance"]);
  });

  it("returns the newest posts when no topics are supplied", () => {
    const related = selectRelatedPosts(base, "current", [], 2);
    expect(related.map((p) => p.slug)).toEqual(["shared-ai", "shared-governance"]);
  });
});

describe("buildTopicsIndex", () => {
  it("counts curated topics across published posts, newest first", () => {
    const posts = [
      makePost({ slug: "a", topics: ["ai", "governance"] }),
      makePost({ slug: "b", topics: ["ai"] }),
      makePost({ slug: "c", topics: ["boxing"] }),
    ];
    const index = buildTopicsIndex(posts);
    expect(index).toEqual([
      { topic: "ai", count: 2 },
      { topic: "boxing", count: 1 },
      { topic: "governance", count: 1 },
    ]);
  });

  it("omits one-off keywords that are not curated", () => {
    const posts = [
      makePost({ slug: "a", topics: ["ai", "personal" as never] }),
    ];
    const index = buildTopicsIndex(posts);
    expect(index).toEqual([{ topic: "ai", count: 1 }]);
  });
});
