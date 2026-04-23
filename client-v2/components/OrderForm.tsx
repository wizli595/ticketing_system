'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorAlert, Spinner } from './FormComponents';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors || [{ message: 'Failed to create order' }]);
        return;
      }

      const order = await response.json();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setErrors([{ message: err instanceof Error ? err.message : 'An error occurred' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorAlert errors={errors} />

      <button type="submit" disabled={isLoading} className="w-full btn btn-accent btn-lg">
        {isLoading ? <Spinner /> : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        )}
        {isLoading ? 'Processing...' : 'Purchase Ticket'}
      </button>

      <Link href="/tickets" className="block text-center btn btn-outline w-full cursor-pointer">
        Continue Browsing
      </Link>
    </form>
  );
}
