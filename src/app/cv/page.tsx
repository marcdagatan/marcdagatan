import type { Metadata } from "next";
import { CvLedger } from "@/components/cv/cv-ledger";
import { getCvPath, resolveCvView } from "@/lib/cv/view";
import { absoluteUrl, RSS_ALTERNATE, SITE_NAME } from "@/lib/site";

const generalDescription =
  "The professional record of Marc Uy Dagatan: full-stack engineering, technical leadership, teaching, and education.";
const technicalDescription =
  "The detailed technical CV of Marc Uy Dagatan: architecture, platform modernization, engineering leadership, and delivery.";

interface CvPageProps {
  readonly searchParams: Promise<{ readonly view?: string | string[] }>;
}

/** Generates a separate canonical record for each substantive CV reading. */
export async function generateMetadata({ searchParams }: CvPageProps): Promise<Metadata> {
  const view = resolveCvView((await searchParams).view);
  const technical = view === "technical";
  const title = technical ? "Technical CV" : "CV";
  const description = technical ? technicalDescription : generalDescription;
  const path = getCvPath(view);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": [RSS_ALTERNATE],
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "profile",
      url: absoluteUrl(path),
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function CvPage({ searchParams }: CvPageProps) {
  return (
    <main className="ml-page ml-cv">
      <div className="ml-wrap ml-page-body">
        <CvLedger view={resolveCvView((await searchParams).view)} />
      </div>
    </main>
  );
}
