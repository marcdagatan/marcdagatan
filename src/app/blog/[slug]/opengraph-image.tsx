import { ImageResponse } from "next/og";
import { getPostSource } from "@/lib/posts";

export const alt = "Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPostSource(params.slug);
  
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#000000",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "48px",
          }}
        >
          Post Not Found
        </div>
      ),
      { ...size }
    );
  }

  const { meta } = post;
  
  const truncatedDesc = meta.description 
    ? meta.description.length > 150 
      ? meta.description.substring(0, 150) + "..."
      : meta.description
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
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
            fontSize: "32px",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "60px",
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
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              marginBottom: "30px",
              fontFamily: "Georgia, serif",
              letterSpacing: "-1px",
              display: "flex",
            }}
          >
            {meta.title}
          </div>

          {truncatedDesc && (
            <div
              style={{
                fontSize: "28px",
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.4,
                maxWidth: "900px",
                fontFamily: "system-ui, sans-serif",
                display: "flex",
              }}
            >
              {truncatedDesc}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily: "system-ui, sans-serif",
            marginTop: "40px",
          }}
        >
          <span>{new Date(meta.timestamp).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}</span>
          <span style={{ color: "rgb(215, 38, 56)" }}>·</span>
          <span>{meta.readingTime} min read</span>
          <span style={{ color: "rgb(215, 38, 56)" }}>·</span>
          <span>marcuyyy.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
