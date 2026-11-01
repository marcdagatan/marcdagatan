import type { RoomId } from "./rooms";

/**
 * EDITABLE COPY for The Many Lives.
 *
 * Everything written for this prototype lives here so it can be rewritten in
 * one place. Facts come from the About page, the CV (`src/lib/cv`), and the
 * posts themselves. Quotes marked with `slug` are verbatim from that post.
 * Lines marked `// voice` are prototype copy in Marc's voice: edit freely.
 */

export type Quote = { text: string; slug?: string; source: string };

export const HOME = {
  // voice
  intro:
    "I'm Marc Uy Dagatan. I build AI systems and the companies around them, train in a boxing gym, act when a script lines up, and parent without a manual. Same person in every room. Different lighting.",
  // voice
  planNote: "Hover a room to switch on its lights. Click to walk in.",
};

/** Hand-edited "Now" block. Rewrite whenever life moves. */
export const NOW_UPDATED = "November 2026";

export const NOW_ITEMS: { room: RoomId; label: string; text: string }[] = [
  {
    room: "engineering",
    label: "Building",
    text: "Kravos AI, an AI agent operations platform, from first sketch toward launch. Founder, CEO, and still the one reading the diffs.",
  },
  {
    room: "engineering",
    label: "Maintaining",
    text: "The Skills Router, open-sourced instead of left in the company vault, because governed AI coding should not be a trade secret.",
  },
  {
    room: "ring",
    label: "Training",
    text: "Boxing and the gym, whenever the calendar loses the argument.",
  },
  {
    room: "screen",
    label: "Performing",
    text: "Short films and Filipino drama series, when a script and a schedule line up.",
  },
  {
    room: "life",
    label: "Parenting",
    text: "Being a dad. Still no manual. Still taking notes.",
  },
];

/** Per-room copy used on tiles, room landings, and the house page. */
export const ROOM_COPY: Record<RoomId, { line: string; manifesto: string[] }> = {
  engineering: {
    line: "AI systems that have to behave, teams that have to ship.",
    // voice
    manifesto: [
      "The day job. Models do not govern themselves, hires do not vet themselves, and companies do not survive on vibes.",
      "I lead architecture and delivery, but I stay close to the code, because the hard decisions only become real when a system meets customers, data, and people.",
    ],
  },
  ring: {
    line: "Training, discipline, and what getting hit teaches you.",
    // voice
    manifesto: [
      "Boxing taught me more about business than any book. The ring is the one room where nobody cares about your title.",
      "The bell rings whether you are ready or not. You answer it anyway.",
    ],
  },
  screen: {
    line: "Showing up as someone else, and opinions about movies.",
    // voice
    manifesto: [
      "Short films, Filipino drama series, and reviews of movies that should have known better.",
      "Acting taught me to be present. Watching films taught me to be picky.",
    ],
  },
  life: {
    line: "Relationships, family, and the person left after the meetings.",
    // voice
    manifesto: [
      "The room without a manual. Relationships that lasted and the ones that ended in silence.",
      "Creative outlets as expansion rather than escape, and parenting moments nobody rehearses.",
    ],
  },
};

/* Engineering --------------------------------------------------------------- */

/** `principles.ts` in the room's README. Beliefs from the About page. */
export const ENGINEERING_NOTES = [
  "Models do not govern themselves; someone has to own the rules.",
  "Bad decisions usually look reasonable at first.",
  "Honesty about failure is the least expensive lesson available.",
  "Hope is not a hiring strategy.",
  "Route before you reason.",
];

/**
 * The Skills Router as a request flow, paraphrased from the Skills Router
 * post. `node` is the hop a request passes through at each layer.
 */
