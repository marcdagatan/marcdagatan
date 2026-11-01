import Link from "next/link";
import { CV_DATA } from "@/lib/cv/data";
import { formatDateRange } from "@/lib/cv/cv";
import type { CvExperience } from "@/lib/cv/types";
import { ENGINEERING_NOTES, HOUSE, LIFE_BELIEFS, ROOM_COPY } from "../content";
import { Door } from "../door";
import { RoomMotif } from "../motif";
import { RoomLink } from "../room-link";
import { ROOM_IDS, ROOMS, roomHref } from "../rooms";

/** Floors top to bottom: the day job up top, the foundation underneath. */
const FLOORS = [...ROOM_IDS];

/**
 * Who lives here: a cross-section of the house (one floor per room), the
 * working history from the CV, and the beliefs and failures from About.
 */
export function HouseAbout({ counts }: { counts: Record<string, number> }) {
  const { person, teaching, education, bio } = CV_DATA;
  const experience: readonly CvExperience[] = CV_DATA.experience;
  const beliefs = [...new Set([...ENGINEERING_NOTES, ...LIFE_BELIEFS])];

  return (
    <>
      <section className="ml-wrap ml-house-open">
        <p className="ml-house-kicker ml-reveal">Who lives here</p>
        <h1 className="ml-house-title">
          <span className="ml-house-title-line">One occupant.</span>
          <span className="ml-house-title-line">Four floors.</span>
        </h1>
        <p className="ml-house-lede">{HOUSE.lede}</p>
      </section>

      <section className="ml-wrap ml-house-section" aria-labelledby="ml-house-floors-title">
        <h2 id="ml-house-floors-title" className="ml-house-h2 ml-reveal">The house, in section</h2>
        <div className="ml-section-drawing">
          <span aria-hidden="true" className="ml-section-roof" />
          <ol className="ml-floors">
            {FLOORS.map((id, index) => (
              <li key={id} data-room={id} data-morph className="ml-floor ml-tile" style={{ "--i": index } as React.CSSProperties}>
                <RoomMotif room={id} detail={false} />
                <span className="ml-floor-level">Level {FLOORS.length - index}</span>
                <RoomLink href={roomHref(id)} morph className="ml-tile-link ml-floor-name ml-display">
                  {ROOMS[id].name}
                </RoomLink>
                <span className="ml-floor-role">{ROOMS[id].role}</span>
                <span className="ml-floor-count">
                  {counts[id]} {counts[id] === 1 ? "piece" : "pieces"}
                </span>
                <p className="ml-floor-line">{ROOM_COPY[id].line}</p>
                <Door className="ml-tile-door" />
              </li>
            ))}
          </ol>
          <span aria-hidden="true" className="ml-section-ground">
            <span>Foundation: showing up, taking the hit, making the next call</span>
          </span>
        </div>
        <p className="ml-house-why ml-reveal">{HOUSE.why}</p>
      </section>

      <section className="ml-wrap ml-house-grid" aria-labelledby="ml-house-work-title">
        <div className="ml-house-col-head">
          <h2 id="ml-house-work-title" className="ml-house-h2 ml-reveal">The working history</h2>
          <p className="ml-house-note ml-reveal">{person.summary}</p>
          <Link href="/cv" className="ml-house-cv ml-reveal">
            <span className="ml-u">The full CV</span> <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ol className="ml-timeline">
          {experience.map((job) => (
            <li key={job.id} className="ml-timeline-item ml-reveal">
              <p className="ml-timeline-date">{formatDateRange(job.start, job.end)}</p>
              <div>
                <h3 className="ml-timeline-company">{job.company}</h3>
                <p className="ml-timeline-role">{job.role}</p>
                <p className="ml-timeline-summary">{job.generalSummary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ml-wrap ml-house-pair">
        <div className="ml-house-card ml-reveal" aria-labelledby="ml-house-teach-title">
          <h2 id="ml-house-teach-title" className="ml-house-h3">Teaching</h2>
          <p className="ml-house-meta">
            {teaching.title}, {teaching.organization} · {formatDateRange(teaching.start, teaching.end)}
          </p>
          <p>{teaching.description}</p>
        </div>
        <div className="ml-house-card ml-reveal" aria-labelledby="ml-house-edu-title">
          <h2 id="ml-house-edu-title" className="ml-house-h3">Education</h2>
          <ul className="ml-house-edu">
            {education.map((item) => (
              <li key={item.id}>
                <p className="ml-house-meta">{formatDateRange(item.start, item.end)}</p>
                <p className="ml-house-strong">{item.institution}</p>
                <p>
                  {item.qualification}
                  {"details" in item && item.details ? ` ${item.details}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-house-card ml-reveal" aria-labelledby="ml-house-off-title">
          <h2 id="ml-house-off-title" className="ml-house-h3">Off the clock</h2>
          <p>{bio}</p>
        </div>
      </section>

      <section className="ml-wrap ml-house-beliefs" aria-labelledby="ml-house-beliefs-title">
        <div>
          <h2 id="ml-house-beliefs-title" className="ml-house-h2 ml-reveal">House rules</h2>
          <ol className="ml-house-rules">
            {beliefs.map((belief, index) => (
              <li key={belief} className="ml-reveal" style={{ "--i": index } as React.CSSProperties}>
                {belief}
              </li>
            ))}
          </ol>
        </div>
        <div className="ml-house-failures ml-reveal">
          <h2 className="ml-house-h3">Damage on record</h2>
          <p>{HOUSE.failures}</p>
          <p className="ml-house-note">Kept visible on purpose. Honesty about failure is the least expensive lesson available.</p>
        </div>
      </section>

      <section className="ml-wrap ml-house-contact" aria-labelledby="ml-house-contact-title">
        <h2 id="ml-house-contact-title" className="ml-house-h2 ml-reveal">Knock</h2>
        <ul className="ml-house-links ml-reveal">
          <li>
            <a href={`mailto:${person.email}`} className="ml-u">{person.email}</a>
          </li>
          {person.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer" className="ml-u">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
