import { describe, expect, it } from "vitest";
import {
  CURATED_TOPICS,
  LANES,
  POST_FORMATS,
  TOPIC_INTROS,
  normalizeTopic,
  isCuratedTopic,
  isValidLane,
  isValidFormat,
} from "@/lib/topics";

describe("curated taxonomy", () => {
  it("defines exactly the planned curated topic set", () => {
    expect(CURATED_TOPICS).toEqual([
      "ai",
      "governance",
      "engineering",
      "tools",
      "hiring",
      "leadership",
      "entrepreneurship",
      "relationships",
      "creativity",
      "boxing",
      "acting",
      "film",
    ]);
  });

  it("defines the three lanes", () => {
    expect(LANES).toEqual(["systems", "operators", "life"]);
  });

  it("defines the four formats", () => {
    expect(POST_FORMATS).toEqual(["essay", "guide", "review", "note"]);
  });

  it("provides an editorial intro for every curated topic", () => {
    for (const topic of CURATED_TOPICS) {
      expect(TOPIC_INTROS[topic].length).toBeGreaterThan(0);
    }
  });
});

describe("normalizeTopic", () => {
  it("normalizes case and whitespace", () => {
    expect(normalizeTopic("AI")).toBe("ai");
    expect(normalizeTopic("  Governance ")).toBe("governance");
  });

  it("rejects one-off keywords that are not curated", () => {
    expect(normalizeTopic("system-design")).toBeNull();
    expect(normalizeTopic("personal")).toBeNull();
    expect(normalizeTopic("gpt-5")).toBeNull();
  });

  it("returns null for empty input", () => {
    expect(normalizeTopic("")).toBeNull();
  });
});

describe("guards", () => {
  it("isCuratedTopic matches curated values only", () => {
    expect(isCuratedTopic("film")).toBe(true);
    expect(isCuratedTopic("movies")).toBe(false);
  });

  it("isValidLane accepts lanes only", () => {
    expect(isValidLane("systems")).toBe(true);
    expect(isValidLane("life")).toBe(true);
    expect(isValidLane("personal")).toBe(false);
  });

  it("isValidFormat accepts formats only", () => {
    expect(isValidFormat("essay")).toBe(true);
    expect(isValidFormat("review")).toBe(true);
    expect(isValidFormat("tutorial")).toBe(false);
  });
});
