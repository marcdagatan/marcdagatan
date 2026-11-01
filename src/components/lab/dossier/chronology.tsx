import Link from "next/link";
import type { CvDate, CvExperience } from "@/lib/cv/types";
import { GRID } from "./grid";

/** Decimal year for a CV date; month precision is enough for a timeline. */
function toYear(date: CvDate): number {
  const [year, month = 1] = date.split("-").map(Number);
  return year + (month - 1) / 12;
}

/**
 * Horizontal role timeline whose year ticks sit on the page grid.
 *
 * Why the calc: with twelve years on twelve columns (or three years per
 * column on mobile), scaling by (100% + gutter) lands each year boundary on a
 * column's left edge, so the bars line up with the drawn grid.
 */
export function Chronology({
  experience,
  asOf,
}: {
  experience: readonly CvExperience[];
  asOf: CvDate;
}) {
  const startYear = Math.floor(Math.min(...experience.map((item) => toYear(item.start))));
  const endYear = startYear + 12;
  const span = endYear - startYear;
  const years = Array.from({ length: 12 }, (_, index) => startYear + index);
  const position = (value: number) => (value - startYear) / span;

  return (
    <figure className="[--g:1rem] md:[--g:1.5rem]">
      <div className={`${GRID} border-b-2 border-[var(--d-ink)] pb-2`}>
        {years.map((year, index) => (
          <p
            key={year}
            className={`dossier-label tabular-nums ${index % 3 === 0 ? "" : "hidden md:block"}`}
          >
            {year}
          </p>
        ))}
      </div>
      <ol className="relative">
        {experience.map((item) => {
          const from = position(toYear(item.start));
          const to = position(toYear(item.end ?? asOf));
          const live = item.end === undefined;
          const alignRight = from > 0.55;
          return (
            <li key={item.id} className="relative h-12 border-b border-[var(--d-hair)]">
              <Link
                href={`#${item.id}`}
                className="dossier-row absolute inset-y-0 block"
                style={{
                  left: `calc((100% + var(--g)) * ${from})`,
                  width: `max(4px, calc((100% + var(--g)) * ${to - from}))`,
                }}
              >
                <span
                  className={`dossier-row-title absolute top-1.5 whitespace-nowrap text-[0.75rem] font-medium leading-none ${alignRight ? "right-0" : "left-0"}`}
                >
                  {item.company}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-2 left-0 right-0 h-3 ${live ? "bg-[var(--d-accent)]" : "bg-[var(--d-ink)]"}`}
                />
              </Link>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem] text-[var(--d-mute)]">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-2.5 w-5 bg-[var(--d-ink)]" />
          Completed
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-2.5 w-5 bg-[var(--d-accent)]" />
          Current
        </span>
      </figcaption>
    </figure>
  );
}
