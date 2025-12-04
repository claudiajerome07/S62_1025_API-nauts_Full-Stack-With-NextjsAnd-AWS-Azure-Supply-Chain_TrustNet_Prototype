export default function GiveEndorsementLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Loading Skeleton */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-purple-500 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-purple-400 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Main Content Loading */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-8">
          <div className="animate-pulse space-y-8">
            {/* Business Info Loading */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mr-6"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
            </div>

            {/* Form Loading */}
            <div className="space-y-6">
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-12 bg-gray-100 rounded"></div>
              </div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
              </div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-gray-100 rounded-full w-20"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="h-12 bg-gray-200 rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