export const ROUTER_LAYERS = [
  {
    id: "governance",
    node: "rules",
    name: "Governance",
    tag: "The constitution",
    body: "Retrieval first, by default. Project-local rules beat global skills, and global skills beat model priors.",
  },
  {
    id: "routing",
    node: "router",
    name: "Routing",
    tag: "Minimal context on purpose",
    body: "Each SKILL.md is a router that picks the smallest set of leaf docs for the request. No Flutter rules while fixing a Next.js action.",
  },
  {
    id: "execution",
    node: "skill",
    name: "Execution",
    tag: "Agents are roles",
    body: "An agent is a permissions profile, a temperature, and a scope. Choosing one is an authorization decision.",
  },
  {
    id: "enforcement",
    node: "guard",
    name: "Enforcement",
    tag: "Stop the world",
    body: "SkillGuard blocks file edits until skills are loaded. A suggestion becomes a gate.",
  },
  {
    id: "quality",
    node: "verify",
    name: "Quality",
    tag: "Routing must be lintable",
    body: "Router references, leaves, and headings are machine-checked, so the control plane cannot drift silently.",
  },
] as const;

/* Ring ---------------------------------------------------------------------- */

/** Tale of the tape. No invented measurements: rows are facts or stated beliefs. */
export const TALE_OF_THE_TAPE: { label: string; value: string }[] = [
  { label: "Discipline", value: "Boxing and the gym" },
  { label: "Corner", value: "MAD Software" },
  { label: "Day job", value: "Founder, Kravos AI" },
  { label: "Style", value: "Answer the bell. Step forward. Throw something. Adjust." },
  { label: "Lesson", value: "Getting hit teaches more than winning." },
];

export const CORNER_QUOTES: Quote[] = [
  {
    text: "You don’t need to have it all figured out. You just need to answer the bell.",
    slug: "001-the-first-bell",
    source: "The First Bell",
  },
  {
    text: "I’ve been the guy everyone bets against… until they stop.",
    slug: "001-the-first-bell",
    source: "The First Bell",
  },
  {
    text: "Life works exactly the same way, except you don’t always hear the bell.",
    slug: "001-the-first-bell",
    source: "The First Bell",
  },
];

/* Screen -------------------------------------------------------------------- */

export const ACTING_QUOTES: Quote[] = [
  {
    text: "I’ve stood under different lights in front of a camera, knowing the scene isn’t just acting; it’s me drawing from every scar, every fight, every heartbreak.",
    slug: "001-the-first-bell",
    source: "The First Bell",
  },
  {
    text: "For me, that door was acting classes.",
    slug: "002-finding-yourself",
    source: "Finding Yourself in a Different Language",
  },
  {
    text: "That’s a sugar high. Once the buzz wears off, there’s no real meal underneath.",
    slug: "009-superman-2025",
    source: "When Superman Fails to Soar",
  },
];

/* Life ---------------------------------------------------------------------- */

/** Beliefs from the About page, kept in the notebook. */
export const LIFE_BELIEFS = [
  "Creative outlets are expansion, not escape.",
  "Getting hit teaches more than winning.",
  "Honesty about failure is the least expensive lesson available.",
  "Bad decisions usually look reasonable at first.",
];

export const LIFE_QUOTES: Quote[] = [
  {
    text: "Because there’s a lot of you left to meet.",
    slug: "002-finding-yourself",
    source: "Finding Yourself in a Different Language",
  },
  {
    text: "It just makes it a short story instead of a novel.",
    slug: "008-ghosted",
    source: "When the Ghost Feels Like 'The One'",
  },
];

/* House --------------------------------------------------------------------- */

export const HOUSE = {
  // voice
  lede: "A builder who took the hits. Founder of MAD Software and Kravos AI, fighter, actor, hands-on technical leader, and dad.",
  // About page, lightly trimmed
  failures:
    "Hiring people on trust instead of evidence. Relationships that ended in silence. Businesses where I learned the lesson the expensive way.",
  // About page
  why: "The systems you build, the operators you become, and the fights that shape you are the same discipline: showing up, taking the hit, and making the next call.",
};
