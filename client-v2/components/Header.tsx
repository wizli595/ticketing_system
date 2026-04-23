import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { ProfileDropdown } from './ProfileDropdown';
import { fetchCurrentUser } from '@/lib/server-actions';

export async function Header() {
  const currentUser = await fetchCurrentUser();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 dark:border-slate-800/60">
      <nav className="section">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <span className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              GitTix
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/tickets">Browse</NavLink>
            {currentUser ? (
              <>
                <NavLink href="/tickets/new">Sell Tickets</NavLink>
                <NavLink href="/orders">My Orders</NavLink>
                <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <ThemeToggle />
                  <ProfileDropdown email={currentUser.email} />
                </div>
              </>
            ) : (
              <>
                <NavLink href="/signup">Sign Up</NavLink>
                <Link href="/signin" className="ml-2 btn btn-primary btn-sm">
                  Sign In
                </Link>
                <div className="ml-3 pl-3 border-l border-slate-200 dark:border-slate-700">
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileMenu isAuthenticated={!!currentUser} email={currentUser?.email || null} />
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
    >
      {children}
    </Link>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 dark:border-slate-800/60">
      <nav className="section">
        <div className="flex justify-between items-center h-16">
          <div className="w-28 h-8 skeleton rounded-lg" />
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
