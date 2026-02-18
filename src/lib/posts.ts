import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  timestamp: number;
  description?: string;
  tags: string[];
  readingTime: number;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function parseDate(raw: unknown): Date {
  if (typeof raw === "string") {
    const direct = new Date(raw);
    if (!Number.isNaN(direct.getTime())) return direct;
    const m = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m) {
      const [, y, mo, d, hh, mm, ampm] = m;
      let hours = parseInt(hh, 10) % 12;
      if (/pm/i.test(ampm)) hours += 12;
      return new Date(Number(y), Number(mo) - 1, Number(d), hours, Number(mm), 0, 0);
    }
  }
  return new Date();
}

export function getPostSource(slug: string): { meta: PostMeta; content: string } {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const dateRaw = data.date ?? new Date().toISOString();
  const dateObj = parseDate(dateRaw);
  const tags = Array.isArray(data.tags) 
    ? data.tags.map(String) 
    : data.tags 
      ? [String(data.tags)] 
      : [];
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  const meta: PostMeta = {
    slug,
    title: String(data.title ?? slug),
    date: String(dateRaw),
    dateISO: new Date(dateObj.getTime()).toISOString(),
    timestamp: dateObj.getTime(),
    description: data.description ? String(data.description) : undefined,
    tags,
    readingTime,
  };
  return { meta, content };
}

export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPostSource(slug).meta)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function getPostsByTag(tag: string): PostMeta[] {
  const normalizedTag = tag.toLowerCase();
  return getAllPostsMeta()
    .filter((post) => post.tags.some((t) => t.toLowerCase() === normalizedTag));
}

export function getRelatedPosts(slug: string, tags: string[], limit = 3): PostMeta[] {
  const allPosts = getAllPostsMeta().filter((p) => p.slug !== slug);
  
  if (tags.length === 0) {
    return allPosts.slice(0, limit);
  }

  const normalizedTags = tags.map((t) => t.toLowerCase());

  const scored = allPosts.map((post) => {
    const postTags = post.tags.map((t) => t.toLowerCase());
    const overlap = postTags.filter((t) => normalizedTags.includes(t)).length;
    return { post, score: overlap };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.timestamp - a.post.timestamp;
    })
    .slice(0, limit)
    .map((s) => s.post);
}

export function getAllTags(): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>();
  for (const post of getAllPostsMeta()) {
    for (const tag of post.tags) {
      const normalized = tag.toLowerCase();
      tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
