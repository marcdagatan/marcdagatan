/**
 * Publication-index search configuration (pure, testable).
 *
 * The Fuse options are the single source of truth for how search ranks posts,
 * so ranking regressions can be locked in unit tests without a browser. The
 * dialog lazy-loads Fuse.js and instantiates it with these options; this
 * module must never import Fuse at runtime (only its types) to keep the
 * library out of the initial bundle.
 *
 * Weighting contract: title and curated topics are the strongest fields,
 * description is secondary, lane is weakest. Threshold 0.25 keeps fuzzy
 * matches useful for multi-word queries ("skils" still finds "skills") while
 * rejecting loose short-pattern noise, e.g. the query "glm" must not surface
 * the Superman review through a fuzzy 1-edit match against its "film" topic.
 */

import type { IFuseOptions } from "fuse.js";
import type { SearchPost } from "@/components/search-types";

/** Shared Fuse options for the publication index. */
export const SEARCH_OPTIONS: IFuseOptions<SearchPost> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "topics", weight: 0.3 },
    { name: "description", weight: 0.2 },
    { name: "lane", weight: 0.1 },
  ],
  threshold: 0.25,
  includeScore: true,
};
