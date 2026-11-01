import { describe, expect, it } from "vitest";
import { buildSitemapEntries } from "@/lib/sitemap";
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
  makePost({ slug: "010-skills-router", topics: ["ai", "governance"] }),
  makePost({ slug: "001-the-first-bell", topics: ["boxing", "acting"] }),
];

const topics = [
  { topic: "ai" as const, count: 1 },
  { topic: "acting" as const, count: 1 },
  { topic: "boxing" as const, count: 1 },
  { topic: "governance" as const, count: 1 },
];

describe("buildSitemapEntries", () => {
  const entries = buildSitemapEntries(
    posts,
    topics,
    ["engineering", "ring"],
    "https://marcuyyy.com",
    new Date("2026-03-01T00:00:00.000Z")
  );

  it("includes home, about, archive, and RSS entry points", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://marcuyyy.com");
    expect(urls).toContain("https://marcuyyy.com/about");
    expect(urls).toContain("https://marcuyyy.com/blog");
    expect(urls).toContain("https://marcuyyy.com/rss.xml");
  });

  it("includes a page for every room", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://marcuyyy.com/rooms/engineering");
    expect(urls).toContain("https://marcuyyy.com/rooms/ring");
  });

  it("includes every published post with an absolute URL", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://marcuyyy.com/blog/010-skills-router");
    expect(urls).toContain("https://marcuyyy.com/blog/001-the-first-bell");
  });

  it("includes only curated topic pages", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://marcuyyy.com/blog/tag/ai");
    expect(urls).toContain("https://marcuyyy.com/blog/tag/boxing");
    expect(urls).not.toContain("https://marcuyyy.com/blog/tag/personal");
  });

  it("uses post timestamps as lastModified", () => {
    const post = entries.find((e) => e.url.endsWith("/blog/010-skills-router"));
    expect(post?.lastModified).toEqual(new Date("2025-08-10T13:30:00.000Z"));
  });
});
