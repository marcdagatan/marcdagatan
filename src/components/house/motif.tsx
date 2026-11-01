import type { RoomId } from "./rooms";

/**
 * Each room's drawn texture: a blueprint routing diagram, a ring corner, a
 * film strip with a projector beam, and growth rings. Strokes use
 * currentColor so the same art works lit and unlit. Purely decorative.
 */
export function RoomMotif({ room, detail = true }: { room: RoomId; detail?: boolean }) {
  switch (room) {
    case "engineering":
      return (
        <div aria-hidden="true" className="ml-motif ml-motif-grid">
          {detail ? <RoutingDiagram /> : null}
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

/** The Skills Router, drawn as a blueprint. */
function RoutingDiagram() {
  return (
    <svg className="ml-motif-diagram" viewBox="-2 0 302 122" fill="none">
      <g stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.7">
        <rect x="0" y="45" width="80" height="32" />
        <rect x="112" y="4" width="72" height="30" />
        <rect x="112" y="88" width="72" height="30" />
        <rect x="220" y="45" width="78" height="32" />
        <path className="ml-trace" d="M80 61 H96 V19 H112" />
        <path className="ml-trace" d="M96 61 V103 H112" />
        <path className="ml-trace" d="M184 19 H202 V61 H220" />
        <path className="ml-trace" d="M184 103 H202 V61" />
      </g>
      <g fill="currentColor" fillOpacity="0.8" fontFamily="var(--ml-font-engineering), monospace" fontSize="11">
        <text x="12" y="65">router</text>
        <text x="124" y="23">skill</text>
        <text x="124" y="107">skill</text>
        <text x="232" y="65">verify</text>
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
