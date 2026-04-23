'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ProfileDropdownProps {
  email: string;
}

export function ProfileDropdown({ email }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open]);

  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
          open
            ? 'bg-primary-700 text-white ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900'
            : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white hover:shadow-glow'
        }`}
        aria-label="Profile menu"
        aria-expanded={open}
      >
        {initial}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-2xl border border-slate-200/80 dark:border-slate-700/60 py-1.5 z-50 origin-top-right transition-all duration-200 ${
          open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
        }`}
      >
        {/* User info */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-lg font-heading font-bold flex-shrink-0 shadow-sm">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{email}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Online
              </p>
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
        <div className="border-t border-slate-100 dark:border-slate-700/50 pt-1">
          <DropdownLink href="/signout" onClick={() => setOpen(false)} icon="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" danger>
            Sign Out
          </DropdownLink>
        </div>
      </div>
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
      className={`flex items-center gap-3 mx-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
        danger
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      {children}
    </Link>
  );
}
