export default function TicketsLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2 mb-8">
        <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
        <div className="h-6 w-96 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Grid of skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="card animate-pulse"
          >
            <div className="card-body flex flex-col h-full">
              {/* Title skeleton */}
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 mb-4" />
              
              {/* ID skeleton */}
              <div className="space-y-2 mb-4 flex-grow">
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2" />
              </div>
              
              {/* Price skeleton */}
              <div className="h-8 bg-gradient-to-r from-primary-200 to-primary-100 rounded w-1/3 mb-4" />
              
              {/* Button skeleton */}
              <div className="h-10 bg-gradient-to-r from-primary-200 to-primary-100 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
