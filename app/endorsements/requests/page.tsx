"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type EndorsementRequest = {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  relationship: string;
  message: string;
  skills: string[];
  dateRequested: string;
  requesterTrustScore: number;
  expiresIn: number; // days
  status: "pending" | "accepted" | "declined";
};

type FilterState = {
  sortBy: string;
  timeFilter: string;
};

export default function PendingRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<EndorsementRequest[]>([
    {
      id: "1",
      businessId: "201",
      businessName: "Your Business Name",
      businessCategory: "Professional Services",
      requesterId: "user2",
      requesterName: "Sarah Johnson",
      requesterRole: "Business Partner",
      relationship: "Collaborated on 3 projects",
      message:
        "I've been impressed with your professionalism and quality of work. Would you be open to an endorsement?",
      skills: ["Professionalism", "Quality", "Reliability"],
      dateRequested: "2024-01-20",
      requesterTrustScore: 88,
      expiresIn: 7,
      status: "pending",
    },
    {
      id: "2",
      businessId: "201",
      businessName: "Your Business Name",
      businessCategory: "Professional Services",
      requesterId: "user3",
      requesterName: "Mike Chen",
      requesterRole: "Client",
      relationship: "Client for 6 months",
      message:
        "Your service has exceeded all expectations. I'd love to endorse your attention to detail and communication skills.",
      skills: ["Attention to Detail", "Communication", "Service"],
      dateRequested: "2024-01-18",
      requesterTrustScore: 90,
      expiresIn: 5,
      status: "pending",
    },
    {
      id: "3",
      businessId: "201",
      businessName: "Your Business Name",
      businessCategory: "Professional Services",
      requesterId: "user4",
      requesterName: "Alex Rodriguez",
      requesterRole: "Industry Peer",
      relationship: "Known for 3 years",
      message:
        "As a fellow professional in our industry, I've always admired your work. Would you accept my endorsement?",
      skills: ["Industry Knowledge", "Trustworthiness", "Community"],
      dateRequested: "2024-01-15",
      requesterTrustScore: 85,
      expiresIn: 2,
      status: "pending",
    },
    {
      id: "4",
      businessId: "201",
      businessName: "Your Business Name",
      businessCategory: "Professional Services",
      requesterId: "user5",
      requesterName: "Jessica Williams",
      requesterRole: "Collaborator",
      relationship: "Worked together on community project",
      message:
        "Your contribution to our community project was invaluable. I'd like to endorse your teamwork and dedication.",
      skills: ["Teamwork", "Dedication", "Community"],
      dateRequested: "2024-01-10",
      requesterTrustScore: 92,
      expiresIn: -1, // Expired
      status: "pending",
    },
  ]);

  const [filteredRequests, setFilteredRequests] = useState<
    EndorsementRequest[]
  >([]);
  const [stats, setStats] = useState({
    totalPending: 4,
    expiringSoon: 1,
    avgRequesterScore: 89,
    responseRate: "75%",
  });

  const [filters, setFilters] = useState<FilterState>({
    sortBy: "newest",
    timeFilter: "all",
  });

  const [bulkAction, setBulkAction] = useState<string>("");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  // Filter and sort requests
  useEffect(() => {
    let result = [...requests];

    // Time filter
    if (filters.timeFilter !== "all") {
      const now = new Date();
      result = result.filter((request) => {
        const daysLeft = request.expiresIn;
        switch (filters.timeFilter) {
          case "expiring":
            return daysLeft <= 3 && daysLeft >= 0;
          case "expired":
            return daysLeft < 0;
          case "new":
            const requestDate = new Date(request.dateRequested);
            const diffDays = Math.floor(
              (now.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return diffDays <= 7;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return (
            new Date(a.dateRequested).getTime() -
            new Date(b.dateRequested).getTime()
          );
        case "score":
          return b.requesterTrustScore - a.requesterTrustScore;
        case "expiring":
          return a.expiresIn - b.expiresIn;
        case "newest":
        default:
          return (
            new Date(b.dateRequested).getTime() -
            new Date(a.dateRequested).getTime()
          );
      }
    });

    setFilteredRequests(result);
  }, [requests, filters]);

  const handleAcceptRequest = async (requestId: string) => {
    setProcessing(requestId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "accepted" } : req
        )
      );

      // Remove from selected if it was selected
      setSelectedRequests((prev) => prev.filter((id) => id !== requestId));
    } catch (error) {
      console.error("Failed to accept request:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    setProcessing(requestId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "declined" } : req
        )
      );

      // Remove from selected if it was selected
      setSelectedRequests((prev) => prev.filter((id) => id !== requestId));
    } catch (error) {
      console.error("Failed to decline request:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedRequests.length === 0) return;

    setProcessing("bulk");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (bulkAction === "accept") {
        setRequests((prev) =>
          prev.map((req) =>
            selectedRequests.includes(req.id)
              ? { ...req, status: "accepted" }
              : req
          )
        );
      } else if (bulkAction === "decline") {
        setRequests((prev) =>
          prev.map((req) =>
            selectedRequests.includes(req.id)
              ? { ...req, status: "declined" }
              : req
          )
        );
      }

      setSelectedRequests([]);
      setBulkAction("");
    } catch (error) {
      console.error("Failed to process bulk action:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map((req) => req.id));
    }
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
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

  const getExpirationStatus = (expiresIn: number) => {
    if (expiresIn < 0) {
      return { text: "Expired", color: "bg-red-100 text-red-800" };
    } else if (expiresIn <= 2) {
      return {
        text: `Expires in ${expiresIn} day${expiresIn !== 1 ? "s" : ""}`,
        color: "bg-orange-100 text-orange-800",
      };
    } else if (expiresIn <= 7) {
      return {
        text: `Expires in ${expiresIn} days`,
        color: "bg-yellow-100 text-yellow-800",
      };
    } else {
      return {
        text: `Expires in ${expiresIn} days`,
        color: "bg-green-100 text-green-800",
      };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const expiringSoonCount = requests.filter(
    (r) => r.expiresIn <= 3 && r.expiresIn >= 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Endorsement Requests
              </h1>
              <p className="text-purple-100">
                Review and manage endorsement requests from other businesses
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/endorsements/received"
                className="inline-flex items-center px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                View Received Endorsements
              </Link>
              <Link
                href="/endorsements"
                className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition"
              >
                Back to Endorsements
              </Link>
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
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-orange-600"
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
                <p className="text-sm text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expiringSoonCount}
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Requester Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgRequesterScore}
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.responseRate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Bulk Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedRequests.length > 0 &&
                      selectedRequests.length === filteredRequests.length
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {selectedRequests.length > 0
                      ? `${selectedRequests.length} selected`
                      : "Select all"}
                  </span>
                </div>

                {selectedRequests.length > 0 && (
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      disabled={processing === "bulk"}
                    >
                      <option value="">Bulk action...</option>
                      <option value="accept">Accept selected</option>
                      <option value="decline">Decline selected</option>
                    </select>
                    <button
                      onClick={handleBulkAction}
                      disabled={!bulkAction || processing === "bulk"}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      {processing === "bulk" ? "Processing..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Time Filter */}
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Filter:</span>
                <select
                  value={filters.timeFilter}
                  onChange={(e) =>
                    setFilters({ ...filters, timeFilter: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All requests</option>
                  <option value="new">Last 7 days</option>
                  <option value="expiring">Expiring soon (≤3 days)</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="expiring">Expiring soon</option>
                  <option value="score">Requester score</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredRequests.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Checkbox for bulk selection */}
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        disabled={request.status !== "pending"}
                      />
                    </div>

                    {/* Request Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex items-start">
                          {/* Requester Avatar */}
                          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg mr-4">
                            {getInitials(request.requesterName)}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {request.requesterName}
                              </h3>
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                {request.requesterRole}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getExpirationStatus(request.expiresIn).color}`}
                              >
                                {getExpirationStatus(request.expiresIn).text}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              {request.relationship} • Requested{" "}
                              {formatDate(request.dateRequested)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {request.requesterTrustScore}
                          </div>
                          <div className="text-xs text-gray-500">
                            Requester Trust Score
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="mb-4">
                        <p className="text-gray-700 italic">
                          "{request.message}"
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Proposed Skills to Endorse:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {request.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="flex items-center">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {request.requesterName}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Wants to endorse: {request.businessName}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {request.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            disabled={processing === request.id}
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {processing === request.id ? (
                              <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Accepting...
                              </span>
                            ) : (
                              "Accept Request"
                            )}
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            disabled={processing === request.id}
                            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                          >
                            {processing === request.id
                              ? "Processing..."
                              : "Decline"}
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
                            Message
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              request.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.status === "accepted"
                              ? "Accepted"
                              : "Declined"}
                          </span>
                        </div>
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No pending requests
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {filters.timeFilter !== "all"
                  ? "No requests match your current filters. Try adjusting your filter settings."
                  : "You don't have any pending endorsement requests at the moment."}
              </p>
              {filters.timeFilter !== "all" && (
                <button
                  onClick={() => setFilters({ ...filters, timeFilter: "all" })}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
                >
                  Show All Requests
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tips & Guidelines */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Tips for Reviewing Requests
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  1
                </div>
                <span className="text-sm text-gray-700">
                  Check the requester's trust score and relationship
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  2
                </div>
                <span className="text-sm text-gray-700">
                  Review proposed skills for accuracy and relevance
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  3
                </div>
                <span className="text-sm text-gray-700">
                  Consider how the endorsement reflects on your business
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  4
                </div>
                <span className="text-sm text-gray-700">
                  Respond promptly to maintain good relationships
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Request Management
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Accepting Requests
                </h4>
                <p className="text-sm text-gray-600">
                  Accepted endorsements will appear on your business profile and
                  boost your trust score.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Declining Requests
                </h4>
                <p className="text-sm text-gray-600">
                  You can politely decline requests that don't align with your
                  business relationships.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Expiration</h4>
                <p className="text-sm text-gray-600">
                  Requests expire after 14 days. Expired requests can be renewed
                  by the requester.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
