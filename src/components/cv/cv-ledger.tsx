import Link from "next/link";
import { CV, formatCvDate, formatDateRange } from "@/lib/cv/cv";
import type { CvDate, CvExperience } from "@/lib/cv/types";
import { getCvExperienceView, type CvView } from "@/lib/cv/view";
import { PrintButton } from "./print-button";
import { CvViewSwitch } from "./cv-view-switch";

const sectionLabel =
  "cv-section-label font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground";
const ledgerGrid = "cv-ledger-grid grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8";

function DateRange({ start, end }: { start: CvDate; end?: CvDate }) {
  return (
    <p
      className="font-mono text-xs leading-relaxed text-muted-foreground"
      aria-label={formatDateRange(start, end)}
    >
      <time dateTime={start.length === 4 ? undefined : start}>{formatCvDate(start)}</time>
      <span aria-hidden="true">–</span>
      {end ? <time dateTime={end.length === 4 ? undefined : end}>{formatCvDate(end)}</time> : <span>Present</span>}
    </p>
  );
}

function ExperienceEntry({ experience, view }: { experience: CvExperience; view: CvView }) {
  const experienceView = getCvExperienceView(experience, view);

  return (
    <article className={`${ledgerGrid} cv-experience-entry min-w-0 py-6 sm:py-8`}>
      <div className="min-w-0">
        <DateRange start={experience.start} end={experience.end} />
        {experience.location ? (
          <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            {experience.location}
          </p>
        ) : null}
        {experience.workArrangement ? (
          <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            {experience.workArrangement}
          </p>
        ) : null}
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-2xl font-bold leading-tight tracking-[-0.01em]">
          {experience.role}
        </h3>
        <p className="mt-1 text-muted-foreground">{experience.company}</p>
        <p className="mt-3 max-w-[62ch] leading-relaxed">{experienceView.summary}</p>
        <ul className="mt-4 max-w-[62ch] list-disc space-y-2 pl-5 leading-relaxed">
          {experienceView.accomplishments.map((accomplishment) => (
            <li key={accomplishment}>{accomplishment}</li>
          ))}
        </ul>
        <p className="mt-4 max-w-[62ch] font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
          {experience.stack.join(" · ")}
        </p>
      </div>
    </article>
  );
}

function ExperienceSection({ view }: { view: CvView }) {
  return (
    <section className="cv-section border-b border-border py-12" aria-labelledby="experience-heading">
      <h2 id="experience-heading" className={sectionLabel}>
        Experience <span className="sr-only">— {view === "general" ? "general record" : "full technical record"}</span>
      </h2>
      <div className="mt-6 divide-y divide-border">
        {CV.experience.map((experience) => (
          <ExperienceEntry key={experience.id} experience={experience} view={view} />
        ))}
      </div>
    </section>
  );
}

function StackSection() {
  return (
    <section className="cv-section border-b border-border py-12" aria-labelledby="stack-heading">
      <h2 id="stack-heading" className={sectionLabel}>
        Technical stack
      </h2>
      <div className="mt-2 divide-y divide-border">
        {CV.skillGroups.map((group) => (
          <div key={group.label} className={`${ledgerGrid} min-w-0 py-5`}>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {group.label}
            </p>
            <p className="min-w-0 font-mono text-sm leading-relaxed">{group.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeachingSection() {
  const { teaching } = CV;
  return (
    <section className="cv-section border-b border-border py-12" aria-labelledby="teaching-heading">
      <h2 id="teaching-heading" className={sectionLabel}>
        Teaching
      </h2>
      <div className={`${ledgerGrid} mt-2 min-w-0 py-5`}>
        <div>
          <DateRange start={teaching.start} end={teaching.end} />
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-bold leading-tight">{teaching.title}</h3>
          <p className="mt-1 text-muted-foreground">{teaching.organization}</p>
          <p className="mt-2 max-w-[62ch] leading-relaxed">{teaching.description}</p>
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section className="cv-section border-b border-border py-12" aria-labelledby="education-heading">
      <h2 id="education-heading" className={sectionLabel}>
        Education
      </h2>
      <div className="mt-2 divide-y divide-border">
        {CV.education.map((item) => (
          <div key={item.id} className={`${ledgerGrid} min-w-0 py-5`}>
            <DateRange start={item.start} end={item.end} />
            <div className="min-w-0">
              <h3 className="font-serif text-xl font-bold leading-tight">{item.qualification}</h3>
              <p className="mt-1 max-w-[62ch] text-muted-foreground">{item.institution}</p>
              {item.details ? <p className="mt-1 max-w-[62ch] leading-relaxed text-muted-foreground">{item.details}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReferencesSection() {
  return (
    <section className="cv-section border-b border-border py-12" aria-labelledby="references-heading">
      <h2 id="references-heading" className={sectionLabel}>
        References
      </h2>
      <div className={`${ledgerGrid} mt-2 min-w-0 py-5`}>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Status</p>
        <p>{CV.references}</p>
      </div>
    </section>
  );
}

/** Renders the editorial record ledger for the public CV route. */
export function CvLedger({ view }: { view: CvView }) {
  return (
    <article className="cv-page min-w-0">
      <header className="cv-masthead border-b border-border pb-8">
        <p className={sectionLabel}>CV / PROFESSIONAL RECORD</p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
          {CV.person.name}
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
          {CV.person.headline}
        </p>
        <p className="mt-4 max-w-[62ch] leading-relaxed">{CV.person.summary}</p>
        <nav className="cv-contact mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.12em]" aria-label="Contact">
          {CV.person.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-accent hover:opacity-80">
              {link.label} ↗
            </a>
          ))}
          <a href={`mailto:${CV.person.email}`} className="text-accent hover:opacity-80">
            Email
          </a>
        </nav>
        <div className="mt-8 border-t border-border pt-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Last updated <time dateTime={CV.lastUpdated}>{formatCvDate(CV.lastUpdated)}</time>
          </p>
          <PrintButton />
        </div>
      </header>

      <CvViewSwitch view={view} />
      <ExperienceSection view={view} />
      <StackSection />
      <TeachingSection />
      <EducationSection />
      <ReferencesSection />

      <section className="cv-colophon py-12" aria-labelledby="colophon-heading">
        <h2 id="colophon-heading" className={sectionLabel}>
          Colophon
        </h2>
        <p className="mt-4 max-w-[62ch] leading-relaxed">{CV.bio}</p>
        <Link href="/about" className="mt-6 inline-block text-accent underline decoration-1 underline-offset-[0.2em] hover:opacity-80">
          About Marc Uy Dagatan →
        </Link>
      </section>
    </article>
  );
}
