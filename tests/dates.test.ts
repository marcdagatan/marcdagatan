import { describe, expect, it } from "vitest";
import {
  parsePostDate,
  toPostISO,
  formatDisplayDate,
  POST_TIME_ZONE,
  POST_TIME_ZONE_OFFSET,
} from "@/lib/dates";

describe("parsePostDate", () => {
  it("parses explicit ISO dates with timezone offset", () => {
    const date = parsePostDate("2025-08-10T21:30:00+08:00");
    expect(date.toISOString()).toBe("2025-08-10T13:30:00.000Z");
  });

  it("treats legacy 12-hour frontmatter dates as Asia/Manila", () => {
    const date = parsePostDate("2025-08-10 9:30 PM");
    expect(date.toISOString()).toBe("2025-08-10T13:30:00.000Z");
  });

  it("parses late-night Manila times without shifting the day", () => {
    const date = parsePostDate("2025-08-10 11:40 PM");
    expect(date.toISOString()).toBe("2025-08-10T15:40:00.000Z");
  });

  it("parses early-morning AM times correctly", () => {
    const date = parsePostDate("2025-08-11 1:15 AM");
    expect(date.toISOString()).toBe("2025-08-10T17:15:00.000Z");
  });

  it("treats ISO wall-clock dates without an offset as Asia/Manila", () => {
    const date = parsePostDate("2025-08-10T21:30:00");
    expect(date.toISOString()).toBe("2025-08-10T13:30:00.000Z");
  });

  it("treats date-only values as midnight in Asia/Manila", () => {
    const date = parsePostDate("2025-08-10");
    expect(date.toISOString()).toBe("2025-08-09T16:00:00.000Z");
  });

  it("throws on unparseable input", () => {
    expect(() => parsePostDate("not-a-date")).toThrow();
  });

  it("throws on empty input", () => {
    expect(() => parsePostDate("")).toThrow();
  });
});

describe("toPostISO", () => {
  it("formats a UTC instant back to the Asia/Manila wall clock with offset", () => {
    const date = new Date("2025-08-10T13:30:00.000Z");
    expect(toPostISO(date)).toBe("2025-08-10T21:30:00+08:00");
  });

  it("keeps the +08:00 offset constant regardless of runtime timezone", () => {
    const date = parsePostDate("2026-02-18T13:45:00+08:00");
    expect(toPostISO(date).endsWith(POST_TIME_ZONE_OFFSET)).toBe(true);
  });
});

describe("formatDisplayDate", () => {
  it("renders a deterministic long-form date in the Manila timezone", () => {
    const date = parsePostDate("2025-08-10 9:30 PM");
    expect(formatDisplayDate(date)).toBe("August 10, 2025");
  });

  it("does not shift a late-night post to the next day", () => {
    const date = parsePostDate("2025-08-10 11:40 PM");
    expect(formatDisplayDate(date)).toBe("August 10, 2025");
  });

  it("matches the plan's canonical example", () => {
    const date = parsePostDate("2026-02-18T13:45:00+08:00");
    expect(formatDisplayDate(date)).toBe("February 18, 2026");
  });
});

describe("timezone constants", () => {
  it("uses Asia/Manila with a +08:00 offset", () => {
    expect(POST_TIME_ZONE).toBe("Asia/Manila");
    expect(POST_TIME_ZONE_OFFSET).toBe("+08:00");
  });
});
