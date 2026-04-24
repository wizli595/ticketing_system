import Link from 'next/link';
import { redirect } from 'next/navigation';
import { fetchCurrentUser, fetchMyTickets, fetchOrders } from '@/lib/server-actions';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Motion';

export const metadata = {
  title: 'Profile - GitTix',
};

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await fetchCurrentUser();

  if (!user) {
    redirect('/signin');
  }

  const [myTickets, orderData] = await Promise.all([
    fetchMyTickets(),
    fetchOrders(1, 50),
  ]);

  const orders = orderData.orders;
  const initial = user.email.charAt(0).toUpperCase();
  const completedOrders = orders.filter((o) => o.status === 'complete');
  const pendingOrders = orders.filter((o) => o.status === 'created' || o.status === 'awaiting:payment');
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.ticket.price, 0);
  const totalEarned = myTickets.filter((t) => t.orderId).reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="section py-10">
      <div className="max-w-4xl mx-auto">
        {/* Profile header */}
        <FadeIn>
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-2xl font-heading font-bold shadow-glow flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {user.email}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Active account
                </p>
              </div>
              <Link href="/tickets/new" className="hidden sm:inline-flex btn btn-accent cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Sell Ticket
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Stats grid */}
        <FadeIn delay={0.1}>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StaggerItem>
              <StatCard label="Tickets Listed" value={String(myTickets.length)} icon="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </StaggerItem>
            <StaggerItem>
              <StatCard label="Orders Made" value={String(orders.length)} icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </StaggerItem>
            <StaggerItem>
              <StatCard label="Total Spent" value={`$${(totalSpent / 100).toFixed(2)}`} icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </StaggerItem>
            <StaggerItem>
              <StatCard label="Total Earned" value={`$${(totalEarned / 100).toFixed(2)}`} icon="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </StaggerItem>
          </StaggerContainer>
        </FadeIn>

        {/* Quick links */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <QuickLink href="/tickets/my" label="My Listings" count={myTickets.length} icon="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            <QuickLink href="/orders" label="My Orders" count={orders.length} icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            <QuickLink href="/tickets" label="Browse Tickets" icon="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </div>
        </FadeIn>

        {/* Recent activity */}
        {(pendingOrders.length > 0 || completedOrders.length > 0) && (
          <FadeIn delay={0.3}>
            <div className="glass-card p-6">
              <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {pendingOrders.slice(0, 3).map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{order.ticket.title}</p>
                        <p className="text-xs text-slate-400">Awaiting payment</p>
                      </div>
                    </div>
                    <span className="text-sm font-heading font-bold text-slate-900 dark:text-white tabular-nums flex-shrink-0 ml-3">
                      ${(order.ticket.price / 100).toFixed(2)}
                    </span>
                  </Link>
                ))}
                {completedOrders.slice(0, 3).map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{order.ticket.title}</p>
                        <p className="text-xs text-slate-400">Completed</p>
                      </div>
                    </div>
                    <span className="text-sm font-heading font-bold text-emerald-600 dark:text-emerald-400 tabular-nums flex-shrink-0 ml-3">
                      ${(order.ticket.price / 100).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-heading text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</p>
    </div>
  );
}

function QuickLink({ href, label, count, icon }: { href: string; label: string; count?: number; icon: string }) {
  return (
    <Link href={href} className="glass-card-hover p-5 flex items-center gap-4 cursor-pointer group">
      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 flex items-center justify-center transition-colors flex-shrink-0">
        <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{label}</p>
        {count !== undefined && (
          <p className="text-xs text-slate-400">{count} items</p>
        )}
      </div>
      <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}
