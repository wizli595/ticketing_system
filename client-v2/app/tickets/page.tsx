import Link from 'next/link';
import { fetchTickets } from '@/lib/server-actions';
import { Ticket } from '@/lib/api';
import { TicketSearch } from '@/components/TicketSearch';
import { StaggerContainer, StaggerItem } from '@/components/Motion';

export const revalidate = 0;

interface TicketsPageProps {
  searchParams: Promise<{ q?: string; minPrice?: string; maxPrice?: string; sort?: string }>;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const params = await searchParams;
  const allTickets = await fetchTickets();
  let available = allTickets.filter((ticket: any) => !ticket.orderId);

  // Filter by search query
  const query = params.q?.trim().toLowerCase();
  if (query) {
    available = available.filter((t) => t.title.toLowerCase().includes(query));
  }

  // Filter by price range (prices are in cents)
  const minPrice = params.minPrice ? parseFloat(params.minPrice) * 100 : null;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) * 100 : null;
  if (minPrice !== null && !isNaN(minPrice)) {
    available = available.filter((t) => t.price >= minPrice);
  }
  if (maxPrice !== null && !isNaN(maxPrice)) {
    available = available.filter((t) => t.price <= maxPrice);
  }

  // Sort
  const sort = params.sort || 'newest';
  if (sort === 'price-low') {
    available.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    available.sort((a, b) => b.price - a.price);
  }

  const totalAvailable = allTickets.filter((t: any) => !t.orderId).length;
  const isFiltered = !!(query || minPrice || maxPrice);

  return (
    <div className="section py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Available Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Browse and purchase event tickets</p>
        </div>
        <Link href="/tickets/new" className="hidden sm:inline-flex btn btn-accent cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Sell Ticket
        </Link>
      </div>

      {/* Search & Filters */}
      <TicketSearch
        initialQuery={params.q || ''}
        initialMinPrice={params.minPrice || ''}
        initialMaxPrice={params.maxPrice || ''}
        initialSort={params.sort || 'newest'}
      />

      {/* Results */}
      {available.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {isFiltered ? (
            <>
              <p className="text-slate-500 dark:text-slate-400 mb-2 text-lg">No tickets match your search</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Try different keywords or remove filters</p>
              <Link href="/tickets" className="btn btn-outline cursor-pointer">Clear Filters</Link>
            </>
          ) : (
            <>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">No tickets available at the moment</p>
              <Link href="/tickets/new" className="btn btn-primary cursor-pointer">Create First Ticket</Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isFiltered
                ? `${available.length} of ${totalAvailable} tickets`
                : `${available.length} ticket${available.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {available.map((ticket: Ticket) => (
              <StaggerItem key={ticket.id}>
                <TicketCard ticket={ticket} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      )}
    </div>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link href={`/tickets/${ticket.id}`} className="glass-card-hover p-6 group cursor-pointer block">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
          {ticket.title}
        </h3>
        <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors ml-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-mono">
        {ticket.id.slice(0, 12)}...
      </p>
      <p className="font-heading text-2xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">
        ${(ticket.price / 100).toFixed(2)}
      </p>
    </Link>
  );
}
