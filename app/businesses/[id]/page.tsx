"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Users,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  phone: string;
  location: string | null;
  trustScore: number;
  isVerified: boolean;
  verificationMethod: string | null;
  upiVerified: boolean;
  upiId: string | null;
  createdAt: string;
  owner: {
    name: string;
    phone: string;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: {
      name: string;
    };
  }>;
  endorsements: Array<{
    id: string;
    relationship: string;
    message: string | null;
    createdAt: string;
    endorser: {
      name: string;
    };
  }>;
  analytics: {
    totalReviews: number;
    averageRating: number;
    totalEndorsements: number;
    monthlyVisits: number;
    upiTransactionVolume: number;
    customerRetentionRate: number;
  } | null;
}

export default function BusinessProfilePage() {
  const params = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchBusiness();
    }
  }, [params.id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/businesses/${params.id}`);

      if (!response.ok) {
        throw new Error("Business not found");
      }

      const data = await response.json();
      setBusiness(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load business");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Business Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "The business you are looking for does not exist."}
          </p>
          <Link
            href="/businesses"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Businesses
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    category,
    address,
    phone,
    location,
    trustScore,
    isVerified,
    verificationMethod,
    upiVerified,
    upiId,
    createdAt,
    owner,
    reviews,
    endorsements,
    analytics,
  } = business;

  const averageRating =
    analytics?.averageRating ||
    (reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/businesses"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Businesses
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                {isVerified && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Joined {new Date(createdAt).toLocaleDateString()}</span>
                </div>
                <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
                  {category.toLowerCase().replace("_", " ")}
                </span>
              </div>

              {description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Trust Score Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 min-w-[200px]">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {trustScore}
                </div>
                <div className="text-blue-600 font-medium">Trust Score</div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(trustScore, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Phone: </span>
                  <span className="text-gray-900">{phone}</span>
                </div>
                {address && (
                  <div>
                    <span className="font-medium text-gray-700">Address: </span>
                    <span className="text-gray-900">{address}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Owner: </span>
                  <span className="text-gray-900">{owner.name}</span>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Verification Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Phone Verified</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                {upiVerified && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">UPI Verified</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
                {verificationMethod && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Verification Method</span>
                    <span className="capitalize text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {verificationMethod.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-900">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {review.reviewer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {review.reviewer.name}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Business Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-medium text-gray-900">
                    {reviews.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Endorsements</span>
                  <span className="font-medium text-gray-900">
                    {endorsements.length}
                  </span>
                </div>
                {analytics && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Visits</span>
                      <span className="font-medium text-gray-900">
                        {analytics.monthlyVisits}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Customer Retention</span>
                      <span className="font-medium text-gray-900">
                        {(analytics.customerRetentionRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Endorsements */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Community Endorsements
                </h3>
              </div>

              {endorsements.length === 0 ? (
                <p className="text-gray-500 text-sm">No endorsements yet</p>
              ) : (
                <div className="space-y-3">
                  {endorsements.slice(0, 5).map((endorsement) => (
                    <div key={endorsement.id} className="text-sm">
                      <div className="font-medium text-gray-900">
                        {endorsement.endorser.name}
                      </div>
                      <div className="text-gray-600 capitalize">
                        {endorsement.relationship.toLowerCase()}
                      </div>
                      {endorsement.message && (
                        <p className="text-gray-700 mt-1">
                          "{endorsement.message}"
                        </p>
                      )}
                    </div>
                  ))}
                  {endorsements.length > 5 && (
                    <button className="text-blue-600 text-sm hover:text-blue-700">
                      + {endorsements.length - 5} more endorsements
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
