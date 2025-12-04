"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Endorsement = {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  endorserId: string;
  endorserName: string;
  endorserRole: string;
  relationship: string;
  message: string;
  skills: string[];
  status: "active" | "pending" | "expired";
  dateGiven: string;
  trustScore: number;
  endorserTrustScore: number;
};

type EndorsementStats = {
  totalGiven: number;
  totalReceived: number;
  pendingRequests: number;
  activeEndorsements: number;
  avgTrustScore: number;
};

export default function EndorsementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"given" | "received">("given");
  const [stats, setStats] = useState<EndorsementStats>({
    totalGiven: 12,
    totalReceived: 8,
    pendingRequests: 3,
    activeEndorsements: 17,
    avgTrustScore: 89,
  });

  const [givenEndorsements, setGivenEndorsements] = useState<Endorsement[]>([
    {
      id: "1",
      businessId: "101",
      businessName: "GreenLeaf Cafe",
      businessCategory: "Coffee Shop",
      endorserId: "user1",
      endorserName: "You",
      endorserRole: "Regular Customer",
      relationship: "Customer for 2+ years",
      message:
        "Excellent coffee and customer service. Always friendly and consistent quality.",
      skills: ["Customer Service", "Quality", "Consistency"],
      status: "active",
      dateGiven: "2024-01-15",
      trustScore: 94,
      endorserTrustScore: 92,
    },
    {
      id: "2",
      businessId: "102",
      businessName: "TechFix Solutions",
      businessCategory: "Electronics Repair",
      endorserId: "user1",
      endorserName: "You",
      endorserRole: "Satisfied Customer",
      relationship: "Multiple repairs completed",
      message:
        "Fast, reliable, and affordable repairs. Highly recommended for phone and laptop issues.",
      skills: ["Technical Skill", "Reliability", "Pricing"],
      status: "active",
      dateGiven: "2024-01-10",
      trustScore: 92,
      endorserTrustScore: 92,
    },
    {
      id: "3",
      businessId: "103",
      businessName: "Urban Fitness Center",
      businessCategory: "Gym",
      endorserId: "user1",
      endorserName: "You",
      endorserRole: "Member",
      relationship: "Member for 1 year",
      message:
        "Clean facilities, excellent equipment, and knowledgeable trainers.",
      skills: ["Cleanliness", "Equipment", "Training"],
      status: "active",
      dateGiven: "2023-12-20",
      trustScore: 89,
      endorserTrustScore: 92,
    },
  ]);

  const [receivedEndorsements, setReceivedEndorsements] = useState<
    Endorsement[]
  >([
    {
      id: "4",
      businessId: "201",
      businessName: "Your Business Name",
      businessCategory: "Professional Services",
      endorserId: "user2",
      endorserName: "Sarah Johnson",
      endorserRole: "Business Partner",
      relationship: "Collaborated on 3 projects",
      message:
        "Extremely professional and reliable. Delivers high-quality work on time.",
      skills: ["Professionalism", "Reliability", "Quality"],
      status: "active",
      dateGiven: "2024-01-18",
      trustScore: 91,
      endorserTrustScore: 88,
    },
    {
      id: "5",
      businessId: "201",
      businessName: "Your Business Name",
      businessCategory: "Professional Services",
      endorserId: "user3",
      endorserName: "Mike Chen",
      endorserRole: "Client",
      relationship: "Client for 6 months",
      message:
        "Outstanding service and attention to detail. Exceeded all expectations.",
      skills: ["Service", "Attention to Detail", "Communication"],
      status: "active",
      dateGiven: "2024-01-12",
      trustScore: 95,
      endorserTrustScore: 90,
    },
    {
      id: "6",
      businessId: "201",
      businessName: "Your Business Name",
      businessCategory: "Professional Services",
      endorserId: "user4",
      endorserName: "Alex Rodriguez",
      endorserRole: "Industry Peer",
      relationship: "Known for 3 years",
      message:
        "Highly knowledgeable and trustworthy. A valuable member of our business community.",
      skills: ["Knowledge", "Trustworthiness", "Community"],
      status: "pending",
      dateGiven: "2024-01-20",
      trustScore: 93,
      endorserTrustScore: 85,
    },
  ]);

  const handleGiveEndorsement = () => {
    router.push("/endorsements/give");
  };

  const handleViewRequests = () => {
    router.push("/endorsements/requests");
  };

  const handleRemoveEndorsement = (id: string, type: "given" | "received") => {
    if (window.confirm("Are you sure you want to remove this endorsement?")) {
      if (type === "given") {
        setGivenEndorsements((prev) => prev.filter((e) => e.id !== id));
      } else {
        setReceivedEndorsements((prev) => prev.filter((e) => e.id !== id));
      }
    }
  };

  const handleAcceptEndorsement = (id: string) => {
    setReceivedEndorsements((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "active" } : e))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const displayedEndorsements =
    activeTab === "given" ? givenEndorsements : receivedEndorsements;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Community Endorsements
              </h1>
              <p className="text-purple-100">
                Build trust and credibility through community endorsements
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGiveEndorsement}
                className="inline-flex items-center px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Give Endorsement
              </button>
              <button
                onClick={handleViewRequests}
                className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition"
              >
                View Requests ({stats.pendingRequests})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Endorsements Given</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalGiven}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Endorsements Received</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalReceived}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingRequests}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgTrustScore}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="px-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("given")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "given"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Endorsements Given
                  <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded">
                    {givenEndorsements.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("received")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "received"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Endorsements Received
                  <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded">
                    {receivedEndorsements.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Endorsements List */}
          <div className="p-6">
            {displayedEndorsements.length > 0 ? (
              <div className="space-y-6">
                {displayedEndorsements.map((endorsement) => (
                  <div
                    key={endorsement.id}
                    className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      {/* Left Column - Endorsement Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {activeTab === "given"
                                  ? endorsement.businessName
                                  : endorsement.endorserName}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(endorsement.status)}`}
                              >
                                {endorsement.status.charAt(0).toUpperCase() +
                                  endorsement.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              {activeTab === "given"
                                ? `${endorsement.businessCategory} • ${endorsement.relationship}`
                                : `${endorsement.endorserRole} • ${endorsement.relationship}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {endorsement.trustScore}
                            </div>
                            <div className="text-xs text-gray-500">
                              Trust Score
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="mb-4">
                          <p className="text-gray-700 italic">
                            "{endorsement.message}"
                          </p>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Skills & Qualities:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {endorsement.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center text-sm text-gray-500">
                          <span>
                            Given on {formatDate(endorsement.dateGiven)}
                          </span>
                          {activeTab === "received" && (
                            <>
                              <span className="mx-2">•</span>
                              <span>
                                Endorser Trust Score:{" "}
                                {endorsement.endorserTrustScore}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Actions */}
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        {activeTab === "given" ? (
                          <>
                            <Link
                              href={`/businesses/${endorsement.businessId}`}
                              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-center"
                            >
                              View Business
                            </Link>
                            <button
                              onClick={() =>
                                handleRemoveEndorsement(endorsement.id, "given")
                              }
                              className="px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            {endorsement.status === "pending" ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleAcceptEndorsement(endorsement.id)
                                  }
                                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveEndorsement(
                                      endorsement.id,
                                      "received"
                                    )
                                  }
                                  className="px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <>
                                <Link
                                  href={`/businesses/${endorsement.businessId}`}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-center"
                                >
                                  View Business
                                </Link>
                                <button
                                  onClick={() =>
                                    handleRemoveEndorsement(
                                      endorsement.id,
                                      "received"
                                    )
                                  }
                                  className="px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No{" "}
                  {activeTab === "given"
                    ? "Endorsements Given"
                    : "Endorsements Received"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {activeTab === "given"
                    ? "You haven't given any endorsements yet. Start building trust in your community."
                    : "Your business hasn't received any endorsements yet. Build relationships to earn endorsements."}
                </p>
                {activeTab === "given" ? (
                  <button
                    onClick={handleGiveEndorsement}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Give Your First Endorsement
                  </button>
                ) : (
                  <Link
                    href="/network/recommendations"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
                  >
                    Connect with Businesses
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            About Endorsements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Why Endorsements Matter
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Build credibility and trust in the community</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Help businesses grow through verified recommendations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Increase visibility and attract new customers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Strengthen business relationships and networks</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Endorsement Guidelines
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    Only endorse businesses you've personally worked with
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Be specific about skills and qualities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Provide honest and constructive feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Update endorsements as relationships evolve</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
