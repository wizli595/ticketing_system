import Link from 'next/link';
import { Suspense } from 'react';
import { fetchTickets, fetchCategories } from '@/lib/server-actions';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Motion';
import { HeroSearch } from '@/components/HeroSearch';

export const revalidate = 0;

export default function LandingPage() {
  return (
    <div>
      {/* ═══════════════ HERO — Search focused ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* Background — adapts to light/dark */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/80 via-slate-50 to-slate-50 dark:from-primary-900/80 dark:via-slate-950 dark:to-slate-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/5 dark:bg-accent-500/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="section relative py-20 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-widest uppercase mb-6">
                Trusted by 10,000+ event-goers
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-5 leading-[1.08] tracking-tight">
                Discover live events.
                <br />
                <span className="bg-gradient-to-r from-accent-600 via-accent-500 to-amber-500 dark:from-accent-400 dark:via-accent-300 dark:to-amber-300 bg-clip-text text-transparent">
                  Buy with confidence.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                The marketplace where every ticket is protected, every payment is secure, and unsold orders release automatically.
              </p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <HeroSearch />
            </FadeIn>
          </div>

          {/* Stats bar */}
          <FadeIn delay={0.35}>
            <div className="mt-20 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200/50 dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/5">
                {[
                  { value: '10K+', label: 'Active Users', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
                  { value: '50K+', label: 'Tickets Sold', icon: 'M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z' },
                  { value: '15 min', label: 'Auto-Release', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { value: '100%', label: 'Buyer Protection', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 px-5 py-4 bg-white/60 dark:bg-white/[0.02]">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                    <div>
                      <p className="font-heading text-lg font-bold text-slate-900 dark:text-white tabular-nums leading-tight">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="section py-16 border-b border-slate-100 dark:border-slate-800/50">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
            <Link href="/tickets" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium cursor-pointer">
              View all
            </Link>
          </div>
        </FadeIn>
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesGrid />
        </Suspense>
      </section>

      {/* ═══════════════ FEATURED LISTINGS ═══════════════ */}
      <section className="section py-16">
        <FadeIn>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-1">Marketplace</p>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Recently Listed</h2>
            </div>
            <Link href="/tickets" className="btn btn-outline btn-sm cursor-pointer">
              View all
            </Link>
          </div>
        </FadeIn>

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedTickets />
        </Suspense>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 border-y border-slate-100 dark:border-slate-800/50">
        <div className="section">
          <FadeIn className="text-center mb-14">
            <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-1">Simple process</p>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">How GitTix works</h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '1', title: 'Find an event', desc: 'Search thousands of listings or browse by category', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
              { n: '2', title: 'Place your order', desc: 'Ticket is reserved for you with a 15-minute hold', icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' },
              { n: '3', title: 'Pay securely', desc: 'Checkout with Stripe — your card info never touches us', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
              { n: '4', title: 'Get confirmed', desc: 'Instant confirmation — no delays, no waiting', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map((step, i) => (
              <StaggerItem key={step.n}>
                <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 h-full">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-10 -right-3 w-6 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">STEP {step.n}</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ TRUST & SAFETY ═══════════════ */}
      <section className="section py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2">
            <FadeIn>
              <p className="text-accent-600 dark:text-accent-400 text-sm font-semibold mb-1">Built for trust</p>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">Your money is safe. Always.</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Every transaction runs through Stripe with full buyer protection. If a seller doesn&apos;t deliver, you&apos;re covered. Orders that aren&apos;t paid within 15 minutes automatically release the ticket back to the marketplace — no inventory gets stuck.
              </p>
              <Link href="/signup" className="btn btn-primary cursor-pointer">
                Create Free Account
              </Link>
            </FadeIn>
          </div>

          <div className="lg:col-span-3">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Stripe Payments', desc: 'PCI-compliant card processing. Your card number never hits our servers.', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
                { title: '15-Min Auto-Release', desc: 'Unpaid orders expire and tickets return to the marketplace automatically.', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
                { title: 'Instant Confirmation', desc: 'Payment completes, ticket is yours. No manual review, no delays.', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
                { title: 'Version-Safe Updates', desc: 'Optimistic concurrency control prevents double-selling and race conditions.', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ═══════════════ SELLER CTA ═══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-100/60 via-slate-100 to-slate-100 dark:from-accent-900/40 dark:via-slate-950 dark:to-slate-950" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="section relative py-20">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="text-accent-600 dark:text-accent-400 text-sm font-semibold tracking-widest uppercase mb-4">For sellers</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Have tickets to sell?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                List your tickets in seconds. Set your price. Get paid when someone buys. No listing fees, no hidden charges.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/tickets/new" className="btn btn-lg bg-accent-500 hover:bg-accent-600 text-white font-semibold cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  List a Ticket
                </Link>
                <Link href="/tickets" className="btn btn-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-semibold cursor-pointer">
                  See what&apos;s selling
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════ SERVER COMPONENTS ═══════════════ */

async function FeaturedTickets() {
  const tickets = await fetchTickets();
  const available = tickets.filter((t: any) => !t.orderId).slice(0, 6);

  if (available.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
        <svg className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">No tickets listed yet. Be the first.</p>
        <Link href="/tickets/new" className="btn btn-primary btn-sm cursor-pointer">Create Listing</Link>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {available.map((ticket: any) => (
        <StaggerItem key={ticket.id}>
          <Link
            href={`/tickets/${ticket.id}`}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                {ticket.title}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{ticket.id.slice(0, 8)}</p>
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <span className="font-heading text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                ${(ticket.price / 100).toFixed(2)}
              </span>
              <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

const FALLBACK_CATEGORIES = [
  { name: 'Concerts', slug: 'concerts', icon: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' },
  { name: 'Sports', slug: 'sports', icon: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z' },
  { name: 'Conference', slug: 'conference', icon: 'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' },
  { name: 'Theatre', slug: 'theatre', icon: 'M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z' },
  { name: 'Festival', slug: 'festival', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
  { name: 'Workshop', slug: 'workshop', icon: 'M11.42 15.17l-5.25 5.25a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06l5.25-5.25m5.06-3.5l3.5 3.5a.75.75 0 010 1.06l-5.25 5.25m-10.06 0L2.25 12 12 2.25l9.75 9.75' },
];

async function CategoriesGrid() {
  const categories = await fetchCategories();
  const items = categories.length > 0
    ? categories.map((c) => ({ name: c.name, slug: c.slug, icon: c.icon }))
    : FALLBACK_CATEGORIES;

  return (
    <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map((cat) => (
        <StaggerItem key={cat.slug}>
          <Link
            href={`/tickets?q=${cat.slug}`}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 flex items-center justify-center transition-colors">
              {cat.icon ? (
                <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                </svg>
              ) : (
                <span className="text-sm font-bold text-slate-400 group-hover:text-primary-500">{cat.name.charAt(0)}</span>
              )}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
              {cat.name}
            </span>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 skeleton rounded-xl" />
          <div className="w-16 h-4 skeleton rounded" />
        </div>
      ))}
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex-1">
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
          <div className="skeleton h-5 w-16 ml-4" />
        </div>
      ))}
    </div>
  );
}
