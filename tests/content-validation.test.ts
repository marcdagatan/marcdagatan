import { describe, expect, it } from "vitest";
import {
  validatePostFrontmatter,
  PostValidationError,
  type ValidatedFrontmatter,
} from "@/lib/content-validation";

const validFrontmatter = {
  title: "The Skills Router: Governing AI Coding Instead of Hoping It Behaves",
  date: "2026-02-18T13:45:00+08:00",
  description:
    "Why bigger models aren't the answer, and how a deterministic Skills Router architecture turns AI coding from probabilistic guessing into governed execution.",
  lane: "systems",
  format: "essay",
  topics: ["ai", "governance", "engineering"],
  featured: true,
  draft: false,
};

describe("validatePostFrontmatter", () => {
  it("accepts the canonical plan frontmatter", () => {
    const result = validatePostFrontmatter("010-skills-router", validFrontmatter);
    expect(result.title).toBe(validFrontmatter.title);
    expect(result.lane).toBe("systems");
    expect(result.format).toBe("essay");
    expect(result.topics).toEqual(["ai", "governance", "engineering"]);
    expect(result.featured).toBe(true);
    expect(result.draft).toBe(false);
    expect(result.dateISO).toBe("2026-02-18T13:45:00+08:00");
    expect(result.displayDate).toBe("February 18, 2026");
    expect(result.timestamp).toBe(Date.parse("2026-02-18T05:45:00.000Z"));
  });

  it("applies safe defaults for featured and draft", () => {
    const { featured, draft } = validatePostFrontmatter("x", {
      ...validFrontmatter,
      featured: undefined,
      draft: undefined,
    });
    expect(featured).toBe(false);
    expect(draft).toBe(false);
  });

  it("normalizes topics to lowercase", () => {
    const result = validatePostFrontmatter("x", {
      ...validFrontmatter,
      topics: ["AI", " Film "],
    });
    expect(result.topics).toEqual(["ai", "film"]);
  });

  it("fails on missing title", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, title: "" })
    ).toThrow(PostValidationError);
  });

  it("fails on missing description", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, description: undefined })
    ).toThrow(/description/);
  });

  it("fails on invalid date", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, date: "tomorrow-ish" })
    ).toThrow(/date/);
  });

  it("fails on unknown lane", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, lane: "personal" })
    ).toThrow(/lane/);
  });

  it("fails on unknown format", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, format: "tutorial" })
    ).toThrow(/format/);
  });

  it("fails on unknown topic", () => {
    expect(() =>
      validatePostFrontmatter("x", {
        ...validFrontmatter,
        topics: ["ai", "system-design"],
      })
    ).toThrow(/system-design/);
  });

  it("fails on empty topics", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, topics: [] })
    ).toThrow(/topics/);
  });

  it("fails when two topics normalize to the same curated topic", () => {
    expect(() =>
      validatePostFrontmatter("x", {
        ...validFrontmatter,
        topics: ["ai", " AI "],
      })
    ).toThrow(/duplicate topic/);
  });

  it("fails when draft is not a boolean", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, draft: "true" })
    ).toThrow(/draft/);
  });

  it("reports the offending slug in the error", () => {
    try {
      validatePostFrontmatter("007-openrouter-integration-on-cursor", {
        ...validFrontmatter,
        title: "",
      });
      throw new Error("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(PostValidationError);
      if (error instanceof PostValidationError) {
        expect(error.slug).toBe("007-openrouter-integration-on-cursor");
      }
    }
  });

  it("accepts a valid updated date", () => {
    const result = validatePostFrontmatter("x", {
      ...validFrontmatter,
      updated: "2026-03-01T10:00:00+08:00",
    });
    expect(result.updated?.dateISO).toBe("2026-03-01T10:00:00+08:00");
    expect(result.updated?.displayDate).toBe("March 1, 2026");
  });

  it("rejects an invalid updated date", () => {
    expect(() =>
      validatePostFrontmatter("x", { ...validFrontmatter, updated: "later" })
    ).toThrow(/updated/);
  });
});

describe("ValidatedFrontmatter shape", () => {
  it("exposes server-formatted display dates only", () => {
    const result: ValidatedFrontmatter = validatePostFrontmatter(
      "x",
      validFrontmatter
    );
    expect(result.displayDate).toBe("February 18, 2026");
  });
});
