# V3 Design Handoff

> Implementation-ready design direction for the next version of marcuyyy.com.
>
> Read [`../.plan/README.md`](../.plan/README.md) for the strategic rationale. Use [`TASKLIST.md`](./TASKLIST.md) to execute the work in phases.

## 1. Creative brief

### Product

A personal MDX publication for essays and guides about AI systems, engineering, team building, entrepreneurship, relationships, creativity, boxing, acting, and film.

### Audience

- technical founders and senior builders who care about systems and governance
- operators who recognize expensive hiring and leadership mistakes
- returning personal readers interested in Marc's life outside software
- first-time visitors arriving from social links, search, GitHub, or shared posts

### Reader jobs

- understand who Marc is and what the publication covers
- choose a first post quickly
- read long essays comfortably on desktop and mobile
- navigate long essays by section
- move from one finished essay to another relevant essay
- share a post without fighting the interface
- subscribe or return later

### Feeling

Confident, editorial, controlled, personal, and slightly confrontational.

The site should feel like a publication by someone who has taken hits and formed opinions, not a template made to look "premium."

### Direction mode

**Break, then preserve.**

Break the current page structure, content model, archive behavior, and reading ergonomics. Preserve the existing personality: black canvas, white type, crimson accent, Playfair display type, huge titles, fixed share bar, dry humor, and `~ FIN ~`.

## 2. Design thesis

> **A black-canvas editorial fight journal: loud when Marc makes a claim, controlled when the reader needs to think.**

The design metaphor is a boxing program card crossed with an essay collection:

- title = opening bell
- article = round
- major sections = rounds
- tags/topics = corner team
- table of contents = referee
- archive = fight record
- `~ FIN ~` = final bell
- fixed share bar = the corner crew handing the result to the crowd

This metaphor guides hierarchy and tone. Do not turn it into novelty boxing clip art.

## 3. Visual stance

| Axis     | Direction                                                                                  |
| -------- | ------------------------------------------------------------------------------------------ |
| Density  | Balanced editorial; spacious openings, controlled reading, compact metadata                |
| Mood     | Bold, dry, personal, technical, confrontational but not chaotic                            |
| Geometry | Sharp editorial grid, minimal radius, fine borders, occasional intentional asymmetry       |
| Color    | Near-monochrome black/white with one scarce crimson accent                                 |
| Type     | Expressive serif for claims, readable sans for body, restrained mono for metadata          |
| Surface  | Flat surfaces, dividers and rhythm over cards and shadows                                  |
| Imagery  | Mostly none; meaningful diagrams, personal artifacts, or rare editorial illustrations only |
| Motion   | Functional only: dialog, disclosure, theme, copied state, current-section feedback         |

## 4. Brand constants

These are fixed. Do not remove them during implementation.

- The publication name/headline remains "Thoughts of a Mastermind in Pajamas."
- The article title remains intentionally loud.
- The share bar remains permanently fixed to the bottom on article pages.
- `~ FIN ~` remains the article sign-off.
- The red accent remains crimson.
- Playfair Display remains the primary display voice.
- The footer may remain dry and self-deprecating, but remove implementation-note copy such as "Theme toggle, shiki highlighting...".

## 5. Typography system

### Type roles

#### Display

Use Playfair Display for:

- homepage hero
- article titles
- major section titles
- lane names when used editorially
- pull quotes only when the quote deserves display treatment

Display type should be bold, high-contrast, and intentionally staged.

#### Body

Use the existing sans direction, but reduce the font payload.

Body priorities:

- 17-20px effective size
- approximately 1.65-1.8 line-height
- 65-75 characters per line for prose
- strong contrast in both themes

#### Metadata mono

Use a restrained mono for:

- dates
- reading time
- lane labels
- format labels
- archive sequence numbers
- table of contents labels
- `ROUND 03`-style markers when used

Mono is a seasoning, not the main voice.

### Type rules

- Loud display, controlled body.
- Never let long titles break into accidental orphans such as a standalone `a`.
- Use intentional manual line-break opportunities for hero and major titles.
- Article headings should look like claims, not ordinary red links.
- Body links are crimson and underlined; heading anchor links inherit heading color and reveal a quiet `#` on hover/focus.

## 6. Color system

Use semantic roles, not ad-hoc color values.

### Dark theme

