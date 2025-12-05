"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  trustScore: number;
  isVerified: boolean;
  phone: string;
  address?: string;
  upiId?: string;
  upiVerified: boolean;
  totalReviews: number;
  totalEndorsements: number;
  createdAt: string;
}

export default function MyBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      // SIMPLIFIED: Directly call the correct endpoint
      const res = await fetch("/api/businesses/my-business");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Business API response:", data); // Debug log

      if (data.success) {
        // Handle the response structure correctly
        const businessesArray = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.businesses)
            ? data.businesses
            : data.data
              ? [data.data]
              : [];

        console.log("Businesses array:", businessesArray); // Debug log
        setBusinesses(businessesArray);
      } else {
        setError(data.error || "Failed to load businesses");
        setBusinesses([]);
      }
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      setError(
        "An error occurred while fetching businesses. Please try again."
      );
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <BusinessLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchBusinesses}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const verifiedCount = businesses.filter((b) => b.isVerified).length;
  const averageTrustScore =
    businesses.length > 0
      ? Math.round(
          businesses.reduce((sum, b) => sum + b.trustScore, 0) /
            businesses.length
        )
      : 0;

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="dashboard/profile"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm">Profile</span>
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-2xl md:text-3xl font-bold">My Businesses</h1>
          </div>
          <p className="text-gray-600 mt-2">Manage your business profiles</p>
          <p className="text-sm text-gray-500 mt-1">
            Total: {businesses.length} business
            {businesses.length !== 1 ? "es" : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Profile
          </Link>
          <Link
            href="/my-business/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Business
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Businesses
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {businesses.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Verified</h3>
          <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Average Trust Score
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {averageTrustScore}
          </p>
        </div>
      </div>

      {/* Business List */}
      {businesses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function BusinessCard({ business }: { business: Business }) {
  const getCategoryLabel = (category: string) => {
    return category ? category.replace(/_/g, " ") : "Uncategorized";
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {business.name || "Unnamed Business"}
              </h3>
              {business.isVerified && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{getCategoryLabel(business.category)}</span>
              {business.upiVerified && (
                <span className="flex items-center gap-1 text-green-600">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  UPI Verified
                </span>
              )}
            </div>
          </div>
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full ${getTrustScoreColor(
              business.trustScore || 0
            )}`}
          >
            {business.trustScore || 0} Trust
          </div>
        </div>

        {business.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {business.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{business.phone || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{business.address || "Not specified"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Reviews</p>
              <p className="font-semibold">{business.totalReviews || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Endorsements</p>
              <p className="font-semibold">{business.totalEndorsements || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Created</p>
              <p className="font-semibold">
                {business.createdAt
                  ? new Date(business.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/my-business/${business.id}`}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
            >
              Manage
            </Link>
            <Link
              href={`/business/${business.id}`}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              target="_blank"
            >
              View Public
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Businesses Yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create your first business profile to start building trust with
        customers and accessing business tools.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard/profile"
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-block"
        >
          ← Back to Profile
        </Link>
        <Link
          href="/my-business/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
        >
          Create Your First Business
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        It only takes 2 minutes to get started
      </p>
    </div>
  );
}

function BusinessLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
