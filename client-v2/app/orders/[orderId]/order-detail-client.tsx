'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import StripeCheckout from 'react-stripe-checkout';
import { processPayment, cancelOrder } from '@/lib/order-actions';
import { Spinner } from '@/components/FormComponents';
import { useToast } from '@/components/Toast';

interface Order {
  id: string;
  version: number;
  userId: string;
  status: 'created' | 'complete' | 'cancelled' | 'awaiting:payment';
  ticket: { id: string; title: string; price: number };
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailClientProps {
  initialOrder: Order;
  userEmail: string | null;
}

export function OrderDetailClient({ initialOrder, userEmail }: OrderDetailClientProps) {
  const { toast } = useToast();
  const [order, setOrder] = useState(initialOrder);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const checkoutRef = useRef<any>(null);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, new Date(order.expiresAt).getTime() - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0 && order.status !== 'complete') {
        setOrder((prev) => ({ ...prev, status: 'cancelled' }));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.expiresAt, order.status]);

  const formatTime = (ms: number) => {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 1000 / 60) % 60);
    const h = Math.floor(ms / 1000 / 60 / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = new Date(order.expiresAt).getTime() - new Date(order.createdAt).getTime();
    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    return Math.max(0, 100 - (elapsed / total) * 100);
  };

  const handleToken = async (token: any) => {
    setIsProcessing(true);
    try {
      const result = await processPayment(token.id, order.id);
      if (result.success) {
        setOrder((prev) => ({ ...prev, status: 'complete' }));
        toast('Payment successful! Your ticket has been purchased.', 'success');
      } else {
        toast(result.error || 'Payment failed. Please try again.', 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelOrder(order.id);
      if (result.success) {
        setOrder((prev) => ({ ...prev, status: 'cancelled' }));
        toast('Order cancelled. The ticket is now available again.', 'info');
      } else {
        toast(result.error || 'Failed to cancel order.', 'error');
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const isExpired = order.status === 'cancelled' || timeLeft === 0;
  const isCompleted = order.status === 'complete';
  const price = (order.ticket.price / 100).toFixed(2);
  const progress = getProgress();

  return (
    <div className="section py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to orders
        </Link>

        <div className="glass-card p-8">
          {/* Status + Timer */}
          <div className="flex items-center justify-between mb-6">
            <span className={`badge ${isCompleted ? 'badge-success' : isExpired ? 'badge-danger' : 'badge-warning'}`}>
              {isCompleted ? 'Completed' : isExpired ? 'Expired' : 'Pending Payment'}
            </span>
            {!isCompleted && !isExpired && (
              <span className="font-heading text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                {formatTime(timeLeft)}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {!isCompleted && (
            <div className="mb-8">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${
                    isExpired ? 'bg-red-500' : progress > 25 ? 'bg-primary-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {isExpired ? 'Order has expired' : 'Time remaining to complete payment'}
              </p>
            </div>
          )}

          {/* Ticket info */}
          <div className="mb-8 pb-8 border-b border-slate-200/60 dark:border-slate-700/40">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-4">{order.ticket.title}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Ticket ID</p>
                <p className="font-mono text-slate-600 dark:text-slate-300 text-xs break-all">{order.ticket.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
                <p className="font-mono text-slate-600 dark:text-slate-300 text-xs break-all">{order.id}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          {!isCompleted && !isExpired ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Amount</span>
                <span className="font-heading text-3xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">${price}</span>
              </div>

              {process.env.NEXT_PUBLIC_STRIPE_KEY ? (
                <>
                  <StripeCheckout
                    ref={checkoutRef}
                    stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
                    token={handleToken}
                    amount={order.ticket.price}
                    name={order.ticket.title}
                    description={`Purchase ticket for ${order.ticket.title}`}
                    email={userEmail || undefined}
                    currency="USD"
                    billingAddress={false}
                    zipCode={false}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => checkoutRef.current?.onClick()}
                      disabled={isProcessing || isCancelling}
                      type="button"
                      className="flex-1 btn btn-accent btn-lg"
                    >
                      {isProcessing ? <Spinner /> : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      )}
                      {isProcessing ? 'Processing...' : `Pay $${price}`}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isProcessing || isCancelling}
                      type="button"
                      className="btn btn-outline btn-lg text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-400"
                    >
                      {isCancelling ? <Spinner /> : 'Cancel'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Stripe is not configured. Set NEXT_PUBLIC_STRIPE_KEY to enable payments.
                  </p>
                </div>
              )}
            </div>
          ) : isExpired ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-6 text-center">
              <svg className="mx-auto h-8 w-8 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-red-700 dark:text-red-300">This order has expired</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">Please create a new order to continue</p>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-6 text-center">
              <svg className="mx-auto h-8 w-8 text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-emerald-700 dark:text-emerald-300">Payment Complete</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Your ticket has been successfully purchased</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
