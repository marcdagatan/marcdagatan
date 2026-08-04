import { getAllPostsMeta } from "@/lib/posts";

export const revalidate = 3600;

export async function GET() {
  const posts = getAllPostsMeta();

  const index = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    lane: post.lane,
    format: post.format,
    topics: post.topics,
    dateISO: post.dateISO,
    displayDate: post.displayDate,
    readingTime: post.readingTime,
  }));

  return Response.json({ posts: index });
}
