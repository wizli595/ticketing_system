'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ThemeToggle } from './ThemeToggle';

interface CurrentUser {
  id: string;
  email: string;
}

export function HeaderContent() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/users/current');
        setCurrentUser(data.currentUser);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchUser();
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-soft sticky top-0 z-50 transition-colors">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              GitTix
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-soft sticky top-0 z-50 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-secondary-700 transition-all">
              GitTix
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!isLoading && (
              <>
                {currentUser ? (
                  <>
                    <NavLink href="/tickets/new">Sell Tickets</NavLink>
                    <NavLink href="/orders">My Orders</NavLink>
                    <NavLink href="/signout">Sign Out</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink href="/signup">Sign Up</NavLink>
                    <Link
                      href="/signin"
                      className="ml-4 px-4 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-800 transition-colors"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </>
            )}
            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: string;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
    >
      {children}
    </Link>
  );
}
