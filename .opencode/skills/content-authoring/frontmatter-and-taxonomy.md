# Frontmatter and Taxonomy (MDX Blog)

This repo’s blog features depend on consistent frontmatter.

## Frontmatter fields

Required:

- `title`: string
- `date`: string (ISO or `YYYY-MM-DD hh:mm AM/PM`)

Recommended:

- `description`: string (used in RSS + metadata)
- `tags`: string[] (powers tag pages + related posts + search)

## Tag rules

- Prefer 2–5 tags.
- Tags are **lowercase**.
- Use hyphens for multiword tags (`control-plane`, `system-design`).
- Avoid synonyms that split the archive (`ai-governance` vs `governance`). Pick one.

## Description rules

- 120–180 chars is the sweet spot.
- Must state the _constraint_ or _failure mode_, not generic topic.
- No clickbait.

## Minimal examples

### Canonical frontmatter

```yaml
---
title: "AI coding isn’t a capability problem"
date: "2026-02-18 01:45 PM"
description: "Why model quality plateaus without routing, constraints, and auditable control planes."
tags: ["ai", "governance", "control-plane"]
---
```

### Tag normalization examples

- Good: `"governance"`
- Bad: `"Governance"`, `"AI Governance"`, `"ai_governance"`
