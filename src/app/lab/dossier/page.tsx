import Link from "next/link";
import { CV } from "@/lib/cv/cv";
import { getAllPostsMeta } from "@/lib/posts";
import { PUBLICATION_NAME, RSS_PATH } from "@/lib/site";
import { essayHref, formatDotDate, postNumber, yearSpan } from "@/components/lab/dossier/format";
import { COL_INDEX, COL_MAIN, FRAME, GRID } from "@/components/lab/dossier/grid";
import { PRINCIPLES } from "@/components/lab/dossier/principles";
import { SectionHead } from "@/components/lab/dossier/section-head";

const LEADERSHIP_ROLE = /founder|cto|chief|lead/i;

const CONTACT_LINKS = [
  { label: "GitHub", href: "https://github.com/marcdagatan", note: "github.com/marcdagatan" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marcdagatan/", note: "in/marcdagatan" },
  { label: "Instagram", href: "https://www.instagram.com/marc.uyyy/", note: "@marc.uyyy" },
  { label: "RSS", href: RSS_PATH, note: "Every new essay" },
] as const;

export default function DossierHome() {
  const posts = getAllPostsMeta();
  const current = CV.experience.filter((item) => item.end === undefined);
  const built = CV.experience.filter(
    (item) => item.end === undefined || LEADERSHIP_ROLE.test(item.role)
  );
  const firstYear = CV.experience.reduce(
    (earliest, item) => (item.start < earliest ? item.start : earliest),
    CV.experience[0].start
  ).slice(0, 4);

  const facts = [
    { label: "Role", value: "Founder and hands-on technical leader" },
    { label: "Currently", value: current.map((item) => item.company).join(", ") },
    { label: "Shipping since", value: firstYear },
    { label: "Writes", value: `${PUBLICATION_NAME}, ${posts.length} essays` },
  ];

  return (
    <>
      {/* 00 Position */}
      <section aria-labelledby="dossier-position" className={`${FRAME} pb-16 pt-10 md:pb-24 md:pt-16`}>
        <div className={GRID}>
          <p className={`${COL_INDEX} dossier-label`}>00 Position</p>
          <h1
            id="dossier-position"
            className="col-span-4 mt-8 text-[clamp(2.75rem,8.6vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.05em] [text-wrap:pretty] md:col-span-12 md:mt-14"
          >
            I build companies and the software they run on, then write down what it cost.
          </h1>
        </div>

        <div className={`${GRID} mt-12 gap-y-10 md:mt-20`}>
          <p className="col-span-4 max-w-[34ch] text-[1.125rem] leading-[1.45] md:col-span-5 md:col-start-4">
            I lead architecture and delivery, but I stay close to the code. The hard
            decisions only become real when a system meets customers, data, and people.
          </p>
          <div className="col-span-4 flex flex-col gap-2 text-[1.125rem] font-medium leading-tight md:col-span-3 md:col-start-10">
            <Link href="/lab/dossier/work" className="dossier-underline w-fit">
              Read the full record
            </Link>
            <a href={`mailto:${CV.person.email}`} className="dossier-underline w-fit">
              Email me
            </a>
          </div>
        </div>

        <dl className={`${GRID} mt-12 gap-y-6 border-t border-[var(--d-ink)] pt-4 md:mt-16`}>
          {facts.map((fact) => (
            <div key={fact.label} className="col-span-2 md:col-span-3">
              <dt className="dossier-label">{fact.label}</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-medium leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 01 Built */}
      <section aria-labelledby="dossier-built" className="border-t-2 border-[var(--d-ink)]">
        <div className={`${FRAME} py-12 md:py-20`}>
          <div className={GRID}>
            <SectionHead index="01" label="What I have built" />
            <div className={COL_MAIN}>
              <p
                id="dossier-built"
                className="max-w-[22ch] text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.03em]"
              >
                Founder and lead roles, newest first.
              </p>

              <div className="mt-10 hidden grid-cols-9 gap-x-6 border-b-2 border-[var(--d-ink)] pb-2 md:grid">
                <p className="dossier-label col-span-1">Years</p>
                <p className="dossier-label col-span-3">Company and role</p>
                <p className="dossier-label col-span-5">Scope</p>
              </div>
              <ol className="mt-8 md:mt-0">
                {built.map((item) => (
                  <li key={item.id} className="border-b border-[var(--d-hair)]">
                    <Link
                      href={`/lab/dossier/work#${item.id}`}
                      className="dossier-row grid grid-cols-4 gap-x-4 gap-y-2 py-5 md:grid-cols-9 md:gap-x-6"
                    >
                      <p className="col-span-4 text-[0.8125rem] tabular-nums text-[var(--d-mute)] md:col-span-1 md:pt-1">
                        {item.end === undefined ? (
                          <span className="font-medium text-[var(--d-accent)]">
                            {yearSpan(item.start, item.end)}
                          </span>
                        ) : (
                          yearSpan(item.start, item.end)
                        )}
                      </p>
                      <div className="col-span-4 md:col-span-3">
                        <p className="dossier-row-title text-[1.375rem] font-bold leading-tight tracking-[-0.02em]">
                          {item.company}
                        </p>
                        <p className="mt-1 text-[0.9375rem] leading-snug">{item.role}</p>
                      </div>
                      <p className="col-span-4 text-[0.9375rem] leading-[1.5] text-[var(--d-mute)] md:col-span-5">
                        {item.generalSummary}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-[0.9375rem]">
                <Link href="/lab/dossier/work" className="dossier-underline font-medium">
                  All {CV.experience.length} roles, with technical detail
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Method */}
      <section aria-labelledby="dossier-method" className="border-t-2 border-[var(--d-ink)]">
        <div className={`${FRAME} py-12 md:py-20`}>
          <div className={GRID}>
            <SectionHead index="02" label="How I work" />
            <div className={COL_MAIN}>
              <p
                id="dossier-method"
                className="max-w-[22ch] text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.03em]"
              >
                Six rules, each paid for in full.
              </p>
              <ol className="mt-10 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                {PRINCIPLES.map((principle, index) => (
                  <li
                    key={principle.statement}
                    className="flex flex-col border-t border-[var(--d-ink)] pb-10 pt-3"
                  >
                    <p className="text-[0.8125rem] font-medium tabular-nums">2.{index + 1}</p>
                    <p className="mt-6 text-[1.375rem] font-bold leading-[1.12] tracking-[-0.02em]">
                      {principle.statement}
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-[1.5] text-[var(--d-mute)]">
                      {principle.gloss}
                    </p>
                    <p className="mt-auto pt-5 text-[0.8125rem]">
                      <span className="text-[var(--d-mute)]">Source </span>
                      <Link href={principle.source.href} className="dossier-underline">
                        {principle.source.label}
                      </Link>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Writing */}
      <section
        id="writing"
        aria-labelledby="dossier-writing"
        className="border-t-2 border-[var(--d-ink)]"
      >
        <div className={`${FRAME} py-12 md:py-20`}>
          <div className={GRID}>
            <SectionHead index="03" label="Selected writing" />
            <div className={COL_MAIN}>
              <p
                id="dossier-writing"
                className="max-w-[24ch] text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.03em]"
              >
                {PUBLICATION_NAME}.
              </p>
              <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.5] text-[var(--d-mute)]">
                AI systems, engineering, hiring, and the lessons usually learned the
                expensive way. Plus boxing, acting, and film, because those count too.
              </p>

              <div className="mt-10 hidden grid-cols-9 gap-x-6 border-b-2 border-[var(--d-ink)] pb-2 md:grid">
                <p className="dossier-label col-span-1">No.</p>
                <p className="dossier-label col-span-5">Title</p>
                <p className="dossier-label col-span-1">Lane</p>
                <p className="dossier-label col-span-1">Date</p>
                <p className="dossier-label col-span-1 text-right">Min</p>
              </div>
              <ol className="mt-8 md:mt-0">
                {posts.map((post) => (
                  <li key={post.slug} className="border-b border-[var(--d-hair)]">
                    <Link
                      href={essayHref(post.slug)}
                      className="dossier-row grid grid-cols-4 gap-x-4 gap-y-1 py-4 md:grid-cols-9 md:gap-x-6"
                    >
                      <p className="col-span-1 text-[0.8125rem] font-medium tabular-nums md:pt-1">
                        {postNumber(post)}
                      </p>
                      <div className="col-span-3 md:col-span-5">
                        <p className="dossier-row-title text-[1.1875rem] font-bold leading-[1.2] tracking-[-0.015em]">
                          {post.title}
                        </p>
                        {post.featured ? (
                          <p className="mt-1 text-[0.8125rem] font-medium text-[var(--d-accent)]">
                            Start here
                          </p>
                        ) : null}
                      </div>
                      <p className="col-span-3 col-start-2 text-[0.8125rem] text-[var(--d-mute)] md:col-span-1 md:col-start-auto md:pt-1">
                        <span className="capitalize">{post.lane}</span>
                        <span className="md:hidden">, {formatDotDate(post.dateISO)}, {post.readingTime} min</span>
                      </p>
                      <p className="hidden text-[0.8125rem] tabular-nums text-[var(--d-mute)] md:col-span-1 md:block md:pt-1">
                        {formatDotDate(post.dateISO)}
                      </p>
                      <p className="hidden text-right text-[0.8125rem] tabular-nums text-[var(--d-mute)] md:col-span-1 md:block md:pt-1">
                        {post.readingTime}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 04 Contact */}
      <section
        id="contact"
        aria-labelledby="dossier-contact"
        className="border-t-2 border-[var(--d-ink)]"
      >
        <div className={`${FRAME} py-12 md:py-20`}>
          <div className={GRID}>
            <SectionHead index="04" label="Contact" />
            <div className={COL_MAIN}>
              <p
                id="dossier-contact"
                className="max-w-[26ch] text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.03em]"
              >
                Building something that has to work on Monday?
              </p>
              <a
                href={`mailto:${CV.person.email}`}
                className="dossier-link mt-8 block break-all text-[clamp(1.625rem,4.6vw,4.25rem)] font-bold leading-none tracking-[-0.04em] underline decoration-2 underline-offset-[0.12em]"
              >
                {CV.person.email}
              </a>
              <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[var(--d-ink)] pt-4 md:grid-cols-4">
                {CONTACT_LINKS.map((link) => (
                  <li key={link.label}>
                    <p className="dossier-label">{link.label}</p>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="dossier-underline mt-1.5 inline-block text-[0.9375rem]"
                    >
                      {link.note}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
