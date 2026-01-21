'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequest } from '@/hooks/use-request';
import { ErrorAlert } from '@/components/FormComponents';

export default function NewTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors, isLoading } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (!isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create a New Ticket</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">List your event tickets for sale in our marketplace</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-none p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <ErrorAlert errors={errors} />

          <div>
            <label htmlFor="title" className="label">
              Ticket Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g., Concert - The Beatles Tribute Band"
              required
              disabled={isLoading}
              minLength={3}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Describe the event or ticket type
            </p>
          </div>

          <div>
            <label htmlFor="price" className="label">
              Price (USD) *
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              placeholder="99.99"
              step="0.01"
              min="0"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the price in USD (will be formatted to 2 decimal places)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn btn-outline dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
