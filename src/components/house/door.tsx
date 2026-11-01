/**
 * Architectural door-swing symbol: a leaf hinged at the bottom-left and the
 * quarter arc it sweeps. Tiles open it on hover; essay headers render it open.
 */
export function Door({ open = false, className = "" }: { open?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`ml-door ${className}`}
      data-open={open ? "true" : undefined}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      <path className="ml-door-arc" d="M100 100 A100 100 0 0 0 0 0" strokeWidth="1.5" />
      <line x1="0" y1="100" x2="100" y2="100" strokeWidth="1.5" strokeOpacity="0.4" />
      <rect className="ml-door-leaf" x="0" y="95" width="100" height="6" fill="currentColor" stroke="none" />
      <circle cx="0" cy="100" r="5" fill="currentColor" stroke="none" />
    </svg>
  );
}
