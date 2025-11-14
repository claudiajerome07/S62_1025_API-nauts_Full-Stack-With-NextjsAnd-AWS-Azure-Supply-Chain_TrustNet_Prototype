"use client";

import { Star, CheckCircle } from "lucide-react";

interface ReviewCardProps {
  reviewerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // formatted string
  isVerified?: boolean;
}

export default function ReviewCard({
  reviewerName,
  rating,
  comment,
  date,
  isVerified = false,
}: ReviewCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900">{reviewerName}</h4>
          {isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>

        <span className="text-sm text-gray-500">{date}</span>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-500" : "text-gray-300"
            }`}
            fill={i < rating ? "#facc15" : "none"}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 text-sm leading-relaxed">{comment}</p>
    </div>
  );
}
