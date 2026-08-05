/**
 * Sitemap entry generation.
 *
 * Pure builder so the sitemap contract is unit-testable. Entries cover the
 * publication entry points, every published post, and curated topic pages
 * only.
 */

import type { MetadataRoute } from "next";
import type { PostMeta } from "./post-data";
import type { Topic } from "./topics";
import { getCvPath } from "./cv/view";
import { RSS_PATH } from "./site";

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Builds sitemap entries for the publication.
 *
 * @param posts - Published posts.
 * @param topics - Curated topic index.
 * @param siteUrl - Absolute site origin.
 * @param now - Current build time for the entry points.
 * @returns Sitemap entries ordered: home, about, CV readings, archive, RSS, posts, topics.
 */
export function buildSitemapEntries(
  posts: readonly PostMeta[],
  topics: readonly { topic: Topic; count: number }[],
  siteUrl: string,
  now: Date
): SitemapEntry[] {
  const postEntries: SitemapEntry[] = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.timestamp),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const topicEntries: SitemapEntry[] = topics.map(({ topic }) => ({
    url: `${siteUrl}/blog/tag/${topic}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}${getCvPath("general")}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}${getCvPath("technical")}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}${RSS_PATH}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.3,
    },
    ...postEntries,
    ...topicEntries,
  ];
}
