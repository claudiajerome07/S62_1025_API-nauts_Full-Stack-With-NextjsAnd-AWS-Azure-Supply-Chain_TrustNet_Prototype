// src/components/reviews/BusinessReviews.tsx (RENAMED for single business)
"use client";

import { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  ownerReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  reviewer?: { id: string; name: string | null; avatar?: string | null };
}

interface BusinessReviewsProps {
  businessId: string;
  isOwner?: boolean; // Is the current user the owner of this business?
}

export default function BusinessReviews({
  businessId,
  isOwner = false,
}: BusinessReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5, // Show fewer on business profile
    sort: "newest" as "newest" | "highest" | "lowest",
  });

  // Fetch reviews for this specific business
  const fetchReviews = async () => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        businessId,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sort: filters.sort,
      });

      const response = await fetch(`/api/reviews?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      } else {
        setError(data.error || "Failed to fetch reviews");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchReviews();
    }
  }, [businessId, filters]);

  // Handle reply submission (only for owners)
  const handleReplySubmit = async (reviewId: string, reply: string) => {
    try {
      const response = await fetch("/api/reviews/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, reply }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the review in state
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  ownerReply: data.data.ownerReply,
                  repliedAt: data.data.repliedAt,
                }
              : review
          )
        );
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error };
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
      return { success: false, message: "Network error" };
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Count reviews by rating
  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="mt-12">
      {/* Reviews Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="ml-1 text-gray-600">out of 5</span>
            </div>
            <span className="text-gray-600">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        {/* Sort Options - only show if there are reviews */}
        {reviews.length > 0 && (
          <div className="mt-4 md:mt-0">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Sort by:
            </label>
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: e.target.value as any,
                  page: 1,
                }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        )}
      </div>

      {/* Rating Distribution */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Breakdown
          </h3>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating as keyof typeof ratingCounts];
            const percentage =
              reviews.length > 0 ? (count / reviews.length) * 100 : 0;

            return (
              <div key={rating} className="flex items-center mb-3">
                <div className="w-16 text-sm text-gray-600">
                  {rating} star{rating !== 1 ? "s" : ""}
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && (
        <>
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-500">
                Be the first to review this business!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReplySubmit={isOwner ? handleReplySubmit : undefined}
                  showReplyForm={isOwner}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {reviews.length >= filters.limit && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, limit: prev.limit + 5 }))
                }
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
