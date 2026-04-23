import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import '@/styles/globals.css';
import { Header, HeaderSkeleton } from '@/components/Header';
import { ThemeProvider } from '@/lib/theme-provider';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'GitTix - Buy & Sell Tickets',
  description: 'A modern microservices ticketing platform',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80">G</text></svg>',
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
      <body className="font-body antialiased">
        <ThemeProvider>
          <ToastProvider>
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>
          <main className="min-h-[calc(100dvh-64px)]">
            {children}
          </main>
          <footer className="border-t border-slate-200 dark:border-slate-800 mt-20">
            <div className="section py-10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  &copy; 2026 GitTix. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <span>Built with microservices</span>
                  <span className="hidden sm:inline">&middot;</span>
                  <span>Powered by Next.js</span>
                </div>
              </div>
            </div>
          </footer>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
