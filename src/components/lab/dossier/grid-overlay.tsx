import { FRAME, GRID } from "./grid";

/** Draws the layout columns behind the page so the grid stays visible. */
export function GridOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className={`${FRAME} h-full`}>
        <div className={`${GRID} h-full`}>
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={`dossier-col h-full ${index >= 4 ? "hidden md:block" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
