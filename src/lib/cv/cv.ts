import { CV_DATA } from "./data";
import type {
  CvDate,
  CvEducation,
  CvExperience,
  CvLink,
  CvRecord,
  CvSkillGroup,
  CvTeaching,
} from "./types";

const YEAR_DATE = /^\d{4}$/;
const MONTH_DATE = /^\d{4}-(0[1-9]|1[0-2])$/;
const DAY_DATE = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
type ObjectRecord = Record<string, unknown>;
function isObjectRecord(value: unknown): value is ObjectRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readObject(value: unknown, label: string): ObjectRecord {
  if (!isObjectRecord(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function readString(record: ObjectRecord, key: string, label: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}.${key} must be a non-empty string`);
  }
  return value;
}

function readOptionalString(record: ObjectRecord, key: string, label: string): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}.${key} must be a non-empty string when present`);
  }
  return value;
}

function readArray(record: ObjectRecord, key: string, label: string): readonly unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) throw new Error(`${label}.${key} must be an array`);
  return value;
}

function readStringArray(record: ObjectRecord, key: string, label: string): readonly string[] {
  return readArray(record, key, label).map((item, itemIndex) => {
    if (typeof item !== "string" || item.trim() === "") {
      throw new Error(`${label}.${key}[${itemIndex}] must be a non-empty string`);
    }
    return item;
  });
}

function validateDate(value: string, label: string): CvDate {
  if (!YEAR_DATE.test(value) && !MONTH_DATE.test(value) && !DAY_DATE.test(value)) {
    throw new Error(`${label} must use YYYY, YYYY-MM, or YYYY-MM-DD`);
  }

  if (DAY_DATE.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() !== month - 1 ||
      parsed.getUTCDate() !== day
    ) {
      throw new Error(`${label} must be a real calendar date`);
    }
  }

  return value;
}

function validateOptionalDate(value: string | undefined, label: string): CvDate | undefined {
  return value === undefined ? undefined : validateDate(value, label);
}

function parseLink(value: unknown, index: number): CvLink {
  const record = readObject(value, `person.links[${index}]`);
  const href = readString(record, "href", `person.links[${index}]`);
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    throw new Error(`person.links[${index}].href must be an absolute URL`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`person.links[${index}].href must be an HTTP URL`);
  }
  return { label: readString(record, "label", `person.links[${index}]`), href };
}

function parsePerson(value: unknown): CvRecord["person"] {
  const record = readObject(value, "person");
  return {
    name: readString(record, "name", "person"),
    headline: readString(record, "headline", "person"),
    summary: readString(record, "summary", "person"),
    email: readString(record, "email", "person"),
    links: readArray(record, "links", "person").map(parseLink),
  };
}

function parseExperience(value: unknown, index: number): CvExperience {
  const label = `experience[${index}]`;
  const record = readObject(value, label);
  const start = validateDate(readString(record, "start", label), `${label}.start`);
  const end = validateOptionalDate(readOptionalString(record, "end", label), `${label}.end`);
  if (end !== undefined && end < start) throw new Error(`${label}.end cannot be before start`);

  const accomplishments = readStringArray(record, "accomplishments", label);
  if (accomplishments.length < 1) {
    throw new Error(`${label}.accomplishments must contain at least one item`);
  }

  const generalAccomplishments = readStringArray(record, "generalAccomplishments", label);
  if (generalAccomplishments.length < 1) {
    throw new Error(`${label}.generalAccomplishments must contain at least one item`);
  }
  const stack = readStringArray(record, "stack", label);
  const location = readOptionalString(record, "location", label);
  const workArrangement = readOptionalString(record, "workArrangement", label);
  return {
    id: readString(record, "id", label),
    company: readString(record, "company", label),
    role: readString(record, "role", label),
    start,
    generalSummary: readString(record, "generalSummary", label),
    generalAccomplishments,
    summary: readString(record, "summary", label),
    accomplishments,
    stack,
    ...(end === undefined ? {} : { end }),
    ...(location === undefined ? {} : { location }),
    ...(workArrangement === undefined ? {} : { workArrangement }),
  };
}

