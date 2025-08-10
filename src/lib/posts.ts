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
  const meta: PostMeta = {
    slug,
    title: String(data.title ?? slug),
    date: String(dateRaw),
    dateISO: new Date(dateObj.getTime()).toISOString(),
    timestamp: dateObj.getTime(),
    description: data.description ? String(data.description) : undefined,
  };
  return { meta, content };
}

export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPostSource(slug).meta)
    .sort((a, b) => b.timestamp - a.timestamp);
}
