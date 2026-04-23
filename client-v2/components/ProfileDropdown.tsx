'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ProfileDropdownProps {
  email: string;
}

export function ProfileDropdown({ email }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-heading font-bold hover:bg-primary-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        aria-label="Profile menu"
        aria-expanded={open}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 glass-card rounded-xl shadow-glass-lg py-2 animate-fade-in z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-lg font-heading font-bold flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Signed in</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="py-1">
            <DropdownLink href="/tickets/my" onClick={() => setOpen(false)} icon="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z">
              My Listings
            </DropdownLink>
            <DropdownLink href="/orders" onClick={() => setOpen(false)} icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z">
              My Orders
            </DropdownLink>
            <DropdownLink href="/tickets/new" onClick={() => setOpen(false)} icon="M12 4.5v15m7.5-7.5h-15">
              Sell a Ticket
            </DropdownLink>
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-200/60 dark:border-slate-700/40 pt-1">
            <DropdownLink href="/signout" onClick={() => setOpen(false)} icon="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" danger>
              Sign Out
            </DropdownLink>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  onClick,
  icon,
  children,
  danger,
}: {
  href: string;
  onClick: () => void;
  icon: string;
  children: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
        danger
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
      }`}
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      {children}
    </Link>
  );
}
