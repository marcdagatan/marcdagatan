/**
 * RSS 2.0 feed generation.
 *
 * Pure builder so the XML contract is unit-testable without a server. Items
 * carry lane and topic categories, the feed links to itself, and all text is
 * XML-escaped. Content is a deliberate summary (description) rather than full
 * body HTML.
 */

import type { PostMeta } from "./post-data";
import { PUBLICATION_NAME, SITE_DESCRIPTION, RSS_PATH } from "./site";

/**
 * Escapes a string for safe inclusion in XML text or attributes.
 *
 * @param input - Raw string.
 * @returns XML-safe string.
 */
export function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildItem(post: PostMeta, siteUrl: string): string {
  const link = `${siteUrl}/blog/${post.slug}`;
  const categories = [post.lane, ...post.topics]
    .map((category) => `      <category>${escapeXml(category)}</category>`)
    .join("\n");

  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid>${escapeXml(link)}</guid>`,
    `      <pubDate>${new Date(post.timestamp).toUTCString()}</pubDate>`,
    `      <description>${escapeXml(post.description)}</description>`,
    categories,
    "    </item>",
  ].join("\n");
}

/**
 * Builds the complete RSS 2.0 document for the published posts.
 *
 * @param posts - Published posts, newest first.
 * @param siteUrl - Absolute site origin.
 * @param buildDate - Feed build time; emitted as lastBuildDate.
 * @returns The full RSS XML document.
 */
export function buildRssFeed(
  posts: readonly PostMeta[],
  siteUrl: string,
  buildDate: Date
): string {
  const selfLink = `${siteUrl}${RSS_PATH}`;
  const items = posts.map((post) => buildItem(post, siteUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(PUBLICATION_NAME)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}