- background: near-black
- foreground: warm off-white
- accent: crimson
- accent foreground: white
- muted: readable secondary gray
- border: low-contrast charcoal
- elevated surface: subtly lighter than background
- success/warning/error: retained as functional states, not editorial decoration

### Light theme

Light mode should feel like the printed fight journal, not a generic white website.

- background: warm paper white
- foreground: near-black
- accent: deeper crimson
- muted: readable warm gray
- border: warm light gray
- elevated surface: paper with a fine border

### Accent discipline

Use crimson for:

- primary text links
- active filter/current state
- the word "Mastermind" in the hero
- rare editorial emphasis
- focus-visible ring
- copy/share feedback where appropriate

Do not use crimson for every heading, tag, border, icon, and metadata item. Scarcity gives it force.

## 7. Surface and shape

- Prefer flat sections, fine borders, and typographic rhythm.
- Use cards sparingly and only when content genuinely needs containment.
- Keep radius small. The design is editorial and sharp, not soft SaaS.
- Avoid heavy shadows.
- Use one strong rule/border to establish article and archive boundaries.
- Code blocks may use slightly elevated surfaces and horizontal scrolling, contained inside the block.

## 8. Imagery and illustration

Do not invent a cover-image requirement.

Use imagery only when it adds information or personal texture:

- systems diagrams for technical essays
- comparison tables for model/tool essays
- meaningful personal photos or artifacts for life essays
- occasional custom editorial illustrations for major pieces

Avoid:

- stock photography
- generic AI hero images
- decorative image cards on every archive row
- repeated illustrations that make every post look the same

## 9. Layout system

### Global shell

- sticky, minimal header
- max-width publication container around 1100-1180px
- consistent horizontal padding
- footer with personality and useful links
- skip-to-content link

Header contents:

- wordmark
- About
- Archive
- Search
- theme toggle

The header should stay quiet. The pages carry the drama.

### Homepage

The homepage is the front door. It no longer redirects.

Desktop rhythm:

1. **Opening Bell**: large staged headline, direct positioning line, short intro
2. **Current Bout**: one featured essay with dominant scale
3. **Start Here**: three curated posts
4. **Three Lanes**: Systems, Operators, Life
5. **Recent Rounds**: compact recent list
6. **Stay for the Next Round**: RSS/email return path

Mobile priority:

1. Opening Bell
2. Current Bout
3. Start Here
4. Three Lanes
5. Recent Rounds
6. Stay for the Next Round

The first viewport should communicate persona, subject matter, and a clear next read. It should not be a centered hero plus generic cards.

### Archive

The archive is a fight record and table of contents.

Each entry should show:

- sequence number
- lane
- format
- date
- reading time
- title
- thesis/description
- curated topics

Filtering:

- primary lane filters: All, Systems, Operators, Life
- secondary curated topics
- search entry point
- URL-backed selected state

Sequence numerals remain large, but they are decorative and must be `aria-hidden`.

### Article

The article page has two scales:

- wide/loud opening apparatus
- controlled prose reading column

Required order:

1. back to archive
2. kicker: lane + format
3. loud title with intentional line breaks
4. date, reading time, curated topics
5. optional short-version/thesis block
6. optional header image or diagram
7. table of contents for long articles
8. prose
9. `~ FIN ~`
10. author block
11. next/previous navigation
12. related essays
13. permanently fixed share bar

Prose column:

- approximately `65ch-72ch`
- code blocks stay inside the prose column and scroll internally; only meaningful figures or diagrams may break wider
- no full-width ordinary paragraphs on desktop

Long-article support:

- desktop: quiet table-of-contents rail outside the prose column
- mobile: collapsed "In this essay" disclosure near the top
- active section state is subtle but visible

### About

About should be an editorial page, not a résumé.

Recommended sequence:

1. strong opening claim about Marc
2. short identity paragraph
3. what he builds
4. what he believes
5. what he has failed at
6. why the three lanes belong together
7. where to start reading
8. external links

Use restrained personal imagery only if it genuinely helps.

## 10. Component intent

Use the existing component system where possible. Redesign through composition, tokens, and variants before adding new primitives.

### Header

Quiet, sharp, functional. No marketing nav clutter.

### Hero

Not a reusable SaaS hero. The homepage hero is a specific editorial composition with staged line breaks and a short positioning statement.

### Lane navigation

Lanes are editorial pathways, not product feature cards. They may use fine dividers and typographic hierarchy instead of boxes.

### Post lists

Post rows should prioritize title and thesis. Do not make every post a card with equal visual weight.

