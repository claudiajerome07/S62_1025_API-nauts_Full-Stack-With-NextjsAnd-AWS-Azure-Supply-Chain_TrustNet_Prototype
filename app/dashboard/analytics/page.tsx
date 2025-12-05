"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  BarChart3,
  Filter,
  AlertCircle,
} from "lucide-react";

interface AnalyticsData {
  profileViews: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    weeklyData: Array<{
      week: string;
      views: number;
    }>;
  };
  customerDemographics: {
    topLocations: Array<{
      location: string;
      views: number;
      percentage: number;
    }>;
    viewTimes: Array<{
      hour: string;
      views: number;
    }>;
  };
  engagement: {
    averageTimeOnProfile: string;
    contactClicks: number;
    reviewClicks: number;
    endorsementRequests: number;
  };
  businessMetrics: {
    discoveryRate: number;
    conversionRate: number;
    returnVisitors: number;
    peakHours: Array<{
      hour: string;
      views: number;
    }>;
  };
}

export default function DashboardAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30days");
  const router = useRouter();

  useEffect(() => {
    // checkAuthentication();
  }, []);

  useEffect(() => {
    // if (isAuthenticated) {
    fetchAnalyticsData();
    // }
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/dashboard/analytics?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("backendToken")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("backendToken");
          router.push("/login");
          return;
        }
        throw new Error(`Failed to fetch analytics data: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to load analytics data");
      }

      setData(result.data);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load analytics data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until authentication is checked
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Checking authentication...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Error Loading Analytics Data</h3>
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchAnalyticsData}
                  className="mt-2 text-sm text-red-800 underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No analytics data available.</p>
          </div>
        </div>
      </div>
    );
  }

  const viewChange = data.profileViews.thisMonth - data.profileViews.lastMonth;
  const isViewsPositive = viewChange >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Business Analytics
              </h1>
              <p className="text-gray-600">
                Track visitor analytics and profile performance
              </p>
            </div>

            {/* Time Range Filter */}
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 3 months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Profile Views
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {data.profileViews.thisMonth}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {isViewsPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${isViewsPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    {isViewsPositive ? "+" : ""}
                    {viewChange} from last month
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Average Visit Time
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {data.engagement.averageTimeOnProfile}
                </p>
                <p className="text-xs text-gray-500 mt-1">Per profile visit</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Contact Clicks
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {data.engagement.contactClicks}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Phone & location clicks
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Conversion Rate
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {data.businessMetrics.conversionRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Views to actions</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Views Trends */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Profile Views by Week
            </h3>

            <div className="space-y-4">
              {data.profileViews.weeklyData.map((week) => {
                const maxViews = Math.max(
                  ...data.profileViews.weeklyData.map((w) => w.views)
                );
                const percentage = (week.views / maxViews) * 100;

                return (
                  <div
                    key={week.week}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600 w-16">
                      {week.week}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {week.views}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Demographics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Visitor Demographics
            </h3>

            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-700">Top Locations</h4>
              {data.customerDemographics.topLocations.map((location) => (
                <div
                  key={location.location}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {location.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {location.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">View Times</h4>
              {data.customerDemographics.viewTimes.map((time) => {
                const maxViews = Math.max(
                  ...data.customerDemographics.viewTimes.map((t) => t.views)
                );
                const percentage = (time.views / maxViews) * 100;

                return (
                  <div
                    key={time.hour}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{time.hour}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {time.views}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Engagement Breakdown
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  Contact Info Clicks
                </span>
                <span className="font-medium text-gray-900">
                  {data.engagement.contactClicks}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  Review Button Clicks
                </span>
                <span className="font-medium text-gray-900">
                  {data.engagement.reviewClicks}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  Endorsement Requests
                </span>
                <span className="font-medium text-gray-900">
                  {data.engagement.endorsementRequests}
                </span>
              </div>
            </div>
          </div>

          {/* Business Performance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Metrics
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Discovery Rate</span>
                  <span className="font-medium text-gray-900">
                    {data.businessMetrics.discoveryRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${data.businessMetrics.discoveryRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-medium text-gray-900">
                    {data.businessMetrics.conversionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{
                      width: `${data.businessMetrics.conversionRate * 5}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-sm text-gray-600">Return Visitors: </span>
                <span className="font-medium text-gray-900">
                  {data.businessMetrics.returnVisitors}
                </span>
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Peak Hours Today
            </h3>

            <div className="space-y-3">
              {data.businessMetrics.peakHours.map((hour) => {
                const maxViews = Math.max(
                  ...data.businessMetrics.peakHours.map((h) => h.views)
                );
                const percentage = (hour.views / maxViews) * 100;

                return (
                  <div
                    key={hour.hour}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{hour.hour}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-6">
                        {hour.views}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Analytics Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <strong>Peak Activity:</strong> Most visitors view your profile
                between 12-3 PM. Consider posting updates or offers during this
                time.
              </p>
            </div>
            <div>
              <p className="text-blue-800">
                <strong>Local Focus:</strong>{" "}
                {data.customerDemographics.topLocations[0].percentage}% of
                visitors are from your local area. Focus on local marketing
                strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
