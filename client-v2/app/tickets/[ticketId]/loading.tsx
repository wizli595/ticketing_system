export default function TicketDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse space-y-8">
      {/* Title skeleton */}
      <div className="space-y-4">
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-3/4" />
        <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-1/2" />
      </div>

      {/* Main content card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-soft p-8 space-y-6">
        {/* Price section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 border-b border-gray-200">
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gradient-to-r from-primary-200 to-primary-100 rounded w-3/4" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/4" />
            <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/3" />
          </div>
        </div>

        {/* Form skeleton */}
        <div className="space-y-4">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-full" />
          <div className="h-12 bg-gradient-to-r from-primary-200 to-primary-100 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
}
