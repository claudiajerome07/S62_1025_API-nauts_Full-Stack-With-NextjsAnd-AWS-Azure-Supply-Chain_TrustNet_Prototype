"use client";

import { useEffect, useState } from "react";
import BusinessCard from "@/components/BusinessCard";
import { Search, Filter, Loader } from "lucide-react";

// Use the full business type that matches what BusinessCard expects
interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string;
  location: string | null;
  trustScore: number;
  isVerified: boolean;
  phone: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  verificationMethod: string | null;
  upiVerified: boolean;
  upiId: string | null;
  ownerId: string;
  owner: { name: string };
  _count: { reviews: number; endorsements: number };
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/businesses");
      const data = await response.json();

      if (data.businesses) {
        setBusinesses(data.businesses);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (categoryFilter) params.append("category", categoryFilter);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.businesses) {
        setBusinesses(data.businesses);
      }
    } catch (error) {
      console.error("Error searching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading businesses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Local Businesses
          </h1>
          <p className="text-gray-600">
            Find trusted local businesses in your community
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search businesses by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Categories</option>
                  <option value="FOOD_RESTAURANT">Food & Restaurant</option>
                  <option value="RETAIL_SHOP">Retail Shop</option>
                  <option value="SERVICES">Services</option>
                  <option value="HOME_BUSINESS">Home Business</option>
                  <option value="STREET_VENDOR">Street Vendor</option>
                  <option value="ARTISAN">Artisan</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Search
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                fetchBusinesses();
              }}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Business Grid */}
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No businesses found
            </h3>
            <p className="text-gray-600">
              {searchQuery || categoryFilter
                ? "Try adjusting your search criteria"
                : "No businesses are registered yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
