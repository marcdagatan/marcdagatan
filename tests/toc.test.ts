import { describe, expect, it } from "vitest";
import {
  composeTableOfContents,
  extractTableOfContents,
  TOC_H2_DIET_THRESHOLD,
  TOC_MIN_HEADINGS,
} from "@/lib/toc";

describe("extractTableOfContents", () => {
  it("extracts h2 and h3 headings in document order", () => {
    const source = [
      "Intro paragraph.",
      "",
      "## First Section",
      "",
      "Body text.",
      "",
      "### Sub Section",
      "",
      "## Second Section",
    ].join("\n");

    expect(extractTableOfContents(source)).toEqual([
      { id: "first-section", text: "First Section", level: 2 },
      { id: "sub-section", text: "Sub Section", level: 3 },
      { id: "second-section", text: "Second Section", level: 2 },
    ]);
  });

  it("strips markdown formatting from heading text", () => {
    const source = [
      "## **Why I'm Here**",
      "",
      "### The `skills` router",
      "",
      "## [A Link Heading](https://example.com)",
    ].join("\n");

    expect(extractTableOfContents(source)).toEqual([
      { id: "why-im-here", text: "Why I'm Here", level: 2 },
      { id: "the-skills-router", text: "The skills router", level: 3 },
      { id: "a-link-heading", text: "A Link Heading", level: 2 },
    ]);
  });

  it("matches github-slugger behavior for punctuation-heavy headings", () => {
    const source = "## Context Entropy (And Why It Gets Worse Over Time)";

    expect(extractTableOfContents(source)[0]?.id).toBe(
      "context-entropy-and-why-it-gets-worse-over-time"
    );
  });

  it("deduplicates repeated headings like rehype-slug", () => {
    const source = ["## The Cost", "", "### The Cost"].join("\n");

    const items = extractTableOfContents(source);
    expect(items.map((item) => item.id)).toEqual(["the-cost", "the-cost-1"]);
  });

  it("skips headings inside fenced code blocks", () => {
    const source = [
      "## Real Section",
      "",
      "```ts",
      "## Not a heading",
      "```",
      "",
      "## Another Section",
    ].join("\n");

    const items = extractTableOfContents(source);
    expect(items.map((item) => item.text)).toEqual([
      "Real Section",
      "Another Section",
    ]);
  });

  it("ignores h1 and h4 headings", () => {
    const source = [
      "# Title Only",
      "",
      "## Kept Section",
      "",
      "#### Too Deep",
    ].join("\n");

    expect(extractTableOfContents(source)).toEqual([
      { id: "kept-section", text: "Kept Section", level: 2 },
    ]);
  });

  it("returns an empty list for content without headings", () => {
    expect(extractTableOfContents("Just prose.\n\nMore prose.")).toEqual([]);
  });

  it("matches ids on real long-essay source (skills router style)", () => {
    const source = [
      "## The Real Problem: AI Coding Is a Governance Problem",
      "",
      "### Context Entropy (And Why It Gets Worse Over Time)",
      "",
      "### Skill Bleed",
    ].join("\n");

    const items = extractTableOfContents(source);
    expect(items[0]?.id).toBe("the-real-problem-ai-coding-is-a-governance-problem");
    expect(items[1]?.id).toBe("context-entropy-and-why-it-gets-worse-over-time");
    expect(items[2]?.id).toBe("skill-bleed");
  });

  it("exports a sensible long-post threshold", () => {
    expect(TOC_MIN_HEADINGS).toBeGreaterThan(1);
  });
});

describe("composeTableOfContents", () => {
  function sourceWith(headingLines: string[]): string {
    const blocks: string[] = [];
    for (const line of headingLines) {
      blocks.push(line, "Body text.");
    }
    return blocks.join("\n\n");
  }

  function h2s(count: number): string[] {
    return Array.from({ length: count }, (_, i) => `## Section ${i + 1}`);
  }

  it("keeps h3 sections when a post has 8 or fewer h2 headings", () => {
    const toc = composeTableOfContents(
      extractTableOfContents(
        sourceWith([...h2s(7), "### Sub Section", "## Final Section"])
      )
    );

    expect(toc.some((item) => item.level === 3)).toBe(true);
  });

  it("drops h3 sections when a post has more than 8 h2 headings", () => {
    const toc = composeTableOfContents(
      extractTableOfContents(
        sourceWith([...h2s(9), "### Sub Section", "## Final Section"])
      )
    );

    expect(toc.length).toBeGreaterThan(0);
    expect(toc.every((item) => item.level === 2)).toBe(true);
  });

  it("keeps every h2, including closing sections, when h3 sections are dropped", () => {
    const headings = [...h2s(9), "## References", "## Closing Stance"];
    const toc = composeTableOfContents(extractTableOfContents(sourceWith(headings)));

    expect(toc.map((item) => item.text)).toEqual([
      "Section 1",
      "Section 2",
      "Section 3",
      "Section 4",
      "Section 5",
      "Section 6",
      "Section 7",
      "Section 8",
      "Section 9",
      "References",
      "Closing Stance",
    ]);
  });

  it("keeps h3 sections at the exact threshold boundary", () => {
    const toc = composeTableOfContents(
      extractTableOfContents(sourceWith([...h2s(TOC_H2_DIET_THRESHOLD), "### Sub"]))
    );

    expect(toc.some((item) => item.level === 3)).toBe(true);
  });

  it("leaves empty extractions empty", () => {
    expect(composeTableOfContents([])).toEqual([]);
  });
});
