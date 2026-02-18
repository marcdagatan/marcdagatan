import { getAllPostsMeta, getAllTags } from "@/lib/posts";
import { BlogContent } from "@/components/blog-content";
import { JsonLd } from "@/components/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

export const metadata = {
  title: "Marc Uy Dagatan | Thoughts of a Mastermind in Pajamas",
  description: "It's hard to plot world domination when your coffee's still brewing… but I'm making it work",
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  const allTags = getAllTags();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Marc — Blog",
    description: "Thoughts of a Mastermind in Pajamas",
    url: `${SITE_URL}/blog`,
    author: {
      "@type": "Person",
      name: "Marc Uy Dagatan",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description ?? undefined,
      datePublished: post.dateISO,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogContent posts={posts} allTags={allTags} />
    </>
  );
}
