import { COL_INDEX } from "./grid";

/** Left-column section marker: index number over a short label. */
export function SectionHead({ index, label }: { index: string; label: string }) {
  return (
    <div className={`${COL_INDEX} mb-8 md:mb-0`}>
      <div className="md:sticky md:top-24">
        <p className="text-[2.5rem] font-bold leading-none tracking-[-0.04em] tabular-nums">
          {index}
        </p>
        <h2 className="dossier-label mt-3">{label}</h2>
      </div>
    </div>
  );
}
