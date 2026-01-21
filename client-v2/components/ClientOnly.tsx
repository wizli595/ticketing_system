'use client';

import type { ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * Wrapper component to prevent hydration mismatch warnings
 * Use this for components that only run in the browser
 */
export function ClientOnly({ children }: ClientOnlyProps) {
  // This component intentionally does nothing but mark its children as client-only
  return <>{children}</>;
}