### Table of contents

A quiet text navigation component.

- desktop rail for long essays
- mobile disclosure
- active item tracking
- keyboard accessible
- no sticky boxed sidebar that competes with prose

### Share bar

The share bar stays fixed at the bottom on article pages.

Redesign it as publication apparatus:

- slim but touch-friendly
- editorial label on larger screens
- X, LinkedIn, Copy Link by default
- Facebook optional; include only if Marc wants it
- accessible names for all buttons
- visible copied feedback
- safe-area padding on mobile
- enough bottom spacing on the article so the bar never hides the ending
- no bright brand-color hover circus

### Tags/topics

Tags are quiet links to curated collections. They should not inherit prose-link underlines or look like primary actions.

### Related posts

Use text-forward rows or restrained panels. No stray bullets. No prose-link leakage. Related posts should feel like recommendations, not template cards.

### Search

Search is a publication index.

Results should show:

- title
- thesis/description
- lane
- date
- reading time

Requirements:

- accessible dialog title
- labeled input
- keyboard navigation
- lazy-loaded search dependency
- useful empty state

## 11. Interaction and state model

### Filter state

- Active lane/topic is visible.
- Clear filter is always available.
- Filter state is reflected in the URL.
- Browser back returns to the previous filter state.
- Empty results explain whether the topic is empty or the filter is too narrow.

### Dialog state

- Only one topic dialog exists and opens at a time.
- Escape closes.
- Focus returns to the trigger.
- Dialog title is accessible.
- No stacked duplicate overlays.

### Search state

- Closed by default.
- Opens from header and keyboard shortcut.
- Shows loading state only while the index loads.
- Empty state explains how to search.
- Results are navigable by keyboard.
- Selection navigates and closes the dialog.

### Share state

- Copy Link changes to a clear copied state.
- Failure state explains that copying failed and offers the URL.
- Share buttons have accessible labels even when text labels hide on mobile.

### Theme state

- Toggle is labeled.
- No header layout shift before hydration.
- Respect stored preference and system preference.
- Motion is minimal and respects reduced motion.

### Error state

- Unknown post slug returns a designed 404.
- Invalid frontmatter fails the build or validation command.
- Search index failure gives a retry path.
- Broken content links should be caught by checks.

## 12. Responsive behavior

### Desktop (>=1024px)

- Hero uses strong asymmetry.
- Archive sequence numbers sit outside or beside the entry column.
- Article title can span wide.
- Prose is constrained.
- Table of contents can use a quiet rail.
- Share bar shows editorial label and text controls.

### Tablet (768-1023px)

- Hero remains staged but less wide.
- Archive numbers reduce in scale.
- Article opening remains dramatic.
- Table of contents may collapse or move above content.

### Mobile (<768px)

- Hero line breaks are intentional and compact.
- Archive numbers must not collide with titles.
- Prose fills the readable content width without page overflow.
- Table of contents becomes a disclosure.
- Share bar is slim, safe-area aware, and icon-first with accessible labels.
- Code blocks scroll internally without moving the page.
- Touch targets are at least 44px where feasible.

## 13. Accessibility requirements

- Add skip-to-content.
- Every icon-only button has an accessible name.
- Search dialog has a title and labeled input.
- Topic dialog appears once and has a title.
- Decorative sequence numbers are `aria-hidden`.
- Focus is visible and aesthetically integrated.
- Crimson has sufficient contrast in both themes; adjust the token rather than abandoning the color.
- Do not rely on color alone for active filter/current section state.
- Long URLs wrap.
- Code overflow is contained.
- Reduced-motion users receive instant or near-instant state changes.
- Dialog focus management follows Radix expectations.
- 404 page is readable and offers a path back to the archive.

## 14. Performance requirements

- Keep static generation for content pages.
- Reduce local font files to only used weights/styles.
- Prefer WOFF2 where licensing and source files allow.
- Lazy-load Fuse.js/search code.
- Do not hydrate the entire article body.
- Keep table-of-contents active tracking lightweight.
- Optimize any raster images and use appropriate dimensions.
- Avoid unnecessary third-party scripts.
- Preserve Matomo, but keep configuration deliberate.

## 15. Technical and content requirements

### Content model

Implement validated frontmatter with:

- `title`
- `date` as explicit ISO with timezone
- `description`
- `lane`
- `format`
- `topics`
- `featured`
- `draft`
- optional `updated`
- optional `headerImage`

