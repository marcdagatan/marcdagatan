/**
 * Table-of-contents extraction from raw MDX source.
 *
 * Why: the article page renders headings through rehype-slug (which assigns
 * `id` attributes), so the TOC must produce the exact same ids. Rather than
 * parsing the rendered React tree, this module runs the same remark pipeline
 * (remark-parse + remark-gfm + github-slugger) over the source on the server
 * and walks the mdast headings, so ids and text are guaranteed to match.
 *
 * Pure string-in/string-out logic so it is unit-testable without a server.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";

/** A single table-of-contents entry. */
export type TocItem = {
  /** Heading `id` as assigned by rehype-slug on the article page. */
  id: string;
  /** Visible heading text. */
  text: string;
  /** Heading depth (2 = section, 3 = subsection). */
  level: 2 | 3;
};

/** Minimum number of headings before a post earns a table of contents.
 *
 * Short posts stay uncluttered; only essays with real section structure get
 * the apparatus.
 */
export const TOC_MIN_HEADINGS = 3;

/** Number of h2 sections above which the TOC switches to h2-only mode.
 *
 * Long essays (more than 8 h2 sections) get an h2-only TOC so the rail stays
 * scannable and important closing sections (references, closing stance) stay
 * visible instead of being pushed out by subsections.
 */
export const TOC_H2_DIET_THRESHOLD = 8;

/**
 * Composes the final TOC from extracted headings.
 *
 * Long essays (more than {@link TOC_H2_DIET_THRESHOLD} h2 sections) drop their
 * h3 subsections; shorter essays keep them. Every h2 is always kept.
 *
 * @param items - Headings in document order from `extractTableOfContents`.
 * @returns The composed TOC, a subset of `items` preserving document order.
 */
export function composeTableOfContents(items: TocItem[]): TocItem[] {
  const h2Count = items.filter((item) => item.level === 2).length;
  if (h2Count > TOC_H2_DIET_THRESHOLD) {
    return items.filter((item) => item.level === 2);
  }
  return items;
}

/**
 * Extracts h2/h3 headings from raw MDX source with ids matching rehype-slug.
 *
 * @param source - Raw MDX body (without frontmatter).
 * @returns Heading entries in document order, h2 first within the same id.
 */
export function extractTableOfContents(source: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  walk(tree, (node) => {
    if (node.type !== "heading") return;
    const text = collectHeadingText(node);
    // Slug every heading (h1-h6) in document order so duplicate handling
    // matches rehype-slug exactly, then keep only h2/h3 for the TOC.
    const id = slugger.slug(text);
    if (node.depth === 2 || node.depth === 3) {
      items.push({ id, text, level: node.depth });
    }
  });

  return items;
}

/** Minimal structural node shape used by the walker. */
type MdastNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: MdastNode[];
};

/**
 * Collects the visible text of a heading, including inline code, matching
 * what rehype-slug receives after remark rendering.
 *
 * @param node - mdast heading node.
 * @returns Concatenated text content.
 */
function collectHeadingText(node: MdastNode): string {
  return (node.children ?? []).map(collectText).join("");
}

function collectText(node: MdastNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  return (node.children ?? []).map(collectText).join("");
}

/** Minimal mdast walker (avoids a unist-util-visit dependency). */
function walk(node: MdastNode, visit: (node: MdastNode) => void): void {
  visit(node);
  const children = node.children;
  if (Array.isArray(children)) {
    for (const child of children) walk(child, visit);
  }
}
