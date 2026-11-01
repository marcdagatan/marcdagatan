import { CV_DATA } from "@/lib/cv/data";
import { KRAVOS_EXPERIENCE } from "@/lib/cv/experience/kravos";
import { ENGINEERING_NOTES, ROOM_COPY } from "../content";
import type { RoomProps } from "../data";
import { PointerField } from "../pointer-field";
import { RoomLink } from "../room-link";
import { pad, postHref, ROOMS } from "../rooms";
import { RouterDiagram } from "./router-diagram";

/**
 * Engineering is a drawing set: a blueprint title sheet, general notes, a
 * detail callout for the lead piece, a drawing register, and a bill of
 * materials. Everything is drawn, nothing is decorated.
 */
export function EngineeringRoom({ pieces, featured }: RoomProps) {
  const newest = pieces[0];
  const materials = [
    ...CV_DATA.skillGroups.map((group) => ({ label: group.label, items: group.items })),
    { label: "Kravos AI", items: KRAVOS_EXPERIENCE.stack },
  ];

  return (
    <>
      <PointerField className="ml-eng-hero ml-hero-morph">
        <div aria-hidden="true" className="ml-eng-grid" />
        <div aria-hidden="true" className="ml-eng-cross">
          <span className="ml-eng-cross-x" />
          <span className="ml-eng-cross-y" />
        </div>
        <div className="ml-wrap ml-eng-hero-inner">
          <div className="ml-eng-dim" aria-hidden="true">
            <span className="ml-eng-dim-line" />
            <span className="ml-eng-dim-label">{pieces.length} sheets in this set</span>
          </div>
          <p className="ml-eng-kicker">Sheet A-00 · Title sheet · Marc, the {ROOMS.engineering.role.toLowerCase()}</p>
          <h1 className="ml-eng-title ml-display">
            <span className="ml-eng-title-text">Engineering</span>
            <span aria-hidden="true" className="ml-eng-caret" />
          </h1>
          <div className="ml-eng-foot">
          <p className="ml-eng-line">{ROOM_COPY.engineering.line}</p>

          <dl className="ml-eng-block" aria-label="Title block">
            <div><dt>Project</dt><dd>The Many Lives</dd></div>
            <div><dt>Drawn by</dt><dd>Marc Uy Dagatan</dd></div>
            <div><dt>Discipline</dt><dd>Systems, teams, AI</dd></div>
            <div><dt>Sheets</dt><dd>{pad(pieces.length)}</dd></div>
            {newest ? <div><dt>Last issued</dt><dd>{newest.displayDate}</dd></div> : null}
            <div><dt>Scale</dt><dd>1 : 1</dd></div>
          </dl>
          </div>
        </div>
      </PointerField>

      <section className="ml-wrap ml-eng-notes" aria-labelledby="ml-eng-notes-title">
        <div className="ml-eng-notes-intro ml-reveal">
          <h2 id="ml-eng-notes-title" className="ml-eng-h2">
            <span className="ml-eng-h2-tag">01</span>General notes
          </h2>
          {ROOM_COPY.engineering.manifesto.map((paragraph) => (
            <p key={paragraph} className="ml-eng-para">{paragraph}</p>
          ))}
        </div>
        <ol className="ml-eng-notes-list">
          {ENGINEERING_NOTES.map((note, index) => (
            <li key={note} className="ml-reveal" style={{ "--i": index } as React.CSSProperties}>
              <span className="ml-eng-note-n">N{index + 1}</span>
              <span>{note}</span>
            </li>
          ))}
        </ol>
      </section>

      {featured ? (
        <section className="ml-wrap ml-eng-detail" aria-labelledby="ml-eng-detail-title">
          <div className="ml-eng-detail-head ml-reveal">
            <h2 id="ml-eng-detail-title" className="ml-eng-h2">
              <span className="ml-eng-h2-tag">02</span>Detail A: the lead sheet
            </h2>
            <span aria-hidden="true" className="ml-eng-callout">A</span>
          </div>
          <div className="ml-eng-detail-body">
            <article className="ml-eng-feature ml-reveal">
              <p className="ml-eng-feature-meta">
                {featured.displayDate} · {featured.format} · {featured.readingTime} min · {featured.sections} sections
              </p>
              <h3 className="ml-eng-feature-title">
                <RoomLink href={postHref(featured.slug)} className="ml-u">
                  {featured.title}
                </RoomLink>
              </h3>
              <p className="ml-eng-para">{featured.description}</p>
              <RoomLink href={postHref(featured.slug)} className="ml-eng-button">
                Open the sheet <span aria-hidden="true">→</span>
              </RoomLink>
            </article>
            <RouterDiagram />
          </div>
        </section>
      ) : null}

      <section className="ml-wrap ml-eng-register" aria-labelledby="ml-eng-register-title">
        <h2 id="ml-eng-register-title" className="ml-eng-h2 ml-reveal">
          <span className="ml-eng-h2-tag">03</span>Drawing register
        </h2>
        <div className="ml-eng-table-wrap ml-reveal">
          <table className="ml-eng-table">
            <thead>
              <tr>
                <th scope="col">Sheet</th>
                <th scope="col">Title</th>
                <th scope="col" className="ml-eng-col-opt">Type</th>
                <th scope="col" className="ml-eng-col-opt">Sections</th>
                <th scope="col">Min</th>
                <th scope="col" className="ml-eng-col-opt">Issued</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((piece, index) => (
                <tr key={piece.slug} style={{ "--i": index } as React.CSSProperties}>
                  <td className="ml-eng-sheet">A-{pad(index + 1)}</td>
                  <td>
                    <RoomLink href={postHref(piece.slug)} className="ml-eng-row-link">
                      {piece.title}
                    </RoomLink>
                    {piece.room !== "engineering" ? (
                      <span className="ml-eng-xref"> (cross-ref, {ROOMS[piece.room].name})</span>
                    ) : null}
                  </td>
                  <td className="ml-eng-col-opt">{piece.format}</td>
                  <td className="ml-eng-col-opt">{piece.sections || "—"}</td>
                  <td>{piece.readingTime}</td>
                  <td className="ml-eng-col-opt">
                    <time dateTime={piece.dateISO}>{piece.displayDate}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ml-wrap ml-eng-bom" aria-labelledby="ml-eng-bom-title">
        <h2 id="ml-eng-bom-title" className="ml-eng-h2 ml-reveal">
          <span className="ml-eng-h2-tag">04</span>Bill of materials
        </h2>
        <p className="ml-eng-para ml-eng-bom-note ml-reveal">
          What the work is actually built from, per the CV. Not exhaustive, not aspirational.
        </p>
        <div className="ml-eng-bom-grid">
          {materials.map((group, groupIndex) => (
            <div key={group.label} className="ml-eng-bom-group ml-reveal">
              <h3 className="ml-eng-bom-label">
                <span>{String.fromCharCode(65 + groupIndex)}</span>
                {group.label}
              </h3>
              <ul>
                {group.items.map((item, index) => (
                  <li key={item}>
                    <span className="ml-eng-bom-n">{pad(index + 1)}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="ml-eng-endset ml-reveal">End of set. Revisions issued as they happen.</p>
      </section>
    </>
  );
}
