/**
 * Site-wide constants shared by metadata, RSS, sitemap, robots, and JSON-LD.
 *
 * Why: URL and identity constants were hand-rolled in every route, which made
 * them drift (e.g. "Marc: Blog" vs the publication name). Everything derives
 * from this single module.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

export const SITE_NAME = "Marc Uy Dagatan";

export const PUBLICATION_NAME = "Thoughts of a Mastermind in Pajamas";

export const SITE_DESCRIPTION =
  "Essays and guides on AI systems, engineering, building teams, and the lessons usually learned the expensive way.";

export const AUTHOR_NAME = "Marc Uy Dagatan";

export const AUTHOR_EMAIL = "marc.dagatan@gmail.com";

export const SITE_LOCALE = "en_US";

export const RSS_PATH = "/rss.xml";

export const RSS_URL = `${SITE_URL}${RSS_PATH}`;

/** Alternate-link entry for RSS autodiscovery in Metadata. */
export const RSS_ALTERNATE = { url: RSS_PATH, title: PUBLICATION_NAME };

/**
 * Resolves a site-relative path to an absolute URL.
 *
 * @param path - Site-relative path, e.g. "/blog/010-skills-router".
 * @returns Absolute URL based on SITE_URL.
 */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
