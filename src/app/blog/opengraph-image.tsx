import { ImageResponse } from "next/og";
import { getAllPostsMeta } from "@/lib/posts";

export const alt = "Marc Uy Dagatan - Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const posts = getAllPostsMeta();

  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "rgb(215, 38, 56)",
          }}
        />

        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "40px",
            fontFamily: "Georgia, serif",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          <span style={{ color: "#ffffff" }}>M</span>
          <span style={{ color: "rgb(215, 38, 56)" }}>D</span>
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "30px",
            fontFamily: "Georgia, serif",
            letterSpacing: "-1px",
            display: "flex",
          }}
        >
          Thoughts of a Mastermind in Pajamas
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "rgba(255, 255, 255, 0.6)",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "800px",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
          }}
        >
          It&apos;s hard to plot world domination when your coffee&apos;s still brewing… but I&apos;m making it work.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
          }}
        >
          {posts.length} posts · marcuyyy.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
