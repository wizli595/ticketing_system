import Link from 'next/link';
import { fetchMyTickets } from '@/lib/server-actions';
import { Ticket } from '@/lib/api';

export const revalidate = 0;

export const metadata = {
  title: 'My Listings - GitTix',
  description: 'Manage your listed tickets',
};

export default async function MyTicketsPage() {
  const tickets = await fetchMyTickets();

  return (
    <div className="section py-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">My Listings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tickets you have listed for sale</p>
        </div>
        <Link href="/tickets/new" className="hidden sm:inline-flex btn btn-accent cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Listing
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 mb-2 text-lg">You haven&apos;t listed any tickets yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Start selling by creating your first listing</p>
          <Link href="/tickets/new" className="btn btn-primary cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Listing
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {tickets.length} listing{tickets.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket: Ticket) => (
              <MyTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MyTicketCard({ ticket }: { ticket: Ticket }) {
  const hasOrder = !!(ticket as any).orderId;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 flex-1">
          {ticket.title}
        </h3>
        <span className={`badge ml-2 flex-shrink-0 ${hasOrder ? 'badge-warning' : 'badge-success'}`}>
          {hasOrder ? 'Reserved' : 'Available'}
        </span>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-mono">
        {ticket.id.slice(0, 12)}...
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-700/40">
        <p className="font-heading text-xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">
          ${(ticket.price / 100).toFixed(2)}
        </p>
        <Link
          href={`/tickets/${ticket.id}`}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors cursor-pointer"
        >
          View
        </Link>
      </div>
    </div>
  );
}
