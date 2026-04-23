'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isAuthenticated: boolean;
  email: string | null;
}

export function MobileMenu({ isAuthenticated, email }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 glass border-b border-slate-200 dark:border-slate-800 shadow-glass-lg animate-fade-in z-50">
          <div className="section py-4 flex flex-col gap-1">
            {/* Profile header when authenticated */}
            {isAuthenticated && email && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-slate-200/60 dark:border-slate-700/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-heading font-bold flex-shrink-0">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Signed in</p>
                </div>
              </div>
            )}

            <MobileLink href="/tickets" onClick={close} icon="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
              Browse Tickets
            </MobileLink>

            {isAuthenticated ? (
              <>
                <MobileLink href="/tickets/my" onClick={close} icon="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z">
                  My Listings
                </MobileLink>
                <MobileLink href="/tickets/new" onClick={close} icon="M12 4.5v15m7.5-7.5h-15">
                  Sell a Ticket
                </MobileLink>
                <MobileLink href="/orders" onClick={close} icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z">
                  My Orders
                </MobileLink>
                <div className="border-t border-slate-200/60 dark:border-slate-700/40 mt-2 pt-2">
                  <MobileLink href="/signout" onClick={close} icon="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" danger>
                    Sign Out
                  </MobileLink>
                </div>
              </>
            ) : (
              <>
                <MobileLink href="/signup" onClick={close} icon="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z">
                  Sign Up
                </MobileLink>
                <MobileLink href="/signin" onClick={close} icon="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75">
                  Sign In
                </MobileLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MobileLink({
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
        danger
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      {children}
    </Link>
  );
}
