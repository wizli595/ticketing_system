'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket } from '@/lib/api';
import { updateTicket, deleteTicket } from '@/lib/server-actions';
import { useToast } from '@/components/Toast';
import { Spinner } from '@/components/FormComponents';

interface MyTicketCardsProps {
  initialTickets: Ticket[];
}

export function MyTicketCards({ initialTickets }: MyTicketCardsProps) {
  const [tickets, setTickets] = useState(initialTickets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <MyTicketCard
          key={ticket.id}
          ticket={ticket}
          onDelete={(id) => setTickets((prev) => prev.filter((t) => t.id !== id))}
          onUpdate={(id, data) =>
            setTickets((prev) =>
              prev.map((t) => (t.id === id ? { ...t, ...data } : t))
            )
          }
        />
      ))}
    </div>
  );
}

interface MyTicketCardProps {
  ticket: Ticket;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Ticket>) => void;
}

function MyTicketCard({ ticket, onDelete, onUpdate }: MyTicketCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const hasOrder = !!(ticket as any).orderId;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState((ticket.price / 100).toFixed(2));
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const priceInCents = Math.round(parseFloat(price) * 100);
    const result = await updateTicket(ticket.id, { title, price: priceInCents });
    setIsLoading(false);

    if (result.success) {
      onUpdate(ticket.id, { title, price: priceInCents });
      setEditing(false);
      toast('Ticket updated', 'success');
      router.refresh();
    } else {
      toast(result.error || 'Failed to update', 'error');
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteTicket(ticket.id);
    setIsLoading(false);

    if (result.success) {
      onDelete(ticket.id);
      toast('Ticket deleted', 'success');
    } else {
      toast(result.error || 'Failed to delete', 'error');
      setConfirmDelete(false);
    }
  };

  if (editing) {
    return (
      <div className="glass-card p-6">
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="label">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              className="input-field"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={isLoading} className="flex-1 btn btn-primary btn-sm">
              {isLoading ? <Spinner /> : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setTitle(ticket.title);
                setPrice((ticket.price / 100).toFixed(2));
              }}
              disabled={isLoading}
              className="flex-1 btn btn-outline btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="flex items-center gap-2">
          {!hasOrder && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Edit ticket"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    {isLoading ? <Spinner className="w-3 h-3" /> : 'Yes'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  title="Delete ticket"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              )}
            </>
          )}

          <Link
            href={`/tickets/${ticket.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="View ticket"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
