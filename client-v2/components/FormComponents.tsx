import type { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
  title: string;
}

export function FormContainer({ children, title }: FormContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-elevated dark:shadow-none border border-gray-200 dark:border-gray-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        {children}
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
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400 dark:text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Please check the following:
          </h3>
          <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
