"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type BusinessMarker = {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  isOpen: boolean;
  color: string;
};

type FilterState = {
  category: string;
  trustScore: number;
  rating: number;
  openNow: boolean;
  radius: number; // in miles
};

// Calculate distance between two coordinates (simplified)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
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

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<BusinessMarker | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    trustScore: 0,
    rating: 0,
    openNow: false,
    radius: 5,
  });

  // Mock business markers (simulated coordinates around a central point)
  const businessMarkers: BusinessMarker[] = [
    {
      id: "1",
      name: "GreenLeaf Cafe",
      category: "Coffee Shop",
      trustScore: 94,
      location: "123 Main St",
      coordinates: { lat: 40.7128, lng: -74.006 },
      rating: 4.8,
      isOpen: true,
      color: "bg-green-500",
    },
    {
      id: "2",
      name: "Urban Fitness Center",
      category: "Gym",
      trustScore: 89,
      location: "456 Fitness Ave",
      coordinates: { lat: 40.7168, lng: -74.008 },
      rating: 4.6,
      isOpen: true,
      color: "bg-blue-500",
    },
    {
      id: "3",
      name: "TechFix Solutions",
      category: "Electronics Repair",
      trustScore: 92,
      location: "789 Tech Blvd",
      coordinates: { lat: 40.7108, lng: -74.01 },
      rating: 4.9,
      isOpen: true,
      color: "bg-purple-500",
    },
    {
      id: "4",
      name: "Bliss Yoga Studio",
      category: "Yoga Studio",
      trustScore: 96,
      location: "321 Wellness St",
      coordinates: { lat: 40.7148, lng: -74.004 },
      rating: 4.7,
      isOpen: false,
      color: "bg-pink-500",
    },
    {
      id: "5",
      name: "FreshMart Grocery",
      category: "Grocery Store",
      trustScore: 87,
      location: "654 Market St",
      coordinates: { lat: 40.7188, lng: -74.002 },
      rating: 4.5,
      isOpen: true,
      color: "bg-orange-500",
    },
    {
      id: "6",
      name: "Precision Auto Care",
      category: "Auto Repair",
      trustScore: 91,
      location: "987 Garage Ln",
      coordinates: { lat: 40.7208, lng: -74.012 },
      rating: 4.8,
      isOpen: true,
      color: "bg-red-500",
    },
    {
      id: "7",
      name: "Creative Minds Marketing",
      category: "Marketing Agency",
      trustScore: 88,
      location: "147 Business Ave",
      coordinates: { lat: 40.7088, lng: -74.006 },
      rating: 4.4,
      isOpen: true,
      color: "bg-indigo-500",
    },
    {
      id: "8",
      name: "Pet Paradise Care",
      category: "Pet Services",
      trustScore: 93,
      location: "258 Pet Blvd",
      coordinates: { lat: 40.7228, lng: -74.008 },
      rating: 4.9,
      isOpen: true,
      color: "bg-yellow-500",
    },
    {
      id: "9",
      name: "Sunrise Bakery",
      category: "Bakery",
      trustScore: 90,
      location: "369 Bread St",
      coordinates: { lat: 40.7068, lng: -74.002 },
      rating: 4.7,
      isOpen: true,
      color: "bg-amber-500",
    },
    {
      id: "10",
      name: "City Hardware Store",
      category: "Hardware",
      trustScore: 85,
      location: "753 Tool Ave",
      coordinates: { lat: 40.7248, lng: -74.004 },
      rating: 4.3,
      isOpen: false,
      color: "bg-gray-500",
    },
  ];

  const categories = [
    { id: "all", name: "All Categories", count: 156 },
    { id: "coffee", name: "Coffee & Cafes", count: 24 },
    { id: "food", name: "Restaurants", count: 42 },
    { id: "retail", name: "Retail Stores", count: 38 },
    { id: "services", name: "Services", count: 34 },
    { id: "wellness", name: "Wellness", count: 22 },
  ];

  // Get user location
  useEffect(() => {
    setIsLoadingLocation(true);

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Default to New York if location access denied
            setUserLocation({ lat: 40.7128, lng: -74.006 });
            setIsLoadingLocation(false);
          },
          {
            timeout: 5000, // 5 second timeout
            maximumAge: 60000, // Cache for 1 minute
            enableHighAccuracy: false, // Faster, less accurate
          }
        );
      } else {
        // Default to New York if geolocation not supported
        setUserLocation({ lat: 40.7128, lng: -74.006 });
        setIsLoadingLocation(false);
      }
    };

    // Add a timeout for the geolocation request
    const timeoutId = setTimeout(() => {
      if (!userLocation) {
        console.log("Geolocation timeout, using default location");
        setUserLocation({ lat: 40.7128, lng: -74.006 });
        setIsLoadingLocation(false);
      }
    }, 3000); // 3 second timeout

    getLocation();

    return () => clearTimeout(timeoutId);
  }, []);

  // Initialize map simulation
  useEffect(() => {
    // Set map as loaded after a short delay OR when user location is determined
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500); // Shorter delay

    return () => clearTimeout(timer);
  }, []); // Run once on mount

  // Filter markers based on filters
  const filteredMarkers = businessMarkers.filter((marker) => {
    // Category filter
    if (filters.category !== "all") {
      const categoryMap: Record<string, string> = {
        coffee: "Coffee Shop",
        food: "Restaurant",
        retail: "Retail Store",
        services: "Service",
        wellness: "Wellness",
      };
      if (categoryMap[filters.category] !== marker.category.split(" ")[0]) {
        return false;
      }
    }

    // Trust score filter
    if (filters.trustScore > 0 && marker.trustScore < filters.trustScore) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && marker.rating < filters.rating) {
      return false;
    }

    // Open now filter
    if (filters.openNow && !marker.isOpen) {
      return false;
    }

    // Radius filter (simplified distance calculation)
    if (userLocation && filters.radius > 0) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        marker.coordinates.lat,
        marker.coordinates.lng
      );
      if (distance > filters.radius) {
        return false;
      }
    }

    return true;
  });

  const handleMarkerClick = (marker: BusinessMarker) => {
    setSelectedMarker(marker);
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      trustScore: 0,
      rating: 0,
      openNow: false,
      radius: 5,
    });
    setSelectedMarker(null);
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (_error) => {
          alert(
            "Unable to get your location. Please enable location services."
          );
        }
      );
    }
  };

  const handleGetDirections = () => {
    if (selectedMarker && userLocation) {
      // In a real app, this would open Google Maps or similar
      const mapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${selectedMarker.coordinates.lat},${selectedMarker.coordinates.lng}`;
      window.open(mapsUrl, "_blank");
    }
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
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Show loading state only briefly, then show map even if location isn't ready
  const showLoading = (!mapLoaded || isLoadingLocation) && !userLocation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Business Map</h1>
              <p className="text-blue-100">
                Find trusted businesses near you on the map
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUseMyLocation}
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition"
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Use My Location
              </button>
              <Link
                href="/discover"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                List View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters and List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
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
                      <span>{cat.name}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {cat.count}
                      </span>
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

              {/* Radius Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Search Radius
                </h3>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={filters.radius}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        radius: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-900 min-w-[50px]">
                    {filters.radius} mi
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 mi</span>
                  <span>20 mi</span>
                </div>
              </div>
            </div>

            {/* Results List Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Businesses ({filteredMarkers.length})
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {filteredMarkers.map((marker) => (
                  <button
                    key={marker.id}
                    onClick={() => handleMarkerClick(marker)}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedMarker?.id === marker.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {marker.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {marker.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {marker.trustScore}
                        </div>
                        <div className="text-xs text-gray-500">Trust</div>
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
                        {marker.location}
                      </div>
                      <div
                        className={`flex items-center ${marker.isOpen ? "text-green-600" : "text-red-600"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${marker.isOpen ? "bg-green-500" : "bg-red-500"}`}
                        />
                        {marker.isOpen ? "Open" : "Closed"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {/* Map Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Map View
                    </h2>
                    <p className="text-sm text-gray-600">
                      {userLocation
                        ? "Showing businesses near you"
                        : "Loading your location..."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">
                      {filteredMarkers.length} businesses shown
                    </div>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <button
                      onClick={() => setSelectedMarker(null)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Area */}
              <div className="relative" style={{ height: "600px" }}>
                {showLoading ? (
                  // Loading State
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                      {isLoadingLocation && (
                        <p className="text-sm text-gray-500 mt-2">
                          Requesting location permission
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setMapLoaded(true);
                          setUserLocation({ lat: 40.7128, lng: -74.006 });
                        }}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        Skip Location & Show Map
                      </button>
                    </div>
                  </div>
                ) : mapError ? (
                  // Error State
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-8">
                      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Map Error
                      </h3>
                      <p className="text-gray-600 mb-4">{mapError}</p>
                      <button
                        onClick={() => setMapError(null)}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  // Map Content (Simulated) - ALWAYS SHOW THIS WHEN NOT LOADING
                  <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                    {/* Simulated Map Background */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"
                      style={{
                        backgroundImage: `
                          linear-gradient(90deg, #dbeafe 1px, transparent 1px),
                          linear-gradient(#dbeafe 1px, transparent 1px)
                        `,
                        backgroundSize: "50px 50px",
                      }}
                    >
                      {/* User Location Marker */}
                      {userLocation && (
                        <div
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: "50%",
                            top: "50%",
                            zIndex: 10,
                          }}
                        >
                          <div className="relative">
                            <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                            <div className="absolute inset-0 animate-ping bg-blue-400 rounded-full"></div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded shadow">
                              Your Location
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Business Markers */}
                      {filteredMarkers.map((marker, index) => {
                        // Calculate position relative to user location (simulated)
                        const angle =
                          (index / filteredMarkers.length) * 2 * Math.PI;
                        const distance = 100 + (index % 5) * 30; // pixels from center
                        const x = Math.cos(angle) * distance;
                        const y = Math.sin(angle) * distance;

                        return (
                          <button
                            key={marker.id}
                            onClick={() => handleMarkerClick(marker)}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                              selectedMarker?.id === marker.id
                                ? "z-20 scale-125"
                                : "z-10 hover:scale-110"
                            }`}
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                            }}
                          >
                            <div className="relative">
                              <div
                                className={`${marker.color} w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center`}
                              >
                                <span className="text-white font-bold text-sm">
                                  {marker.name.charAt(0)}
                                </span>
                              </div>
                              {selectedMarker?.id === marker.id && (
                                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-700 bg-white px-3 py-2 rounded-lg shadow-lg min-w-[200px]">
                                  <div className="font-bold">{marker.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {marker.category}
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-medium">
                                      {marker.trustScore} Trust
                                    </span>
                                    <span
                                      className={`text-xs ${marker.isOpen ? "text-green-600" : "text-red-600"}`}
                                    >
                                      {marker.isOpen ? "Open" : "Closed"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}

                      {/* Radius Circle */}
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-300 border-dashed rounded-full"
                        style={{
                          left: "50%",
                          top: "50%",
                          width: `${filters.radius * 40}px`,
                          height: `${filters.radius * 40}px`,
                          zIndex: 5,
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-blue-600 font-medium bg-white px-2 py-1 rounded shadow">
                          {filters.radius} mile radius
                        </div>
                      </div>
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={handleUseMyLocation}
                        className="bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                        title="Center on my location"
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
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
                      </button>
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            radius: Math.min(filters.radius + 1, 20),
                          })
                        }
                        className="bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                        title="Zoom out"
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            radius: Math.max(filters.radius - 1, 1),
                          })
                        }
                        className="bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                        title="Zoom in"
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-4 max-w-xs">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Map Legend
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                          <span>Your Location</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span>Businesses (90+ Trust)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                          <span>Businesses (80-89 Trust)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                          <span>Closed Businesses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Business Card */}
                {selectedMarker && (
                  <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg max-w-sm z-30">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {selectedMarker.name}
                          </h3>
                          <p className="text-gray-600">
                            {selectedMarker.category}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedMarker(null)}
                          className="text-gray-400 hover:text-gray-600"
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

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedMarker.trustScore}
                            </div>
                            <div className="text-sm text-gray-500">
                              Trust Score
                            </div>
                          </div>
                          <div>
                            {renderStars(selectedMarker.rating)}
                            <div className="text-sm text-gray-500 text-right">
                              Rating
                            </div>
                          </div>
                          <div>
                            <div
                              className={`text-lg font-bold ${selectedMarker.isOpen ? "text-green-600" : "text-red-600"}`}
                            >
                              {selectedMarker.isOpen ? "Open" : "Closed"}
                            </div>
                            <div className="text-sm text-gray-500">Status</div>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
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
                          <span>{selectedMarker.location}</span>
                        </div>

                        {userLocation && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Distance:</span>{" "}
                            {calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              selectedMarker.coordinates.lat,
                              selectedMarker.coordinates.lng
                            ).toFixed(1)}{" "}
                            miles
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={`/businesses/${selectedMarker.id}`}
                          className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-center"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={handleGetDirections}
                          disabled={!userLocation}
                          className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                        >
                          Get Directions
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Info Footer */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                This is a simulated map. In a production app, integrate with
                Google Maps, Mapbox, or Leaflet.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Showing {filteredMarkers.length} of {businessMarkers.length}{" "}
                businesses within {filters.radius} miles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
