import { fetchOrder } from '@/lib/order-actions';
import { fetchCurrentUser } from '@/lib/server-actions';
import { OrderDetailClient } from './order-detail-client';
import Link from 'next/link';

export const revalidate = 0;

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const [order, currentUser] = await Promise.all([
    fetchOrder(orderId),
    fetchCurrentUser(),
  ]);

  if (!order) {
    return (
      <div className="section py-10">
        <div className="max-w-lg mx-auto glass-card p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="font-heading font-semibold text-slate-900 dark:text-white mb-1">Order not found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This order may not exist or you may not have access.</p>
          <Link href="/orders" className="btn btn-primary cursor-pointer">Back to Orders</Link>
        </div>
      </div>
    );
  }

  return <OrderDetailClient initialOrder={order} userEmail={currentUser?.email || null} />;
}
