import Link from 'next/link';
import { OrderForm } from '@/components/OrderForm';
import { fetchTicket } from '@/lib/server-actions';

export const revalidate = 0;

interface TicketDetailPageProps {
  params: Promise<{ ticketId: string }>;
}

export async function generateMetadata({ params }: TicketDetailPageProps) {
  const { ticketId } = await params;
  const ticket = await fetchTicket(ticketId);
  return {
    title: ticket ? `${ticket.title} - GitTix` : 'Ticket Not Found - GitTix',
    description: ticket ? `Purchase ${ticket.title} for $${(ticket.price / 100).toFixed(2)}` : 'Ticket not found',
  };
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { ticketId } = await params;
  const ticket = await fetchTicket(ticketId);

  if (!ticket) {
    return (
      <div className="section py-10">
        <div className="max-w-lg mx-auto glass-card p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="font-heading font-semibold text-slate-900 dark:text-white mb-1">Ticket not found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This ticket may have been sold or removed.</p>
          <Link href="/tickets" className="btn btn-primary cursor-pointer">Browse Tickets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/tickets" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to tickets
        </Link>

        <div className="glass-card p-8">
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-6">{ticket.title}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200/60 dark:border-slate-700/40">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium mb-1">Price</p>
              <p className="font-heading text-3xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">
                ${(ticket.price / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium mb-1">Ticket ID</p>
              <p className="text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg break-all">
                {ticket.id}
              </p>
            </div>
          </div>

          <OrderForm ticketId={ticket.id} />
        </div>
      </div>
    </div>
  );
}
