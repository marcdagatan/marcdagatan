import Link from "next/link";
import type { Metadata } from "next";
import { CV, formatCvDate, formatDateRange } from "@/lib/cv/cv";
import { getCvExperienceView, resolveCvView, type CvView } from "@/lib/cv/view";
import { Chronology } from "@/components/lab/dossier/chronology";
import { seq } from "@/components/lab/dossier/format";
import { COL_INDEX, COL_MAIN, FRAME, GRID } from "@/components/lab/dossier/grid";
import { SectionHead } from "@/components/lab/dossier/section-head";

export const metadata: Metadata = {
  title: "Work index | The Operator's Dossier",
};

type Props = { searchParams: Promise<{ view?: string | string[] }> };

const VIEWS: readonly { view: CvView; label: string; href: string }[] = [
  { view: "general", label: "Summary", href: "/lab/dossier/work" },
  { view: "technical", label: "Technical", href: "/lab/dossier/work?view=technical" },
];

export default async function DossierWork({ searchParams }: Props) {
  const view = resolveCvView((await searchParams).view);
  const firstYear = CV.experience.reduce(
    (earliest, item) => (item.start < earliest ? item.start : earliest),
    CV.experience[0].start
  ).slice(0, 4);
  const currentCount = CV.experience.filter((item) => item.end === undefined).length;

  return (
    <>
      <header className={`${FRAME} pb-12 pt-10 md:pb-16 md:pt-16`}>
        <div className={GRID}>
          <p className={`${COL_INDEX} dossier-label`}>Work index</p>
          <div className="col-span-4 mt-8 md:col-span-9 md:mt-0">
            <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,5.75rem)] font-bold leading-[0.92] tracking-[-0.045em] [text-wrap:balance]">
              {CV.experience.length} roles since {firstYear}. {currentCount} still running.
            </h1>
            <p className="mt-8 max-w-[52ch] text-[1.125rem] leading-[1.5]">{CV.person.summary}</p>
          </div>
        </div>
      </header>

      <section aria-labelledby="dossier-chronology" className="border-t-2 border-[var(--d-ink)]">
        <div className={`${FRAME} py-10 md:py-14`}>
          <h2 id="dossier-chronology" className="dossier-label mb-6">
            Chronology, {firstYear} to {CV.lastUpdated.slice(0, 4)}
          </h2>
          <Chronology experience={CV.experience} asOf={CV.lastUpdated} />
        </div>
      </section>

      <section aria-labelledby="dossier-roles" className="border-t-2 border-[var(--d-ink)]">
        <div className={`${FRAME} py-10 md:py-14`}>
          <div className={`${GRID} items-end gap-y-6`}>
            <h2 id="dossier-roles" className={`${COL_INDEX} dossier-label`}>
              Roles, newest first
            </h2>
            <div className={`${COL_MAIN} flex flex-wrap items-center gap-x-4 gap-y-2`}>
              <p className="text-[0.8125rem] text-[var(--d-mute)]">Detail</p>
              <ul className="flex border border-[var(--d-ink)]">
                {VIEWS.map((item) => (
                  <li key={item.view}>
                    <Link
                      href={item.href}
                      scroll={false}
                      aria-current={view === item.view ? "true" : undefined}
                      className="block px-3 py-1.5 text-[0.8125rem] font-medium hover:text-[var(--d-accent)] aria-[current=true]:bg-[var(--d-ink)] aria-[current=true]:text-[var(--d-paper)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ol className="mt-8">
            {CV.experience.map((item, index) => {
              const reading = getCvExperienceView(item, view);
              const live = item.end === undefined;
              const place = [item.location, item.workArrangement].filter(Boolean).join(", ");
              return (
                <li
                  key={item.id}
                  id={item.id}
                  className="scroll-mt-24 border-t border-[var(--d-ink)] py-8 md:py-10"
                >
                  <div className={`${GRID} gap-y-5`}>
                    <div className={`${COL_INDEX} flex gap-6 md:block`}>
                      <p className="text-[2.5rem] font-bold leading-none tracking-[-0.04em] tabular-nums">
                        {seq(index)}
                      </p>
                      <dl className="space-y-3 text-[0.8125rem] leading-snug md:mt-5">
                        <div>
                          <dt className="dossier-label">Dates</dt>
                          <dd className="mt-0.5 tabular-nums">{formatDateRange(item.start, item.end)}</dd>
                        </div>
                        {place ? (
                          <div>
                            <dt className="dossier-label">Place</dt>
                            <dd className="mt-0.5">{place}</dd>
                          </div>
                        ) : null}
                        <div>
                          <dt className="dossier-label">Status</dt>
                          <dd className={`mt-0.5 font-medium ${live ? "text-[var(--d-accent)]" : ""}`}>
                            {live ? "Current" : "Completed"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="col-span-4 md:col-span-6">
                      <h3 className="text-[clamp(1.75rem,2.6vw,2.5rem)] font-bold leading-none tracking-[-0.035em]">
                        {item.company}
                      </h3>
                      <p className="mt-2 text-[1.0625rem] font-medium">{item.role}</p>
                      <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-[1.5]">{reading.summary}</p>
                      <ol className="mt-6 space-y-3 text-[0.9375rem] leading-[1.5]">
                        {reading.accomplishments.map((line, lineIndex) => (
                          <li key={line} className="grid grid-cols-[2.5rem_1fr] border-t border-[var(--d-hair)] pt-3">
                            <span className="tabular-nums text-[var(--d-mute)]">
                              {index + 1}.{lineIndex + 1}
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="col-span-4 pt-4 md:col-span-3 md:pt-0">
                      <p className="dossier-label">Stack and scope</p>
                      <ul className="mt-2 text-[0.875rem] leading-snug">
                        {item.stack.map((tool) => (
                          <li key={tool} className="border-b border-[var(--d-hair)] py-1.5">
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section aria-label="Capabilities and background" className="border-t-2 border-[var(--d-ink)]">
        <div className={`${FRAME} py-12 md:py-20`}>
          <div className={GRID}>
            <SectionHead index="A" label="Appendix" />
            <div className={`${COL_MAIN} grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3`}>
              <div>
                <h3 className="border-b-2 border-[var(--d-ink)] pb-2 text-[1.125rem] font-bold">
                  Core stack
                </h3>
                <dl className="mt-3 space-y-4 text-[0.9375rem] leading-snug">
                  {CV.skillGroups.map((group) => (
                    <div key={group.label}>
                      <dt className="dossier-label">{group.label}</dt>
                      <dd className="mt-1">{group.items.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h3 className="border-b-2 border-[var(--d-ink)] pb-2 text-[1.125rem] font-bold">
                  Teaching
                </h3>
                <p className="dossier-label mt-3">
                  {formatDateRange(CV.teaching.start, CV.teaching.end)}
                </p>
                <p className="mt-1 text-[0.9375rem] font-medium">
                  {CV.teaching.title}, {CV.teaching.organization}
                </p>
                <p className="mt-2 text-[0.9375rem] leading-[1.5] text-[var(--d-mute)]">
                  {CV.teaching.description}
                </p>
              </div>
              <div>
                <h3 className="border-b-2 border-[var(--d-ink)] pb-2 text-[1.125rem] font-bold">
                  Education
                </h3>
                <ul className="mt-3 space-y-4 text-[0.9375rem] leading-snug">
                  {CV.education.map((entry) => (
                    <li key={entry.id}>
                      <p className="dossier-label">{formatDateRange(entry.start, entry.end)}</p>
                      <p className="mt-1 font-medium">{entry.institution}</p>
                      <p className="text-[var(--d-mute)]">
                        {entry.qualification}
                        {entry.details ? ` ${entry.details}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="dossier-label mt-8">References</p>
                <p className="mt-1 text-[0.9375rem]">{CV.references}</p>
                <p className="dossier-label mt-6">Last updated</p>
                <p className="mt-1 text-[0.9375rem] tabular-nums">{formatCvDate(CV.lastUpdated)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
