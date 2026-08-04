import { ImageResponse } from "next/og";

export const alt = "Thoughts of a Mastermind in Pajamas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social image for the publication front door and editorial profile pages. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0a09",
          color: "#f0ece3",
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a29a8d",
          }}
        >
          The Fight Journal · Marc Uy Dagatan
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 94, fontWeight: 700, lineHeight: 0.92 }}>
          <span>Thoughts of a</span>
          <span style={{ color: "#e84556" }}>Mastermind</span>
          <span>in Pajamas</span>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "1px solid #26221f",
            paddingTop: 24,
            fontFamily: "monospace",
            fontSize: 19,
            letterSpacing: "0.08em",
            color: "#a29a8d",
          }}
        >
          Systems, scars, and selfhood: from the corner.
        </div>
      </div>
    ),
    size
  );
}
