"use client";

import { useState } from "react";
import Link from "next/link";

type Business = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  trustScore: number;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  description: string;
  tags: string[];
  isOpen: boolean;
  featured: boolean;
  imageColor: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
};

type FilterState = {
  category: string;
  trustScore: number;
  rating: number;
  openNow: boolean;
  distance: string;
  tags: string[];
};

export default function DiscoverPage() {
  const businesses: Business[] = [
    {
      id: "1",
      name: "GreenLeaf Cafe",
      category: "Food & Drink",
      subcategory: "Coffee Shop",
      trustScore: 94,
      location: "Downtown",
      distance: "0.5 mi",
      rating: 4.8,
      reviewCount: 342,
      description:
        "Artisan coffee and fresh pastries in a cozy atmosphere. Family-owned since 2010.",
      tags: ["Coffee", "Pastries", "WiFi", "Vegetarian"],
      isOpen: true,
      featured: true,
      imageColor: "bg-green-100",
    },
    {
      id: "2",
      name: "Urban Fitness Center",
      category: "Fitness",
      subcategory: "Gym",
      trustScore: 89,
      location: "City Center",
      distance: "1.2 mi",
      rating: 4.6,
      reviewCount: 215,
      description:
        "24/7 gym with personal training, group classes, and modern equipment.",
      tags: ["24/7", "Personal Training", "Yoga", "Cardio"],
      isOpen: true,
      featured: true,
      imageColor: "bg-blue-100",
    },
    {
      id: "3",
      name: "TechFix Solutions",
      category: "Services",
      subcategory: "Electronics Repair",
      trustScore: 92,
      location: "Tech Park",
      distance: "2.3 mi",
      rating: 4.9,
      reviewCount: 187,
      description:
        "Expert repair for phones, laptops, and tablets with warranty on all services.",
      tags: ["Phone Repair", "Laptop", "Warranty", "Same Day"],
      isOpen: true,
      featured: false,
      imageColor: "bg-purple-100",
    },
    {
      id: "4",
      name: "Bliss Yoga Studio",
      category: "Wellness",
      subcategory: "Yoga Studio",
      trustScore: 96,
      location: "West Side",
      distance: "1.8 mi",
      rating: 4.7,
      reviewCount: 156,
      description:
        "Mindful yoga practice for all levels in a serene environment.",
      tags: ["Hot Yoga", "Meditation", "Beginners", "Workshops"],
      isOpen: false,
      featured: true,
      imageColor: "bg-pink-100",
    },
    {
      id: "5",
      name: "FreshMart Grocery",
      category: "Retail",
      subcategory: "Grocery Store",
      trustScore: 87,
      location: "North District",
      distance: "3.1 mi",
      rating: 4.5,
      reviewCount: 278,
      description: "Local produce, organic products, and household essentials.",
      tags: ["Organic", "Local", "Delivery", "Bulk"],
      isOpen: true,
      featured: false,
      imageColor: "bg-orange-100",
    },
    {
      id: "6",
      name: "Precision Auto Care",
      category: "Automotive",
      subcategory: "Auto Repair",
      trustScore: 91,
      location: "Industrial Area",
      distance: "4.2 mi",
      rating: 4.8,
      reviewCount: 194,
      description:
        "Honest auto repair with certified mechanics and fair pricing.",
      tags: ["Oil Change", "Brakes", "Diagnostics", "Transmission"],
      isOpen: true,
      featured: false,
      imageColor: "bg-red-100",
    },
    {
      id: "7",
      name: "Creative Minds Marketing",
      category: "Professional",
      subcategory: "Marketing Agency",
      trustScore: 88,
      location: "Business District",
      distance: "0.9 mi",
      rating: 4.4,
      reviewCount: 89,
      description:
        "Digital marketing solutions for small to medium businesses.",
      tags: ["SEO", "Social Media", "Web Design", "Branding"],
      isOpen: true,
      featured: false,
      imageColor: "bg-indigo-100",
    },
    {
      id: "8",
      name: "Pet Paradise Care",
      category: "Pet Services",
      subcategory: "Pet Grooming",
      trustScore: 93,
      location: "Residential Area",
      distance: "2.7 mi",
      rating: 4.9,
      reviewCount: 167,
      description:
        "Professional grooming, boarding, and daycare for your furry friends.",
      tags: ["Grooming", "Boarding", "Daycare", "Vet Recommended"],
      isOpen: true,
      featured: true,
      imageColor: "bg-yellow-100",
    },
  ];

  const categories: Category[] = [
    { id: "all", name: "All", icon: "📊", count: 156, color: "bg-gray-100" },
    {
      id: "food",
      name: "Food & Drink",
      icon: "🍽️",
      count: 42,
      color: "bg-red-100",
    },
    {
      id: "retail",
      name: "Retail",
      icon: "🛍️",
      count: 38,
      color: "bg-blue-100",
    },
    {
      id: "services",
      name: "Services",
      icon: "🔧",
      count: 34,
      color: "bg-green-100",
    },
    {
      id: "wellness",
      name: "Wellness",
      icon: "💆",
      count: 22,
      color: "bg-purple-100",
    },
    {
      id: "professional",
      name: "Professional",
      icon: "💼",
      count: 18,
      color: "bg-indigo-100",
    },
    {
      id: "automotive",
      name: "Automotive",
      icon: "🚗",
      count: 12,
      color: "bg-orange-100",
    },
    {
      id: "home",
      name: "Home Services",
      icon: "🏠",
      count: 28,
      color: "bg-yellow-100",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    trustScore: 0,
    rating: 0,
    openNow: false,
    distance: "all",
    tags: [],
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("trustScore");

  // Available tags for filtering
  const availableTags = [
    "WiFi",
    "Delivery",
    "24/7",
    "Organic",
    "Vegetarian",
    "Vegan",
    "Parking",
    "Outdoor",
    "Family",
    "Pet Friendly",
    "Wheelchair Accessible",
    "Appointment",
    "Walk-ins Welcome",
    "Local",
    "Sustainable",
  ];

  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter((business) => {
      // Search filter
      if (
        searchTerm &&
        !business.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !business.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category !== "all") {
        const categoryMap: Record<string, string> = {
          food: "Food & Drink",
          retail: "Retail",
          services: "Services",
          wellness: "Wellness",
          professional: "Professional",
          automotive: "Automotive",
          home: "Home Services",
        };
        if (categoryMap[filters.category] !== business.category) {
          return false;
        }
      }

      // Trust score filter
      if (filters.trustScore > 0 && business.trustScore < filters.trustScore) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && business.rating < filters.rating) {
        return false;
      }

      // Open now filter
      if (filters.openNow && !business.isOpen) {
        return false;
      }

      // Distance filter (simplified)
      if (filters.distance !== "all") {
        const distanceNum = parseFloat(business.distance.split(" ")[0]);
        switch (filters.distance) {
          case "under1":
            if (distanceNum > 1) return false;
            break;
          case "under3":
            if (distanceNum > 3) return false;
            break;
          case "under5":
            if (distanceNum > 5) return false;
            break;
          case "under10":
            if (distanceNum > 10) return false;
            break;
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        if (!filters.tags.every((tag) => business.tags.includes(tag))) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "trustScore":
        default:
          return b.trustScore - a.trustScore;
      }
    });

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      trustScore: 0,
      rating: 0,
      openNow: false,
      distance: "all",
      tags: [],
    });
    setSearchTerm("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you might trigger API call here
    console.log("Searching for:", searchTerm);
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
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Local Businesses
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find trusted businesses in your area. Read reviews, check trust
              scores, and make informed decisions.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for businesses, services, or categories..."
                  className="w-full px-6 py-4 pl-12 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Search
                </button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-blue-200">Try:</span>
                {[
                  "Coffee shops",
                  "Plumbers",
                  "Restaurants",
                  "Gyms",
                  "Electricians",
                ].map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSearchTerm(term)}
                    className="text-sm bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-full transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setFilters({ ...filters, category: cat.id })
                      }
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                        filters.category === cat.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Score */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Minimum Trust Score
                </h3>
                <div className="space-y-2">
                  {[0, 80, 85, 90, 95].map((score) => (
                    <button
                      key={score}
                      onClick={() =>
                        setFilters({ ...filters, trustScore: score })
                      }
                      className={`w-full text-left p-2 rounded-lg transition ${
                        filters.trustScore === score
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {score === 0
                        ? "Any trust score"
                        : `${score}+ Trust Score`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Minimum Rating
                </h3>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, rating })}
                      className={`w-full text-left p-2 rounded-lg transition ${
                        filters.rating === rating
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {rating === 0 ? "Any rating" : `${rating}+ Stars`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Open Now */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Open Now</h3>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, openNow: !filters.openNow })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      filters.openNow ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        filters.openNow ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Distance */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Distance</h3>
                <select
                  value={filters.distance}
                  onChange={(e) =>
                    setFilters({ ...filters, distance: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Any distance</option>
                  <option value="under1">Under 1 mile</option>
                  <option value="under3">Under 3 miles</option>
                  <option value="under5">Under 5 miles</option>
                  <option value="under10">Under 10 miles</option>
                </select>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 text-sm rounded-full transition ${
                        filters.tags.includes(tag)
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-bold">
                      {filteredBusinesses.length}
                    </span>{" "}
                    of <span className="font-bold">{businesses.length}</span>{" "}
                    businesses
                  </p>
                  {filters.category !== "all" && (
                    <p className="text-sm text-blue-600 mt-1">
                      Category:{" "}
                      {categories.find((c) => c.id === filters.category)?.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="trustScore">Trust Score</option>
                      <option value="rating">Rating</option>
                      <option value="reviews">Most Reviews</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="distance">Distance</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-l-lg ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
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
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-r-lg ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
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
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {Object.values(filters).some(
              (val) =>
                (typeof val === "string" && val !== "all" && val !== "") ||
                (typeof val === "number" && val > 0) ||
                (typeof val === "boolean" && val) ||
                (Array.isArray(val) && val.length > 0)
            ) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.category !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {categories.find((c) => c.id === filters.category)?.name}
                      <button
                        onClick={() =>
                          setFilters({ ...filters, category: "all" })
                        }
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.trustScore > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {filters.trustScore}+ Trust Score
                      <button
                        onClick={() =>
                          setFilters({ ...filters, trustScore: 0 })
                        }
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.rating > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                      {filters.rating}+ Stars
                      <button
                        onClick={() => setFilters({ ...filters, rating: 0 })}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.openNow && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Open Now
                      <button
                        onClick={() =>
                          setFilters({ ...filters, openNow: false })
                        }
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="ml-2 text-gray-600 hover:text-gray-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Businesses Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      {/* Business Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`${business.imageColor} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg mr-4`}
                          >
                            {getInitials(business.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-gray-900">
                                {business.name}
                              </h3>
                              {business.featured && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {business.category} • {business.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {business.trustScore}
                          </div>
                          <div className="text-xs text-gray-500">
                            Trust Score
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {business.description}
                      </p>

                      {/* Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          {renderStars(business.rating)}
                          <div className="text-sm text-gray-600">
                            {business.reviewCount} reviews
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
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
                            {business.distance}
                          </div>
                          <div
                            className={`flex items-center ${business.isOpen ? "text-green-600" : "text-red-600"}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${business.isOpen ? "bg-green-500" : "bg-red-500"}`}
                            />
                            {business.isOpen ? "Open Now" : "Closed"}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {business.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {business.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{business.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/businesses/${business.id}`}
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
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Business Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className={`${business.imageColor} w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-3`}
                                >
                                  {getInitials(business.name)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-gray-900">
                                      {business.name}
                                    </h3>
                                    {business.featured && (
                                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm">
                                    {business.category} • {business.location}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm mb-3">
                                {business.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                {business.trustScore}
                              </div>
                              <div className="text-xs text-gray-500">
                                Trust Score
                              </div>
                            </div>
                          </div>

                          {/* Stats Row */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center">
                              {renderStars(business.rating)}
                              <span className="ml-2 text-gray-600">
                                ({business.reviewCount})
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
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
                              {business.distance}
                            </div>
                            <div
                              className={`flex items-center ${business.isOpen ? "text-green-600" : "text-red-600"}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${business.isOpen ? "bg-green-500" : "bg-red-500"}`}
                              />
                              {business.isOpen ? "Open Now" : "Closed"}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {business.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <Link
                            href={`/businesses/${business.id}`}
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
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredBusinesses.length === 0 && (
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
                  No businesses found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Map Link */}
            <div className="mt-8 text-center">
              <Link
                href="/map"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                View on Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
