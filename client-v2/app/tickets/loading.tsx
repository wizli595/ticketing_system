export default function TicketsLoading() {
  return (
    <div className="section py-10">
      <div className="mb-10">
        <div className="skeleton h-9 w-56 mb-2" />
        <div className="skeleton h-5 w-72" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="skeleton h-5 w-3/4 mb-3" />
            <div className="skeleton h-3 w-1/3 mb-4" />
            <div className="skeleton h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
