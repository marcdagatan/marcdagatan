# V3 Redesign Task List

> Execution sequence for the Blog V3 redesign.
>
> Canonical strategy: [`../.plan/README.md`](../.plan/README.md)
> Design handoff: [`README.md`](./README.md)

## Implementation status

**Completed on August 4, 2026.** Phases 0-8 are implemented and integrated.

- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm test` passes: 108 tests.
- `npm run test:e2e` passes: 55 browser tests, with 11 intentional project-specific skips.
- `npm run build` passes with 35 generated pages and no build warnings.
- Dark/light and mobile/tablet/desktop layouts were reviewed in a browser.
- RSS remains a deliberate summary feed rather than compiling full MDX into route-handler HTML.
- The article title remains loud and the bottom share bar remains permanently fixed.

## How to use this file

- Complete phases in order unless a task explicitly says it can run in parallel.
- Keep changes minimal inside each task; do not absorb future-phase scope.
- Do not remove the loud title, fixed share bar, crimson accent, Playfair display type, `~ FIN ~`, or the existing dry personality.
- Do not commit, push, or create a PR unless Marc explicitly asks.
- Before marking a task complete, run its checks and inspect the actual diff.
- If a task conflicts with repository instructions or an existing pattern, stop and surface the conflict instead of guessing.

## Global acceptance checks

Run these when a phase changes shared layout, metadata, content loading, or app behavior:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

When tests are introduced, also run the targeted tests for the changed area, then the full suite before final delivery.

Browser verification for visual phases must include:

- dark and light themes
- 390x844 mobile
- 768x1024 tablet when layout behavior changes
- 1440x900 desktop
- no hydration errors
- no Radix accessibility warnings
- no horizontal page overflow
- no new failed requests or font warnings

---

# Phase 0: Baseline and safety

## 0.1 Capture the current baseline

**Goal:** Establish a before-state so regressions are visible.

**Likely files:** none.

**Work:**

- Confirm the worktree state and note any pre-existing untracked or modified files.
- Run the current lint, typecheck, and build commands.
- Capture current desktop/mobile screenshots for `/blog` and `/blog/010-skills-router` if the implementation environment supports browser tooling.
- Record current console errors and warnings.

**Acceptance criteria:**

- Baseline command results are known.
- Pre-existing user changes are identified and preserved.
- Known current defects are documented before edits begin.

---

## 0.2 Create a verification script or checklist

**Goal:** Make the redesign repeatable to verify.

**Likely files:**

- `package.json`
- optional new script/test files
- optional CI config in a later phase

**Work:**

- Fix or replace the deprecated `next lint` script if required by the installed Next.js version.
- Add explicit scripts for typecheck and, when tests are added, unit/E2E checks.
- Keep scripts simple and conventional.

**Acceptance criteria:**

- `npm run lint` or its replacement runs intentionally.
- `npm run typecheck` or equivalent exists.
- Commands are documented in the final implementation report.

---

# Phase 1: Repair critical defects

Do not begin visual recomposition until these defects are fixed. Painting over them will make the redesign unreliable.

## 1.1 Remove the duplicate topic dialog

**Goal:** Ensure only one topic dialog can render and open.

**Likely files:**

- `src/components/blog-content.tsx`
- optionally a new/extracted topic dialog component

**Work:**

- Extract the topic dialog content into one reusable component or render it once.
- Let both the hero "topics" trigger and footer "Browse topics" trigger open the same dialog instance.
- Preserve keyboard/focus behavior.
- Keep the dialog visually quiet and functional.

**Acceptance criteria:**

- Opening either trigger creates one dialog and one overlay in the DOM.
- Escape closes the dialog and focus returns sensibly.
- No duplicated IDs, focus traps, or double backdrops.
- No Radix accessibility warnings.

---

## 1.2 Make dates deterministic

**Goal:** Remove timezone-sensitive rendering and hydration mismatches.

**Likely files:**

- `src/lib/posts.ts`
- `src/components/blog-content.tsx`
- `src/components/related-posts.tsx`
- `src/app/blog/[slug]/page.tsx`
- any RSS/sitemap consumers of dates

**Work:**

- Parse dates in one server-side utility.
- Treat existing local frontmatter dates as Asia/Manila unless Marc explicitly chooses another timezone.
- Add a preformatted display date to post metadata.
- Pass formatted date strings to client components instead of formatting with viewer locale.
- Preserve machine-readable ISO values for metadata/RSS/sitemap.

**Acceptance criteria:**

- Server and client render the same visible date.
- Late-night posts do not shift to the next day for readers.
- Hydration error #418 is gone.
- RSS and sitemap dates remain valid.

---

## 1.3 Return 404 for unknown posts

**Goal:** Unknown slugs must not crash the page or metadata generation.

**Likely files:**

- `src/lib/posts.ts`
- `src/app/blog/[slug]/page.tsx`
- `src/app/blog/[slug]/opengraph-image.tsx`
- optionally `src/app/blog/[slug]/not-found.tsx`

**Work:**

- Make `getPostSource` fail safely or catch failures at route boundaries.
- Call `notFound()` for missing slugs in page and metadata paths.
- Consider `dynamicParams = false` for fully static known content.
- Add a designed, editorial 404 state.

**Acceptance criteria:**

- `/blog/definitely-not-a-post` returns 404, not 500.
- The 404 page matches the publication voice and links back to the archive.
- No server exception is required for normal missing-content flow.

---

## 1.4 Fix accessibility names for search, dialogs, and icon buttons

**Goal:** Make current interactive furniture understandable to assistive technology.

**Likely files:**

- `src/components/search.tsx`
- `src/components/blog-content.tsx`
- `src/components/social-share.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/ui/dialog.tsx` only if needed

**Work:**

- Add an accessible title to the search dialog.
- Label the search input and mobile icon-only trigger.
- Label all share buttons, including icon-only mobile states.
- Label the clear-topic button.
- Avoid header layout shift from the theme toggle.

**Acceptance criteria:**

- Radix no longer warns about missing dialog titles.
- All icon-only controls have accessible names.
- Keyboard users can identify and operate every control.

---

## 1.5 Stop horizontal page overflow

**Goal:** Code and long URLs may scroll or wrap internally, but the page itself must not move sideways.

**Likely files:**

- `src/app/globals.css`
- `src/app/blog/[slug]/page.tsx`
- prose/MDX component styles if introduced

**Work:**

- Add safe wrapping for long prose links.
- Contain code overflow to code/figure containers.
- Re-check full-bleed mobile code behavior.
- Verify archive and article pages at narrow widths.

**Acceptance criteria:**

- `document.documentElement.scrollWidth` does not exceed the client width on tested pages.
- Long GitHub URLs wrap safely.
- Code blocks can scroll internally without creating body overflow.

---

## 1.6 Scope prose styles so they do not leak into UI components

**Goal:** Article typography styles article content only.

**Likely files:**

- `src/app/globals.css`
- `src/components/tag-list.tsx`
- `src/components/related-posts.tsx`
- `src/app/blog/[slug]/page.tsx`

**Work:**

- Ensure heading anchor links inherit heading color and do not show permanent prose underlines.
- Prevent tag links from inheriting prose-link styles.
- Prevent related-post lists/cards from inheriting prose bullets and link underlines.
- Use `not-prose` or more specific prose selectors where appropriate.

**Acceptance criteria:**

- Article headings no longer look like ordinary red links.
- Tags and related posts have consistent component styling.
- No stray disc bullets appear around related posts.
- Body links remain visibly links.

---

## 1.7 Reduce the font payload

**Goal:** Keep the editorial typography while removing unnecessary downloads.

**Likely files:**

- `src/app/layout.tsx`
- `src/fonts/`
- `src/app/globals.css`

**Work:**

- Identify the Helvetica Neue weights/styles actually used.
- Keep only the necessary files and declarations.
- Prefer WOFF2 if licensed/source files permit.
- Re-check light and dark typography after pruning.

**Acceptance criteria:**

- Only used font weights are declared and preloaded.
- Font preload warnings are removed.
- Visual typography remains recognizably the same.
- Build output shows a materially smaller font payload.

---

# Phase 2: Article experience first

The article is the product. Build the V3 reading experience before the homepage.

## 2.1 Create the article layout system

**Goal:** Separate loud article openings from controlled long-form reading.

**Likely files:**

- `src/app/blog/[slug]/page.tsx`
- `src/app/globals.css`
- new article components under `src/components/article/`

**Work:**

- Keep the title loud and intentionally staged.
- Add kicker slots for lane and format; populate them from the new content model in Phase 3.
- Create a controlled prose column around `65ch-72ch`.
- Keep code blocks inside the prose column with internal scrolling; allow only meaningful figures or diagrams to break wider intentionally.
- Tune heading rhythm for major sections.

**Acceptance criteria:**

- Title remains dramatic and is not accidentally orphaned.
- Body paragraphs no longer stretch across the desktop container.
- Code and figures remain usable.
- Mobile layout remains safe and readable.

---

## 2.2 Add table of contents for long essays

**Goal:** Help readers enter, scan, and resume long articles.

**Likely files:**

- `src/app/blog/[slug]/page.tsx`
- new TOC utilities/components
- `src/app/globals.css`

**Work:**

- Extract `h2` and relevant `h3` headings from MDX content.
- Render a quiet desktop rail for long posts.
- Render a mobile "In this essay" disclosure.
- Track active section without heavy observers or layout thrash.
- Keep the TOC keyboard accessible.

**Acceptance criteria:**

- Posts above the long-post threshold show a usable TOC.
- Short posts are not cluttered.
- Mobile TOC does not compete with the article.
- Active section state is visible and not color-only.

---

## 2.3 Redesign the permanently fixed share bar

**Goal:** Preserve the fixed bar while making it feel like publication apparatus.

**Likely files:**

- `src/components/social-share.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/globals.css`

**Work:**

- Keep the bar fixed at the bottom of article pages.
- Make it slimmer and more editorial.
- Add safe-area padding for mobile.
- Add accessible names and visible copied feedback.
- Ensure article bottom spacing prevents the bar from covering the ending.
- Reduce hover color clutter.

**Acceptance criteria:**

- Bar remains permanently visible on article pages.
- It does not obscure `~ FIN ~`, author block, related posts, or footer content.
- All controls are named and keyboard accessible.
- Mobile controls are comfortable touch targets.

---

## 2.4 Add the article ending path

**Goal:** Turn the end of an essay into an intentional next move.

**Likely files:**

- `src/app/blog/[slug]/page.tsx`
- `src/lib/posts.ts`
- new author/next-post components

**Work:**

- Keep `~ FIN ~`.
- Add a short author block with a link to About.
- Add previous/next navigation or a curated "Next round."
- Redesign related posts as restrained, text-forward recommendations.

**Acceptance criteria:**

- The reader has a clear next step after finishing.
- Related posts do not inherit prose bullets/link styles.
- The author block is short and does not become a résumé card.

---

# Phase 3: Content model and taxonomy

This phase formalizes the metadata introduced visually in Phase 2. Implement the metadata model before building the homepage, lane filters, archive labels, and richer search index.

## 3.1 Add validated post metadata

**Goal:** Make the editorial model explicit and machine-checked.

**Likely files:**

- `src/lib/posts.ts`
- `content/posts/*.mdx`
- package/test config as needed

**Work:**

- Add `lane`, `format`, `topics`, `featured`, `draft`, and optional `updated`.
- Migrate existing posts to the new model.
- Keep `tags` as a compatibility alias only if useful during migration.
- Validate metadata at build or through a dedicated check.
- Fail loudly for invalid data.

**Acceptance criteria:**

- Every post has one lane, one format, and curated topics.
- Draft posts do not appear in production collections.
- Unknown topics fail validation.
- Existing URLs remain stable unless redirects are intentionally added.

---

## 3.2 Consolidate topics into curated collections

**Goal:** Replace keyword noise with useful reader paths.

**Likely files:**

- `content/posts/*.mdx`
- `src/lib/posts.ts`
- `src/app/blog/tag/[tag]/page.tsx`

**Work:**

- Map the current 42 tags into the curated topic list.
- Preserve useful collections such as `ai`, `engineering`, `tools`, `hiring`, `leadership`, `relationships`, `creativity`, `boxing`, `acting`, and `film`.
- Remove or consolidate one-off topic labels.
- Give topic pages a small editorial introduction where practical.

**Acceptance criteria:**

- Topic count drops to a manageable curated set.
- No topic page exists for an accidental one-off keyword unless intentionally curated.
- Topic links remain canonical and lowercased.
- Related posts still work after migration.

---

## 3.3 Add content validation tests

**Goal:** Prevent metadata and taxonomy regressions.

**Likely files:**

- new test files
- `package.json`
- test framework config if added

**Work:**

- Add unit tests for post parsing, date handling, lane/format validation, topic normalization, and draft filtering.
- Add tests for RSS/sitemap consumers where practical.

**Acceptance criteria:**

- Invalid frontmatter fails tests.
- Date parsing behavior is locked.
- Topic normalization behavior is locked.
- Tests run locally with a simple command.

---

# Phase 4: Front door and About

## 4.1 Build the V3 homepage

**Goal:** Make `/` the publication front door.

**Likely files:**

- `src/app/page.tsx`
- homepage components
- `src/lib/posts.ts`
- `src/app/globals.css`

**Work:**

- Replace the redirect with a real homepage.
- Build the Opening Bell hero with intentional line breaks.
- Add a clear positioning sentence and short intro.
- Feature one Current Bout essay.
- Add Start Here with three curated posts.
- Add the three lanes.
- Add Recent Rounds.
- Add RSS/email return path.

**Acceptance criteria:**

- A first-time visitor can identify Marc, the three lanes, and a first post in one viewport or one short scroll.
- The design is not a generic centered SaaS hero.
- Mobile order follows the design handoff.
- No equal-weight feature-card grid.

---

## 4.2 Build the About page

**Goal:** Explain Marc as a coherent whole without flattening the persona.

**Likely files:**

- `src/app/about/page.tsx`
- optional about components
- navigation/footer links

**Work:**

- Write and lay out a concise editorial About page.
- Cover what Marc builds, believes, has failed at, and why the lanes belong together.
- Link to Start Here posts and external profiles.
- Add appropriate metadata and structured data.

**Acceptance criteria:**

- About is linked from header/footer and author block.
- It reads like a person, not a résumé.
- Metadata and social preview are present.

---

# Phase 5: Archive, filtering, and search

## 5.1 Rebuild the archive as a fight record

**Goal:** Make `/blog` feel like a complete publication archive.

**Likely files:**

- `src/app/blog/page.tsx`
- `src/components/blog-content.tsx`
- new archive components
- `src/app/globals.css`

**Work:**

- Add lane and format labels to each entry.
- Preserve oversized sequence numerals but make them decorative and non-colliding.
- Use title and thesis as the primary hierarchy.
- Show curated topics quietly.
- Add lane filters as the primary navigation.

**Acceptance criteria:**

- Archive entries are scannable and editorial.
- Numerals do not collide on mobile and are hidden from assistive technology.
- Lane filters work and are visible.

---

## 5.2 Make filters URL-backed

**Goal:** Make archive states shareable and back-button friendly.

**Likely files:**

- archive/filter components
- `src/app/blog/page.tsx` or search-param consumers

**Work:**

- Reflect selected lane/topic in URL search params.
- Restore filter state from the URL.
- Preserve browser history behavior.
- Keep clear-filter controls visible.

**Acceptance criteria:**

- A filtered archive URL can be shared and reopened.
- Back/forward navigation restores filter state.
- Empty states explain what happened and how to clear filters.

---

## 5.3 Upgrade search into a publication index

**Goal:** Search should help readers find essays by idea and lane, not just title text.

**Likely files:**

- `src/components/search.tsx`
- `src/app/api/posts-index/route.ts`
- search index types

**Work:**

- Include lane, format, description, date, and reading time in results using the Phase 3 content model.
- Lazy-load Fuse.js.
- Keep keyboard navigation.
- Improve empty/error states.

**Acceptance criteria:**

- Fuse.js is not in the initial page bundle for every visitor.
- Results show useful editorial context.
- Search remains keyboard accessible.
- Failed index loading has a retry path.

---

# Phase 6: Metadata, RSS, and distribution

## 6.1 Strengthen metadata foundations

**Goal:** Make the publication easier to index, share, and attribute.

**Likely files:**

- `src/app/layout.tsx`
- page-level metadata files
- new `src/lib/site.ts`
- `src/components/json-ld.tsx`

**Work:**

- Add `metadataBase` and centralize site constants.
- Add canonical URLs.
- Add RSS autodiscovery.
- Add consistent `og:site_name`, locale, and social metadata.
- Harden JSON-LD escaping.
- Add site/person schema where appropriate.

**Acceptance criteria:**

- Pages have canonical metadata.
- RSS is discoverable from the document head.
- Structured data is valid and does not use a fake publisher logo.
- No duplicated hand-rolled site URL constants remain.

---

## 6.2 Enrich RSS

**Goal:** Make the feed useful to real readers and distribution systems.

**Likely files:**

- `src/app/rss.xml/route.ts`
- post compilation utilities

**Work:**

- Add full content when practical.
- Add categories from lane/topics.
- Add feed self-link and last build date.
- Keep XML escaping robust.

**Acceptance criteria:**

- RSS validates.
- Every published post appears with correct absolute URLs and dates.
- Feed readers receive useful content or a deliberate summary strategy.

---

# Phase 7: Test and harden

## 7.1 Add critical unit tests

**Goal:** Lock the content and distribution behavior.

**Likely files:**

- test files near `src/lib`
- test config/package scripts

**Work:**

- Test date parsing/formatting.
- Test post metadata validation.
- Test tag/topic normalization.
- Test related-post selection.
- Test RSS and sitemap data generation where practical.

**Acceptance criteria:**

- Unit tests cover the content model and known previous defects.
- Tests fail when frontmatter or date handling regresses.

---

## 7.2 Add browser smoke tests

**Goal:** Lock the critical reader paths.

**Likely files:**

- Playwright config/specs
- package scripts
- optional CI workflow

**Work:**

- Test homepage, archive, article, topic page, About, and 404.
- Test search dialog accessibility basics.
- Test filter URL state.
- Test no horizontal overflow on article pages.
- Test absence of hydration errors.

**Acceptance criteria:**

- Smoke tests run locally with one command.
- Critical paths are covered.
- Failures identify the broken page and behavior.

---

## 7.3 Add CI

**Goal:** Prevent regressions from shipping silently.

**Likely files:**

- `.github/workflows/`
- `package.json`

**Work:**

- Run install, lint, typecheck, unit tests, build, and browser smoke tests where practical.
- Keep CI fast and deterministic.

**Acceptance criteria:**

- CI runs on pull requests/pushes.
- Build and checks pass from a clean checkout.
- Failure output is actionable.

---

# Phase 8: Final design and accessibility pass

## 8.1 Visual QA pass

**Goal:** Confirm the site is not just functional but visually coherent.

**Likely files:** any visual files requiring polish.

**Work:**

- Compare homepage, archive, article, About, topic page, and 404 across mobile/tablet/desktop.
- Inspect dark and light themes.
- Tune spacing, line breaks, hierarchy, and share bar placement.
- Remove accidental generic component defaults.

**Acceptance criteria:**

- The title remains loud and intentional.
- The prose remains controlled and readable.
- The fixed share bar feels designed and never covers the ending.
- Red is scarce and meaningful.
- No generic SaaS rhythm has crept back in.

---

## 8.2 Accessibility QA pass

**Goal:** Verify the expressive design remains usable.

**Likely files:** any interaction/accessibility files requiring polish.

**Work:**

- Keyboard-navigate header, filters, dialogs, search, TOC, share bar, and footer.
- Inspect accessible names and dialog behavior.
- Check contrast in both themes.
- Check reduced-motion behavior.
- Confirm skip-to-content works.

**Acceptance criteria:**

- All interactive controls are named and keyboard reachable.
- Dialog behavior is correct.
- Important text meets contrast expectations.
- Reduced motion does not break state comprehension.

---

## 8.3 Final cleanup and delivery

**Goal:** Leave the repository clean and report the result clearly.

**Likely files:** any temporary files created during implementation.

**Work:**

- Remove screenshots, logs, temporary scripts, and debug output not intended as deliverables.
- Preserve pre-existing user changes.
- Re-run final checks.
- Inspect the final diff and `git status`.
- Summarize changed files, validation, cleanup, and remaining risks.

**Acceptance criteria:**

- No temporary artifacts remain unless intentionally committed.
- Final checks pass.
- The final report explains what changed, how it was verified, and what follow-up remains.
