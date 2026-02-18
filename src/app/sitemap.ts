import { MetadataRoute } from "next";
import { getAllPostsMeta, getAllTags } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsMeta();
  const tags = getAllTags();

  const postUrls = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.timestamp),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const tagUrls = tags.map((tag) => ({
    url: `${SITE_URL}/blog/tag/${tag.tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/rss.xml`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.3,
    },
    ...postUrls,
    ...tagUrls,
  ];
}