function parseSkillGroup(value: unknown, index: number): CvSkillGroup {
  const label = `skillGroups[${index}]`;
  const record = readObject(value, label);
  const items = readArray(record, "items", label).map((item, itemIndex) => {
    if (typeof item !== "string" || item.trim() === "") {
      throw new Error(`${label}.items[${itemIndex}] must be a non-empty string`);
    }
    return item;
  });
  if (items.length === 0) throw new Error(`${label}.items must not be empty`);
  return { label: readString(record, "label", label), items };
}

function parseTeaching(value: unknown): CvTeaching {
  const label = "teaching";
  const record = readObject(value, label);
  const start = validateDate(readString(record, "start", label), `${label}.start`);
  const end = validateOptionalDate(readOptionalString(record, "end", label), `${label}.end`);
  if (end !== undefined && end < start) throw new Error(`${label}.end cannot be before start`);
  return {
    id: readString(record, "id", label),
    title: readString(record, "title", label),
    organization: readString(record, "organization", label),
    start,
    description: readString(record, "description", label),
    ...(end === undefined ? {} : { end }),
  };
}

function parseEducation(value: unknown, index: number): CvEducation {
  const label = `education[${index}]`;
  const record = readObject(value, label);
  const start = validateDate(readString(record, "start", label), `${label}.start`);
  const end = validateOptionalDate(readOptionalString(record, "end", label), `${label}.end`);
  if (end !== undefined && end < start) throw new Error(`${label}.end cannot be before start`);
  const details = readOptionalString(record, "details", label);
  return {
    id: readString(record, "id", label),
    institution: readString(record, "institution", label),
    qualification: readString(record, "qualification", label),
    start,
    ...(end === undefined ? {} : { end }),
    ...(details === undefined ? {} : { details }),
  };
}

function assertUniqueIds(record: CvRecord): void {
  const ids = [
    ...record.experience.map((item) => item.id),
    record.teaching.id,
    ...record.education.map((item) => item.id),
  ];
  if (new Set(ids).size !== ids.length) throw new Error("CV record ids must be unique");
}

/**
 * Validates and normalizes editable CV data.
 *
 * @param input - Candidate record, usually the module-local editorial data.
 * @returns A typed record safe for rendering and document generation.
 * @throws If a required field, date, relationship, or display limit is invalid.
 */
export function validateCvRecord(input: unknown): CvRecord {
  const record = readObject(input, "CV record");
  const experience = readArray(record, "experience", "CV record").map(parseExperience);
  const skillGroups = readArray(record, "skillGroups", "CV record").map(parseSkillGroup);
  if (skillGroups.length > 4) throw new Error("CV record supports at most four skill groups");
  const parsed: CvRecord = {
    person: parsePerson(record.person),
    experience,
    skillGroups,
    teaching: parseTeaching(record.teaching),
    education: readArray(record, "education", "CV record").map(parseEducation),
    references: readString(record, "references", "CV record"),
    lastUpdated: validateDate(readString(record, "lastUpdated", "CV record"), "lastUpdated"),
    bio: readString(record, "bio", "CV record"),
  };
  assertUniqueIds(parsed);
  return parsed;
}

/** The validated record consumed by the CV page and future exports. */
export const CV = validateCvRecord(CV_DATA);

/** Formats a validated CV date for the editorial display. */
export function formatCvDate(value: CvDate): string {
  const date = validateDate(value, "date");
  if (YEAR_DATE.test(date)) return date;
  const [year, month, day] = date.split("-").map(Number);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  };
  if (date.split("-").length === 3) options.day = "numeric";
  return new Intl.DateTimeFormat("en-US", options).format(
    new Date(Date.UTC(year, month - 1, day ?? 1))
  );
}

/** Formats a ledger date range, preserving an omitted end as present. */
export function formatDateRange(start: CvDate, end?: CvDate): string {
  const startDate = validateDate(start, "start");
  const endDate = validateOptionalDate(end, "end");
  if (endDate !== undefined && endDate < startDate) throw new Error("end cannot be before start");
  return `${formatCvDate(startDate)}–${endDate === undefined ? "Present" : formatCvDate(endDate)}`;
}
