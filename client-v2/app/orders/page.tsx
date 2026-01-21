import { Order } from '@/lib/api';
import Link from 'next/link';
import { fetchOrders } from '@/lib/server-actions';

export const revalidate = 0; // Always fetch fresh data

const ORDER_STATUS_CONFIG = {
  created: { 
    bg: 'bg-blue-100 dark:bg-blue-950', 
    text: 'text-blue-800 dark:text-blue-200', 
    label: 'Pending Payment' 
  },
  'awaiting:payment': { 
    bg: 'bg-yellow-100 dark:bg-yellow-950', 
    text: 'text-yellow-800 dark:text-yellow-200', 
    label: 'Awaiting Payment' 
  },
  complete: { 
    bg: 'bg-green-100 dark:bg-green-950', 
    text: 'text-green-800 dark:text-green-200', 
    label: 'Completed' 
  },
  cancelled: { 
    bg: 'bg-red-100 dark:bg-red-950', 
    text: 'text-red-800 dark:text-red-200', 
    label: 'Cancelled' 
  },
};

export default async function OrdersPage() {
  const orders = await fetchOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">View and manage your ticket purchases</p>
      </div>

      {orders.length === 0 ? (
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="btn btn-primary">
            Browse Tickets
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    label: order.status,
  };

  const expiresAt = new Date(order.expiresAt);
  const isExpired = expiresAt < new Date();
  const price = (order.ticket.price / 100).toFixed(2);

  return (
    <div className="card overflow-hidden hover:shadow-elevated dark:hover:shadow-none transition-all">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {order.ticket.title}
          </h3>
          <span className={`flex-shrink-0 ml-2 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusConfig.bg} ${statusConfig.text}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Order ID: <span className="font-mono text-gray-800 dark:text-gray-200">{order.id.slice(0, 8)}...</span>
          </p>
          <p>
            Created: <span className="text-gray-800 dark:text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</span>
          </p>
          {isExpired ? (
            <p className="text-red-600 dark:text-red-400 font-medium">Expired: {expiresAt.toLocaleDateString()}</p>
          ) : (
            <p>
              Expires: <span className="text-gray-800 dark:text-gray-200">{expiresAt.toLocaleDateString()}</span>
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">${price}</p>
        </div>
      </div>
    </div>
  );
}
