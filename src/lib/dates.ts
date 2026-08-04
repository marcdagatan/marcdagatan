/**
 * Deterministic date handling for posts.
 *
 * Why: frontmatter dates historically rendered with the viewer's locale and
 * timezone, which produced hydration mismatches and day-shifting for
 * late-night posts. All parsing and display formatting happens here, in
 * exactly one place, pinned to Asia/Manila.
 */

/** IANA timezone all post dates are interpreted and displayed in. */
export const POST_TIME_ZONE = "Asia/Manila";

/** Fixed UTC offset for POST_TIME_ZONE (Manila has no DST). */
export const POST_TIME_ZONE_OFFSET = "+08:00";

const LEGACY_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
const EXPLICIT_ZONE_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/i;
const ISO_WALL_CLOCK_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

/**
 * Parses a post date string into a Date.
 *
 * Accepts explicit ISO 8601 strings with an offset, or the legacy
 * `YYYY-MM-DD h:mm AM/PM` format used by older posts. Legacy wall-clock
 * values and ISO strings without an offset are treated as Asia/Manila.
 *
 * @param raw - Raw frontmatter date value.
 * @returns The parsed instant.
 * @throws If the input cannot be parsed as a date.
 */
export function parsePostDate(raw: string): Date {
  const input = raw.trim();

  if (EXPLICIT_ZONE_PATTERN.test(input)) {
    const explicit = new Date(input);
    if (!Number.isNaN(explicit.getTime())) return explicit;
  }

  const legacy = input.match(LEGACY_DATE_PATTERN);
  if (legacy) {
    const [, year, month, day, hour, minute, meridiem] = legacy;
    let hours = parseInt(hour, 10) % 12;
    if (/pm/i.test(meridiem)) hours += 12;
    // Build the instant as UTC then shift back to Manila (UTC+8) so the
    // wall clock in Manila is exactly what the author wrote.
    const utc = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      hours,
      Number(minute),
      0,
      0
    );
    return new Date(utc - 8 * 60 * 60 * 1000);
  }

  const dateOnly = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)) - 8 * 60 * 60 * 1000
    );
  }

  const isoWallClock = input.match(ISO_WALL_CLOCK_PATTERN);
  if (isoWallClock) {
    const [, year, month, day, hour, minute, second = "00"] = isoWallClock;
    const utc = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
    return new Date(utc - 8 * 60 * 60 * 1000);
  }

  throw new Error(`Invalid post date: "${raw}"`);
}

const MANILA_WALL_CLOCK = new Intl.DateTimeFormat("en-CA", {
  timeZone: POST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/**
 * Formats an instant as an ISO 8601 string carrying the Asia/Manila offset,
 * e.g. "2026-02-18T13:45:00+08:00".
 *
 * @param date - The instant to format.
 * @returns Machine-readable ISO string with explicit timezone offset.
 */
export function toPostISO(date: Date): string {
  const parts = MANILA_WALL_CLOCK.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const pad = (value: string) => value.padStart(2, "0");
  return `${get("year")}-${pad(get("month"))}-${pad(get("day"))}T${pad(get("hour"))}:${pad(get("minute"))}:${pad(get("second"))}${POST_TIME_ZONE_OFFSET}`;
}

const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: POST_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

/**
 * Formats an instant as a server-side display string, e.g. "February 18, 2026".
 *
 * This string is computed once on the server and passed down; client
 * components must never reformat the date with the viewer's locale.
 *
 * @param date - The instant to format.
 * @returns Deterministic long-form display string.
 */
export function formatDisplayDate(date: Date): string {
  return DISPLAY_DATE_FORMATTER.format(date);
}
