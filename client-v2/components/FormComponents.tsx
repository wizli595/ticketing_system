import type { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function FormContainer({ children, title, subtitle }: FormContainerProps) {
  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

interface ErrorAlertProps {
  errors: Array<{ message: string }> | null;
}

export function ErrorAlert({ errors }: ErrorAlertProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl animate-fade-in" role="alert">
      <div className="flex items-start gap-3">
        <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
          {errors.map((err, idx) => (
            <li key={idx}>{err.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
