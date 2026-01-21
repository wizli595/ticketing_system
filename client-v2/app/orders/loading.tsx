export default function OrdersLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2 mb-8">
        <div className="h-10 w-48 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
        <div className="h-6 w-80 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Grid of skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card animate-pulse overflow-hidden">
            <div className="card-body">
              {/* Header with title and status */}
              <div className="flex items-start justify-between mb-4">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 flex-1" />
                <div className="h-6 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full w-20 ml-2" />
              </div>

              {/* Order info skeleton */}
              <div className="space-y-3 mb-4 text-sm">
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-2/3" />
              </div>

              {/* Price skeleton */}
              <div className="pt-4 border-t border-gray-200">
                <div className="h-8 bg-gradient-to-r from-primary-200 to-primary-100 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
