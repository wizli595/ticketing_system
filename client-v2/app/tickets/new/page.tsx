'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequest } from '@/hooks/use-request';
import { ErrorAlert, Spinner } from '@/components/FormComponents';

export default function NewTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors, isLoading } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => router.push('/tickets'),
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
    <div className="section py-10">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/tickets" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to tickets
          </Link>
          <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Create a Ticket</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">List your event ticket for sale</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <ErrorAlert errors={errors} />

            <div>
              <label htmlFor="title" className="label">Ticket Title</label>
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
              <p className="text-xs text-slate-400 mt-1.5">Describe the event or ticket type</p>
            </div>

            <div>
              <label htmlFor="price" className="label">Price (USD)</label>
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
              <p className="text-xs text-slate-400 mt-1.5">Price in cents will be stored internally</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isLoading} className="flex-1 btn btn-primary">
                {isLoading ? <Spinner /> : null}
                {isLoading ? 'Creating...' : 'Create Ticket'}
              </button>
              <button type="button" onClick={() => router.back()} className="flex-1 btn btn-outline cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
