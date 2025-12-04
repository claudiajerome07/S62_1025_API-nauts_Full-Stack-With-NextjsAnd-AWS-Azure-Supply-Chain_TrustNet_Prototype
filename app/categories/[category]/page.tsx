"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

type CategoryInfo = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  stats: {
    totalBusinesses: number;
    avgTrustScore: number;
    avgRating: number;
    topSubcategories: string[];
  };
  tips: string[];
};

type FilterState = {
  subcategory: string;
  trustScore: number;
  rating: number;
  openNow: boolean;
  sortBy: string;
};

// Category database
const categoryDatabase: Record<string, CategoryInfo> = {
  restaurants: {
    id: "restaurants",
    name: "Restaurants",
    description:
      "Discover amazing dining experiences, from casual eateries to fine dining establishments.",
    icon: "🍽️",
    color: "from-red-500 to-orange-500",
    stats: {
      totalBusinesses: 248,
      avgTrustScore: 88,
      avgRating: 4.4,
      topSubcategories: [
        "Italian",
        "Asian",
        "American",
        "Mexican",
        "Vegetarian",
      ],
    },
    tips: [
      "Check recent reviews for menu updates",
      "Look for restaurants with consistent high ratings",
      "Consider trust score for reliability",
      "Check if reservations are recommended",
    ],
  },
  coffee: {
    id: "coffee",
    name: "Coffee & Cafes",
    description:
      "Find your perfect brew, from artisanal coffee shops to cozy neighborhood cafes.",
    icon: "☕",
    color: "from-amber-700 to-brown-600",
    stats: {
      totalBusinesses: 156,
      avgTrustScore: 91,
      avgRating: 4.6,
      topSubcategories: [
        "Specialty Coffee",
        "Cafe",
        "Bakery",
        "Tea House",
        "Brunch",
      ],
    },
    tips: [
      "Look for specialty coffee indicators",
      "Check WiFi availability",
      "Consider seating comfort",
      "Look for local roasters",
    ],
  },
  fitness: {
    id: "fitness",
    name: "Gyms & Fitness",
    description:
      "Find fitness centers, gyms, yoga studios, and wellness facilities near you.",
    icon: "💪",
    color: "from-blue-500 to-cyan-500",
    stats: {
      totalBusinesses: 134,
      avgTrustScore: 86,
      avgRating: 4.3,
      topSubcategories: [
        "Gym",
        "Yoga",
        "CrossFit",
        "Pilates",
        "Personal Training",
      ],
    },
    tips: [
      "Check equipment quality and variety",
      "Look for certified trainers",
      "Consider class schedules",
      "Check cleanliness ratings",
    ],
  },
  services: {
    id: "services",
    name: "Home Services",
    description:
      "Professional services for your home including cleaning, repairs, and maintenance.",
    icon: "🔧",
    color: "from-green-500 to-emerald-600",
    stats: {
      totalBusinesses: 342,
      avgTrustScore: 85,
      avgRating: 4.2,
      topSubcategories: [
        "Cleaning",
        "Plumbing",
        "Electrical",
        "Handyman",
        "Pest Control",
      ],
    },
    tips: [
      "Always check licensing and insurance",
      "Look for service guarantees",
      "Check response time ratings",
      "Compare pricing transparency",
    ],
  },
  wellness: {
    id: "wellness",
    name: "Health & Wellness",
    description:
      "Take care of your mind and body with spas, clinics, and wellness centers.",
    icon: "💆",
    color: "from-purple-500 to-pink-500",
    stats: {
      totalBusinesses: 187,
      avgTrustScore: 89,
      avgRating: 4.5,
      topSubcategories: ["Spa", "Massage", "Dental", "Chiropractic", "Therapy"],
    },
    tips: [
      "Verify professional certifications",
      "Check hygiene standards",
      "Look for personalized service",
      "Consider ambiance and comfort",
    ],
  },
  retail: {
    id: "retail",
    name: "Retail Stores",
    description:
      "Shop local with independent retailers, boutiques, and specialty stores.",
    icon: "🛍️",
    color: "from-indigo-500 to-purple-600",
    stats: {
      totalBusinesses: 423,
      avgTrustScore: 87,
      avgRating: 4.4,
      topSubcategories: [
        "Clothing",
        "Electronics",
        "Grocery",
        "Home Goods",
        "Specialty",
      ],
    },
    tips: [
      "Check return policies",
      "Look for local products",
      "Consider customer service ratings",
      "Check parking availability",
    ],
  },
  automotive: {
    id: "automotive",
    name: "Automotive",
    description:
      "Keep your vehicle running smoothly with trusted auto shops and services.",
    icon: "🚗",
    color: "from-gray-600 to-gray-800",
    stats: {
      totalBusinesses: 89,
      avgTrustScore: 84,
      avgRating: 4.1,
      topSubcategories: [
        "Repair",
        "Maintenance",
        "Detailing",
        "Tires",
        "Body Shop",
      ],
    },
    tips: [
      "Verify mechanic certifications",
      "Check warranty on repairs",
      "Look for honest diagnostics",
      "Compare pricing transparency",
    ],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.category as string;

  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    subcategory: "all",
    trustScore: 0,
    rating: 0,
    openNow: false,
    sortBy: "trustScore",
  });

  // Mock businesses data for each category
  const mockBusinesses: Record<string, Business[]> = {
    restaurants: [
      {
        id: "1",
        name: "La Bella Vista",
        category: "Restaurants",
        subcategory: "Italian",
        trustScore: 94,
        location: "Downtown",
        distance: "0.8 mi",
        rating: 4.8,
        reviewCount: 342,
        description:
          "Authentic Italian cuisine with handmade pasta and imported ingredients.",
        tags: ["Fine Dining", "Romantic", "Wine List", "Reservations"],
        isOpen: true,
        featured: true,
        imageColor: "bg-red-100",
      },
      {
        id: "2",
        name: "Spice Garden",
        category: "Restaurants",
        subcategory: "Indian",
        trustScore: 91,
        location: "East Side",
        distance: "1.5 mi",
        rating: 4.7,
        reviewCount: 215,
        description:
          "Traditional Indian dishes with modern twists in a vibrant setting.",
        tags: ["Vegetarian", "Spicy", "Lunch Buffet", "Takeout"],
        isOpen: true,
        featured: true,
        imageColor: "bg-orange-100",
      },
      {
        id: "3",
        name: "Ocean Blue",
        category: "Restaurants",
        subcategory: "Seafood",
        trustScore: 92,
        location: "Waterfront",
        distance: "2.3 mi",
        rating: 4.6,
        reviewCount: 187,
        description:
          "Fresh seafood with ocean views and sustainable sourcing practices.",
        tags: ["Seafood", "Water View", "Sustainable", "Fresh Catch"],
        isOpen: true,
        featured: false,
        imageColor: "bg-blue-100",
      },
      {
        id: "4",
        name: "Green Leaf Bistro",
        category: "Restaurants",
        subcategory: "Vegetarian",
        trustScore: 96,
        location: "West Side",
        distance: "1.2 mi",
        rating: 4.9,
        reviewCount: 278,
        description:
          "Creative plant-based cuisine using locally sourced organic ingredients.",
        tags: ["Vegetarian", "Vegan", "Organic", "Farm-to-Table"],
        isOpen: true,
        featured: true,
        imageColor: "bg-green-100",
      },
      {
        id: "5",
        name: "Burger Junction",
        category: "Restaurants",
        subcategory: "American",
        trustScore: 88,
        location: "Midtown",
        distance: "0.9 mi",
        rating: 4.4,
        reviewCount: 194,
        description:
          "Gourmet burgers and craft beers in a casual, family-friendly atmosphere.",
        tags: ["Burgers", "Craft Beer", "Family", "Casual"],
        isOpen: true,
        featured: false,
        imageColor: "bg-amber-100",
      },
      {
        id: "6",
        name: "Sakura Japanese",
        category: "Restaurants",
        subcategory: "Japanese",
        trustScore: 93,
        location: "Business District",
        distance: "1.8 mi",
        rating: 4.7,
        reviewCount: 156,
        description:
          "Traditional sushi and Japanese cuisine prepared by master chefs.",
        tags: ["Sushi", "Japanese", "Authentic", "Omakase"],
        isOpen: false,
        featured: false,
        imageColor: "bg-pink-100",
      },
    ],
    coffee: [
      {
        id: "7",
        name: "Artisan Roasters",
        category: "Coffee & Cafes",
        subcategory: "Specialty Coffee",
        trustScore: 95,
        location: "Downtown",
        distance: "0.5 mi",
        rating: 4.8,
        reviewCount: 287,
        description:
          "Third-wave coffee shop roasting single-origin beans on site.",
        tags: ["Specialty Coffee", "Local Roaster", "WiFi", "Cozy"],
        isOpen: true,
        featured: true,
        imageColor: "bg-brown-100",
      },
      {
        id: "8",
        name: "Morning Brew Cafe",
        category: "Coffee & Cafes",
        subcategory: "Cafe",
        trustScore: 89,
        location: "West Side",
        distance: "1.2 mi",
        rating: 4.5,
        reviewCount: 203,
        description:
          "Neighborhood cafe with fresh pastries and comfortable seating.",
        tags: ["Pastries", "WiFi", "Breakfast", "Outdoor Seating"],
        isOpen: true,
        featured: false,
        imageColor: "bg-amber-100",
      },
    ],
    // Add more mock data for other categories as needed
  };

  // Get subcategories based on category
  const getSubcategories = () => {
    if (!category) return ["all"];
    const uniqueSubcategories = Array.from(
      new Set(businesses.map((b) => b.subcategory))
    );
    return ["all", ...uniqueSubcategories];
  };

  // Load category data
  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const categoryData = categoryDatabase[categoryId];
        if (!categoryData) {
          throw new Error("Category not found");
        }

        setCategory(categoryData);

        // Load businesses for this category
        const categoryBusinesses =
          mockBusinesses[categoryId] || mockBusinesses.restaurants;
        setBusinesses(categoryBusinesses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load category"
        );
        router.push("/discover"); // Redirect to discover page if category not found
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadCategoryData();
    }
  }, [categoryId, router]);

  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter((business) => {
      // Subcategory filter
      if (
        filters.subcategory !== "all" &&
        business.subcategory !== filters.subcategory
      ) {
        return false;
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

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "name":
          return a.name.localeCompare(b.name);
        case "trustScore":
        default:
          return b.trustScore - a.trustScore;
      }
    });

  const handleClearFilters = () => {
    setFilters({
      subcategory: "all",
      trustScore: 0,
      rating: 0,
      openNow: false,
      sortBy: "trustScore",
    });
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

  if (loading) {
    // Loading state is handled by Next.js loading.tsx
    return null;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero */}
      <div className={`bg-gradient-to-r ${category.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{category.icon}</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {category.name}
                  </h1>
                  <p className="text-xl opacity-90">{category.description}</p>
                </div>
              </div>

              {/* Category Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {category.stats.totalBusinesses}
                  </div>
                  <div className="text-sm opacity-90">Businesses</div>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {category.stats.avgTrustScore}
                  </div>
                  <div className="text-sm opacity-90">Avg Trust Score</div>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {category.stats.avgRating.toFixed(1)}
                  </div>
                  <div className="text-sm opacity-90">Avg Rating</div>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-lg font-bold">Top Rated</div>
                  <div className="text-sm opacity-90">In {category.name}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/map"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition"
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
              <Link
                href="/discover"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition"
              >
                All Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Filters */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Filter Results
                </h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              {/* Subcategory Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Type</h3>
                <div className="space-y-2">
                  {getSubcategories().map((subcat) => (
                    <button
                      key={subcat}
                      onClick={() =>
                        setFilters({ ...filters, subcategory: subcat })
                      }
                      className={`w-full text-left p-2 rounded-lg transition ${
                        filters.subcategory === subcat
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {subcat === "all" ? "All Types" : subcat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Score Filter */}
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

              {/* Rating Filter */}
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

              {/* Open Now Filter */}
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
            </div>

            {/* Category Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Choosing {category.name}
              </h3>
              <ul className="space-y-3">
                {category.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Subcategories */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Popular in {category.name}
              </h3>
              <div className="space-y-3">
                {category.stats.topSubcategories
                  .slice(0, 5)
                  .map((subcat, index) => (
                    <Link
                      key={subcat}
                      href={`/search?q=${encodeURIComponent(subcat + " " + category.name.toLowerCase())}`}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <span className="text-gray-900">{subcat}</span>
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
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {filteredBusinesses.length} {category.name} Found
                  </h2>
                  <p className="text-gray-600">
                    {filters.subcategory !== "all" &&
                      `Filtered by: ${filters.subcategory}`}
                    {filters.trustScore > 0 &&
                      ` • ${filters.trustScore}+ Trust Score`}
                    {filters.rating > 0 && ` • ${filters.rating}+ Stars`}
                    {filters.openNow && " • Open Now"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Sort by:</span>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({ ...filters, sortBy: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="trustScore">Trust Score</option>
                      <option value="rating">Rating</option>
                      <option value="reviews">Most Reviews</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="distance">Distance</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.subcategory !== "all" ||
              filters.trustScore > 0 ||
              filters.rating > 0 ||
              filters.openNow) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.subcategory !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Type: {filters.subcategory}
                      <button
                        onClick={() =>
                          setFilters({ ...filters, subcategory: "all" })
                        }
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
                      Rating: {filters.rating}+
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
                </div>
              </div>
            )}

            {/* Businesses Grid */}
            {filteredBusinesses.length > 0 ? (
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
                              {business.subcategory} • {business.location}
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
                  Try adjusting your filters or browse other categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear All Filters
                  </button>
                  <Link
                    href="/discover"
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    Browse All Categories
                  </Link>
                </div>
              </div>
            )}

            {/* Category Description */}
            <div className="mt-8 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About {category.name}
              </h3>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700">
                  {category.description} TrustNet helps you find the best{" "}
                  {category.name.toLowerCase()} by combining verified reviews,
                  trust scores from real customers, and detailed business
                  information. Each listing includes important details like
                  operating hours, contact information, services offered, and
                  customer ratings to help you make informed decisions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Why TrustNet for {category.name}?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Verified customer reviews and ratings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Trust scores based on reliability and quality
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Detailed business profiles with photos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Real-time availability and booking</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Tips for Choosing
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {category.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
