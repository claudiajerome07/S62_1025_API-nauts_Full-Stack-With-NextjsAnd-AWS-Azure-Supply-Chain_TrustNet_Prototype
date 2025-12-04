"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Business = {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number; // in miles
  rating: number;
  reviewCount: number;
  description: string;
  tags: string[];
  isOpen: boolean;
  openingHours: string;
  phone: string;
  imageColor: string;
};

type FilterState = {
  category: string;
  trustScore: number;
  rating: number;
  openNow: boolean;
  distance: number; // max distance in miles
  sortBy: string;
};

export default function NearbyPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    trustScore: 0,
    rating: 0,
    openNow: false,
    distance: 5, // Default 5 mile radius
    sortBy: "distance",
  });

  const categories = [
    { id: "all", name: "All Categories", icon: "📊", count: 0 },
    { id: "food", name: "Food & Drink", icon: "🍽️", count: 0 },
    { id: "coffee", name: "Coffee & Cafes", icon: "☕", count: 0 },
    { id: "shopping", name: "Shopping", icon: "🛍️", count: 0 },
    { id: "services", name: "Services", icon: "🔧", count: 0 },
    { id: "health", name: "Health & Wellness", icon: "💊", count: 0 },
    { id: "entertainment", name: "Entertainment", icon: "🎬", count: 0 },
    { id: "other", name: "Other", icon: "🏢", count: 0 },
  ];

  // Mock businesses data with coordinates
  const mockBusinesses: Business[] = [
    {
      id: "1",
      name: "GreenLeaf Cafe",
      category: "Coffee & Cafes",
      trustScore: 94,
      location: "123 Main Street",
      coordinates: { lat: 40.7128, lng: -74.006 },
      distance: 0.3,
      rating: 4.8,
      reviewCount: 342,
      description:
        "Artisan coffee and fresh pastries. Family-owned since 2010.",
      tags: ["Coffee", "Pastries", "WiFi", "Breakfast"],
      isOpen: true,
      openingHours: "6:00 AM - 8:00 PM",
      phone: "(555) 123-4567",
      imageColor: "bg-green-100",
    },
    {
      id: "2",
      name: "Urban Fitness Center",
      category: "Health & Wellness",
      trustScore: 89,
      location: "456 Fitness Avenue",
      coordinates: { lat: 40.7168, lng: -74.008 },
      distance: 0.8,
      rating: 4.6,
      reviewCount: 215,
      description: "24/7 gym with personal training and group classes.",
      tags: ["24/7", "Personal Training", "Yoga", "Cardio"],
      isOpen: true,
      openingHours: "Open 24/7",
      phone: "(555) 234-5678",
      imageColor: "bg-blue-100",
    },
    {
      id: "3",
      name: "TechFix Solutions",
      category: "Services",
      trustScore: 92,
      location: "789 Tech Boulevard",
      coordinates: { lat: 40.7108, lng: -74.01 },
      distance: 1.2,
      rating: 4.9,
      reviewCount: 187,
      description: "Expert repair for phones, laptops, and tablets.",
      tags: ["Phone Repair", "Laptop", "Warranty", "Same Day"],
      isOpen: true,
      openingHours: "9:00 AM - 7:00 PM",
      phone: "(555) 345-6789",
      imageColor: "bg-purple-100",
    },
    {
      id: "4",
      name: "Bliss Yoga Studio",
      category: "Health & Wellness",
      trustScore: 96,
      location: "321 Wellness Street",
      coordinates: { lat: 40.7148, lng: -74.004 },
      distance: 0.5,
      rating: 4.7,
      reviewCount: 156,
      description:
        "Mindful yoga practice for all levels in a serene environment.",
      tags: ["Hot Yoga", "Meditation", "Beginners", "Workshops"],
      isOpen: false,
      openingHours: "7:00 AM - 9:00 PM",
      phone: "(555) 456-7890",
      imageColor: "bg-pink-100",
    },
    {
      id: "5",
      name: "FreshMart Grocery",
      category: "Shopping",
      trustScore: 87,
      location: "654 Market Street",
      coordinates: { lat: 40.7188, lng: -74.002 },
      distance: 1.5,
      rating: 4.5,
      reviewCount: 278,
      description: "Local produce, organic products, and household essentials.",
      tags: ["Organic", "Local", "Delivery", "Bulk"],
      isOpen: true,
      openingHours: "7:00 AM - 10:00 PM",
      phone: "(555) 567-8901",
      imageColor: "bg-orange-100",
    },
    {
      id: "6",
      name: "Precision Auto Care",
      category: "Services",
      trustScore: 91,
      location: "987 Garage Lane",
      coordinates: { lat: 40.7208, lng: -74.012 },
      distance: 2.3,
      rating: 4.8,
      reviewCount: 194,
      description:
        "Honest auto repair with certified mechanics and fair pricing.",
      tags: ["Oil Change", "Brakes", "Diagnostics", "Transmission"],
      isOpen: true,
      openingHours: "8:00 AM - 6:00 PM",
      phone: "(555) 678-9012",
      imageColor: "bg-red-100",
    },
    {
      id: "7",
      name: "Cinema Palace",
      category: "Entertainment",
      trustScore: 88,
      location: "147 Movie Avenue",
      coordinates: { lat: 40.7088, lng: -74.006 },
      distance: 1.8,
      rating: 4.4,
      reviewCount: 89,
      description: "Modern movie theater with IMAX and premium seating.",
      tags: ["IMAX", "3D", "Snacks", "Parking"],
      isOpen: true,
      openingHours: "11:00 AM - 11:00 PM",
      phone: "(555) 789-0123",
      imageColor: "bg-indigo-100",
    },
    {
      id: "8",
      name: "Pet Paradise Care",
      category: "Services",
      trustScore: 93,
      location: "258 Pet Boulevard",
      coordinates: { lat: 40.7228, lng: -74.008 },
      distance: 2.7,
      rating: 4.9,
      reviewCount: 167,
      description:
        "Professional grooming, boarding, and daycare for your furry friends.",
      tags: ["Grooming", "Boarding", "Daycare", "Vet Recommended"],
      isOpen: true,
      openingHours: "8:00 AM - 7:00 PM",
      phone: "(555) 890-1234",
      imageColor: "bg-yellow-100",
    },
    {
      id: "9",
      name: "Sunrise Bakery",
      category: "Food & Drink",
      trustScore: 90,
      location: "369 Bread Street",
      coordinates: { lat: 40.7068, lng: -74.002 },
      distance: 1.1,
      rating: 4.7,
      reviewCount: 142,
      description:
        "Fresh baked goods, sandwiches, and coffee in a charming bakery.",
      tags: ["Bakery", "Sandwiches", "Coffee", "Local"],
      isOpen: true,
      openingHours: "5:30 AM - 6:00 PM",
      phone: "(555) 901-2345",
      imageColor: "bg-amber-100",
    },
    {
      id: "10",
      name: "City Hardware Store",
      category: "Shopping",
      trustScore: 85,
      location: "753 Tool Avenue",
      coordinates: { lat: 40.7248, lng: -74.004 },
      distance: 3.2,
      rating: 4.3,
      reviewCount: 94,
      description:
        "Complete hardware store with tools, supplies, and expert advice.",
      tags: ["Hardware", "Tools", "Paint", "Garden"],
      isOpen: false,
      openingHours: "7:00 AM - 8:00 PM",
      phone: "(555) 012-3456",
      imageColor: "bg-gray-100",
    },
  ];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setLocationLoading(false);
        // Use default location (New York)
        setUserLocation({ lat: 40.7128, lng: -74.006 });
        return;
      }

      setLocationLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
          setLocationLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Unable to retrieve your location. Using default location."
          );
          // Use default location (New York)
          setUserLocation({ lat: 40.7128, lng: -74.006 });
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocation();
  }, []);

  // Update businesses with distances
  useEffect(() => {
    if (userLocation) {
      const updatedBusinesses = mockBusinesses.map((business) => ({
        ...business,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          business.coordinates.lat,
          business.coordinates.lng
        ),
      }));

      setBusinesses(updatedBusinesses);
      setLoading(false);
    }
  }, [userLocation]);

  // Update category counts
  useEffect(() => {
    const updatedCategories = categories.map((cat) => ({
      ...cat,
      count: businesses.filter(
        (b) =>
          cat.id === "all" ||
          (cat.id === "food" && b.category === "Food & Drink") ||
          (cat.id === "coffee" && b.category === "Coffee & Cafes") ||
          (cat.id === "shopping" && b.category === "Shopping") ||
          (cat.id === "services" && b.category === "Services") ||
          (cat.id === "health" && b.category === "Health & Wellness") ||
          (cat.id === "entertainment" && b.category === "Entertainment") ||
          (cat.id === "other" &&
            ![
              "Food & Drink",
              "Coffee & Cafes",
              "Shopping",
              "Services",
              "Health & Wellness",
              "Entertainment",
            ].includes(b.category))
      ).length,
    }));

    // Update categories state if needed, but we'll use it locally
    return;
  }, [businesses]);

  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter((business) => {
      // Distance filter
      if (business.distance > filters.distance) {
        return false;
      }

      // Category filter
      if (filters.category !== "all") {
        const categoryMap: Record<string, string> = {
          food: "Food & Drink",
          coffee: "Coffee & Cafes",
          shopping: "Shopping",
          services: "Services",
          health: "Health & Wellness",
          entertainment: "Entertainment",
        };

        if (filters.category === "other") {
          const mainCategories = [
            "Food & Drink",
            "Coffee & Cafes",
            "Shopping",
            "Services",
            "Health & Wellness",
            "Entertainment",
          ];
          if (mainCategories.includes(business.category)) {
            return false;
          }
        } else if (categoryMap[filters.category] !== business.category) {
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

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "trustScore":
          return b.trustScore - a.trustScore;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "name":
          return a.name.localeCompare(b.name);
        case "distance":
        default:
          return a.distance - b.distance;
      }
    });

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
          setLocationLoading(false);
        },
        (error) => {
          setLocationError("Unable to retrieve your location");
          setLocationLoading(false);
        }
      );
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      trustScore: 0,
      rating: 0,
      openNow: false,
      distance: 5,
      sortBy: "distance",
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

  const formatDistance = (distance: number) => {
    if (distance < 0.1) return "< 0.1 mi";
    if (distance < 1) return `${distance.toFixed(1)} mi`;
    return `${distance.toFixed(1)} mi`;
  };

  const getCategoryIcon = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.icon : "🏢";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Businesses Near You
              </h1>
              <p className="text-blue-100">
                Discover trusted local businesses in your area
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
              >
                {locationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Update Location
                  </>
                )}
              </button>
              <Link
                href="/map"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition"
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

          {/* Location Status */}
          <div className="mt-6 p-4 bg-blue-500 bg-opacity-20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
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
                <div>
                  <p className="font-medium">
                    {locationLoading
                      ? "Detecting your location..."
                      : locationError
                        ? locationError
                        : "Showing businesses near your location"}
                  </p>
                  {userLocation && !locationLoading && (
                    <p className="text-sm text-blue-200">
                      Within {filters.distance} miles •{" "}
                      {filteredBusinesses.length} businesses found
                    </p>
                  )}
                </div>
              </div>
              {userLocation && !locationLoading && (
                <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  📍 Location detected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading || locationLoading ? (
          // Loading State
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Finding businesses near you...</p>
            {locationLoading && (
              <p className="text-sm text-gray-500 mt-2">
                Requesting location permission
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Distance Filter */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Distance</h2>
                  <div className="text-lg font-bold text-blue-600">
                    {filters.distance} mi
                  </div>
                </div>

                <div className="mb-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={filters.distance}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        distance: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 mi</span>
                    <span>10 mi</span>
                    <span>20 mi</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[1, 3, 5, 10, 15, 20].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setFilters({ ...filters, distance: dist })}
                      className={`px-3 py-2 text-sm rounded-lg transition ${
                        filters.distance === dist
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {dist} mi
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    Categories
                  </h2>
                  <button
                    onClick={() => setFilters({ ...filters, category: "all" })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset
                  </button>
                </div>

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
                        {
                          businesses.filter(
                            (b) =>
                              cat.id === "all" ||
                              (cat.id === "food" &&
                                b.category === "Food & Drink") ||
                              (cat.id === "coffee" &&
                                b.category === "Coffee & Cafes") ||
                              (cat.id === "shopping" &&
                                b.category === "Shopping") ||
                              (cat.id === "services" &&
                                b.category === "Services") ||
                              (cat.id === "health" &&
                                b.category === "Health & Wellness") ||
                              (cat.id === "entertainment" &&
                                b.category === "Entertainment") ||
                              (cat.id === "other" &&
                                ![
                                  "Food & Drink",
                                  "Coffee & Cafes",
                                  "Shopping",
                                  "Services",
                                  "Health & Wellness",
                                  "Entertainment",
                                ].includes(b.category))
                          ).length
                        }
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Filters
                </h2>

                {/* Trust Score */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Trust Score
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 80, 85, 90].map((score) => (
                      <button
                        key={score}
                        onClick={() =>
                          setFilters({ ...filters, trustScore: score })
                        }
                        className={`px-3 py-2 text-sm rounded-lg transition ${
                          filters.trustScore === score
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {score === 0 ? "Any" : `${score}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters({ ...filters, rating })}
                        className={`px-3 py-2 text-sm rounded-lg transition ${
                          filters.rating === rating
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {rating === 0 ? "Any" : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Open Now */}
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

                {/* Clear All */}
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Clear All Filters
                </button>
              </div>

              {/* Nearby Stats */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Nearby Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredBusinesses.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Businesses within {filters.distance} miles
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {businesses.length > 0
                        ? (
                            businesses.reduce(
                              (acc, b) => acc + b.trustScore,
                              0
                            ) / businesses.length
                          ).toFixed(0)
                        : "0"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Average Trust Score
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {businesses.filter((b) => b.isOpen).length}
                    </div>
                    <div className="text-sm text-gray-600">Open Now</div>
                  </div>
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
                      {filteredBusinesses.length} Nearby Businesses
                    </h2>
                    <p className="text-gray-600">
                      Sorted by{" "}
                      {filters.sortBy === "distance"
                        ? "distance"
                        : filters.sortBy === "trustScore"
                          ? "trust score"
                          : filters.sortBy === "rating"
                            ? "rating"
                            : "name"}
                      {filters.category !== "all" &&
                        ` • ${categories.find((c) => c.id === filters.category)?.name}`}
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
                        <option value="distance">Closest</option>
                        <option value="trustScore">Highest Trust</option>
                        <option value="rating">Highest Rated</option>
                        <option value="reviews">Most Reviews</option>
                        <option value="name">Name (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(filters.category !== "all" ||
                  filters.trustScore > 0 ||
                  filters.rating > 0 ||
                  filters.openNow) && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {filters.category !== "all" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {
                            categories.find((c) => c.id === filters.category)
                              ?.name
                          }
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
                          {filters.trustScore}+ Trust
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
                            onClick={() =>
                              setFilters({ ...filters, rating: 0 })
                            }
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
              </div>

              {/* Businesses Grid */}
              {filteredBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <div
                      key={business.id}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition"
                    >
                      <div className="p-6">
                        {/* Distance Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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
                            {formatDistance(business.distance)}
                          </div>
                        </div>

                        {/* Business Header */}
                        <div className="flex items-start mb-4">
                          <div
                            className={`${business.imageColor} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg mr-4`}
                          >
                            {getInitials(business.name)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {business.name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {business.category}
                                </p>
                              </div>
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
                            <div className="flex items-center">
                              {renderStars(business.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                ({business.reviewCount})
                              </span>
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {business.openingHours}
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
                    No businesses found nearby
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try increasing your search distance or adjusting your
                    filters.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setFilters({ ...filters, distance: 10 })}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Search 10 Miles
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                    >
                      Clear All Filters
                    </button>
                  </div>
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
                  View Nearby Businesses on Map
                </Link>
              </div>

              {/* Tips Section */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Finding the Best Nearby Businesses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Tips for Local Searches
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Check trust scores for reliability indicators
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Read recent reviews for up-to-date information
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Consider distance vs. quality trade-offs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Use filters to narrow down your search</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Why Trust Nearby Businesses?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Support your local community and economy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Faster service and easier communication</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Personalized service and relationships</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>
                          Reduced travel time and environmental impact
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
