import type { ReactNode } from 'react';

interface PageProps {
  children?: ReactNode;
  params?: Record<string, unknown>;
  searchParams?: Record<string, string>;
}

/**
 * Page layout component
 * Provides consistent spacing and container structure
 */
export function PageLayout({
  children,
}: Omit<PageProps, 'params' | 'searchParams'>) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}
