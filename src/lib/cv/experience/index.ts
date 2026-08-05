import type { CvExperience } from "../types";
import { BEAMTREE_EXPERIENCE } from "./beamtree";
import { GOGYM_EXPERIENCE } from "./gogym";
import { HANDLR_EXPERIENCE } from "./handlr";
import { KRAVOS_EXPERIENCE } from "./kravos";
import { LEGACY_EXPERIENCE } from "./legacy";

/** Experience order for the public CV; update this list instead of moving data blocks. */
export const CV_EXPERIENCE = [
  KRAVOS_EXPERIENCE,
  BEAMTREE_EXPERIENCE,
  HANDLR_EXPERIENCE,
  GOGYM_EXPERIENCE,
  ...LEGACY_EXPERIENCE,
] satisfies readonly CvExperience[];
