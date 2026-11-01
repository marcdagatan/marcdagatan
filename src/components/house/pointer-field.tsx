"use client";

import { useRef } from "react";

/**
 * Publishes the pointer position inside this element as --px/--py (0..1)
 * for CSS-driven cursor effects: an editor line highlight, projector spotlights.
 */
export function PointerField({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  return (
    <div
      {...rest}
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el || event.pointerType === "touch") return;
        const { clientX, clientY } = event;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--px", String((clientX - rect.left) / rect.width));
          el.style.setProperty("--py", String((clientY - rect.top) / rect.height));
          el.style.setProperty("--pxpx", `${Math.round(clientX - rect.left)}`);
          el.style.setProperty("--pypx", `${Math.round(clientY - rect.top)}`);
          el.dataset.pointer = "on";
        });
      }}
      onPointerLeave={() => {
        if (ref.current) delete ref.current.dataset.pointer;
      }}
    >
      {children}
    </div>
  );
}
