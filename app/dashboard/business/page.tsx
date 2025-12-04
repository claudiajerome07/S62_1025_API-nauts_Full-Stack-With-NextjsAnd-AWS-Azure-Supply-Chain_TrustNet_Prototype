"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Star, 
  Users, 
  Eye, 
  Settings,
  BarChart3,
  Award,
  ChevronRight,
  Shield,
  MessageSquare,
  AlertCircle,
  LogOut,
  Building
} from 'lucide-react';

interface DashboardStats {
  trustScore: number;
  totalReviews: number;
  totalEndorsements: number;
  monthlyVisits: number;
  pendingEndorsements: number;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    reviewer: string;
    createdAt: string;
  }>;
}

export default function BusinessOwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole === 'BUSINESS_OWNER') {
      fetchDashboardStats();
    }
  }, [isAuthenticated, userRole]);

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
      
      if (payload.role !== 'BUSINESS_OWNER') {
        // Redirect to appropriate dashboard based on role
        if (payload.role === 'CUSTOMER') {
          router.push('/dashboard/customer');
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

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Cookie': `auth_token=${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your business and track performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Trust Score</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.trustScore || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Out of 100</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalReviews || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Endorsements</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalEndorsements || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.pendingEndorsements || 0} pending
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Monthly Visits</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.monthlyVisits || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">+8% this month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/dashboard/business/profile" 
                className="flex items-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Building className="w-8 h-8 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Update Business Profile</h3>
                  <p className="text-sm text-gray-600">Edit your business information</p>
                </div>
              </Link>

              <Link 
                href="/dashboard/business/verification" 
                className="flex items-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <Shield className="w-8 h-8 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Get Verified</h3>
                  <p className="text-sm text-gray-600">Increase trust with verification</p>
                </div>
              </Link>

              <Link 
                href="/dashboard/analytics" 
                className="flex items-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <BarChart3 className="w-8 h-8 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Detailed performance insights</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
                <Link 
                  href="/dashboard/reviews" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats?.recentReviews && stats.recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentReviews.map((review) => (
                    <div key={review.id} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium text-gray-900">
                            {review.reviewer}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                  <p className="text-sm text-gray-500">
                    Encourage customers to leave reviews to build trust
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Management</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  href="/dashboard/trust-score"
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Trust Score</h3>
                      <p className="text-sm text-gray-600">Monitor trust metrics</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link
                  href="/dashboard/analytics"
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">Performance insights</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Settings</h3>
                      <p className="text-sm text-gray-600">Account & preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                {stats?.pendingEndorsements && stats.pendingEndorsements > 0 && (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Pending Endorsements</h3>
                        <p className="text-sm text-gray-600">
                          {stats.pendingEndorsements} endorsements waiting for approval
                        </p>
                      </div>
                    </div>
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}