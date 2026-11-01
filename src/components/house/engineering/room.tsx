import { CV_DATA } from "@/lib/cv/data";
import { KRAVOS_EXPERIENCE } from "@/lib/cv/experience/kravos";
import { ENGINEERING_NOTES, ROOM_COPY } from "../content";
import type { RoomProps } from "../data";
import { PointerField } from "../pointer-field";
import { RoomLink } from "../room-link";
import { postHref, ROOMS } from "../rooms";
import { shortHash } from "./git";
import { RouterDiagram } from "./router-diagram";

const GUTTER_LINES = Array.from({ length: 24 }, (_, index) => index + 1);

/** Files open in the room's editor; each tab jumps to its section. */
const TABS = [
  { href: "#ml-eng-readme", label: "README.md" },
  { href: "#ml-eng-head", label: "HEAD" },
  { href: "#ml-eng-log", label: "git log" },
  { href: "#ml-eng-deps", label: "package.json" },
] as const;

/**
 * Engineering is a developer's workspace: an editor window with tabs and a
 * gutter, a README and its principles as code, the lead piece as the latest
 * commit with its checks and a request trace, the room's posts as a git log,
 * and the stack as an `npm ls` tree.
 */
export function EngineeringRoom({ pieces, featured }: RoomProps) {
  const newest = pieces[0];
  const dependencies = [
    ...CV_DATA.skillGroups.map((group) => ({ label: group.label, items: group.items })),
    { label: "Kravos AI", items: KRAVOS_EXPERIENCE.stack },
  ];

  return (
    <>
      <PointerField className="ml-eng-hero ml-hero-morph">
        <nav aria-label="Room files" className="ml-eng-tabs">
          <ul className="ml-wrap">
            {TABS.filter((tab) => featured || tab.href !== "#ml-eng-head").map((tab, index) => (
              <li key={tab.href}>
                <a href={tab.href} className="ml-eng-tab" data-active={index === 0 ? "true" : undefined}>
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div aria-hidden="true" className="ml-eng-linehl" />
        <div className="ml-wrap ml-eng-editor">
          <ol aria-hidden="true" className="ml-eng-gutter">
            {GUTTER_LINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <div className="ml-eng-code">
            <p className="ml-eng-kicker">
              <span className="ml-syn-com">
                {"// Rm 01 · Marc, the "}
                {ROOMS.engineering.role.toLowerCase()}
              </span>
            </p>
            <h1 className="ml-eng-title ml-display">
              <span className="ml-eng-title-text">Engineering</span>
              <span aria-hidden="true" className="ml-eng-caret" />
            </h1>
            <p className="ml-eng-line">{ROOM_COPY.engineering.line}</p>
          </div>
        </div>
        <dl className="ml-eng-status" aria-label="Repository status">
          <div className="ml-wrap">
            <div><dt>Branch</dt><dd>main</dd></div>
            <div><dt>Commits</dt><dd>{pieces.length}</dd></div>
            {newest ? <div><dt>Last commit</dt><dd><time dateTime={newest.dateISO}>{newest.displayDate}</time></dd></div> : null}
            <div><dt>Scope</dt><dd>systems, teams, AI</dd></div>
            <div className="ml-eng-status-ok"><dt>Checks</dt><dd>passing</dd></div>
          </div>
        </dl>
      </PointerField>

      <section id="ml-eng-readme" className="ml-wrap ml-eng-readme" aria-labelledby="ml-eng-readme-title">
        <div className="ml-eng-readme-intro ml-reveal">
          <h2 id="ml-eng-readme-title" className="ml-eng-h2">
            <span aria-hidden="true" className="ml-eng-file">md</span>README.md
          </h2>
          {ROOM_COPY.engineering.manifesto.map((paragraph) => (
            <p key={paragraph} className="ml-eng-para">{paragraph}</p>
          ))}
        </div>
        <figure className="ml-eng-codefile ml-reveal" aria-labelledby="ml-eng-principles-title">
          <figcaption id="ml-eng-principles-title" className="ml-eng-codefile-name">
            <span aria-hidden="true" className="ml-eng-file">ts</span>principles.ts
          </figcaption>
          <div className="ml-eng-codefile-body">
            <p aria-hidden="true" className="ml-eng-ln">
              <span className="ml-syn-kw">export const</span> <span className="ml-syn-fn">principles</span> = [
            </p>
            <ol className="ml-eng-principles">
              {ENGINEERING_NOTES.map((note) => (
                <li key={note} className="ml-eng-ln">
                  <span className="ml-syn-str">{note}</span>
                </li>
              ))}
            </ol>
            <p aria-hidden="true" className="ml-eng-ln">
              ] <span className="ml-syn-kw">as const</span>;
            </p>
          </div>
        </figure>
      </section>

      {featured ? (
        <section id="ml-eng-head" className="ml-wrap ml-eng-head" aria-labelledby="ml-eng-head-title">
          <h2 id="ml-eng-head-title" className="ml-eng-h2 ml-reveal">
            <span aria-hidden="true" className="ml-eng-file">git</span>HEAD: the latest piece
          </h2>
          <div className="ml-eng-head-body">
            <article className="ml-eng-commit ml-reveal">
              <p className="ml-eng-commit-meta">
                <span className="ml-eng-hash">{shortHash(featured.slug)}</span>
                <span className="ml-eng-ref">HEAD → main</span>
                <time dateTime={featured.dateISO}>{featured.displayDate}</time>
              </p>
              <h3 className="ml-eng-commit-title">
                <RoomLink href={postHref(featured.slug)} className="ml-u">
                  {featured.title}
                </RoomLink>
              </h3>
              <p className="ml-eng-para">{featured.description}</p>
              <ul className="ml-eng-checks" aria-label="Checks">
                <li><span className="ml-eng-check-name">read time</span>{featured.readingTime} min</li>
                <li><span className="ml-eng-check-name">sections</span>{featured.sections || 1}</li>
                <li><span className="ml-eng-check-name">words</span>{featured.words.toLocaleString("en-US")}</li>
                <li><span className="ml-eng-check-name">format</span>{featured.format}</li>
              </ul>
              <RoomLink href={postHref(featured.slug)} className="ml-eng-button">
                Open {featured.slug}.mdx <span aria-hidden="true">→</span>
              </RoomLink>
            </article>
            <RouterDiagram />
          </div>
        </section>
      ) : null}

      <section id="ml-eng-log" className="ml-wrap ml-eng-log" aria-labelledby="ml-eng-log-title">
        <h2 id="ml-eng-log-title" className="ml-eng-h2 ml-reveal">
          <span aria-hidden="true" className="ml-eng-file">$</span>git log
        </h2>
        <p className="ml-eng-cmd ml-reveal" aria-hidden="true">
          <span className="ml-eng-prompt">$</span> git log --oneline --graph
        </p>
        <ol className="ml-eng-commits ml-reveal">
          {pieces.map((piece, index) => (
            <li key={piece.slug}>
              <RoomLink href={postHref(piece.slug)} className="ml-eng-commit-row">
                <span className="ml-eng-hash">{shortHash(piece.slug)}</span>
                <span className="ml-eng-commit-text">
                  {index === 0 ? <span className="ml-eng-ref">HEAD → main</span> : null}
                  {piece.room !== "engineering" ? (
                    <span className="ml-eng-ref ml-eng-ref-remote" data-room={piece.room}>
                      <span aria-hidden="true" className="ml-swatch" />
                      origin/{piece.room}
                    </span>
                  ) : null}
                  <span className="ml-eng-commit-subject">{piece.title}</span>
                </span>
                <span className="ml-eng-commit-when">
                  <time dateTime={piece.dateISO}>{piece.displayDate}</time>
                  <span>{piece.readingTime} min</span>
                </span>
              </RoomLink>
            </li>
          ))}
        </ol>
      </section>

      <section id="ml-eng-deps" className="ml-wrap ml-eng-deps" aria-labelledby="ml-eng-deps-title">
        <h2 id="ml-eng-deps-title" className="ml-eng-h2 ml-reveal">
          <span aria-hidden="true" className="ml-eng-file">{"{}"}</span>package.json
        </h2>
        <p className="ml-eng-para ml-eng-deps-note ml-reveal">
          <span className="ml-syn-com">
            {"// What the work is actually built from, per the CV. Not exhaustive, not aspirational."}
          </span>
        </p>
        <div className="ml-eng-deps-grid">
          {dependencies.map((group) => (
            <div key={group.label} className="ml-eng-dep ml-reveal">
              <h3 className="ml-eng-dep-label">{group.label}</h3>
              <ul className="ml-eng-tree">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="ml-eng-exit ml-reveal">
          <span className="ml-eng-prompt" aria-hidden="true">$</span> exit 0
          <span className="ml-eng-exit-note">Process finished with exit code 0. New commits land as they happen.</span>
        </p>
      </section>
    </>
  );
}
