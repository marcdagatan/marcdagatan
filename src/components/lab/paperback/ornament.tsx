/**
 * Three diamonds. The book's only ornament, used at the title page and between
 * scenes in place of a horizontal rule.
 */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pb-ornament ${className}`.trim()}
      viewBox="0 0 72 8"
      width="72"
      height="8"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 4 8 0l4 4-4 4z" fill="currentColor" />
      <path d="M32 4l4-4 4 4-4 4z" fill="currentColor" />
      <path d="M60 4l4-4 4 4-4 4z" fill="currentColor" />
    </svg>
  );
}
