import Link from "next/link";
import type { Metadata } from "next";
import { getAllPostsMeta } from "@/lib/posts";
import { selectStartHerePosts } from "@/lib/homepage";
import {
  absoluteUrl,
  PUBLICATION_NAME,
  RSS_ALTERNATE,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Marc Uy Dagatan: founder, hands-on technical leader, fighter, actor, and dad. Systems, products, operators, and life.",
  alternates: {
    canonical: "/about",
    types: {
      "application/rss+xml": [RSS_ALTERNATE],
    },
  },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description:
      "Marc Uy Dagatan: founder, hands-on technical leader, fighter, actor, and dad. Systems, scars, and selfhood.",
    type: "profile",
    url: absoluteUrl("/about"),
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${SITE_NAME}`,
    description:
      "Marc Uy Dagatan: founder, hands-on technical leader, fighter, actor, and dad. Systems, scars, and selfhood.",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  const startHere = selectStartHerePosts(getAllPostsMeta());

  return (
    <main>
      <header className="border-b border-border pb-12">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
          About
        </p>
        <h1 className="mt-3 max-w-[16ch] font-serif text-4xl font-bold leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-6xl [text-wrap:balance]">
          A builder who took the hits.
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
          I&apos;m Marc Uy Dagatan, founder of MAD Software, fighter, actor,
          hands-on technical leader, and dad. My life is a strange mix of
          business meetings, boxing rounds, film scripts, and parenting moments
          that don&apos;t come with a manual.
        </p>
      </header>

      <section className="grid gap-10 border-b border-border py-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-10">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              What I build
            </h2>
            <p className="mt-4 leading-relaxed">
              Software, at MAD Software, including the{" "}
              <Link href="/blog/010-skills-router" className="text-accent underline decoration-1 underline-offset-[0.2em] hover:opacity-80">
                Skills Router
              </Link>
              , a governed AI-coding system I open-sourced rather than keep in
              the company vault. I believe the models work better inside
              deterministic control planes, and I build the tooling to prove it.
            </p>
            <p className="mt-4 leading-relaxed">
              The rest of my work sits where product and operations collide:
              AI agent platforms, clinical analytics, payment and marketplace
              systems, and multi-location businesses. I lead architecture and
              delivery, but I stay close to the code because the hard decisions
              only become real when a system meets customers, data, and people.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              What I believe
            </h2>
            <ul className="mt-4 space-y-3 leading-relaxed">
              <li>Models do not govern themselves; someone has to own the rules.</li>
              <li>Bad decisions usually look reasonable at first.</li>
              <li>Creative outlets are expansion, not escape.</li>
              <li>Getting hit teaches more than winning.</li>
              <li>Honesty about failure is the least expensive lesson available.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              What I&apos;ve failed at
            </h2>
            <p className="mt-4 leading-relaxed">
              Hiring people on trust instead of evidence:{" "}
              <Link href="/blog/003-how-not-to-hire" className="text-accent underline decoration-1 underline-offset-[0.2em] hover:opacity-80">
                the self-inflicted headache
              </Link>{" "}
              is on the record. Relationships that ended in silence. Businesses
              where I learned the lesson the expensive way. The kind of failure
              you don&apos;t post about: the kind that forces you to look in a
              mirror you can&apos;t lie to.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Why three lanes belong together
            </h2>
            <p className="mt-4 leading-relaxed">
              The systems you build, the operators you become, and the fights
              that shape you are the same discipline: showing up, taking the
              hit, and making the next call. Boxing taught me more about
              business than any book; acting taught me to be present; running
              a company taught me that governance is not boring; it&apos;s the
              difference between surviving and breaking. So this publication
              has one archive, three lanes, and no apology for the mix.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Where to start reading
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {startHere.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block py-4"
                  >
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                      {post.lane} · {post.readingTime} min
                    </p>
                    <p className="mt-1 font-serif text-lg font-bold leading-snug group-hover:text-accent">
                      {post.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Outside this publication
            </h2>
            <ul className="mt-4 space-y-2 font-mono text-sm">
              <li>
                <a href="https://github.com/marcdagatan" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
                  github.com/marcdagatan ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/madsoftwaredev/opencode-config" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
                  MAD Software · opencode-config ↗
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/marc.uyyy/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
                  instagram.com/marc.uyyy ↗
                </a>
              </li>
              <li>
                <a href="mailto:marc.dagatan@gmail.com" className="text-muted-foreground hover:text-accent">
                  marc.dagatan@gmail.com
                </a>
              </li>
              <li>
                <Link href="/rss.xml" className="text-muted-foreground hover:text-accent">
                  {PUBLICATION_NAME}: RSS feed
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <p className="font-serif text-2xl font-bold leading-snug sm:text-3xl">
          The blog exists because I&apos;ve lived enough canon events to know
          the value of sharing them, even when the stories aren&apos;t easy to
          hear.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-block border border-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent hover:bg-accent/10"
        >
          Read the fight record →
        </Link>
        <Link
          href="/cv"
          className="mt-5 block text-sm text-accent underline decoration-1 underline-offset-[0.2em] hover:opacity-80"
        >
          View the professional record →
        </Link>
      </section>
    </main>
  );
}
