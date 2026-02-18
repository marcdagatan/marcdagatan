---
name: content-authoring
description: Markdown-first content authoring: Marc's voice, post structure, tags/metadata, and distribution.
compatibility:
  - markdown
  - mdx
metadata:
  primary_output: mdx
  audience: serious-builders
---

# Skill: content-authoring

Write technical thought-leadership with a governance-first, systems lens.

This skill is optimized for this repo:

- Posts live in `content/posts/*.mdx`
- Frontmatter supports: `title`, `date`, `description`, `tags` (see `src/lib/posts.ts`)
- Tags power `/blog/tag/[tag]` and related posts
- RSS, sitemap, robots, OG images, and JSON-LD exist and should be used intentionally

## When to load

- You are drafting a new post/article in Markdown/MDX.
- You are editing a post for voice consistency, clarity, and system-level framing.
- You are adding/updating frontmatter: tags, description, date formatting.
- You are repurposing a post into other formats (thread, talk outline, memo) while keeping the core thesis.

## When NOT to load

- You are implementing application code (load the relevant stack skill).
- You are doing SEO/marketing copywriting for a landing page (different voice constraints).
- You are writing tutorial content for beginners (this skill is for serious builders).

## Quick routing

| Task                                                              | Load                          | Why                                                   |
| ----------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------- |
| Enforce Marc voice (no fluff, calm authority)                     | `voice-and-tone.md`           | Prevents drift into hype/corporate/guru tone          |
| Design the post arc (problem → failure mode → fix → implications) | `post-structure.md`           | Canonical structure Marc prefers                      |
| Set frontmatter (tags, description, date)                         | `frontmatter-and-taxonomy.md` | Ensures blog features work (tags, related posts, RSS) |
| Ship checklist (SEO, distribution, repurposing)                   | `distribution-and-seo.md`     | Makes output publishable and consistent               |
| Generate canonical templates                                      | `recipes/new-post.md`         | Repeatable post scaffolds                             |

## Non-negotiables

- Markdown-first. Prefer MDX only when it materially improves clarity.
- No corporate filler. No motivational guru energy. No trend-chasing.
- Strong declaratives. Minimal hedging. Short paragraphs.
- Frame issues as _system_ / _governance_ failures, not vibes.
- Subtle positioning is allowed; over-claiming is not.
- Metaphors are permitted but must be sparse and controlled.

## Minimal examples

### 1) Canonical opening

"Capability isn’t the bottleneck. Control is."

### 2) Canonical transition

"That’s not a model problem. That’s a governance problem."

### 3) Canonical close

"If you want reliability, stop optimizing prompts. Start designing constraints."
