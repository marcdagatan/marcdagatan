import { getAllPostsMeta } from "@/lib/posts";

export const revalidate = 3600;

export async function GET() {
  const posts = getAllPostsMeta();

  const index = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description ?? "",
    tags: post.tags,
    dateISO: post.dateISO,
  }));

  return Response.json({ posts: index });
}
