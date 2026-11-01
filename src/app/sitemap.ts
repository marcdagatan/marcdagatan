import { MetadataRoute } from "next";
import { getAllPostsMeta, getAllTopics } from "@/lib/posts";
import { buildSitemapEntries } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/site";
import { ROOM_IDS } from "@/components/house/rooms";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(
    getAllPostsMeta(),
    getAllTopics(),
    ROOM_IDS,
    SITE_URL,
    new Date()
  );
}
