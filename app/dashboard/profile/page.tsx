"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "CUSTOMER" | "BUSINESS_OWNER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  businesses?: Business[];
}

interface Business {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  isVerified: boolean;
  description?: string;
  phone: string;
  address?: string;
  upiVerified: boolean;
  totalReviews?: number;
  totalEndorsements?: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        credentials: "include",
      });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const result = await response.json();

      if (!result.data || !result.data.user) {
        router.push("/login");
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication error:", error);
      router.push("/login");
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch user data
      const userRes = await fetch("/api/users/me", {
        credentials: "include",
      });
      const userData = await userRes.json();

      if (userData.success) {
        const userWithBusinesses = userData.user;

        // If user is BUSINESS_OWNER, fetch their businesses
        if (userData.user.role === "BUSINESS_OWNER") {
          try {
            const businessesRes = await fetch("/api/businesses/my-business", {
              credentials: "include",
            });
            if (businessesRes.ok) {
              const businessesData = await businessesRes.json();
              if (businessesData.success) {
                userWithBusinesses.businesses = businessesData.data || [];
              }
            }
          } catch (error) {
            console.error("Failed to fetch businesses:", error);
          }
        }

        setUser(userWithBusinesses);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear cookies
      Cookies.remove("auth_token");

      // Redirect to login page
      router.push("/login");
      router.refresh();
    }
  };

  const getDashboardUrl = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "BUSINESS_OWNER":
        return "/dashboard/business";
      case "CUSTOMER":
        return "/dashboard/customer";
      case "ADMIN":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  const getEditProfileUrl = () => {
    if (!user) return "/dashboard/profile/edit";
    return `/dashboard/profile/edit/${user.role.toLowerCase()}`;
  };

  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            User not found
          </h2>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Please login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your profile and account settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Role:{" "}
                <span className="font-medium">
                  {user.role.replace("_", " ")}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "BUSINESS_OWNER"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                        : user.role === "ADMIN"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                  {user.role === "BUSINESS_OWNER" && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      • {user.businesses?.length || 0} Business
                      {user.businesses?.length !== 1 ? "es" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={getDashboardUrl()}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
              >
                ← Back to Dashboard
              </Link>

              <Link
                href={getEditProfileUrl()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit Profile
              </Link>

              {user.role === "BUSINESS_OWNER" && (
                <Link
                  href="/my-business/create"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  + Add Business
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Personal Information
              </h2>
              <Link
                href={getEditProfileUrl()}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
              >
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Full Name" value={user.name} />
              <InfoField
                label="Phone Number"
                value={user.phone}
                isPhone={true}
              />
              <InfoField label="Email" value={user.email || "Not provided"} />
              <InfoField
                label="Account Type"
                value={user.role.replace("_", " ")}
              />
              <InfoField
                label="Member Since"
                value={formatDate(user.createdAt)}
              />
              <InfoField
                label="Last Updated"
                value={formatDate(user.updatedAt)}
              />
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
              Quick Actions
            </h2>
            <div className="space-y-4">
              {user.role === "BUSINESS_OWNER" && (
                <>
                  <Link
                    href="/dashboard/business"
                    className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="mr-4 text-xl">🏢</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Business Dashboard
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your businesses
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/my-business"
                    className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="mr-4 text-xl">📋</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        My Businesses
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        View all your businesses
                      </p>
                    </div>
                  </Link>
                </>
              )}
              <Link
                href="/dashboard/analytics"
                className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="mr-4 text-xl">📊</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View your statistics
                  </p>
                </div>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="mr-4 text-xl">⚙️</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Settings
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Account preferences
                  </p>
                </div>
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center p-4 rounded-lg border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <div className="mr-4 text-xl">🛡️</div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Admin Panel
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage platform
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Business Section (Only for Business Owners) */}
        {user.role === "BUSINESS_OWNER" &&
          user.businesses &&
          user.businesses.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  My Businesses
                </h2>
                <Link
                  href="/my-business"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.businesses.slice(0, 3).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

// Helper Components
function InfoField({
  label,
  value,
  isPhone = false,
}: {
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p
        className={`text-lg font-medium ${isPhone ? "font-mono" : ""} text-gray-900 dark:text-gray-100`}
      >
        {value}
      </p>
    </div>
  );
}

function BusinessCard({ business }: { business: Business }) {
  const getTrustScoreColor = (score: number) => {
    if (score >= 80)
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    if (score >= 60)
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {business.name || "Unnamed Business"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {business.category?.replace(/_/g, " ") || "Uncategorized"}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${getTrustScoreColor(business.trustScore || 0)}`}
          >
            {business.trustScore || 0} Trust
          </span>
          {business.isVerified && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded mt-1">
              ✓ Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Reviews</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {business.totalReviews || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Endorsements</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {business.totalEndorsements || 0}
            </p>
          </div>
        </div>
        <Link
          href={`/my-business/${business.id}`}
          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm"
        >
          Manage
        </Link>
      </div>
    </div>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-200 dark:bg-gray-700 h-64 rounded-xl"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
