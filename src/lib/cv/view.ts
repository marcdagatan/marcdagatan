import type { CvExperience } from "./types";

/** The audience-specific rendering of the professional record. */
export type CvView = "general" | "technical";

/** The experience fields rendered by one CV view. */
export interface CvExperienceView {
  readonly summary: string;
  readonly accomplishments: readonly string[];
}

/** Resolves untrusted URL state to the recruiter-first CV view. */
export function resolveCvView(value: string | readonly string[] | undefined): CvView {
  return value === "technical" ? "technical" : "general";
}

/** Returns the stable, crawlable URL for a CV reading. */
export function getCvPath(view: CvView): string {
  return view === "technical" ? "/cv?view=technical" : "/cv";
}

/** Selects a concise or fully technical reading without duplicating each role. */
export function getCvExperienceView(experience: CvExperience, view: CvView): CvExperienceView {
  return view === "general"
    ? { summary: experience.generalSummary, accomplishments: experience.generalAccomplishments }
    : { summary: experience.summary, accomplishments: experience.accomplishments };
}
