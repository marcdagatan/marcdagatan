/**
 * Shared layout tokens for the Dossier case study.
 *
 * Why: the visible column overlay and every content row must use the exact
 * same frame and grid, or the drawn columns stop lining up with the type.
 */

/** Outer frame: max width and side margins. */
export const FRAME = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

/** Four columns on mobile, twelve from tablet up. */
export const GRID = "grid grid-cols-4 gap-x-4 md:grid-cols-12 md:gap-x-6";

/** Left index column on desktop (columns 1-3). */
export const COL_INDEX = "col-span-4 md:col-span-3";

/** Main content column on desktop (columns 4-12). */
export const COL_MAIN = "col-span-4 md:col-span-9 md:col-start-4";
