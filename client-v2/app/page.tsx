import Link from 'next/link';
import { Suspense } from 'react';
import { fetchTickets } from '@/lib/server-actions';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Motion';

export const revalidate = 0;

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-primary-900 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-300 rounded-full blur-[100px]" />
        </div>

        <div className="section relative py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                Trusted ticket marketplace
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Find your next
                <span className="block text-accent-400">experience</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-xl mx-auto leading-relaxed">
                Buy and sell event tickets securely. Instant delivery, transparent pricing, and buyer protection on every transaction.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tickets" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-lg cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Browse Tickets
                </Link>
                <Link href="/tickets/new" className="btn btn-lg border-2 border-white/30 text-white hover:bg-white/10 font-semibold cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  List a Ticket
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Stats */}
          <StaggerContainer className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Tickets Sold' },
              { value: '5K+', label: 'Events Listed' },
            ].map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="font-heading text-3xl md:text-4xl font-bold text-white tabular-nums">{stat.value}</p>
                <p className="text-sm text-primary-200 mt-1">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Tickets */}
      <section className="section py-20">
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Featured Tickets</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Recently listed and ready to purchase</p>
            </div>
            <Link href="/tickets" className="hidden sm:inline-flex btn btn-outline btn-sm cursor-pointer">
              View all
            </Link>
          </div>
        </FadeIn>

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedTickets />
        </Suspense>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="section">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Get your tickets in four simple steps</p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Browse', desc: 'Explore available events and find tickets you love', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
              { step: '02', title: 'Select', desc: 'Choose your ticket and review the details', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { step: '03', title: 'Pay', desc: 'Complete secure checkout with Stripe', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
              { step: '04', title: 'Receive', desc: 'Get your ticket instantly delivered', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
            ].map((item) => (
              <StaggerItem key={item.step} className="text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-primary-500 dark:text-primary-400 mb-2 font-heading tracking-wider">{item.step}</div>
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust section */}
      <section className="section py-20">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Secure Payments', desc: 'Every transaction is protected with Stripe. Your payment info never touches our servers.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
            { title: 'Auto-Release', desc: 'Unpaid orders expire after 15 minutes. Tickets automatically return to the marketplace.', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Instant Delivery', desc: 'Once payment completes, your ticket is confirmed instantly. No waiting, no delays.', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
          ].map((item) => (
            <StaggerItem key={item.title}>
              <div className="glass-card p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-slate-900">
        <div className="section py-20 text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-primary-100 mb-8 max-w-md mx-auto">Join thousands of users buying and selling tickets on GitTix.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tickets" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50 font-semibold cursor-pointer">
                Browse Tickets
              </Link>
              <Link href="/signup" className="btn btn-lg border-2 border-white/30 text-white hover:bg-white/10 font-semibold cursor-pointer">
                Create Account
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

async function FeaturedTickets() {
  const tickets = await fetchTickets();
  const available = tickets.filter((t: any) => !t.orderId).slice(0, 6);

  if (available.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
        <p className="text-slate-500 dark:text-slate-400 mb-4">No tickets available yet</p>
        <Link href="/tickets/new" className="btn btn-primary cursor-pointer">Create First Ticket</Link>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {available.map((ticket: any) => (
        <StaggerItem key={ticket.id}>
          <Link href={`/tickets/${ticket.id}`} className="glass-card-hover p-6 group cursor-pointer block">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                {ticket.title}
              </h3>
              <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <p className="font-heading text-2xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">
              ${(ticket.price / 100).toFixed(2)}
            </p>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div className="skeleton h-5 w-3/4 mb-4" />
          <div className="skeleton h-8 w-24" />
        </div>
      ))}
    </div>
  );
}
