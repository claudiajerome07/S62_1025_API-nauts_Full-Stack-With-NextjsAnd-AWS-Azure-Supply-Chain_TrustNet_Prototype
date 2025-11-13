"use client";

import { Business } from "@prisma/client";
import Link from "next/link";
import { Star, MapPin, CheckCircle } from "lucide-react";

interface BusinessCardProps {
  business: Business & {
    owner: { name: string };
    _count: { reviews: number; endorsements: number };
  };
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const {
    id,
    name,
    description,
    category,
    location,
    trustScore,
    isVerified,
    _count,
  } = business;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {name}
              </h3>
              {isVerified && (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
              <span className="text-gray-300">•</span>
              <span className="capitalize">
                {category.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Trust Metrics */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            {/* Trust Score */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-medium text-gray-900">{trustScore}</span>
              <span className="text-gray-500">Trust Score</span>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-gray-900">
                {_count.reviews}
              </span>
              <span className="text-gray-500">Reviews</span>
            </div>

            {/* Endorsements */}
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-900">
                {_count.endorsements}
              </span>
              <span className="text-gray-500">Endorsements</span>
            </div>
          </div>
        </div>

        {/* Trust Score Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(trustScore, 100)}%` }}
          ></div>
        </div>

        {/* Action Button */}
        <Link
          href={`/businesses/${id}`}
          className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 block"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
