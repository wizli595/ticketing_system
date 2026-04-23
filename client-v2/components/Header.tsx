import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { ProfileDropdown } from './ProfileDropdown';
import { ScrollHeader } from './ScrollHeader';
import { NavLink } from './NavLinks';
import { fetchCurrentUser } from '@/lib/server-actions';

export async function Header() {
  const currentUser = await fetchCurrentUser();

  return (
    <ScrollHeader>
      {/* Accent top line */}
      <div className="h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

      <nav className="section">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow duration-300">
              <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-heading font-bold leading-tight text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                GitTix
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/tickets">Browse</NavLink>
            {currentUser ? (
              <>
                <NavLink href="/tickets/new">Sell Tickets</NavLink>
                <NavLink href="/orders">My Orders</NavLink>
                <div className="ml-3 pl-3 border-l border-slate-200/60 dark:border-slate-700/40 flex items-center gap-1.5">
                  <ThemeToggle />
                  <ProfileDropdown email={currentUser.email} />
                </div>
              </>
            ) : (
              <>
                <NavLink href="/signup">Sign Up</NavLink>
                <Link
                  href="/signin"
                  className="ml-3 btn btn-primary btn-sm shadow-sm hover:shadow-glow transition-shadow"
                >
                  Sign In
                </Link>
                <div className="ml-3 pl-3 border-l border-slate-200/60 dark:border-slate-700/40">
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeToggle />
            <MobileMenu isAuthenticated={!!currentUser} email={currentUser?.email || null} />
          </div>
        </div>
      </nav>
    </ScrollHeader>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/40">
      <div className="h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
      <nav className="section">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 skeleton rounded-xl" />
            <div className="flex flex-col gap-1">
              <div className="w-16 h-4 skeleton rounded" />
              <div className="w-20 h-2 skeleton rounded" />
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-8 skeleton rounded-lg" />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
