# Blog V3 Redesign Plan

> Canonical strategy for rebuilding marcuyyy.com into a louder, sharper, more useful personal publication.
>
> Execution handoff lives in [`../v3-design/README.md`](../v3-design/README.md). Sequenced work lives in [`../v3-design/TASKLIST.md`](../v3-design/TASKLIST.md).

## 1. Decision

Rebuild the site as **The Fight Journal**: a black-canvas editorial publication about systems, operator scars, and life outside the system.

This is not a visual reskin. It is a redesign of how readers understand Marc, enter the archive, move through long essays, and return for the next piece.

The current personality is the asset. Preserve it. Make the system around it more deliberate.

## 2. Problem statement

The current blog already has a strong voice and a recognizable dark editorial identity, but the experience does not yet support the writing.

### Reader-facing gaps

- `/` redirects to `/blog`, so there is no true front door.
- New readers do not quickly learn who Marc is or what the publication covers.
- Ten posts are organized around 42 topics, most of which attach to only one post.
- Long essays have no section navigation or strong onward path.
- Article styling leaks into tags, related posts, and headings.
- Mobile article pages can overflow horizontally.
- The archive treats every post as chronology instead of a body of work.

### Technical gaps

- Duplicate topic dialogs render at once.
- Dates are timezone-sensitive and contribute to hydration errors.
- Unknown slugs can produce server errors instead of 404 pages.
- The search dialog and icon-only controls need stronger accessible names.
- The font payload is much larger than the design requires.
- Metadata, RSS, canonical URLs, validation, tests, and CI are incomplete.

## 3. Product thesis

> **The blog should feel like an essay collection crossed with a boxing program card: loud when Marc makes a claim, controlled when the reader needs to think, and honest about the scars behind the opinions.**

The writing persona is:

- builder
- founder/operator
- AI systems critic
- boxer/fighter
- actor/performance-aware storyteller
- candid about mistakes
- allergic to hype and generic advice

The redesign must make that persona legible without turning the site into a résumé or personal-brand funnel.

## 4. Design thesis

> **A personal publication with the confidence of a manifesto, the discipline of a technical essay, and the honesty of a fight journal.**

### Keep

- oversized, confrontational titles
- permanently fixed bottom share bar
- black, white, and crimson palette
- Playfair Display as the voice of major claims
- "Thoughts of a Mastermind in Pajamas"
- `~ FIN ~`
- dry, self-aware footer humor
- dark-first identity with a real light theme
- oversized archive numerals
- text-first essays with occasional meaningful diagrams or images

### Change

- accidental line breaks in the hero and titles
- article prose that stretches too wide on desktop
- headings that look like red links
- topic overload
- generic card-like related posts
- unlabeled icon buttons
- duplicated dialogs
- unstable date rendering
- code and URL overflow on mobile
- underused `/` route
- RSS and metadata discoverability gaps

## 5. Content model

The site needs a clearer editorial structure than tags alone.

### Primary lanes

Every post belongs to exactly one lane:

| Lane        | Meaning                                                          | Example posts                       |
| ----------- | ---------------------------------------------------------------- | ----------------------------------- |
| `systems`   | AI, governance, engineering, architecture, tools                 | Skills Router, GLM-4.5, OpenRouter  |
| `operators` | Hiring, leadership, teams, entrepreneurship, expensive lessons   | How Not to Hire, The First Bell     |
| `life`      | Personal essays, relationships, creativity, acting, boxing, film | Ghosted, Finding Yourself, Superman |

### Formats

Each post should have a lightweight format label:

- `essay`
- `guide`
- `review`
- `note`

### Curated topics

Topics are secondary navigation, not a keyword dump. Start with approximately 8-12 topics:

- `ai`
- `governance`
- `engineering`
- `tools`
- `hiring`
- `leadership`
- `entrepreneurship`
- `relationships`
- `creativity`
- `boxing`
- `acting`
- `film`

A topic should represent a recurring reader path. One-off keywords should be removed or consolidated.

### Frontmatter target

```yaml
---
title: "The Skills Router: Governing AI Coding Instead of Hoping It Behaves"
date: "2026-02-18T13:45:00+08:00"
description: "Why bigger models aren't the answer, and how a deterministic Skills Router architecture turns AI coding from probabilistic guessing into governed execution."
lane: "systems"
format: "essay"
topics: ["ai", "governance", "engineering"]
featured: true
draft: false
---
```

Validation should fail loudly for missing, invalid, or unpublished-by-accident content.

## 6. Information architecture

### `/`: Front door

Purpose: orient a new reader in under ten seconds.

Required sequence:

