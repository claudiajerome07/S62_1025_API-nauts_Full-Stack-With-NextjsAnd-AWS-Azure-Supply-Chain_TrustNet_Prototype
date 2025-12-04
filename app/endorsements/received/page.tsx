"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Endorsement = {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserTrustScore: number;
  toUserId: string;
  toUserName: string;
  endorsementType: "skill" | "service" | "reliability" | "quality";
  message: string;
  date: string;
  status: "active" | "pending" | "archived";
  category: string;
  tags: string[];
};

export default function EndorsementsReceived() {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([
    {
      id: "1",
      fromUserId: "user1",
      fromUserName: "Alex Johnson",
      fromUserAvatar: "AJ",
      fromUserTrustScore: 92,
      toUserId: "current",
      toUserName: "Your Business",
      endorsementType: "reliability",
      message:
        "Always delivers on time and exceeds expectations. Highly reliable partner for any project.",
      date: "2024-01-15",
      status: "active",
      category: "Professional Services",
      tags: ["Reliable", "Punctual", "Quality Work"],
    },
    {
      id: "2",
      fromUserId: "user2",
      fromUserName: "Maria Garcia",
      fromUserAvatar: "MG",
      fromUserTrustScore: 88,
      toUserId: "current",
      toUserName: "Your Business",
      endorsementType: "quality",
      message:
        "Exceptional attention to detail. The quality of work is consistently outstanding.",
      date: "2024-01-12",
      status: "active",
      category: "Creative Services",
      tags: ["High Quality", "Detail-Oriented", "Creative"],
    },
    {
      id: "3",
      fromUserId: "user3",
      fromUserName: "David Chen",
      fromUserAvatar: "DC",
      fromUserTrustScore: 95,
      toUserId: "current",
      toUserName: "Your Business",
      endorsementType: "skill",
      message:
        "Expert knowledge in the field. Provided valuable insights that saved us time and money.",
      date: "2024-01-10",
      status: "active",
      category: "Technical Services",
      tags: ["Expert", "Knowledgeable", "Efficient"],
    },
    {
      id: "4",
      fromUserId: "user4",
      fromUserName: "Sarah Williams",
      fromUserAvatar: "SW",
      fromUserTrustScore: 85,
      toUserId: "current",
      toUserName: "Your Business",
      endorsementType: "service",
      message:
        "Outstanding customer service. Always responsive and goes above and beyond to help.",
      date: "2024-01-08",
      status: "active",
      category: "Customer Service",
      tags: ["Responsive", "Helpful", "Friendly"],
    },
    {
      id: "5",
      fromUserId: "user5",
      fromUserName: "Michael Brown",
      fromUserAvatar: "MB",
      fromUserTrustScore: 90,
      toUserId: "current",
      toUserName: "Your Business",
      endorsementType: "reliability",
      message:
        "Consistently meets deadlines and delivers high-quality results. A dependable partner.",
      date: "2024-01-05",
      status: "active",
      category: "Project Management",
      tags: ["Dependable", "Consistent", "Professional"],
    },
    {
      id: "6",
      fromUserId: "user6",
      fromUserName: "Jessica Lee",
      fromUserAvatar: "JL",
      fromUserTrustScore: 87,
      toUserId: "current",
      toUserName: "Your Business",
      endorsementType: "quality",
      message:
        "The craftsmanship is exceptional. Every project is completed with precision and care.",
      date: "2023-12-28",
      status: "active",
      category: "Artisanal Services",
      tags: ["Craftsmanship", "Precision", "Artisan"],
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [stats, setStats] = useState({
    total: 24,
    active: 18,
    pending: 3,
    archived: 3,
    thisMonth: 6,
  });

  const statusOptions = [
    { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800" },
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "archived",
      label: "Archived",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "skill", label: "Skill" },
    { value: "service", label: "Service" },
    { value: "reliability", label: "Reliability" },
    { value: "quality", label: "Quality" },
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
          return b.fromUserTrustScore - a.fromUserTrustScore;
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "recent":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const handleArchiveEndorsement = (id: string) => {
    setEndorsements((prev) =>
      prev.map((endorsement) =>
        endorsement.id === id
          ? { ...endorsement, status: "archived" }
          : endorsement
      )
    );
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

  const handleRequestVerification = (id: string) => {
    setEndorsements((prev) =>
      prev.map((endorsement) =>
        endorsement.id === id
          ? { ...endorsement, status: "pending" }
          : endorsement
      )
    );
    alert("Verification requested for this endorsement.");
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
      default:
        return type;
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
                Endorsements Received
              </h1>
              <p className="text-gray-600 mt-2">
                Endorsements from other users that validate your skills and
                services
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/endorsements/given"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Endorsements Given
              </Link>
              <Link
                href="/endorsements/request"
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
                Request Endorsement
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
              <div className="text-sm text-gray-500">Total Endorsements</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.active}
              </div>
              <div className="text-sm text-gray-500">Active</div>
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
              <div className="text-3xl font-bold text-gray-600">
                {stats.archived}
              </div>
              <div className="text-sm text-gray-500">Archived</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.thisMonth}
              </div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
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
              </select>
            </div>
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
                  {/* Left Column - User Info */}
                  <div className="lg:w-1/4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {endorsement.fromUserAvatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {endorsement.fromUserName}
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{
                                width: `${endorsement.fromUserTrustScore}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {endorsement.fromUserTrustScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/users/${endorsement.fromUserId}`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Profile
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
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            endorsement.status === "active"
                              ? "bg-green-100 text-green-800"
                              : endorsement.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {endorsement.status.charAt(0).toUpperCase() +
                            endorsement.status.slice(1)}
                        </span>
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
                      {endorsement.status === "active" && (
                        <>
                          <button
                            onClick={() =>
                              handleArchiveEndorsement(endorsement.id)
                            }
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                          >
                            Archive
                          </button>
                          <button
                            onClick={() =>
                              handleRequestVerification(endorsement.id)
                            }
                            className="w-full px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
                          >
                            Request Verification
                          </button>
                        </>
                      )}
                      {endorsement.status === "pending" && (
                        <button
                          onClick={() =>
                            handleArchiveEndorsement(endorsement.id)
                          }
                          className="w-full px-4 py-2 bg-yellow-50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-100 transition"
                        >
                          Mark as Active
                        </button>
                      )}
                      {endorsement.status === "archived" && (
                        <button
                          onClick={() =>
                            handleArchiveEndorsement(endorsement.id)
                          }
                          className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                        >
                          Restore
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
                : "You haven't received any endorsements yet. Build your network and provide great service to receive endorsements."}
            </p>
            <Link
              href="/network/recommendations"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Build Your Network
            </Link>
          </div>
        )}

        {/* Export Section */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Export Your Endorsements
              </h3>
              <p className="text-sm text-gray-600">
                Download your endorsements for your portfolio or records
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
                Export as PDF
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
