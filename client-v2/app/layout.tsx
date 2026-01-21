import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/lib/theme-provider';

export const metadata: Metadata = {
  title: 'GitTix - Buy & Sell Tickets',
  description: 'A modern microservices ticketing platform',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75" fill="black">🎫</text></svg>',
      },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-gray-50 antialiased transition-colors">
        <ThemeProvider>
          <Header />
          <main className="min-h-[calc(100vh-64px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
              <p>&copy; 2026 GitTix. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
