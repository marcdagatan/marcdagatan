"use client";

import { useEffect } from "react";

export default function StagewiseDevToolbar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    (async () => {
      try {
        const { initToolbar } = await import("@stagewise/toolbar");
        initToolbar({ plugins: [] });
      } catch (error) {
        // Intentionally swallow errors in dev to avoid breaking the app if the toolbar is unavailable
        console.warn("Stagewise toolbar failed to initialize:", error);
      }
    })();
  }, []);

  return null;
}


