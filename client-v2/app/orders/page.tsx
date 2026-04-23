import { Order } from '@/lib/api';
import Link from 'next/link';
import { fetchOrders } from '@/lib/server-actions';

export const revalidate = 0;

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  created: { label: 'Pending', className: 'badge-info' },
  'awaiting:payment': { label: 'Awaiting Payment', className: 'badge-warning' },
  complete: { label: 'Completed', className: 'badge-success' },
  cancelled: { label: 'Cancelled', className: 'badge-danger' },
};

export default async function OrdersPage() {
  const orders = await fetchOrders();

  return (
    <div className="section py-10">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">My Orders</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage your ticket purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">No orders yet</p>
          <Link href="/tickets" className="btn btn-primary cursor-pointer">Browse Tickets</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order: Order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const status = STATUS_MAP[order.status] || { label: order.status, className: 'badge-info' };
  const price = (order.ticket.price / 100).toFixed(2);
  const canPay = order.status === 'created' || order.status === 'awaiting:payment';

  return (
    <Link href={`/orders/${order.id}`} className="glass-card-hover p-6 group cursor-pointer block">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
          {order.ticket.title}
        </h3>
        <span className={`badge ml-2 flex-shrink-0 ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400 mb-4">
        <p className="font-mono text-xs">{order.id.slice(0, 12)}...</p>
        <p>{new Date(order.expiresAt).toLocaleDateString()}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-700/40">
        <p className="font-heading text-xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">${price}</p>
        {canPay && (
          <span className="text-xs text-accent-600 dark:text-accent-400 font-semibold">Pay now</span>
        )}
      </div>
    </Link>
  );
}
