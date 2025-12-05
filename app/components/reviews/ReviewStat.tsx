// src/components/reviews/ReviewStats.tsx
"use client";



// Types defined right here in the same file
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  ownerReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  businessId: string;
  reviewerId: string;
  reviewer?: {
    id: string;
    name: string | null;
    avatar?: string | null;
  };
}

interface ReviewStatsProps {
  reviews: Review[];
}

interface RatingDistributionItem {
  rating: number;
  stars: string;
  count: number;
  percentage: number;
}

// interface ChartDataItem {
//   name: string;
//   reviews: number;
// }

export default function ReviewStats({ reviews }: ReviewStatsProps) {
  // Calculate statistics
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  // Count reviews by rating
  const ratingDistribution: RatingDistributionItem[] = [5, 4, 3, 2, 1].map(
    (rating) => {
      const count = reviews.filter((r) => r.rating === rating).length;
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

      return {
        rating,
        stars: "★".repeat(rating),
        count,
        percentage: parseFloat(percentage.toFixed(1)),
      };
    }
  );

  // Replies statistics
  const repliedReviews = reviews.filter((r) => r.ownerReply).length;
  const replyRate =
    totalReviews > 0 ? (repliedReviews / totalReviews) * 100 : 0;

  // Recent activity
  const recentReviews = reviews
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Format data for chart (if using recharts)
  // const chartData: ChartDataItem[] = ratingDistribution.map((item) => ({
  //   name: `${item.rating}★`,
  //   reviews: item.count,
  // }));

  // Simple star rendering function
  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizes[size]} ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Review Statistics
        </h3>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p>
            No reviews yet. Statistics will appear here when you have reviews.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Review Statistics
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Average Rating Card */}
        <div className="bg-blue-50 rounded-lg p-5">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">
                Average Rating
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {averageRating.toFixed(1)}
                <span className="text-lg text-blue-700 ml-1">/5</span>
              </p>
              <div className="mt-1">
                {renderStars(Math.round(averageRating), "sm")}
              </div>
            </div>
          </div>
        </div>

        {/* Total Reviews Card */}
        <div className="bg-green-50 rounded-lg p-5">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1.205V21m0 0h-6m6 0v-3"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">
                Total Reviews
              </p>
              <p className="text-3xl font-bold text-green-900">
                {totalReviews}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {repliedReviews} replied • {totalReviews - repliedReviews}{" "}
                pending
              </p>
            </div>
          </div>
        </div>

        {/* Reply Rate Card */}
        <div className="bg-purple-50 rounded-lg p-5">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Reply Rate</p>
              <p className="text-3xl font-bold text-purple-900">
                {replyRate.toFixed(0)}
                <span className="text-lg text-purple-700">%</span>
              </p>
              <p className="text-sm text-purple-600">
                {repliedReviews} of {totalReviews} replied
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-8">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Rating Distribution
        </h4>
        <div className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.rating} className="flex items-center">
              <div className="w-20">
                <span className="text-yellow-500 font-medium">
                  {item.stars}
                </span>
                <span className="text-gray-600 text-sm ml-2">
                  ({item.rating})
                </span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-24 flex justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {item.count}
                </span>
                <span className="text-sm text-gray-500">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentReviews.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Recent Reviews
          </h4>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-medium">
                      {review.reviewer?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.reviewer?.name || "Anonymous"}
                    </p>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    review.ownerReply
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  }`}
                >
                  {review.ownerReply ? "✓ Replied" : "⏳ Pending"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-900">
              {ratingDistribution[0].count}
            </div>
            <div className="text-sm text-gray-600">5-Star Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-900">
              {ratingDistribution[1].count}
            </div>
            <div className="text-sm text-gray-600">4-Star Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-900">
              {ratingDistribution[2].count}
            </div>
            <div className="text-sm text-gray-600">3-Star Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-900">
              {ratingDistribution[3].count + ratingDistribution[4].count}
            </div>
            <div className="text-sm text-gray-600">Low Ratings (1-2★)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
