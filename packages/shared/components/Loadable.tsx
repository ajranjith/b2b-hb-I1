"use client";

import { lazy, Suspense, type ComponentType } from "react";

/**
 * Lazy-load wrapper. In Next.js pages prefer next/dynamic for code splitting.
 * Kept for API compatibility when migrating from Vite.
 */
export function Loadable<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: { fallback?: React.ReactNode }
) {
  const LazyComponent = lazy(importFn);
  return function LoadableWrapper(props: P) {
    return (
      <Suspense fallback={options?.fallback ?? null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
