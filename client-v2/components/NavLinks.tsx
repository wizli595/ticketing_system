'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
        isActive
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-900/30'
          : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-500 rounded-full" />
      )}
    </Link>
  );
}
