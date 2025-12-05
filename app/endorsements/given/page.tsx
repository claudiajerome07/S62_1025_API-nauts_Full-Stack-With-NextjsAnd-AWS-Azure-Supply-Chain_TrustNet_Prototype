"use client";

import { useState } from "react";
import Link from "next/link";

type Endorsement = {
  id: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  toUserTrustScore: number;
  toUserBusiness: string;
  endorsementType:
    | "skill"
    | "service"
    | "reliability"
    | "quality"
    | "professionalism";
  message: string;
  date: string;
  status: "public" | "private" | "pending";
  category: string;
  tags: string[];
  isVerified: boolean;
};

export default function EndorsementsGiven() {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([
    {
      id: "1",
      toUserId: "business1",
      toUserName: "Sarah Thompson",
      toUserAvatar: "ST",
      toUserTrustScore: 94,
      toUserBusiness: "Thompson Design Studio",
      endorsementType: "quality",
      message:
        "Exceptional design work with incredible attention to detail. Consistently delivers beyond expectations.",
      date: "2024-01-18",
      status: "public",
      category: "Graphic Design",
      tags: ["Creative", "Professional", "High Quality"],
      isVerified: true,
    },
    {
      id: "2",
      toUserId: "business2",
      toUserName: "Robert Kim",
      toUserAvatar: "RK",
      toUserTrustScore: 89,
      toUserBusiness: "Kim's Accounting Services",
      endorsementType: "professionalism",
      message:
        "Highly professional and knowledgeable accountant. Saved our business significant money with smart tax strategies.",
      date: "2024-01-15",
      status: "public",
      category: "Accounting",
      tags: ["Professional", "Knowledgeable", "Reliable"],
      isVerified: true,
    },
    {
      id: "3",
      toUserId: "business3",
      toUserName: "Lisa Rodriguez",
      toUserAvatar: "LR",
      toUserTrustScore: 92,
      toUserBusiness: "Rodriguez Legal Counsel",
      endorsementType: "service",
      message:
        "Outstanding legal services with exceptional client communication. Always responsive and thorough.",
      date: "2024-01-10",
      status: "public",
      category: "Legal Services",
      tags: ["Responsive", "Thorough", "Trustworthy"],
      isVerified: false,
    },
    {
      id: "4",
      toUserId: "business4",
      toUserName: "James Wilson",
      toUserAvatar: "JW",
      toUserTrustScore: 87,
      toUserBusiness: "Wilson Construction",
      endorsementType: "reliability",
      message:
        "Completes construction projects on time and within budget. A reliable partner for any building project.",
      date: "2024-01-05",
      status: "public",
      category: "Construction",
      tags: ["Reliable", "Punctual", "Quality Work"],
      isVerified: true,
    },
    {
      id: "5",
      toUserId: "business5",
      toUserName: "Amanda Chen",
      toUserAvatar: "AC",
      toUserTrustScore: 91,
      toUserBusiness: "Chen Marketing Agency",
      endorsementType: "skill",
      message:
        "Digital marketing expertise that significantly increased our online presence and sales.",
      date: "2023-12-28",
      status: "private",
      category: "Digital Marketing",
      tags: ["Expert", "Results-Driven", "Strategic"],
      isVerified: false,
    },
    {
      id: "6",
      toUserId: "business6",
      toUserName: "David Park",
      toUserAvatar: "DP",
      toUserTrustScore: 85,
      toUserBusiness: "Park IT Solutions",
      endorsementType: "service",
      message:
        "Quick response time and effective IT solutions. Keeps our systems running smoothly.",
      date: "2023-12-20",
      status: "pending",
      category: "IT Services",
      tags: ["Responsive", "Efficient", "Technical"],
      isVerified: false,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const stats = {
    total: 42,
    public: 28,
    private: 10,
    pending: 4,
    verified: 32,
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "pending", label: "Pending" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "skill", label: "Skill" },
    { value: "service", label: "Service" },
    { value: "reliability", label: "Reliability" },
    { value: "quality", label: "Quality" },
    { value: "professionalism", label: "Professionalism" },
  ];

  // Filter endorsements
  const filteredEndorsements = endorsements
    .filter((endorsement) => {
      if (filterStatus !== "all" && endorsement.status !== filterStatus)
        return false;
      if (filterType !== "all" && endorsement.endorsementType !== filterType)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "trustScore":
          return b.toUserTrustScore - a.toUserTrustScore;
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "verified":
          return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0);
        case "recent":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const handleEditEndorsement = (id: string) => {
    const endorsement = endorsements.find((e) => e.id === id);
    if (endorsement) {
      const newMessage = prompt(
        "Edit your endorsement message:",
        endorsement.message
      );
      if (newMessage && newMessage.trim() !== "") {
        setEndorsements((prev) =>
          prev.map((endorsement) =>
            endorsement.id === id
              ? { ...endorsement, message: newMessage }
              : endorsement
          )
        );
      }
    }
  };

  const handleDeleteEndorsement = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this endorsement? This action cannot be undone."
      )
    ) {
      setEndorsements((prev) =>
        prev.filter((endorsement) => endorsement.id !== id)
      );
    }
  };

  const handleToggleVisibility = (id: string) => {
    setEndorsements((prev) =>
      prev.map((endorsement) => {
        if (endorsement.id === id) {
          const newStatus =
            endorsement.status === "public" ? "private" : "public";
          return { ...endorsement, status: newStatus };
        }
        return endorsement;
      })
    );
  };

  const handleResendEndorsement = (id: string) => {
    setEndorsements((prev) =>
      prev.map((endorsement) =>
        endorsement.id === id
          ? { ...endorsement, status: "pending" }
          : endorsement
      )
    );
    alert("Endorsement has been resent for approval.");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEndorsementTypeIcon = (type: string) => {
    switch (type) {
      case "skill":
        return (
          <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        );
      case "service":
        return (
          <div className="bg-green-100 text-green-800 p-2 rounded-lg">
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "reliability":
        return (
          <div className="bg-purple-100 text-purple-800 p-2 rounded-lg">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        );
      case "quality":
        return (
          <div className="bg-amber-100 text-amber-800 p-2 rounded-lg">
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
        );
      case "professionalism":
        return (
          <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg">
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getEndorsementTypeLabel = (type: string) => {
    switch (type) {
      case "skill":
        return "Skill";
      case "service":
        return "Service";
      case "reliability":
        return "Reliability";
      case "quality":
        return "Quality";
      case "professionalism":
        return "Professionalism";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "public":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Public
          </span>
        );
      case "private":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Private
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Endorsements Given
              </h1>
              <p className="text-gray-600 mt-2">
                Endorsements you've given to other businesses and professionals
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/endorsements/received"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Endorsements Received
              </Link>
              <Link
                href="/endorsements/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
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
                Give New Endorsement
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-500">Total Given</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.public}
              </div>
              <div className="text-sm text-gray-500">Public</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.private}
              </div>
              <div className="text-sm text-gray-500">Private</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.verified}
              </div>
              <div className="text-sm text-gray-500">Verified</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endorsement Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest</option>
                <option value="trustScore">Trust Score</option>
                <option value="verified">Verified First</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {filterStatus !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Status:{" "}
                {statusOptions.find((s) => s.value === filterStatus)?.label}
                <button
                  onClick={() => setFilterStatus("all")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filterType !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Type: {typeOptions.find((t) => t.value === filterType)?.label}
                <button
                  onClick={() => setFilterType("all")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filterStatus !== "all" || filterType !== "all") && (
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterType("all");
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Endorsements List */}
        <div className="space-y-6">
          {filteredEndorsements.map((endorsement) => (
            <div
              key={endorsement.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left Column - Recipient Info */}
                  <div className="lg:w-1/4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {endorsement.toUserAvatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {endorsement.toUserName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {endorsement.toUserBusiness}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{
                                width: `${endorsement.toUserTrustScore}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {endorsement.toUserTrustScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/businesses/${endorsement.toUserId}`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Business
                        <svg
                          className="w-4 h-4 ml-1"
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
                    </div>
                  </div>

                  {/* Middle Column - Endorsement Content */}
                  <div className="lg:w-2/4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getEndorsementTypeIcon(endorsement.endorsementType)}
                        <div>
                          <div className="font-medium text-gray-900">
                            {getEndorsementTypeLabel(
                              endorsement.endorsementType
                            )}{" "}
                            Endorsement
                          </div>
                          <div className="text-sm text-gray-500">
                            {endorsement.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(endorsement.status)}
                        {endorsement.isVerified && (
                          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Verified
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(endorsement.date)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 italic">
                      "{endorsement.message}"
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {endorsement.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Actions */}
                  <div className="lg:w-1/4">
                    <div className="space-y-2">
                      {endorsement.status !== "pending" && (
                        <button
                          onClick={() => handleToggleVisibility(endorsement.id)}
                          className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                        >
                          {endorsement.status === "public"
                            ? "Make Private"
                            : "Make Public"}
                        </button>
                      )}

                      <button
                        onClick={() => handleEditEndorsement(endorsement.id)}
                        className="w-full px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>

                      {endorsement.status === "pending" && (
                        <button
                          onClick={() =>
                            handleResendEndorsement(endorsement.id)
                          }
                          className="w-full px-4 py-2 bg-yellow-50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-100 transition"
                        >
                          Resend
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteEndorsement(endorsement.id)}
                        className="w-full px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEndorsements.length === 0 && (
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No endorsements found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filterStatus !== "all" || filterType !== "all"
                ? "Try adjusting your filters to see more endorsements"
                : "You haven't given any endorsements yet. Recognize great work by endorsing businesses you've worked with."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/network/connections"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                View Your Connections
              </Link>
              <Link
                href="/endorsements/new"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
              >
                Give Your First Endorsement
              </Link>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">
            Tips for Giving Great Endorsements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-3">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Be Specific</h4>
                <p className="text-sm text-gray-600">
                  Mention specific projects or qualities that impressed you
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-3">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Focus on Impact
                </h4>
                <p className="text-sm text-gray-600">
                  Highlight how their work made a difference for you
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-3">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Keep it Professional
                </h4>
                <p className="text-sm text-gray-600">
                  Maintain a professional tone while being genuine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