### Deterministic dates

- Parse dates in one server-side utility.
- Treat existing dates as Asia/Manila unless Marc decides otherwise.
- Format display strings once on the server.
- Pass display strings to client components.
- Never format the same date independently on server and client.

### Metadata

- Set `metadataBase`.
- Add canonical URLs.
- Add RSS autodiscovery.
- Keep per-post OG images.
- Add site/person structured data.
- Include lane/topics in article structured data where appropriate.
- Add `updated` only when it is real.

### RSS

- Include full content if practical.
- Add categories from lane/topics.
- Add feed self-link and last build date.
- Keep XML escaping robust.

### Validation

Build or validation must fail for:

- missing title/date/description/lane/format
- invalid date
- unknown topic
- duplicate/normalized topic conflicts
- draft content in production
- missing required image files

## 16. Copy direction

### Homepage positioning line options

Pick one and tune in implementation:

1. `Systems, scars, and selfhood: written from the corner, not the commentary booth.`
2. `Essays on governed AI, building teams, and the lessons that only become clear after the bell.`
3. `A personal publication about systems, operator mistakes, and the other fights that shape a person.`

Recommended default: option 1 for identity, followed by option 2 as a clearer supporting sentence.

### Lane copy

- **Systems**: Models do not govern themselves.
- **Operators**: Bad decisions usually look reasonable at first.
- **Life**: The other fights count too.

### Return-path copy

> New essays when there is something worth saying. No content treadmill.

### Author block copy

> Marc Uy Dagatan writes about AI systems, building teams, and lessons usually learned the expensive way.

Tune this to Marc's preferred biography, but keep it short.

## 17. Anti-slop guardrails

The implementation must not reintroduce generic patterns.

### Do not ship

- centered hero + subheadline + two CTA buttons as the whole homepage
- equal-weight feature cards for the three lanes
- glassmorphism
- blue-purple gradients
- decorative Lucide icons on every section
- low-contrast gray text for important content
- generic rounded-card post grid
- scroll fade-up choreography
- fake terminal/CLI decoration
- stock imagery
- AI-generated illustrations without a consistent art direction
- sticky boxed table of contents that competes with the essay
- more red everywhere as a substitute for hierarchy

### Required specificity checks

Before calling the design done, ask:

- Could this belong to any developer newsletter? If yes, revise.
- Is the title still loud and intentional? If not, revise.
- Is the fixed share bar useful and accessible? If not, revise.
- Does the first homepage screen explain Marc and the next read? If not, revise.
- Does the mobile article page avoid horizontal overflow? If not, revise.
- Does red still mean something? If not, revise.

## 18. Implementation skills to load

The implementation LLM should inspect the repository and load the relevant project/stack skills itself. Recommended routing:

- Next.js App Router behavior, metadata, RSC: `nextjs`
- React component behavior: `react`
- Tailwind/shadcn implementation: `shadcnui-tailwind`
- behavior changes and regression checks: `testing`
- content/frontmatter changes: project-local `content-authoring`
- visual verification: use browser screenshots and accessibility snapshots

## 19. Verification standard

Every phase must verify both behavior and visual quality.

### Commands

Use the smallest relevant checks first, then broaden:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- targeted tests when added
- full test suite before final delivery

The current `lint` script may need updating for the installed Next.js version.

### Browser verification

At minimum inspect:

- `/`
- `/blog`
- `/blog/010-skills-router`
- one guide post with code
- one short personal post
- one topic page
- `/about`
- 404 page

Viewports:

- 390x844 mobile
- 768x1024 tablet
- 1440x900 desktop

Themes:

- dark
- light

### Console gates

No new:

- hydration errors
- accessibility warnings from Radix
- font preload warnings
- failed requests
- unexpected client errors

### Layout gates

- no horizontal page overflow
- share bar never covers the final content
- headings do not look like ordinary links
- archive numerals do not collide with titles
- prose remains within the intended reading measure
- table of contents does not compete with prose

## 20. Definition of done

V3 is done only when:

- the homepage works as a front door
- the archive communicates lanes and curated topics
- article pages are loud, readable, navigable, and mobile-safe
- the fixed share bar is intentionally designed and accessible
- the content model is validated
- dates and hydration are deterministic
- 404 behavior is correct
- RSS/canonical/metadata are strengthened
- tests and browser verification pass
- the result still feels unmistakably like Marc
