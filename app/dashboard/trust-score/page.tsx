"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Award,
  Phone,
  CreditCard,
  AlertCircle,
} from "lucide-react";

interface TrustScoreData {
  currentScore: number;
  previousScore: number;
  scoreHistory: Array<{
    date: string;
    score: number;
  }>;
  breakdown: {
    reviews: {
      score: number;
      weight: number;
      totalReviews: number;
      averageRating: number;
    };
    endorsements: {
      score: number;
      weight: number;
      totalEndorsements: number;
      communityScore: number;
    };
    verification: {
      score: number;
      weight: number;
      phoneVerified: boolean;
      upiVerified: boolean;
      communityVerified: boolean;
    };
    engagement: {
      score: number;
      weight: number;
      profileCompletion: number;
      responseRate: number;
    };
  };
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    action: string;
  }>;
}

export default function TrustScorePage() {
  const [data, setData] = useState<TrustScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // checkAuthentication();
  }, []);

  useEffect(() => {
    // if (isAuthenticated) {
    fetchTrustScoreData();
    // }
  }, []);

  const fetchTrustScoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard/trust-score", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("backendToken")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("backendToken");
          router.push("/login");
          return;
        }
        throw new Error(`Failed to fetch trust score data: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to load trust score data");
      }

      setData(result.data);
    } catch (err) {
      console.error("Error fetching trust score data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load trust score data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until authentication is checked
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Checking authentication...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Trust Score Details
            </h1>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Error Loading Trust Score Data</h3>
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchTrustScoreData}
                  className="mt-2 text-sm text-red-800 underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Trust Score Details
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No trust score data available.</p>
          </div>
        </div>
      </div>
    );
  }

  const scoreChange = data.currentScore - data.previousScore;
  const isPositive = scoreChange >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trust Score Analysis
          </h1>
          <p className="text-gray-600">
            Detailed breakdown of your business trust score and recommendations
            for improvement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Score Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Current Trust Score
                </h2>
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    {isPositive ? "+" : ""}
                    {scoreChange} from last month
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {data.currentScore}
                  </div>
                  <div className="text-sm text-gray-500">Out of 100</div>
                </div>

                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${data.currentScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Trust Score Calculation
                    </h4>
                    <p className="text-sm text-blue-700">
                      Your trust score is calculated based on customer reviews,
                      community endorsements, verification status, and profile
                      engagement. Higher scores help customers find and trust
                      your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Score Breakdown
              </h3>

              <div className="space-y-6">
                {/* Reviews Component */}
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Customer Reviews
                      </h4>
                      <p className="text-sm text-gray-600">
                        {data.breakdown.reviews.totalReviews} reviews •{" "}
                        {data.breakdown.reviews.averageRating} average
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">
                      {data.breakdown.reviews.score}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.breakdown.reviews.weight}% weight
                    </div>
                  </div>
                </div>

                {/* Endorsements Component */}
                <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Community Endorsements
                      </h4>
                      <p className="text-sm text-gray-600">
                        {data.breakdown.endorsements.totalEndorsements}{" "}
                        endorsements •{" "}
                        {data.breakdown.endorsements.communityScore} community
                        score
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.breakdown.endorsements.score}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.breakdown.endorsements.weight}% weight
                    </div>
                  </div>
                </div>

                {/* Verification Component */}
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Verification Status
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs text-gray-600">Phone</span>
                          {data.breakdown.verification.phoneVerified ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span className="text-xs text-gray-600">UPI</span>
                          {data.breakdown.verification.upiVerified ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span className="text-xs text-gray-600">
                            Community
                          </span>
                          {data.breakdown.verification.communityVerified ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {data.breakdown.verification.score}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.breakdown.verification.weight}% weight
                    </div>
                  </div>
                </div>

                {/* Engagement Component */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Profile Engagement
                      </h4>
                      <p className="text-sm text-gray-600">
                        {data.breakdown.engagement.profileCompletion}% complete
                        • {data.breakdown.engagement.responseRate}% response
                        rate
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.breakdown.engagement.score}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.breakdown.engagement.weight}% weight
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Improvement Recommendations
              </h3>

              <div className="space-y-4">
                {data.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          rec.impact === "high"
                            ? "bg-red-100 text-red-700"
                            : rec.impact === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {rec.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {rec.description}
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {rec.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Score History */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Score History
              </h3>

              <div className="space-y-3">
                {data.scoreHistory.reverse().map((entry, index) => (
                  <div
                    key={entry.date}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {entry.score}
                      </span>
                      {index < data.scoreHistory.length - 1 && (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            entry.score >= data.scoreHistory[index + 1].score
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
