import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redesign case studies",
  robots: { index: false, follow: false },
};

const studies = [
  {
    href: "/lab/dossier",
    number: "01",
    name: "The Operator's Dossier",
    thesis: "A founder and technical leader who writes. Work first, writing second.",
    job: "Get hired or win clients",
    look: "Swiss grid, Helvetica Neue, spec-sheet labels",
  },
  {
    href: "/lab/paperback",
    number: "02",
    name: "The Paperback",
    thesis: "The writing is the product. The site reads like a well-made book.",
    job: "Get read, start to finish",
    look: "Warm paper, text serif, contents page, sidenotes",
  },
  {
    href: "/lab/many-lives",
    number: "03",
    name: "The Many Lives",
    thesis: "Founder, fighter, actor, dad. One house, several rooms.",
    job: "Be known as a whole person",
    look: "Shared frame, each room with its own palette",
  },
];

export default function LabIndexPage() {
  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto bg-neutral-100 text-neutral-900">
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          marcuyyy.com · redesign
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Three case studies. Pick one.
        </h1>
        <p className="mt-4 max-w-xl text-neutral-600">
          Each one is a working prototype with real posts. Click through the
          homepage, an essay, and the extra page in each.
        </p>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {studies.map((study) => (
            <li key={study.href}>
              <Link
                href={study.href}
                className="group flex h-full flex-col rounded-lg border border-neutral-300 bg-white p-6 transition hover:-translate-y-0.5 hover:border-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <span className="text-sm tabular-nums text-neutral-400">
                  {study.number}
                </span>
                <span className="mt-2 text-xl font-bold">{study.name}</span>
                <span className="mt-3 text-sm text-neutral-600">
                  {study.thesis}
                </span>
                <dl className="mt-6 space-y-2 border-t border-neutral-200 pt-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-400">
                      Job
                    </dt>
                    <dd>{study.job}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-400">
                      Look
                    </dt>
                    <dd>{study.look}</dd>
                  </div>
                </dl>
                <span className="mt-auto pt-6 text-sm font-medium group-hover:underline">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
