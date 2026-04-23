'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/tickets?q=${encodeURIComponent(q)}` : '/tickets');
  };

  const handleSuggestion = (term: string) => {
    router.push(`/tickets?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <div className="flex bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden focus-within:border-white/40 focus-within:bg-white/15 transition-all">
          <div className="flex items-center pl-5">
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, concerts, conferences..."
            className="flex-1 bg-transparent text-white placeholder-white/50 px-4 py-4 text-base focus:outline-none"
          />
          <button
            type="submit"
            className="m-1.5 px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Popular searches */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5 max-w-2xl mx-auto">
        <span className="text-white/40 text-sm">Popular:</span>
        {['Concert', 'Conference', 'Jazz', 'Tech', 'Sports'].map((term) => (
          <button
            key={term}
            onClick={() => handleSuggestion(term)}
            className="px-3 py-1 text-sm text-white/70 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-lg transition-all cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
