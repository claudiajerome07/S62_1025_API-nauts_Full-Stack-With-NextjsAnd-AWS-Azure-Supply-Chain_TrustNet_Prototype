"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Users,
  Building2,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react";

type AdminStats = {
  totalUsers: number;
  totalBusinesses: number;
  pendingVerifications: number;
  reportedIssues: number;
  newSignupsToday: number;
  activeUsers: number;
};

type RecentActivity = {
  id: string;
  type:
    | "user_signup"
    | "business_verification"
    | "report_resolved"
    | "trust_score_update";
  description: string;
  timestamp: string;
  user?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    pendingVerifications: 0,
    reportedIssues: 0,
    newSignupsToday: 0,
    activeUsers: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole === "ADMIN") {
      fetchAdminData();
    }
  }, [isAuthenticated, userRole]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/auth/verify");

      if (!response.ok) {
        console.log("Authentication failed");
        router.push("/login");
        return;
      }

      const result = await response.json();
      const userData = result.data;

      if (userData.user.role !== "ADMIN") {
        console.log("Access denied: admin only");
        router.push("/dashboard/customer");
        return;
      }

      setIsAuthenticated(true);
      setUserRole(userData.user.role);
    } catch (error) {
      console.error("Authentication error:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch admin stats
      const statsResponse = await fetch("/api/admin/stats");

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch admin stats");
      }

      const statsData = await statsResponse.json();
      setStats(
        statsData.stats || {
          totalUsers: 1542,
          totalBusinesses: 876,
          pendingVerifications: 23,
          reportedIssues: 12,
          newSignupsToday: 42,
          activeUsers: 689,
        }
      );

      // Fetch recent activities
      const activitiesResponse = await fetch("/api/admin/activities");

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData.activities || []);
      } else {
        // Mock data for testing
        setRecentActivities([
          {
            id: "1",
            type: "user_signup",
            description: "New user registered",
            timestamp: new Date().toISOString(),
            user: "john.doe@example.com",
          },
          {
            id: "2",
            type: "business_verification",
            description: "Business verification submitted",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "3",
            type: "report_resolved",
            description: "Report resolved",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "4",
            type: "trust_score_update",
            description: "Trust score updated for GreenLeaf Cafe",
            timestamp: new Date(Date.now() - 10800000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      // Use mock data for testing
      setStats({
        totalUsers: 1542,
        totalBusinesses: 876,
        pendingVerifications: 23,
        reportedIssues: 12,
        newSignupsToday: 42,
        activeUsers: 689,
      });

      setRecentActivities([
        {
          id: "1",
          type: "user_signup",
          description: "New user registered",
          timestamp: new Date().toISOString(),
          user: "john.doe@example.com",
        },
        {
          id: "2",
          type: "business_verification",
          description: "Business verification submitted",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_signup":
        return <Users className="w-5 h-5 text-green-600" />;
      case "business_verification":
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case "report_resolved":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "trust_score_update":
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityDescription = (activity: RecentActivity) => {
    switch (activity.type) {
      case "user_signup":
        return `New user signed up: ${activity.user}`;
      case "business_verification":
        return `Business verification submitted`;
      case "report_resolved":
        return `Report resolved`;
      case "trust_score_update":
        return `Trust score updated`;
      default:
        return activity.description;
    }
  };

  const handleLogout = () => {
    // Clear cookie
    Cookies.remove("auth_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Try Again
          </button>
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
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage TrustNet platform and users
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Logged in as: <span className="font-medium">{userRole}</span>
              </span>
              <Link
                href="/dashboard/admin/settings"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{stats.newSignupsToday} today
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4"
            >
              Manage users <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Total Businesses Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Businesses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.totalBusinesses.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {stats.activeUsers} active businesses
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Link
              href="/dashboard/admin/businesses"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4"
            >
              Manage businesses <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Pending Verifications Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Verifications
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.pendingVerifications}
                </p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-sm text-yellow-600">
                    Requires attention
                  </span>
                </div>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <Link
              href="/dashboard/admin/verifications"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4"
            >
              Review verifications <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Activities
            </h2>
            <Link
              href="/dashboard/admin/activities"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activity.type === "user_signup"
                          ? "bg-green-100 text-green-800"
                          : activity.type === "business_verification"
                            ? "bg-blue-100 text-blue-800"
                            : activity.type === "report_resolved"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {activity.type.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No recent activities
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/admin/users"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Manage Users
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    View and manage all users
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/admin/verifications"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Verify Businesses
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Review pending verifications
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/admin/reports"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Handle Reports
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Review reported issues
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/admin/settings"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Platform Settings
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Configure system settings
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
