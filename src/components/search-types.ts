/**
 * Shared search types between the dialog and its results panel.
 */

export interface SearchPost {
  slug: string;
  title: string;
  description: string;
  lane: string;
  format: string;
  topics: string[];
  dateISO: string;
  displayDate: string;
  readingTime: number;
}
