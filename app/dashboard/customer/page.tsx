"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Star, 
  MapPin, 
  TrendingUp,
  Shield,
  ChevronRight,
  Heart,
  MessageSquare
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  trustScore: number;
  totalReviews: number;
  averageRating: number;
  isVerified: boolean;
  imageUrl?: string;
}

interface SearchFilters {
  category: string;
  location: string;
  minTrustScore: number;
  verifiedOnly: boolean;
}

export default function CustomerDashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    location: '',
    minTrustScore: 0,
    verifiedOnly: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole === 'CUSTOMER') {
      fetchBusinesses();
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    filterBusinesses();
  }, [businesses, searchQuery, filters]);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Basic token validation (check if it's a valid JWT format)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        localStorage.removeItem('auth_token');
        router.push('/login');
        return;
      }

      // Decode payload to get user role
      const payload = JSON.parse(atob(tokenParts[1]));
      setUserRole(payload.role);
      
      if (payload.role !== 'CUSTOMER') {
        // Redirect to appropriate dashboard based on role
        if (payload.role === 'BUSINESS_OWNER') {
          router.push('/dashboard/business');
        } else {
          router.push('/dashboard');
        }
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('auth_token');
      router.push('/login');
    }
  };

  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/businesses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setError('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = [...businesses];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(business => business.category === filters.category);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(business =>
        business.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Trust score filter
    if (filters.minTrustScore > 0) {
      filtered = filtered.filter(business => business.trustScore >= filters.minTrustScore);
    }

    // Verified only filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter(business => business.isVerified);
    }

    setFilteredBusinesses(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discover Trusted Businesses</h1>
              <p className="text-sm text-gray-600">Find and connect with verified businesses in your area</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/customer/favorites"
                className="text-gray-600 hover:text-gray-900"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses, categories, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="FOOD_RESTAURANT">Food & Restaurant</option>
              <option value="RETAIL_SHOP">Retail Shop</option>
              <option value="SERVICES">Services</option>
              <option value="HOME_BUSINESS">Home Business</option>
              <option value="STREET_VENDOR">Street Vendor</option>
              <option value="ARTISAN">Artisan</option>
            </select>

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.minTrustScore}
              onChange={(e) => setFilters({ ...filters, minTrustScore: Number(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Any Trust Score</option>
              <option value="50">Trust Score 50+</option>
              <option value="70">Trust Score 70+</option>
              <option value="85">Trust Score 85+</option>
              <option value="95">Trust Score 95+</option>
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Verified Only</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredBusinesses.length} businesses
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Business Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                      {business.isVerified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{business.category.replace('_', ' ')}</p>
                    {business.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {business.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust Score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-green-600">
                      {business.trustScore}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Trust Score</div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">Verified</span>
                      </div>
                    </div>
                  </div>
                  
                  {business.totalReviews > 0 && (
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{business.averageRating.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {business.totalReviews} reviews
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {business.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {business.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Link
                    href={`/businesses/${business.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/businesses/${business.id}#reviews`}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or removing some filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  category: '',
                  location: '',
                  minTrustScore: 0,
                  verifiedOnly: false
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}