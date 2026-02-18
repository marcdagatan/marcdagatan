import { ImageResponse } from "next/og";
import { getPostSource } from "@/lib/posts";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marcuyyy.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  let title = slug;
  let date = "";

  try {
    const { meta } = getPostSource(slug);
    title = meta.title;
    date = new Date(meta.timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    // Use slug as title if post not found
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#000000",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p
            style={{
              color: "#666666",
              fontSize: "24px",
              margin: 0,
            }}
          >
            Marc Uy Dagatan
          </p>
          <h1
            style={{
              color: "#ededed",
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
              maxWidth: "900px",
              fontFamily: "Georgia, serif",
            }}
          >
            {title}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <p
            style={{
              color: "#666666",
              fontSize: "24px",
              margin: 0,
            }}
          >
            {date}
          </p>
          <p
            style={{
              color: "#666666",
              fontSize: "24px",
              margin: 0,
            }}
          >
            {SITE_URL}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
