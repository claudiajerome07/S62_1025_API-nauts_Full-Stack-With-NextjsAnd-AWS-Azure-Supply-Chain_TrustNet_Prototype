// src/components/reviews/ReviewCard.tsx - UPDATED
"use client";

import { useState } from "react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    ownerReply: string | null;
    repliedAt: string | null;
    createdAt: string;
    reviewer?: {
      id: string;
      name: string | null;
      avatar?: string | null;
    };
  };
  onReplySubmit?: (
    reviewId: string,
    reply: string
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  showReplyForm?: boolean;
}

export default function ReviewCard({
  review,
  onReplySubmit,
  showReplyForm = false,
}: ReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !onReplySubmit) return;

    setIsSubmitting(true);
    const result = await onReplySubmit(review.id, replyText);
    setIsSubmitting(false);

    if (result.success) {
      setIsReplying(false);
      setReplyText("");
    }
  };

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold">
              {review.reviewer?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {review.reviewer?.name || "Anonymous"}
            </h3>
            <div className="flex items-center mt-1">
              {renderStars(review.rating)}
              <span className="ml-2 text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Owner Reply Section */}
      {review.ownerReply ? (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <svg
              className="w-4 h-4 text-blue-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-900">
              Business Response
            </span>
            {review.repliedAt && (
              <span className="ml-2 text-xs text-blue-700">
                {new Date(review.repliedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-blue-800 whitespace-pre-wrap">
            {review.ownerReply}
          </p>
        </div>
      ) : showReplyForm && !review.ownerReply ? (
        // Reply Form (only for business owners)
        <div className="mt-4">
          {isReplying ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Type your response to this review..."
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {replyText.length}/500 characters
              </div>
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !replyText.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Reply"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsReplying(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              Reply to Review
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
