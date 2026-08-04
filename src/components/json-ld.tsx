/**
 * Serializes structured data safely for injection into a JSON-LD script tag.
 *
 * Why: JSON.stringify alone can emit `</script>`-breaking sequences when a
 * string field contains HTML-ish content. Escaping the angle brackets and
 * line separators keeps the injected JSON valid and inert.
 *
 * @param data - Serializable structured data.
 * @returns JSON string safe to embed inside a script tag.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
