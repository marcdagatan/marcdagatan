import { MetadataRoute } from "next";
import { getAllPostsMeta, getAllTopics } from "@/lib/posts";
import { buildSitemapEntries } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(
    getAllPostsMeta(),
    getAllTopics(),
    SITE_URL,
    new Date()
  );
}
