// src/components/reviews/BusinessReviewsDashboard.tsx - SIMPLIFIED
"use client";

import { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import ReviewStats from "./ReviewStat";

// Simple types (no imports needed)
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  ownerReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  reviewer?: { id: string; name: string | null };
  business?: { id: string; name: string };
}

export default function BusinessReviewsDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch reviews - backend handles authentication
  const fetchReviews = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews/manage");
      const data = await response.json();

      if (response.status === 401) {
        setError("Please login to access this page");
        return;
      }

      if (response.status === 403) {
        setError("Access denied. Business owners only.");
        return;
      }

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
    fetchReviews();
  }, []);

  // Handle reply submission
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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
        <p className="text-gray-600 mt-2">
          View and respond to customer reviews for your businesses
        </p>
      </div>

      {/* Show errors if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          {error.includes("login") && (
            <a
              href="/login"
              className="mt-2 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Go to Login
            </a>
          )}
        </div>
      )}

      {/* Only show content if no error */}
      {!error && (
        <>
          {/* Stats Overview */}
          <ReviewStats reviews={reviews} />

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Reviews List */}
          {!loading && reviews.length === 0 ? (
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
                You don't have any reviews for your businesses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReplySubmit={handleReplySubmit}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
