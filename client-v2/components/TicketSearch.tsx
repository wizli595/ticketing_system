'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface TicketSearchProps {
  initialQuery: string;
  initialMinPrice: string;
  initialMaxPrice: string;
  initialSort: string;
}

export function TicketSearch({ initialQuery, initialMinPrice, initialMaxPrice, initialSort }: TicketSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sort, setSort] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(!!(initialMinPrice || initialMaxPrice));

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort !== 'newest') params.set('sort', sort);

    startTransition(() => {
      router.push(`/tickets${params.toString() ? `?${params}` : ''}`);
    });
  };

  const clearFilters = () => {
    setQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    startTransition(() => {
      router.push('/tickets');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    if (newSort !== 'newest') {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    startTransition(() => {
      router.push(`/tickets${params.toString() ? `?${params}` : ''}`);
    });
  };

  const hasFilters = !!(initialQuery || initialMinPrice || initialMaxPrice);

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-3">
        {/* Search input */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets..."
            className="input-field pl-10"
          />
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? 'Searching...' : 'Search'}
        </button>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
          aria-label="Toggle filters"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
        </button>
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="glass-card p-4 animate-fade-in">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[120px]">
              <label className="label">Min Price ($)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="label">Max Price ($)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="label">Sort By</label>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={applyFilters} className="btn btn-primary btn-sm">
                Apply
              </button>
              {hasFilters && (
                <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
