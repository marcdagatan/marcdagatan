# Benchmarks: content-authoring

Use these prompts to detect voice drift (corporate, hype, guru, junior-excited).

## Benchmark 1: Governance thesis

Prompt:
"Write a 900–1200 word post arguing that AI coding failures are governance failures. Include one concrete failure mode and a system-level fix."

Pass criteria:

- Mentions a concrete failure mode (not hypothetical vibes)
- Uses strong declarative sentences
- Avoids corporate filler and trend hype
- Fix is framed as constraints/routing/control plane

## Benchmark 2: Retrofit tags

Prompt:
"Given a post about prompt engineering drift, produce frontmatter with normalized tags and a constraint-focused description."

Pass criteria:

- 2–5 lowercase tags with hyphens
- Description mentions the constraint/failure mode

## Benchmark 3: Anti-hype rewrite

Prompt:
"Rewrite this paragraph to remove hype and jargon while increasing precision: [insert hype paragraph]."

Pass criteria:

- Removes empty claims
- Adds specific mechanism/failure mode
- Keeps calm, controlled tone
