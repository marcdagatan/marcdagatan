/**
 * Curated editorial taxonomy: lanes, formats, and topics.
 *
 * Topics are the secondary navigation of the publication. They are a small,
 * curated set of recurring reader paths, not a keyword dump. One-off labels
 * from the old tag system must be consolidated into these topics.
 */

/** Primary lanes. Every post belongs to exactly one lane. */
export const LANES = ["systems", "operators", "life"] as const;

/** Lightweight format labels. Every post has exactly one. */
export const POST_FORMATS = ["essay", "guide", "review", "note"] as const;

/** Curated topic collections. */
export const CURATED_TOPICS = [
  "ai",
  "governance",
  "engineering",
  "tools",
  "hiring",
  "leadership",
  "entrepreneurship",
  "relationships",
  "creativity",
  "boxing",
  "acting",
  "film",
] as const;

export type Lane = (typeof LANES)[number];
export type PostFormat = (typeof POST_FORMATS)[number];
export type Topic = (typeof CURATED_TOPICS)[number];

/** Short editorial introductions used on topic collection pages. */
export const TOPIC_INTROS: Record<Topic, string> = {
  ai: "Model behavior, routing, and the control planes that keep AI honest.",
  governance: "How rules, structure, and oversight turn capable systems into safe ones.",
  engineering: "Architecture, trade-offs, and the craft of building software that lasts.",
  tools: "The editors, models, and workflows worth keeping in your corner.",
  hiring: "Who you bring in decides what you build. The expensive lessons say so.",
  leadership: "Running teams means absorbing mistakes and making the next call anyway.",
  entrepreneurship: "Starting and running a company is a contact sport.",
  relationships: "The connections that shape you, including the ones that don't last.",
  creativity: "Creative outlets as expansion, not escape.",
  boxing: "Training, discipline, and what getting hit teaches you.",
  acting: "Performance, presence, and showing up as someone else.",
  film: "What movies get right, wrong, and accidentally honest.",
};

/**
 * Normalizes a raw topic label to a curated topic.
 *
 * @param raw - A topic string from frontmatter.
 * @returns The canonical curated topic, or null if the label is not curated.
 */
export function normalizeTopic(raw: string): Topic | null {
  const normalized = raw.trim().toLowerCase();
  return CURATED_TOPICS.includes(normalized as Topic) ? (normalized as Topic) : null;
}

/**
 * Checks whether a raw label is a curated topic.
 *
 * @param raw - A topic string from frontmatter.
 * @returns True when the label normalizes to a curated topic.
 */
export function isCuratedTopic(raw: string): boolean {
  return normalizeTopic(raw) !== null;
}

/**
 * Type guard for lanes.
 *
 * @param value - Candidate lane string.
 * @returns True when the value is one of the three lanes.
 */
export function isValidLane(value: string): value is Lane {
  return (LANES as readonly string[]).includes(value);
}

/**
 * Type guard for formats.
 *
 * @param value - Candidate format string.
 * @returns True when the value is one of the four formats.
 */
export function isValidFormat(value: string): value is PostFormat {
  return (POST_FORMATS as readonly string[]).includes(value);
}
