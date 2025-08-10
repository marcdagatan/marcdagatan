import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const metadata = {
  title: "Marc Uy Dagatan | Thoughts of a Mastermind in Pajamas",
  description: "It’s hard to plot world domination when your coffee’s still brewing… but I’m making it work",
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  return (
    <main className="space-y-8">
      <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] xl:text-[7rem] leading-[1.03] font-bold tracking-[-0.02em]">
        Thoughts of a Mastermind in Pajamas
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-foreground/70">It’s hard to plot world domination when your coffee’s still brewing… but I’m making it work.</p>
      <ul className="divide-y divide-white/10">
        {posts.map((post) => (
          <li key={post.slug} className="py-4">
            <article className="flex flex-col gap-1">
              <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] leading-[1.1] font-bold tracking-[-0.01em]">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              {post.description ? (
                <p className="text-sm text-foreground/70">{post.description}</p>
              ) : null}
              <time className="text-xs text-foreground/50" dateTime={post.dateISO}>
                {new Date(post.timestamp).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}


