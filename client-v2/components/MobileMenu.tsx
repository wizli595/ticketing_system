'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface MobileMenuProps {
  isAuthenticated: boolean;
  email: string | null;
}

export function MobileMenu({ isAuthenticated, email }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-lg transition-all duration-200 cursor-pointer ${
          open
            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
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

      {/* Backdrop */}
      <div
        className={`fixed inset-0 top-[calc(4rem+2px)] bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* Menu panel */}
      <div
        className={`fixed top-[calc(4rem+2px)] left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl z-50 md:hidden transition-all duration-300 ${
          open
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="section py-3 flex flex-col gap-0.5 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Profile header when authenticated */}
          {isAuthenticated && email && (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-sm font-heading font-bold flex-shrink-0 shadow-sm">
                {email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{email}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Online
                </p>
              </div>
            </div>
          )}

          <MobileLink href="/tickets" onClick={close} icon="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
            Browse Tickets
          </MobileLink>

          {isAuthenticated ? (
            <>
              <MobileLink href="/profile" onClick={close} icon="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z">
                Profile
              </MobileLink>
              <MobileLink href="/tickets/my" onClick={close} icon="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z">
                My Listings
              </MobileLink>
              <MobileLink href="/tickets/new" onClick={close} icon="M12 4.5v15m7.5-7.5h-15">
                Sell a Ticket
              </MobileLink>
              <MobileLink href="/orders" onClick={close} icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z">
                My Orders
              </MobileLink>
              <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
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
              <div className="px-3 mt-2">
                <Link
                  href="/signin"
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-glow transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
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
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
        danger
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
          : isActive
            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`}
    >
      <svg className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      {children}
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
      )}
    </Link>
  );
}
