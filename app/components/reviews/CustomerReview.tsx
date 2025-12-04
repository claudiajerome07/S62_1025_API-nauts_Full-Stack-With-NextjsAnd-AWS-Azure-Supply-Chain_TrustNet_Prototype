// src/components/reviews/CustomerReviews.tsx
"use client";

import { useState, useEffect } from "react";

interface CustomerReviewsProps {
  businessId: string;
}

export default function CustomerReviews({ businessId }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews for this business (public endpoint)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?businessId=${businessId}`);
        const data = await response.json();
        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [businessId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="font-medium">
                  {review.reviewer?.name || "Anonymous"}
                </div>
                <div className="ml-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              {review.ownerReply && (
                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800">
                    Business Response:
                  </div>
                  <p className="text-blue-700">{review.ownerReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
