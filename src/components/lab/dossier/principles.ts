/**
 * Working principles, each traced to where Marc already said it.
 * Sources are the About page and published essays; nothing here is new claim.
 */
export interface Principle {
  readonly statement: string;
  readonly gloss: string;
  readonly source: { readonly label: string; readonly href: string };
}

export const PRINCIPLES: readonly Principle[] = [
  {
    statement: "Models do not govern themselves.",
    gloss: "Someone has to own the rules. AI works better inside deterministic control planes, so I build those.",
    source: { label: "No. 010, The Skills Router", href: "/lab/dossier/010-skills-router" },
  },
  {
    statement: "Hire on evidence, not trust.",
    gloss: "I learned this one at 11 PM on a Sunday, reading a codebase nobody planned to maintain.",
    source: { label: "No. 003, How Not to Hire", href: "/lab/dossier/003-how-not-to-hire" },
  },
  {
    statement: "Stay close to the code.",
    gloss: "I lead architecture and delivery, but hard decisions only become real when a system meets customers, data, and people.",
    source: { label: "About", href: "/about" },
  },
  {
    statement: "AI speeds up the figuring out. It does not finish the work.",
    gloss: "Use it for the sketchbook phase. Keep the guardrails for the code you plan to keep.",
    source: { label: "No. 004, AI Vibe Coding", href: "/lab/dossier/004-ai-vibe-coding-basic" },
  },
  {
    statement: "Bad decisions usually look reasonable at first.",
    gloss: "Which is why governance is not boring. It is the difference between surviving and breaking.",
    source: { label: "About", href: "/about" },
  },
  {
    statement: "Getting hit teaches more than winning.",
    gloss: "Boxing taught me more about business than any book. Honesty about failure is the cheapest lesson available.",
    source: { label: "No. 001, The First Bell", href: "/lab/dossier/001-the-first-bell" },
  },
];
