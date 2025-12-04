"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "CUSTOMER" | "BUSINESS_OWNER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  businesses?: Business[];
}

interface Business {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  isVerified: boolean;
  description?: string;
  phone: string;
  address?: string;
  upiVerified: boolean;
  totalReviews?: number;
  totalEndorsements?: number;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user data
      const userRes = await fetch("/api/users/me");
      const userData = await userRes.json();

      if (userData.success) {
        const userWithBusinesses = userData.user;

        // If user is BUSINESS_OWNER, fetch their businesses
        if (userData.user.role === "BUSINESS_OWNER") {
          const businessesRes = await fetch("/api/businesses/my-business");
          const businessesData = await businessesRes.json();

          if (businessesData.success) {
            userWithBusinesses.businesses = businessesData.data || [];
          }
        }

        setUser(userWithBusinesses);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            User not found
          </h2>
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Please login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "BUSINESS_OWNER"
                  ? "bg-blue-100 text-blue-800"
                  : user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.role.replace("_", " ")}
            </span>
            {user.role === "BUSINESS_OWNER" && (
              <span className="text-sm text-gray-600">
                • {user.businesses?.length || 0} Business
                {user.businesses?.length !== 1 ? "es" : ""}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/profile/edit"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Edit Profile
          </Link>
          {user.role === "BUSINESS_OWNER" && (
            <Link
              href="/my-business/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              + Add Business
            </Link>
          )}
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h2>
          <Link
            href="/profile/edit"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Full Name" value={user.name} />
          <InfoField label="Phone Number" value={user.phone} isPhone={true} />
          <InfoField label="Email" value={user.email || "Not provided"} />
          <InfoField label="Account Type" value={user.role.replace("_", " ")} />
          <InfoField label="Member Since" value={formatDate(user.createdAt)} />
          <InfoField label="Last Updated" value={formatDate(user.updatedAt)} />
        </div>
      </div>

      {/* Business Section (Only for Business Owners) */}
      {user.role === "BUSINESS_OWNER" && <BusinessSection user={user} />}

      {/* Quick Actions Section */}
      <QuickActionsSection role={user.role} />
    </div>
  );
}

// Helper Functions
function InfoField({
  label,
  value,
  isPhone = false,
}: {
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-medium ${isPhone ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function BusinessSection({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Businesses</h2>
        <Link
          href="/my-business/create"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm"
        >
          <span>+</span> Add New Business
        </Link>
      </div>

      {user.businesses && user.businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-3">
            You haven't created any business profiles yet.
          </p>
          <Link
            href="/my-business/create"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Create Your First Business
          </Link>
        </div>
      )}
    </div>
  );
}

function BusinessCard({ business }: { business: Business }) {
  const getCategoryLabel = (category: string) => {
    return category ? category.replace(/_/g, " ") : "Uncategorized";
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 truncate">
            {business.name || "Unnamed Business"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {getCategoryLabel(business.category)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${getTrustScoreColor(business.trustScore || 0)}`}
          >
            {business.trustScore || 0} Trust
          </span>
          {business.isVerified && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
              ✓ Verified
            </span>
          )}
        </div>
      </div>

      {business.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {business.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Contact</p>
          <p className="font-medium">{business.phone || "Not provided"}</p>
        </div>
        <div>
          <p className="text-gray-500">Location</p>
          <p className="font-medium">{business.address || "Not specified"}</p>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Reviews</p>
            <p className="font-semibold">{business.totalReviews || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Endorsements</p>
            <p className="font-semibold">{business.totalEndorsements || 0}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/my-business/${business.id}`}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
          >
            Manage
          </Link>
          <Link
            href={`/business/${business.id}`}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            target="_blank"
          >
            View Public
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickActionsSection({ role }: { role: string }) {
  const baseActions = [
    {
      title: "Dashboard",
      desc: "View your statistics",
      href: "/dashboard",
      icon: "📊",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "Security",
      desc: "Change password & settings",
      href: "/profile/security",
      icon: "🔒",
      color: "bg-gray-50 hover:bg-gray-100",
    },
    {
      title: "Activity",
      desc: "View your account activity",
      href: "/profile/activity",
      icon: "📝",
      color: "bg-gray-50 hover:bg-gray-100",
    },
  ];

  // Add role-specific actions
  const roleActions = [];

  if (role === "BUSINESS_OWNER") {
    roleActions.push(
      {
        title: "My Businesses",
        desc: "Manage your businesses",
        href: "/my-business",
        icon: "🏢",
        color: "bg-blue-50 hover:bg-blue-100",
      },
      {
        title: "Analytics",
        desc: "Business insights & reports",
        href: "/analytics",
        icon: "📈",
        color: "bg-green-50 hover:bg-green-100",
      }
    );
  }

  if (role === "ADMIN") {
    roleActions.push({
      title: "Admin Panel",
      desc: "Manage users & businesses",
      href: "/admin",
      icon: "⚙️",
      color: "bg-purple-50 hover:bg-purple-100",
    });
  }

  const allActions = [...baseActions, ...roleActions];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`${action.color} p-4 rounded-lg transition-colors border`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{action.icon}</span>
              <h3 className="font-semibold text-gray-800">{action.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="bg-gray-200 h-64 rounded-xl"></div>
        <div className="bg-gray-200 h-48 rounded-xl"></div>
        <div className="bg-gray-200 h-32 rounded-xl"></div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
