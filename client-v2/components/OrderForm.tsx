'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorAlert } from './FormComponents';

interface OrderFormProps {
  ticketId: string;
}

export function OrderForm({ ticketId }: OrderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Array<{ message: string }> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setErrors(null);
      setIsLoading(true);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors || [{ message: 'Failed to create order' }]);
        return;
      }

      // Redirect to orders page
      router.push('/orders');
    } catch (err) {
      setErrors([{ message: err instanceof Error ? err.message : 'An error occurred' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorAlert errors={errors} />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            Processing...
          </>
        ) : (
          'Purchase Ticket'
        )}
      </button>
      <Link
        href="/"
        className="block text-center btn btn-outline dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400/10"
      >
        Continue Shopping
      </Link>
    </form>
  );
}
