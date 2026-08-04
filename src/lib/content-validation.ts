/**
 * Strict post frontmatter validation.
 *
 * Why: the content model is the contract between the writing and every
 * consumer (pages, RSS, sitemap, search, metadata). Invalid frontmatter must
 * fail loudly at build time instead of silently degrading the site.
 */

import {
  isValidLane,
  isValidFormat,
  normalizeTopic,
  type Lane,
  type PostFormat,
  type Topic,
} from "./topics";
import {
  formatDisplayDate,
  parsePostDate,
  toPostISO,
} from "./dates";

/** Error thrown when post frontmatter fails validation. */
export class PostValidationError extends Error {
  /** Slug of the offending post. */
  slug: string;
  /** Human-readable validation failures. */
  issues: string[];

  constructor(slug: string, issues: string[]) {
    super(`Invalid frontmatter for post "${slug}": ${issues.join("; ")}`);
    this.name = "PostValidationError";
    this.slug = slug;
    this.issues = issues;
  }
}

/** Validated, normalized frontmatter values for a single post. */
export type ValidatedFrontmatter = {
  title: string;
  /** Raw frontmatter date value as authored. */
  date: string;
  /** Machine-readable ISO 8601 string with Asia/Manila offset. */
  dateISO: string;
  /** Epoch milliseconds of the post instant. */
  timestamp: number;
  /** Server-formatted display string ("February 18, 2026"). */
  displayDate: string;
  description: string;
  lane: Lane;
  format: PostFormat;
  topics: Topic[];
  featured: boolean;
  draft: boolean;
  /** Raw header image path when present. */
  headerImage?: string;
  /** Normalized optional update date. */
  updated?: { dateISO: string; displayDate: string };
};

/**
 * Validates raw gray-matter frontmatter for a post.
 *
 * @param slug - Post slug, used in error messages.
 * @param data - Raw frontmatter object from gray-matter.
 * @returns Normalized, validated frontmatter values.
 * @throws PostValidationError listing every failing rule.
 */
export function validatePostFrontmatter(
  slug: string,
  data: unknown
): ValidatedFrontmatter {
  const issues: string[] = [];
  const record = (data ?? {}) as Record<string, unknown>;

  const title = requireString(record.title, "title", issues);
  const description = requireString(record.description, "description", issues);
  const rawDate = requireString(record.date, "date", issues);

  let dateISO = "";
  let timestamp = 0;
  let displayDate = "";
  if (rawDate !== null) {
    try {
      const parsed = parsePostDate(rawDate);
      dateISO = toPostISO(parsed);
      timestamp = parsed.getTime();
      displayDate = formatDisplayDate(parsed);
    } catch {
      issues.push(`invalid date "${rawDate}" (expected ISO with timezone)`);
    }
  }

  const lane = validateLane(record.lane, issues);
  const format = validateFormat(record.format, issues);
  const topics = validateTopics(record.topics, issues);

  const featured = validateBoolean(record.featured, "featured", issues, false);
  const draft = validateBoolean(record.draft, "draft", issues, false);

  const headerImage =
    record.headerImage === undefined || record.headerImage === null
      ? undefined
      : typeof record.headerImage === "string" && record.headerImage.length > 0
        ? record.headerImage
        : (issues.push("headerImage must be a non-empty string"), undefined);

  let updated: { dateISO: string; displayDate: string } | undefined;
  if (record.updated !== undefined && record.updated !== null) {
    if (typeof record.updated === "string" && record.updated.length > 0) {
      try {
        const parsed = parsePostDate(record.updated);
        updated = { dateISO: toPostISO(parsed), displayDate: formatDisplayDate(parsed) };
      } catch {
        issues.push(`invalid updated date "${String(record.updated)}"`);
      }
    } else {
      issues.push("updated must be a non-empty date string");
    }
  }

  if (issues.length > 0) throw new PostValidationError(slug, issues);

  return {
    title: title as string,
    date: rawDate as string,
    dateISO,
    timestamp,
    displayDate,
    description: description as string,
    lane,
    format,
    topics,
    featured,
    draft,
    ...(headerImage !== undefined ? { headerImage } : {}),
    ...(updated !== undefined ? { updated } : {}),
  };
}

function requireString(
  value: unknown,
  field: string,
  issues: string[]
): string | null {
  if (typeof value === "string" && value.trim().length > 0) return value;
  issues.push(`missing or empty "${field}"`);
  return null;
}

function validateLane(value: unknown, issues: string[]): Lane {
  if (typeof value === "string" && isValidLane(value)) return value;
  issues.push(`invalid lane "${String(value)}" (expected systems, operators, or life)`);
  return "life";
}

function validateFormat(value: unknown, issues: string[]): PostFormat {
  if (typeof value === "string" && isValidFormat(value)) return value;
  issues.push(
    `invalid format "${String(value)}" (expected essay, guide, review, or note)`
  );
  return "essay";
}

function validateTopics(value: unknown, issues: string[]): Topic[] {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push("topics must be a non-empty array of curated topics");
    return [];
  }
  const topics: Topic[] = [];
  const seen = new Set<Topic>();
  for (const item of value) {
    if (typeof item !== "string") {
      issues.push(`topic "${String(item)}" must be a string`);
      continue;
    }
    const normalized = normalizeTopic(item);
    if (normalized === null) {
      issues.push(`unknown topic "${item}" (not in curated topic list)`);
    } else if (seen.has(normalized)) {
      issues.push(`duplicate topic "${item}" normalizes to "${normalized}"`);
    } else {
      seen.add(normalized);
      topics.push(normalized);
    }
  }
  return topics;
}

function validateBoolean(
  value: unknown,
  field: string,
  issues: string[],
  defaultValue: boolean
): boolean {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "boolean") return value;
  issues.push(`"${field}" must be a boolean`);
  return defaultValue;
}
