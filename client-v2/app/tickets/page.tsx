import { fetchTickets, Ticket } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 0; // Disable static generation, always use SSR

async function TicketsPage() {
  const tickets = await fetchTickets();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Available Tickets</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Browse and purchase event tickets from our marketplace</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center shadow-soft dark:shadow-none">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m-4 3.5V7m4 6.5v2m4 3.5V16M9 17h6"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">No tickets available at the moment.</p>
          <Link href="/tickets/new" className="btn btn-primary">
            Create First Ticket
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TicketCardProps {
  ticket: Ticket;
}

function TicketCard({ ticket }: TicketCardProps) {
  const price = (ticket.price / 100).toFixed(2);

  return (
    <div className="card group hover:shadow-elevated dark:hover:shadow-none transition-all duration-200">
      <div className="card-body flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {ticket.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
          Ticket ID: <span className="font-mono text-gray-700 dark:text-gray-300">{ticket.id.slice(0, 8)}...</span>
        </p>
        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">${price}</p>
        <Link
          href={`/tickets/${ticket.id}`}
          className="inline-block btn btn-primary w-full text-center"
        >
          View & Purchase
        </Link>
      </div>
    </div>
  );
}

export default TicketsPage;
