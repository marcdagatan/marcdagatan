import type { Metadata } from "next";
import { CvLedger } from "@/components/cv/cv-ledger";
import { resolveCvView } from "@/lib/cv/view";
import { absoluteUrl, RSS_ALTERNATE, SITE_NAME } from "@/lib/site";

const description =
  "The professional record of Marc Uy Dagatan: full-stack engineering, technical leadership, teaching, and education.";

export const metadata: Metadata = {
  title: "CV",
  description,
  alternates: {
    canonical: "/cv",
    types: {
      "application/rss+xml": [RSS_ALTERNATE],
    },
  },
  openGraph: {
    title: `CV | ${SITE_NAME}`,
    description,
    type: "profile",
    url: absoluteUrl("/cv"),
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `CV | ${SITE_NAME}`,
    description,
    images: ["/opengraph-image"],
  },
};

interface CvPageProps {
  readonly searchParams: Promise<{ readonly view?: string | string[] }>;
}

export default async function CvPage({ searchParams }: CvPageProps) {
  return <CvLedger view={resolveCvView((await searchParams).view)} />;
}