1. Opening Bell hero
2. Current Bout featured essay
3. Start Here
4. Three Lanes
5. Recent Rounds
6. Stay for the Next Round

### `/blog`: Complete archive

Purpose: make the full body of work browsable as a publication archive.

Required behavior:

- newest-first archive
- lane labels and filters
- curated topic filtering
- URL-backed filter state
- search access
- oversized but accessible sequence numerals
- no duplicate dialogs

### `/blog/[slug]`: Article

Purpose: support deep reading and onward movement.

Required structure:

1. Back-to-archive link
2. loud title with intentional line breaks
3. lane, format, date, reading time, curated topics
4. optional short-version/thesis block
5. table of contents for long posts
6. controlled prose column
7. functional fixed share bar
8. `~ FIN ~`
9. author block
10. next/previous path
11. related essays

### `/about`: Persona page

Purpose: explain Marc as a coherent whole.

This should be editorial, not a résumé. Include:

- what Marc builds
- what he believes
- what he has failed at
- why the three lanes belong together
- where to start reading
- external links

### `/blog/tag/[tag]`: Topic collections

Keep tag pages, but only for curated topics. Each topic page should explain the topic as a collection, not merely list filtered posts.

## 7. Experience principles

### Loud opening, controlled reading

The title may be huge. The body must remain readable. Use contrast between loud openings and controlled prose instead of making everything wide or everything small.

### Red is scarce

Crimson marks the most important action, emphasis, or current state. It should not paint every heading and badge.

### Furniture must earn its place

Search, topics, table of contents, and sharing are apparatus, not decoration. Each must be useful, accessible, and visually subordinate to the writing.

### The site should not perform before the reader can read

No decorative scroll choreography. Motion exists for state, orientation, and feedback only.

### Every ending has a next move

After an essay, the reader should see the author, the next likely essay, related work, and a way to return later.

## 8. Accessibility and performance doctrine

Accessibility is not a cleanup pass. It is part of the visual system.

### Non-negotiables

- one visible dialog at a time
- named dialogs, buttons, inputs, and icon-only actions
- visible focus states in both themes
- no horizontal page overflow
- comfortable touch targets
- reduced-motion support
- sufficient accent contrast
- no color-only state
- decorative numerals hidden from assistive technology

### Performance doctrine

- statically render content pages
- load only used font weights
- lazy-load search dependencies
- keep article interactivity light
- optimize imagery only when imagery is actually used
- test bundle and rendering changes against a baseline

## 9. Technical doctrine

The redesign should practice the governance philosophy in the writing.

- Content metadata is validated.
- Dates are explicit and deterministic.
- Drafts cannot accidentally publish.
- Unknown content returns 404, not 500.
- Search and filtering behavior is tested.
- RSS, sitemap, canonical URLs, and structured data stay synchronized.
- Visual changes are verified on desktop and mobile.
- No redesign patch ships with hydration errors or console regressions.

## 10. Success criteria

### Reader outcomes

- A new visitor can explain what the site covers after one homepage view.
- A new visitor has an obvious first post to read.
- A long essay can be entered, scanned, resumed, and navigated without losing orientation.
- A mobile reader never has to scroll the whole page sideways.
- A reader finishing an essay has a meaningful next step.

### Editorial outcomes

- The archive communicates three coherent lanes.
- Topics become useful collections rather than metadata noise.
- The publication feels more Marc, not more generic.
- The writing remains the dominant surface.

### Technical outcomes

- no hydration errors
- no duplicate dialogs
- valid 404 behavior
- deterministic dates
- valid frontmatter
- RSS autodiscovery and canonical metadata
- reduced font payload
- automated smoke tests for critical reader paths

## 11. Explicit non-goals

Do not add:

- comments
- reactions
- pop-up newsletter prompts
- generic creator feature grids
- blue-purple gradients
- glassmorphism
- stock photography
- fake terminal aesthetics
- decorative scroll animations
- a résumé-style About page
- more tags as a substitute for structure
- social sharing clutter beyond useful destinations

## 12. Implementation order

1. Repair critical bugs and reading constraints.
2. Introduce the article reading system.
3. Make the content model and taxonomy explicit.
4. Build the front door and About page.
5. Rework archive, filtering, and search.
6. Strengthen metadata, RSS, validation, tests, and performance.

The article page comes first because the article is the product. Once the reading rhythm is right, the homepage and archive can reuse the same language.

## 13. Final creative rule

If a design choice makes the site safer but less recognizable, reject it.

If a design choice makes the site louder but harder to read, refine it.

The target is not polish for its own sake. The target is a publication that could only belong to Marc.
