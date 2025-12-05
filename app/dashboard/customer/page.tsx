"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type SearchResult = {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  description: string;
  matchScore: number;
  imageColor: string;
};

type RecentSearch = {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
};

type SearchSuggestion = {
  id: string;
  text: string;
  type: "business" | "category" | "location" | "service";
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams?.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Mock search suggestions
  const allSuggestions: SearchSuggestion[] = [];

  // Popular searches
  const popularSearches: string[] = [];

  // Filter categories
  const filterCategories: { id: string; name: string; count: number }[] = [];

  // Mock search results
  const mockResults: SearchResult[] = [];

  // Handle search
  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;

    setIsLoading(true);

    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(query)}`);

    // Simulate API call
    setTimeout(() => {
      // Filter mock results based on query
      const filtered = mockResults.filter(
        (result) =>
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.category.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filtered);
      setIsLoading(false);
      setShowSuggestions(false);

      // Add to recent searches if not already there
      if (!recentSearches.some((search) => search.query === query)) {
        const newSearch: RecentSearch = {
          id: Date.now().toString(),
          query,
          timestamp: new Date(),
          resultCount: filtered.length,
        };
        setRecentSearches((prev) => [newSearch, ...prev.slice(0, 9)]);
      }

      // Scroll to results
      document
        .getElementById("search-results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  // Handle popular search click
  const handlePopularSearchClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: RecentSearch) => {
    setSearchQuery(search.query);
    handleSearch(search.query);
  };

  // Clear recent searches
  const handleClearRecentSearches = () => {
    if (window.confirm("Clear all recent searches?")) {
      setRecentSearches([]);
    }
  };

  // Update suggestions based on input
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = allSuggestions.filter((suggestion) =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Load initial search if query exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else {
      // Clear search results and reset states if no initial query
      setSearchResults([]);
      setSearchQuery("");
      setActiveFilter("all");
      setSortBy("relevance");
      setShowSuggestions(false);
    }
  }, [initialQuery]);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Get icon for suggestion type
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "business":
        return "🏢";
      case "category":
        return "📁";
      case "location":
        return "📍";
      case "service":
        return "✅";
      default:
        return "🔍";
    }
  };

  // Format timestamp
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get initials for business
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Render stars
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Search TrustNet
            </h1>
            <p className="text-blue-100">
              Find trusted businesses, services, and professionals
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for? (e.g., plumber, coffee shop, electrician...)"
                  className="w-full px-6 py-4 pl-12 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onFocus={() =>
                    searchQuery.length >= 2 && setShowSuggestions(true)
                  }
                />
                <svg
                  className="absolute left-4 top-4 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isLoading}
                  className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition text-left"
                    >
                      <span className="text-lg mr-3">
                        {getSuggestionIcon(suggestion.type)}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {suggestion.type}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
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
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Popular Searches */}
          <div className="mt-6">
            <div className="text-sm text-blue-200 mb-2">Popular searches:</div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(search)}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-sm rounded-full transition"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchQuery && searchResults.length === 0 && !isLoading ? (
          // No Results State
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No results found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try different keywords or check out our popular searches
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Clear Search
            </button>
          </div>
        ) : !searchQuery && !isLoading ? (
          // Search Home (Before Search)
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Searches */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Searches
                  </h2>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={handleClearRecentSearches}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {recentSearches.length > 0 ? (
                  <div className="space-y-3">
                    {recentSearches.map((search) => (
                      <button
                        key={search.id}
                        onClick={() => handleRecentSearchClick(search)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-400 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {search.query}
                            </div>
                            <div className="text-sm text-gray-500">
                              {search.resultCount} results •{" "}
                              {formatTimeAgo(search.timestamp)}
                            </div>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-gray-500">
                      Your recent searches will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Browse Categories */}
            <div>
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Browse by Category
                </h2>
                <div className="space-y-3">
                  {filterCategories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/discover"
                  className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  View All Categories
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

              {/* Search Tips */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Search Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>
                      Be specific: "24-hour plumber" instead of "plumber"
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Add location: "coffee shop downtown"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Use services: "restaurant with outdoor seating"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Check trust scores for reliability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Search Results
          <div id="search-results">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {isLoading
                      ? "Searching..."
                      : `Results for "${searchQuery}"`}
                  </h2>
                  <p className="text-gray-600">
                    {isLoading
                      ? "Please wait..."
                      : `${searchResults.length} businesses found`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Filter Tabs */}
                  <div className="flex overflow-x-auto pb-2">
                    {filterCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveFilter(category.id)}
                        className={`px-4 py-2 whitespace-nowrap font-medium transition ${
                          activeFilter === category.id
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {category.name}{" "}
                        {category.id !== "all" && `(${category.count})`}
                      </button>
                    ))}
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="trustScore">Highest Trust Score</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="distance">Nearest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">
                  Searching for "{searchQuery}"...
                </p>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      {/* Business Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`${result.imageColor} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg mr-4`}
                          >
                            {getInitials(result.name)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {result.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {result.category} • {result.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {result.trustScore}
                          </div>
                          <div className="text-xs text-gray-500">
                            Trust Score
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {result.description}
                      </p>

                      {/* Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {renderStars(result.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              ({result.reviewCount})
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 inline mr-1"
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
                            {result.distance}
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="flex items-center">
                          <div className="text-xs text-gray-500 mr-2">
                            Match:
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.matchScore >= 90
                                  ? "bg-green-500"
                                  : result.matchScore >= 80
                                    ? "bg-blue-500"
                                    : result.matchScore >= 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                              style={{ width: `${result.matchScore}%` }}
                            />
                          </div>
                          <div className="text-xs font-medium text-gray-700 ml-2">
                            {result.matchScore}%
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/businesses/${result.id}`}
                          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-center"
                        >
                          View Details
                        </Link>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Try Different Search */}
            {!isLoading && searchResults.length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-gray-900 mb-3">
                  Not finding what you need?
                </h3>
                <p className="text-gray-600 mb-4">
                  Try these related searches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[].map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handlePopularSearchClick(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
