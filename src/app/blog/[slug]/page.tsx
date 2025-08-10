import { notFound } from "next/navigation";
import { getPostSlugs, getPostSource } from "@/lib/posts";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const { meta } = getPostSource(slug);
  return {
    title: `${meta.title} | Marc Uy Dagatan`,
    description: meta.description ?? undefined,
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const { meta, content: source } = getPostSource(slug);

  if (!source) notFound();

  const { content } = await compileMDX<{ title: string; date: string; description?: string }>({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: false,
              defaultLang: "ts",
            },
          ],
        ],
      },
    },
  });

  return (
    <article className="prose max-w-none">
      <header className="mb-8">
        <h1>{meta.title}</h1>
        <time className="text-sm text-foreground/60" dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {meta.description ? (
          <p className="mt-2 text-foreground/70">{meta.description}</p>
        ) : null}
      </header>
      {content}
      <p className="text-sm text-foreground/40 font-bold text-sm text-center pt-8">~ FIN ~</p>
    </article>
  );
}


