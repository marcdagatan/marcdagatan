import { getAllPostsMeta } from "@/lib/posts";
import { buildRssFeed } from "@/lib/rss";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // Rebuild RSS every hour

export async function GET() {
  const posts = getAllPostsMeta();

  const xml = buildRssFeed(posts, SITE_URL, new Date());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
    },
  });
}
