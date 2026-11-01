"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FRAME, GRID } from "./grid";

const NAV = [
  { href: "/lab/dossier/work", label: "Work" },
  { href: "/lab/dossier#writing", label: "Writing" },
  { href: "/lab/dossier#contact", label: "Contact" },
] as const;

/** Sticky running head: name, role, and section navigation. */
export function Masthead({ revision }: { revision: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--d-ink)] bg-[var(--d-paper)]">
      <div className={FRAME}>
        <div className={`${GRID} items-baseline gap-y-1 py-3 md:py-4`}>
          <Link
            href="/lab/dossier"
            className="dossier-link col-span-2 text-[0.9375rem] font-bold leading-tight tracking-[-0.01em] md:col-span-3"
          >
            Marc Uy Dagatan
          </Link>
          <p className="col-span-2 text-right text-[0.8125rem] leading-tight text-[var(--d-mute)] md:col-span-3 md:text-left">
            Founder, technical lead
          </p>
          <nav aria-label="Dossier" className="col-span-4 md:col-span-4">
            <ul className="flex gap-5 text-[0.9375rem] leading-tight md:gap-6">
              {NAV.map((item) => {
                const current = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className="dossier-link aria-[current=page]:text-[var(--d-accent)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <p className="hidden text-right text-[0.8125rem] leading-tight tabular-nums text-[var(--d-mute)] md:col-span-2 md:block">
            Rev. {revision}
          </p>
        </div>
      </div>
    </header>
  );
}
