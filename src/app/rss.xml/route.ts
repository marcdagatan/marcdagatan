import { getAllPostsMeta } from "@/lib/posts";

export const revalidate = 3600; // Rebuild RSS every hour

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPostsMeta();

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`;
      const title = escapeXml(post.title);
      const description = escapeXml(post.description || "");
      const pubDate = new Date(post.date).toUTCString();
      return `\n    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Marc — Blog</title>
    <link>${SITE_URL}</link>
    <description>Minimal MDX blog</description>
    <language>en-us</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
    },
  });
}


