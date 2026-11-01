import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeInlineCodeToPre from "@/lib/rehype-inline-code-to-pre";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, AUTHOR_NAME, RSS_ALTERNATE, SITE_NAME } from "@/lib/site";
import { getPostSlugs, getRelatedPosts, PostNotFoundError } from "@/lib/posts";
import { getAllPostsWithStats, getPostWithStats, toPiece, type PostWithStats } from "@/components/house/data";
import { EssayEnding } from "@/components/house/essay/endings";
import { EssayHero, type EssayInfo } from "@/components/house/essay/heroes";
import { EssayMore, type MoreLink } from "@/components/house/essay/more";
import { SectionHeading } from "@/components/house/essay/section-heading";
import { ARTICLE_ID, EssayToc, StickyMeter } from "@/components/house/essay/toc";
import { RoomsNextDoor } from "@/components/house/next-door";
import { postsInRoom, roomsForPost } from "@/components/house/rooms";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

function load(slug: string) {
  try {
    return getPostWithStats(slug);
  } catch (error) {
    if (error instanceof PostNotFoundError) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { post: meta } = load(slug);

  const canonical = `/blog/${slug}`;
  const ogImageUrl = `${canonical}/opengraph-image`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": [RSS_ALTERNATE],
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: meta.dateISO,
      modifiedTime: meta.updated,
      authors: [AUTHOR_NAME],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

function toLink(post: PostWithStats): MoreLink {
  return { slug: post.slug, title: post.title, room: post.room, displayDate: post.displayDate, readingTime: post.readingTime };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const { post, content: source } = load(slug);
  const { room, stats } = post;

  const sectionIndex = new Map(stats.sections.map((section, index) => [section.id, index]));
  const HeadingTag = stats.sectionLevel === 2 ? "h2" : "h3";
  const RoomHeading = ({ id, children, ...rest }: ComponentPropsWithoutRef<"h2">) => {
    const index = id ? sectionIndex.get(id) : undefined;
    if (index === undefined || !id) {
      return (
        <HeadingTag id={id} {...rest}>
          {children}
        </HeadingTag>
      );
    }
    // Life's handwritten margin only notes the minute when it moves on.
    const previous = index > 0 ? stats.minuteAt[stats.sections[index - 1].id] : undefined;
    const minute = room === "life" && previous === stats.minuteAt[id] ? undefined : stats.minuteAt[id];
    return (
      <SectionHeading room={room} level={stats.sectionLevel} index={index} minute={minute} id={id}>
        {children}
      </SectionHeading>
    );
  };

  // Section headings are dressed per room; the rest of the MDX pipeline is
  // the publication's standard one.
  const { content } = await compileMDX({
    source,
    components: { [HeadingTag]: RoomHeading },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeInlineCodeToPre,
          [
            rehypePrettyCode,
            {
              theme: { dark: "github-dark", light: "github-light" },
              keepBackground: false,
              defaultLang: "ts",
            },
          ],
        ],
      },
    },
  });

  const all = getAllPostsWithStats();
  const position = all.findIndex((item) => item.slug === slug);
  const inRoom = postsInRoom(all, room);
  const info: EssayInfo = {
    piece: toPiece(post),
    number: inRoom.findIndex((item) => item.slug === slug) + 1,
    alsoIn: roomsForPost(post).filter((id) => id !== room),
    updatedDisplayDate: post.updatedDisplayDate,
  };
  const bySlug = new Map(all.map((item) => [item.slug, item]));
  const related = getRelatedPosts(slug, post.topics, 3)
    .flatMap((meta) => {
      const match = bySlug.get(meta.slug);
      return match ? [toLink(match)] : [];
    });
  const newer = position > 0 ? toLink(all[position - 1]) : undefined;
  const older = position >= 0 && position < all.length - 1 ? toLink(all[position + 1]) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    ...(post.updated ? { dateModified: post.updated } : {}),
    articleSection: post.lane,
    keywords: post.topics,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${slug}`),
    },
  };

  return (
    <main data-room={room} className="ml-essay" data-sections={stats.sections.length}>
      <JsonLd data={jsonLd} />
      <EssayHero room={room} info={info} />
      {room === "ring" || room === "screen" ? (
        <StickyMeter room={room} sections={stats.sections} readingTime={post.readingTime} />
      ) : null}
      <div className="ml-wrap ml-essay-body">
        <aside className="ml-essay-aside">
          <EssayToc room={room} sections={stats.sections} minuteAt={stats.minuteAt} />
        </aside>
        <article id={ARTICLE_ID} className="ml-prose">
          {content}
        </article>
      </div>
      <EssayEnding room={room} info={info} />
      <EssayMore room={room} related={related} older={older} newer={newer} />
      <RoomsNextDoor current={room} label="Down the hall" />
    </main>
  );
}
