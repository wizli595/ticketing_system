export default function MyTicketsLoading() {
  return (
    <div className="section py-10">
      <div className="mb-10">
        <div className="skeleton h-9 w-44 mb-2" />
        <div className="skeleton h-5 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex justify-between mb-3">
              <div className="skeleton h-5 w-2/3" />
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
            <div className="skeleton h-3 w-1/3 mb-4" />
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/40">
              <div className="skeleton h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
