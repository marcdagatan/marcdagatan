import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Header images are hand-authored SVG artifacts (e.g. the First Bell
    // hero). next/image refuses SVG by default; allow it with a restrictive
    // CSP so the images remain inert.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
