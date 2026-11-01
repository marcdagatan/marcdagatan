import Link from "next/link";

type RunningHeadProps = {
  /** Current section, shown in the centre on wide screens. */
  section?: string;
  /** Right-hand link. Defaults to Contents. */
  right?: { href: string; label: string };
};

/**
 * The book's running head: title on the verso, section on the recto.
 * Sticks to the top of the Paperback shell so Contents is always one click away.
 */
export function RunningHead({
  section,
  right = { href: "/lab/paperback#contents", label: "Contents" },
}: RunningHeadProps) {
  return (
    <header className="pb-running-head">
      <div className="pb-running-inner">
        <Link href="/lab/paperback" className="pb-running-title">
          <span>Thoughts of a</span>
          <span className="pb-running-tail"> Mastermind in Pajamas</span>
        </Link>

        {section ? (
          <p className="pb-running-section" aria-current="page">
            {section}
          </p>
        ) : null}

        <Link href={right.href} className="pb-running-link">
          {right.label}
        </Link>
      </div>
    </header>
  );
}
