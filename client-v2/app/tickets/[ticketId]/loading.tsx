export default function TicketDetailLoading() {
  return (
    <div className="section py-10">
      <div className="max-w-2xl mx-auto">
        <div className="skeleton h-4 w-28 mb-6" />
        <div className="glass-card p-8">
          <div className="skeleton h-7 w-2/3 mb-6" />
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200/60 dark:border-slate-700/40">
            <div>
              <div className="skeleton h-3 w-12 mb-2" />
              <div className="skeleton h-9 w-24" />
            </div>
            <div>
              <div className="skeleton h-3 w-16 mb-2" />
              <div className="skeleton h-10 w-full" />
            </div>
          </div>
          <div className="skeleton h-12 w-full mb-4" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
