/**
 * A stable, git-looking short hash for a post. Purely presentational: the
 * Engineering room lists its posts like `git log --oneline`, and a slug
 * always maps to the same seven hex digits (FNV-1a, 32-bit).
 */
export function shortHash(slug: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < slug.length; index++) {
    hash ^= slug.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}
