import { OrderForm } from '@/components/OrderForm';
import { fetchTicket } from '@/lib/server-actions';

export const revalidate = 0; // Always fetch fresh data

interface TicketDetailPageProps {
  params: Promise<{
    ticketId: string;
  }>;
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">Ticket not found</p>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">The ticket you are looking for may have been sold or removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{ticket.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Review ticket details and complete your purchase</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-none p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Price</p>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              ${(ticket.price / 100).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Ticket ID</p>
            <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all bg-gray-50 dark:bg-gray-800 p-3 rounded">
              {ticket.id}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Listed By</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">User ID: {ticket.userId}</p>
          </div>
        </div>

        <OrderForm ticketId={ticket.id} />
      </div>
    </div>
  );
}
