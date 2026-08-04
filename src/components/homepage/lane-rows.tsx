import Link from "next/link";
import type { Lane } from "@/lib/posts";

/**
 * Three editorial lanes. Not feature cards: a flat, divided table of the
 * publication's structure, each row a path into the filtered archive.
 */

const LANE_COPY: Record<Lane, string> = {
  systems: "Models do not govern themselves.",
  operators: "Bad decisions usually look reasonable at first.",
  life: "The other fights count too.",
};

const LANE_BLURB: Record<Lane, string> = {
  systems: "AI, governance, engineering, and the tools worth keeping in your corner.",
  operators: "Hiring, leadership, and the expensive lessons of building a company.",
  life: "Relationships, creativity, boxing, acting: the fights that shape a person.",
};

interface LaneRowsProps {
  counts: Record<Lane, number>;
}

export function LaneRows({ counts }: LaneRowsProps) {
  return (
    <section className="border-b border-border py-14">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-muted-foreground">
        Three lanes
      </p>
      <h2 className="mt-3 font-serif text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
        Every essay belongs to one of them.
      </h2>

      <ul className="mt-10 divide-y divide-border">
        {(Object.keys(LANE_COPY) as Lane[]).map((lane, index) => (
          <li key={lane}>
            <Link
              href={`/blog?lane=${lane}`}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-4 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="font-serif text-2xl font-bold text-foreground/[0.2] sm:text-3xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-2xl font-bold capitalize tracking-[-0.005em] sm:text-3xl group-hover:text-accent">
                  {lane}
                </span>
                <span className="mt-1 block font-serif text-lg italic text-foreground/80">
                  {LANE_COPY[lane]}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                  {LANE_BLURB[lane]}
                </span>
              </span>
              <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground sm:block">
                {counts[lane]} {counts[lane] === 1 ? "round" : "rounds"} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
