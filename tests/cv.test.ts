import { describe, expect, it } from "vitest";
import { formatCvDate, formatDateRange, validateCvRecord } from "@/lib/cv/cv";
import type { CvRecord } from "@/lib/cv/types";
import { resolveCvView } from "@/lib/cv/view";

const validRecord: CvRecord = {
  person: {
    name: "Marc Uy Dagatan",
    headline: "Senior full-stack engineer building production systems and leading teams.",
    summary: "A compact professional record.",
    email: "marc@example.com",
    links: [],
  },
  experience: [
    {
      id: "example",
      company: "Example",
      role: "Engineer",
      start: "2024-01",
      generalSummary: "Builds dependable products.",
      generalAccomplishments: ["Delivered a useful product improvement."],
      summary: "Builds reliable systems.",
      accomplishments: ["Shipped a thing."],
      stack: ["Rails"],
    },
  ],
  skillGroups: [
    { label: "Languages", items: ["Ruby"] },
  ],
  teaching: {
    id: "teaching",
    title: "Instructor",
    organization: "Bootcamp",
    start: "2023-01",
    description: "Taught software development.",
  },
  education: [
    {
      id: "education",
      institution: "School",
      qualification: "Course",
      start: "2015-01",
      details: "Completed.",
    },
  ],
  references: "Available on request.",
  lastUpdated: "2026-08-05",
  bio: "A builder who writes about systems. A record of the work behind the essays.",
};

describe("CV record", () => {
  it("accepts a valid record and formats a date range", () => {
    expect(validateCvRecord(validRecord)).toEqual(validRecord);
    expect(formatCvDate("2025")).toBe("2025");
    expect(formatCvDate("2026-08-05")).toBe("Aug 5, 2026");
    expect(formatDateRange("2023-12", undefined)).toBe("Dec 2023–Present");
    expect(formatDateRange("2022-01", "2023-09")).toBe("Jan 2022–Sep 2023");
  });

  it("rejects an end date before its start date", () => {
    const invalid = {
      ...validRecord,
      experience: [{ ...validRecord.experience[0], start: "2024-01", end: "2023-12" }],
    };

    expect(() => validateCvRecord(invalid)).toThrow(/end.*start/i);
  });

  it("defaults unknown CV views to the general record", () => {
    expect(resolveCvView(undefined)).toBe("general");
    expect(resolveCvView("technical")).toBe("technical");
    expect(resolveCvView("anything-else")).toBe("general");
    expect(resolveCvView(["technical"])).toBe("general");
  });

});
