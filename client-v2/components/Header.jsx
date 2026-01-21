'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

    fetchUser();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              GitTix
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex space-x-8">
            {!isLoading && (
              <>
                {currentUser ? (
                  <>
                    <Link
                      href="/tickets/new"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      Sell Tickets
                    </Link>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/auth/signout"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      Sign Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/auth/signin"
                      className="btn btn-primary btn-sm"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button placeholder */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
