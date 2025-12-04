"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  trustScore: number;
  isVerified: boolean;
  verificationMethod?: string;
  phone: string;
  address?: string;
  location?: string;
  upiId?: string;
  upiVerified: boolean;
  upiVerificationDate?: string;
  transactionCount: number;
  createdAt: string;
  updatedAt: string;
  analytics?: {
    totalReviews: number;
    averageRating: number;
    totalEndorsements: number;
    monthlyVisits: number;
    upiTransactionVolume: number;
    customerRetentionRate: number;
  };
}

// Helper function to format date as DD/MM/YYYY
const formatDateDDMMYYYY = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return "Invalid date";
  }
};

// Helper function to format date with month name (for Created: Month Year)
const formatMonthYear = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${month} ${year}`;
  } catch (error) {
    return "Invalid date";
  }
};

export default function ManageBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching business with ID:", businessId);

      const res = await fetch(`/api/businesses/my-business/${businessId}`);

      console.log("API Response status:", res.status);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Business not found");
        }
        if (res.status === 401 || res.status === 403) {
          throw new Error("You don't have permission to access this business");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Business API response:", data);

      if (data.success) {
        setBusiness(data.data);
      } else {
        setError(data.error || "Failed to load business");
        setTimeout(() => router.push("/my-business"), 2000);
      }
    } catch (error: any) {
      console.error("Failed to fetch business:", error);
      setError(error.message || "An error occurred while fetching business");
      setTimeout(() => router.push("/my-business"), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ManageBusinessLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchBusiness}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/my-business"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to My Businesses
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Business not found
          </h2>
          <div className="flex gap-3 justify-center">
            <Link
              href="/my-business"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to My Businesses
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/profile" className="hover:text-blue-600">
            Profile
          </Link>
          <span>/</span>
          <Link href="/my-business" className="hover:text-blue-600">
            My Businesses
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{business.name}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                {business.name}
              </h1>
              {business.isVerified && (
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  ✓ Verified Business
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {business.category.replace(/_/g, " ")} •{" "}
              {business.location || "No location specified"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/my-business"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
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
              Back to List
            </Link>
            <Link
              href={`/my-business/edit/${businessId}`}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit Business
            </Link>
            <Link
              href={`/my-business/qr/${businessId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate QR Code
            </Link>
            <Link
              href={`/business/${businessId}`}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              target="_blank"
            >
              View Public
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Score Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Trust Score
            </h2>
            <p className="text-gray-600 mb-4">
              Your business credibility score based on reviews, endorsements,
              and transactions
            </p>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {business.trustScore}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      business.trustScore >= 80
                        ? "bg-green-500"
                        : business.trustScore >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {business.trustScore >= 80
                      ? "Excellent"
                      : business.trustScore >= 60
                        ? "Good"
                        : "Needs Improvement"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Last updated: {formatDateDDMMYYYY(business.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-3">
              Score Breakdown
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Reviews & Ratings</span>
                  <span className="font-medium">
                    {business.analytics?.averageRating?.toFixed(1) || "0.0"}/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Community Endorsements</span>
                  <span className="font-medium">
                    {business.analytics?.totalEndorsements || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>UPI Transactions</span>
                  <span className="font-medium">
                    {business.transactionCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Business Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Business Name" value={business.name} />
              <InfoField
                label="Category"
                value={business.category.replace(/_/g, " ")}
              />
              <InfoField label="Phone Number" value={business.phone} />
              <InfoField
                label="Location"
                value={business.location || "Not specified"}
              />
              <InfoField
                label="Address"
                value={business.address || "Not specified"}
              />
              <InfoField
                label="UPI ID"
                value={business.upiId || "Not added"}
                badge={business.upiVerified ? "✓ Verified" : undefined}
                badgeColor={business.upiVerified ? "green" : "gray"}
              />
              {business.verificationMethod && (
                <InfoField
                  label="Verification Method"
                  value={business.verificationMethod.replace(/_/g, " ")}
                />
              )}
            </div>

            {business.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {business.description}
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Reviews"
                value={business.analytics?.totalReviews || 0}
                icon="⭐"
                color="yellow"
              />
              <StatCard
                label="Endorsements"
                value={business.analytics?.totalEndorsements || 0}
                icon="🤝"
                color="green"
              />
              <StatCard
                label="Monthly Visits"
                value={business.analytics?.monthlyVisits || 0}
                icon="👁️"
                color="blue"
              />
              <StatCard
                label="UPI Transactions"
                value={business.transactionCount || 0}
                icon="💳"
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <ActionLink
                href={`/my-business/edit/${businessId}`}
                icon="✏️"
                title="Edit Business"
                description="Update business details"
              />
              <ActionLink
                href={`/my-business/qr/${businessId}`}
                icon="📱"
                title="QR Code"
                description="Generate & download QR"
              />
              <ActionLink
                href={`/business/${businessId}`}
                icon="🌐"
                title="Public Profile"
                description="View public business page"
                target="_blank"
              />
              <ActionLink
                href={`/analytics?business=${businessId}`}
                icon="📊"
                title="Analytics"
                description="View detailed insights"
              />
              <ActionLink
                href={`/reviews?business=${businessId}`}
                icon="💬"
                title="Manage Reviews"
                description="View & respond to reviews"
              />
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Verification Status
            </h2>
            <div className="space-y-4">
              <StatusItem
                label="Business Verification"
                isVerified={business.isVerified}
                method={business.verificationMethod}
                date={business.createdAt}
              />
              <StatusItem
                label="UPI Verification"
                isVerified={business.upiVerified}
                date={business.upiVerificationDate}
              />
              <StatusItem
                label="Trust Score"
                isVerified={business.trustScore >= 60}
                value={`${business.trustScore} Points`}
              />
            </div>
            {!business.isVerified && (
              <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Start Verification
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoField({
  label,
  value,
  badge,
  badgeColor = "gray",
}: {
  label: string;
  value: string;
  badge?: string;
  badgeColor?: "gray" | "green" | "red" | "blue";
}) {
  const badgeColorClasses = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className="font-medium">{value}</p>
        {badge && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${badgeColorClasses[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    yellow: "bg-yellow-50 border-yellow-100",
    green: "bg-green-50 border-green-100",
    blue: "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
  };

  return (
    <div className={`border rounded-lg p-4 text-center ${colorClasses[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function ActionLink({
  href,
  icon,
  title,
  description,
  target,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <svg
        className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}

function StatusItem({
  label,
  isVerified,
  method,
  date,
  value,
}: {
  label: string;
  isVerified: boolean;
  method?: string;
  date?: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${isVerified ? "bg-green-500" : "bg-gray-300"}`}
        ></div>
        <div>
          <p className="font-medium text-gray-700">{label}</p>
          {method && (
            <p className="text-sm text-gray-500">{method.replace(/_/g, " ")}</p>
          )}
          {date && (
            <p className="text-xs text-gray-500">
              Verified on {formatDateDDMMYYYY(date)}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        {value ? (
          <p className="font-medium">{value}</p>
        ) : (
          <span
            className={`text-sm font-medium ${isVerified ? "text-green-600" : "text-gray-500"}`}
          >
            {isVerified ? "Verified" : "Not Verified"}
          </span>
        )}
      </div>
    </div>
  );
}

function ManageBusinessLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        <div className="bg-gray-200 h-48 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-200 h-64 rounded-xl"></div>
            <div className="bg-gray-200 h-48 rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-200 h-64 rounded-xl"></div>
            <div className="bg-gray-200 h-48 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
