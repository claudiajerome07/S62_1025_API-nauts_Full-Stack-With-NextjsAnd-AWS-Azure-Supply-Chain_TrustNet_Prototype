"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Recommendation = {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  location: string;
  description: string;
  reason: string;
  mutualConnections: number;
  distance?: string;
  rating: number;
  reviewCount: number;
  avatarColor: string;
};

type FilterOptions = {
  category: string;
  trustScore: number;
  distance: string;
};

export default function BusinessRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      name: "Sunrise Bakery",
      category: "Food & Beverage",
      trustScore: 94,
      location: "Downtown",
      description:
        "Artisan bakery specializing in sourdough and pastries. Family-owned since 1995.",
      reason: "High trust score and 8 mutual connections",
      mutualConnections: 8,
      distance: "0.8 mi",
      rating: 4.8,
      reviewCount: 127,
      avatarColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "2",
      name: "Precision Auto Repair",
      category: "Automotive",
      trustScore: 89,
      location: "Industrial Park",
      description:
        "Certified mechanics specializing in European and Japanese vehicles.",
      reason: "Frequently visited by your connections",
      mutualConnections: 5,
      distance: "2.3 mi",
      rating: 4.6,
      reviewCount: 89,
      avatarColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "3",
      name: "Urban Fitness Center",
      category: "Fitness",
      trustScore: 91,
      location: "City Center",
      description: "Full-service gym with personal training and group classes.",
      reason: "Matches your interest in wellness businesses",
      mutualConnections: 12,
      distance: "1.2 mi",
      rating: 4.7,
      reviewCount: 203,
      avatarColor: "bg-red-100 text-red-800",
    },
    {
      id: "4",
      name: "TechHub Coworking",
      category: "Workspace",
      trustScore: 87,
      location: "Innovation District",
      description:
        "Modern coworking space with high-speed internet and meeting rooms.",
      reason: "Popular among local entrepreneurs",
      mutualConnections: 7,
      distance: "1.5 mi",
      rating: 4.5,
      reviewCount: 65,
      avatarColor: "bg-purple-100 text-purple-800",
    },
    {
      id: "5",
      name: "Green Thumb Landscaping",
      category: "Home Services",
      trustScore: 92,
      location: "Suburban Area",
      description: "Sustainable landscaping and garden maintenance services.",
      reason: "Highest rated in your area",
      mutualConnections: 3,
      distance: "3.1 mi",
      rating: 4.9,
      reviewCount: 142,
      avatarColor: "bg-green-100 text-green-800",
    },
    {
      id: "6",
      name: "Creative Minds Marketing",
      category: "Professional Services",
      trustScore: 85,
      location: "Business District",
      description: "Digital marketing agency specializing in small businesses.",
      reason: "Complementary to your business",
      mutualConnections: 6,
      distance: "0.9 mi",
      rating: 4.4,
      reviewCount: 78,
      avatarColor: "bg-indigo-100 text-indigo-800",
    },
    {
      id: "7",
      name: "Pet Paradise Care",
      category: "Pet Services",
      trustScore: 93,
      location: "Residential Area",
      description: "Professional pet grooming, boarding, and daycare services.",
      reason: "Exceptional customer reviews",
      mutualConnections: 4,
      distance: "2.7 mi",
      rating: 4.8,
      reviewCount: 156,
      avatarColor: "bg-pink-100 text-pink-800",
    },
    {
      id: "8",
      name: "Heritage Bookstore",
      category: "Retail",
      trustScore: 88,
      location: "Historic District",
      description:
        "Independent bookstore with rare collections and author events.",
      reason: "Unique local business with strong community ties",
      mutualConnections: 9,
      distance: "1.8 mi",
      rating: 4.6,
      reviewCount: 94,
      avatarColor: "bg-brown-100 text-brown-800",
    },
  ]);

  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    trustScore: 0,
    distance: "all",
  });

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<string[]>([]);

  const categories = [
    "all",
    "Food & Beverage",
    "Retail",
    "Services",
    "Professional",
    "Wellness",
    "Home Services",
    "Automotive",
  ];

  const distanceOptions = [
    { value: "all", label: "Any Distance" },
    { value: "under1", label: "Under 1 mile" },
    { value: "under3", label: "Under 3 miles" },
    { value: "under5", label: "Under 5 miles" },
    { value: "under10", label: "Under 10 miles" },
  ];

  const trustScoreOptions = [
    { value: 0, label: "Any Trust Score" },
    { value: 80, label: "80+ Trust Score" },
    { value: 85, label: "85+ Trust Score" },
    { value: 90, label: "90+ Trust Score" },
    { value: 95, label: "95+ Trust Score" },
  ];

  const filteredRecommendations = recommendations.filter((rec) => {
    // Filter by category
    if (filters.category !== "all" && rec.category !== filters.category) {
      return false;
    }

    // Filter by trust score
    if (filters.trustScore > 0 && rec.trustScore < filters.trustScore) {
      return false;
    }

    // Filter by distance (simplified)
    if (filters.distance !== "all") {
      const distanceNum = parseFloat(rec.distance?.split(" ")[0] || "0");
      switch (filters.distance) {
        case "under1":
          return distanceNum <= 1;
        case "under3":
          return distanceNum <= 3;
        case "under5":
          return distanceNum <= 5;
        case "under10":
          return distanceNum <= 10;
        default:
          return true;
      }
    }

    return true;
  });

  const handleConnect = async (id: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setConnected((prev) => [...prev, id]);
    setLoading(false);

    // Show success message
    const business = recommendations.find((r) => r.id === id);
    alert(`Successfully connected with ${business?.name}!`);
  };

  const handleRemoveRecommendation = (id: string) => {
    if (window.confirm("Remove this recommendation from your list?")) {
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
    }
  };

  const handleRefreshRecommendations = async () => {
    setLoading(true);
    // Simulate loading new recommendations
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, fetch new recommendations from API
    setLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Business Recommendations
              </h1>
              <p className="text-gray-600 mt-2">
                Discover trusted local businesses recommended for you
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefreshRecommendations}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                <svg
                  className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <Link
                href="/network/connections"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                My Connections
                <svg
                  className="w-5 h-5 ml-2"
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
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">
              Total Recommendations
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {recommendations.length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Avg. Trust Score</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(
                recommendations.reduce((acc, rec) => acc + rec.trustScore, 0) /
                  recommendations.length
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">New This Week</div>
            <div className="text-2xl font-bold text-gray-900">3</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Connection Rate</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round((connected.length / recommendations.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filter Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Trust Score Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Trust Score
              </label>
              <select
                value={filters.trustScore}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    trustScore: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {trustScoreOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance
              </label>
              <select
                value={filters.distance}
                onChange={(e) =>
                  setFilters({ ...filters, distance: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {distanceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.category !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Category: {filters.category}
                <button
                  onClick={() => setFilters({ ...filters, category: "all" })}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.trustScore > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Trust Score: {filters.trustScore}+
                <button
                  onClick={() => setFilters({ ...filters, trustScore: 0 })}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.distance !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                {
                  distanceOptions.find((d) => d.value === filters.distance)
                    ?.label
                }
                <button
                  onClick={() => setFilters({ ...filters, distance: "all" })}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.category !== "all" ||
              filters.trustScore > 0 ||
              filters.distance !== "all") && (
              <button
                onClick={() =>
                  setFilters({
                    category: "all",
                    trustScore: 0,
                    distance: "all",
                  })
                }
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="p-6">
                {/* Business Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`${rec.avatarColor} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg mr-4`}
                    >
                      {getInitials(rec.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {rec.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{rec.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveRecommendation(rec.id)}
                    className="text-gray-400 hover:text-red-500"
                    title="Remove recommendation"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {rec.description}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            rec.trustScore >= 90
                              ? "bg-green-500"
                              : rec.trustScore >= 80
                                ? "bg-blue-500"
                                : rec.trustScore >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${rec.trustScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {rec.trustScore}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {rec.distance}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {renderStars(rec.rating)}
                    <div className="text-sm text-gray-600">
                      {rec.reviewCount} reviews
                    </div>
                  </div>

                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {rec.mutualConnections} mutual connections
                    </span>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Why recommended:</span>{" "}
                    {rec.reason}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleConnect(rec.id)}
                    disabled={connected.includes(rec.id) || loading}
                    className={`px-4 py-2 font-medium rounded-lg transition ${
                      connected.includes(rec.id)
                        ? "bg-green-100 text-green-800 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    }`}
                  >
                    {connected.includes(rec.id) ? (
                      <>
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}
                  </button>
                  <Link
                    href={`/businesses/${rec.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecommendations.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No recommendations found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your filters or check back later for new
              recommendations.
            </p>
            <button
              onClick={() =>
                setFilters({ category: "all", trustScore: 0, distance: "all" })
              }
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Loading recommendations...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
