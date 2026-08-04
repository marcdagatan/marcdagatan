import { describe, expect, it } from "vitest";
import { buildRssFeed, escapeXml } from "@/lib/rss";
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
  makePost({
    slug: "010-skills-router",
    title: "The Skills Router: AI & Governance",
    description: "Deterministic AI coding with <strong>guardrails</strong> & rules.",
    lane: "systems",
    format: "essay",
    topics: ["ai", "governance", "engineering"],
    timestamp: Date.parse("2026-02-18T05:45:00.000Z"),
    dateISO: "2026-02-18T13:45:00+08:00",
  }),
  makePost({ slug: "001-the-first-bell", title: "The First Bell", description: "An introduction." }),
];

const buildDate = new Date("2026-03-01T00:00:00.000Z");

describe("escapeXml", () => {
  it("escapes the five XML special characters", () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;"
    );
  });

  it("leaves plain text untouched", () => {
    expect(escapeXml("plain text 123")).toBe("plain text 123");
  });
});

describe("buildRssFeed", () => {
  const feed = buildRssFeed(posts, "https://marcuyyy.com", buildDate);

  it("is a well-formed XML document", () => {
    expect(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(feed).toContain("<rss version=\"2.0\"");
    expect(feed).toContain("<channel>");
    expect(feed).toContain("</channel>");
    expect(feed).toContain("</rss>");
  });

  it("declares the atom namespace for the self link", () => {
    expect(feed).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
  });

  it("includes a self link to the feed URL", () => {
    expect(feed).toContain(
      '<atom:link href="https://marcuyyy.com/rss.xml" rel="self" type="application/rss+xml"'
    );
  });

  it("includes a last build date", () => {
    expect(feed).toContain("<lastBuildDate>Sun, 01 Mar 2026 00:00:00 GMT</lastBuildDate>");
  });

  it("adds lane and topic categories per item", () => {
    const itemStart = feed.indexOf("<item>");
    const itemEnd = feed.indexOf("</item>");
    const item = feed.slice(itemStart, itemEnd);
    expect(item).toContain("<category>systems</category>");
    expect(item).toContain("<category>ai</category>");
    expect(item).toContain("<category>governance</category>");
  });

  it("emits correct UTC pubDate values", () => {
    expect(feed).toContain(
      "<pubDate>Wed, 18 Feb 2026 05:45:00 GMT</pubDate>"
    );
  });

  it("uses absolute post URLs", () => {
    expect(feed).toContain("<link>https://marcuyyy.com/blog/010-skills-router</link>");
    expect(feed).toContain("<guid>https://marcuyyy.com/blog/010-skills-router</guid>");
  });

  it("escapes XML-sensitive title and description content", () => {
    expect(feed).toContain(
      "The Skills Router: AI &amp; Governance"
    );
    expect(feed).toContain(
      "Deterministic AI coding with &lt;strong&gt;guardrails&lt;/strong&gt; &amp; rules."
    );
    expect(feed).not.toContain("<strong>");
  });

  it("lists every published post", () => {
    expect(feed.match(/<item>/g)?.length).toBe(2);
  });
});
