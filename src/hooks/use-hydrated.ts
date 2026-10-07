"use client";

import * as React from "react";

/**
 * Returns false during SSR and on the first client render, then true.
 *
 * Use this to gate UI that reads from browser-only storage (localStorage, sessionStorage)
 * so the server-rendered markup matches the first client render and React does not report
 * a hydration mismatch.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}