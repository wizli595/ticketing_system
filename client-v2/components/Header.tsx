'use client';

import { Suspense } from 'react';
import { HeaderContent } from './HeaderContent';

export function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderContent />
    </Suspense>
  );
}

function HeaderSkeleton() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="hidden md:flex space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
