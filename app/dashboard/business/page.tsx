"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
import {
  TrendingUp,
  Star,
  Users,
  Eye,
  Settings,
  BarChart3,
  Award,
  ChevronRight,
  Shield,
  MessageSquare,
  AlertCircle,
  Building,
  // LogOut,
} from "lucide-react";

interface DashboardStats {
  trustScore: number;
  totalReviews: number;
  totalEndorsements: number;
  monthlyVisits: number;
  pendingEndorsements: number;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    reviewer: string;
    createdAt: string;
  }>;
}

// interface UserData {
//   user: {
//     id: string;
//     name: string;
//     phone: string;
//     role: string;
//   };
//   token: string;
// }

export default function BusinessOwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [userData, setUserData] = useState<UserData | null>(null);
  // const router = useRouter();

  useEffect(() => {
    // checkAuthentication();
    fetchDashboardStats();
  }, []);

  // useEffect(() => {
  //   if (isAuthenticated && userData?.user.role === "BUSINESS_OWNER") {
  //     fetchDashboardStats();
  //   }
  // }, [isAuthenticated, userData]);

  // const checkAuthentication = async () => {
  //   try {
  //     console.log("Checking authentication...");
  //     const response = await fetch("/api/auth/verify", {
  //       credentials: "include", // This is IMPORTANT for cookies
  //     });

  //     console.log("Auth response status:", response.status);

  //     if (!response.ok) {
  //       console.log("Authentication failed, redirecting to login");
  //       router.push("/login");
  //       return;
  //     }

  //     const result = await response.json();
  //     console.log("Auth result:", result);

  //     if (!result.data || !result.data.user) {
  //       console.log("No user data in response");
  //       router.push("/login");
  //       return;
  //     }

  //     const userRole = result.data.user.role;

  //     // Redirect based on role
  //     if (userRole !== "BUSINESS_OWNER") {
  //       console.log(`User role is ${userRole}, redirecting...`);
  //       if (userRole === "ADMIN") {
  //         router.push("/dashboard/admin");
  //       } else if (userRole === "CUSTOMER") {
  //         router.push("/dashboard/customer");
  //       } else {
  //         router.push("/login");
  //       }
  //       return;
  //     }

  //     setUserData(result.data);
  //     setIsAuthenticated(true);
  //     console.log("Authentication successful, user role:", userRole);
  //   } catch (error) {
  //     console.error("Authentication error:", error);
  //     router.push("/login");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDashboardStats = async () => {
    try {
      console.log("Fetching dashboard stats...");
      const response = await fetch("/api/business/dashboard-stats", {
        credentials: "include", // Send cookies automatically
      });

      console.log("Stats response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Stats data:", data);

      // Check if data has stats or use the direct data
      if (data.data) {
        setStats(data.data);
      } else {
        // Mock data for testing - remove this when API is ready
        setStats({
          trustScore: 85.5,
          totalReviews: 342,
          totalEndorsements: 24,
          monthlyVisits: 1250,
          pendingEndorsements: 3,
          recentReviews: [
            {
              id: "1",
              rating: 5,
              comment: "Amazing chai and great service!",
              reviewer: "Amit Kumar",
              createdAt: new Date().toISOString(),
            },
            {
              id: "2",
              rating: 4,
              comment: "Good quality products, reasonable prices",
              reviewer: "Neha Singh",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set mock data for testing
      setStats({
        trustScore: 85.5,
        totalReviews: 342,
        totalEndorsements: 24,
        monthlyVisits: 1250,
        pendingEndorsements: 3,
        recentReviews: [
          {
            id: "1",
            rating: 5,
            comment: "Amazing chai and great service!",
            reviewer: "Amit Kumar",
            createdAt: new Date().toISOString(),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   // Clear the cookie
  //   Cookies.remove("auth_token");
  //   // Redirect to login
  //   router.push("/login");
  // };

  // Create mock API endpoints for testing
  // const createMockEndpoints = () => {
  //   // This is for testing - you should create real API endpoints
  //   console.log("Mock endpoints would be created here");
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
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
                Business Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your business and track performance
                {/* {userData && (
                  <span className="ml-2">• Welcome, {userData.user.name}</span>
                )} */}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* {userData && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Logged in as:{" "}
                  <span className="font-medium">
                    {userData.user.role.replace("_", " ")}
                  </span>
                </span>
              )} */}
              {/* <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Trust Score
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats?.trustScore || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Out of 100
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Reviews
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.totalReviews || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +12% this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Endorsements
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.totalEndorsements || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats?.pendingEndorsements || 0} pending
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Monthly Visits
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.monthlyVisits || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +8% this month
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/profile"
                className="flex items-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Building className="w-8 h-8 text-gray-400 dark:text-gray-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Update Business Profile
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Edit your business information
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/business/verification"
                className="flex items-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <Shield className="w-8 h-8 text-gray-400 dark:text-gray-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Get Verified
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Increase trust with verification
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/analytics"
                className="flex items-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <BarChart3 className="w-8 h-8 text-gray-400 dark:text-gray-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    View Analytics
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed performance insights
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Recent Reviews
                </h2>
                <Link
                  href="/dashboard/reviews"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats?.recentReviews && stats.recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-l-4 border-blue-200 dark:border-blue-700 pl-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {review.reviewer}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No reviews yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Encourage customers to leave reviews to build trust
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Management
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  href="/dashboard/trust-score"
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Trust Score
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monitor trust metrics
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </Link>

                <Link
                  href="/dashboard/analytics"
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Analytics
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Performance insights
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Settings
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Account & preferences
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </Link>

                {stats?.pendingEndorsements &&
                  stats.pendingEndorsements > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            Pending Endorsements
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stats.pendingEndorsements} endorsements waiting for
                            approval
                          </p>
                        </div>
                      </div>
                      <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
