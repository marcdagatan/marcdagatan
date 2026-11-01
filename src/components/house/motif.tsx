import type { RoomId } from "./rooms";

/**
 * Each room's drawn texture: an editor minimap and a code snippet, a ring
 * corner, a film strip with a projector beam, and growth rings. Strokes use
 * currentColor so the same art works lit and unlit. Purely decorative.
 */
export function RoomMotif({ room, detail = true }: { room: RoomId; detail?: boolean }) {
  switch (room) {
    case "engineering":
      return (
        <div aria-hidden="true" className="ml-motif ml-motif-code">
          <Minimap />
          {detail ? <CodeSnippet /> : null}
        </div>
      );
    case "ring":
      return detail ? <RingCorner /> : null;
    case "screen":
      return <ScreenMotif />;
    case "life":
      return <LifeMotif />;
  }
}

/** Minimap rows: indent, width and syntax role, like a file seen from far off. */
const MINIMAP: [number, number, "kw" | "fn" | "str" | "com" | "ink"][] = [
  [0, 46, "com"], [0, 30, "kw"], [0, 0, "ink"], [0, 58, "kw"], [8, 70, "fn"],
  [8, 44, "str"], [16, 52, "ink"], [16, 36, "str"], [8, 22, "ink"], [0, 12, "ink"],
  [0, 0, "ink"], [0, 64, "com"], [0, 50, "kw"], [8, 76, "fn"], [16, 40, "str"],
  [16, 60, "ink"], [8, 28, "kw"], [0, 12, "ink"], [0, 0, "ink"], [0, 38, "kw"],
  [8, 54, "fn"], [8, 34, "ink"], [0, 12, "ink"],
];

function Minimap() {
  return (
    <svg className="ml-motif-minimap" viewBox="0 0 100 184" preserveAspectRatio="xMaxYMin meet">
      {MINIMAP.map(([indent, width, role], index) =>
        width ? (
          <rect key={index} className={`ml-mm ml-mm-${role}`} x={indent} y={index * 8} width={width} height="4" rx="1" />
        ) : null,
      )}
    </svg>
  );
}

/** A few lines of the Skills Router, the way they would sit in an editor. */
function CodeSnippet() {
  return (
    <svg className="ml-motif-snippet" viewBox="0 0 300 96" fill="currentColor">
      <g fontFamily="var(--ml-font-engineering), monospace" fontSize="12">
        <text x="0" y="14" className="ml-mm-com">{"// route a request to a skill"}</text>
        <text x="0" y="38">
          <tspan className="ml-mm-kw">const</tspan> <tspan className="ml-mm-fn">route</tspan> = (req) =&gt;
        </text>
        <text x="16" y="60">
          <tspan className="ml-mm-fn">pick</tspan>(skills, req).<tspan className="ml-mm-fn">verify</tspan>();
        </text>
        <text x="0" y="86" className="ml-mm-str">{"$ exit 0"}</text>
      </g>
    </svg>
  );
}

function RingCorner() {
  return (
    <div aria-hidden="true" className="ml-motif">
      <span className="ml-motif-post" />
      <svg className="ml-motif-twelve" viewBox="0 0 120 120">
        <text x="120" y="112" textAnchor="end" fontFamily="var(--ml-font-ring), Impact, sans-serif" fontSize="132" fill="currentColor">
          12
        </text>
      </svg>
    </div>
  );
}

function ScreenMotif() {
  return (
    <div aria-hidden="true" className="ml-motif">
      <svg className="ml-beam" viewBox="0 0 400 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ml-beam-fade" x1="1" y1="0" x2="0" y2="0.6">
            <stop offset="0" stopColor="#eaa53e" stopOpacity="0.42" />
            <stop offset="1" stopColor="#eaa53e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="400,40 400,64 40,300 0,300 0,170" fill="url(#ml-beam-fade)" />
      </svg>
      <span className="ml-filmstrip ml-filmstrip-top" />
      <span className="ml-filmstrip ml-filmstrip-bottom" />
    </div>
  );
}

function LifeMotif() {
  return (
    <div aria-hidden="true" className="ml-motif">
      <svg className="ml-motif-rings" viewBox="0 0 400 400" fill="none">
        <g className="ml-rings" stroke="currentColor" strokeOpacity="0.28">
          {[28, 52, 74, 100, 122, 150, 170, 196].map((r, index) => (
            <circle key={r} cx="200" cy="200" r={r} strokeWidth={index % 3 === 0 ? 2.5 : 1.25} />
          ))}
        </g>
        <circle cx="200" cy="200" r="7" fill="#8a3a5d" fillOpacity="0.6" />
      </svg>
    </div>
  );
}
