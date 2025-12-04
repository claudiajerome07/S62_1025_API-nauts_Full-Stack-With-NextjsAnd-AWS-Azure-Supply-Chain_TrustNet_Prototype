"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Connection = {
  id: string;
  name: string;
  avatar: string;
  businessName: string;
  trustScore: number;
  category: string;
  location: string;
  lastInteraction: string;
};

type EndorsementType = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

export default function GiveEndorsementPage() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Added this line

  // Selected connection for endorsement
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    endorsementType: "",
    category: "",
    message: "",
    tags: [] as string[],
    currentTag: "",
    visibility: "public",
    allowVerification: true,
  });

  // Mock connections data
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      name: "Sarah Thompson",
      avatar: "ST",
      businessName: "Thompson Design Studio",
      trustScore: 94,
      category: "Graphic Design",
      location: "New York, NY",
      lastInteraction: "2 weeks ago",
    },
    {
      id: "2",
      name: "Robert Kim",
      avatar: "RK",
      businessName: "Kim's Accounting Services",
      trustScore: 89,
      category: "Accounting",
      location: "Los Angeles, CA",
      lastInteraction: "1 month ago",
    },
    {
      id: "3",
      name: "Lisa Rodriguez",
      avatar: "LR",
      businessName: "Rodriguez Legal Counsel",
      trustScore: 92,
      category: "Legal Services",
      location: "Miami, FL",
      lastInteraction: "3 weeks ago",
    },
    {
      id: "4",
      name: "James Wilson",
      avatar: "JW",
      businessName: "Wilson Construction",
      trustScore: 87,
      category: "Construction",
      location: "Chicago, IL",
      lastInteraction: "2 months ago",
    },
    {
      id: "5",
      name: "Amanda Chen",
      avatar: "AC",
      businessName: "Chen Marketing Agency",
      trustScore: 91,
      category: "Digital Marketing",
      location: "San Francisco, CA",
      lastInteraction: "1 week ago",
    },
    {
      id: "6",
      name: "David Park",
      avatar: "DP",
      businessName: "Park IT Solutions",
      trustScore: 85,
      category: "IT Services",
      location: "Seattle, WA",
      lastInteraction: "3 months ago",
    },
    {
      id: "7",
      name: "Emily Brown",
      avatar: "EB",
      businessName: "Brown Consulting",
      trustScore: 90,
      category: "Business Consulting",
      location: "Boston, MA",
      lastInteraction: "4 days ago",
    },
    {
      id: "8",
      name: "Michael Garcia",
      avatar: "MG",
      businessName: "Garcia Photography",
      trustScore: 88,
      category: "Photography",
      location: "Austin, TX",
      lastInteraction: "2 weeks ago",
    },
  ]);

  const endorsementTypes: EndorsementType[] = [
    {
      id: "quality",
      label: "Quality",
      description: "For exceptional quality of work or products",
      icon: (
        <div className="bg-amber-100 text-amber-800 p-3 rounded-lg">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
      ),
    },
    {
      id: "service",
      label: "Service",
      description: "For outstanding customer service",
      icon: (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg">
          <svg
            className="w-6 h-6"
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
      ),
    },
    {
      id: "reliability",
      label: "Reliability",
      description: "For being dependable and trustworthy",
      icon: (
        <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
          <svg
            className="w-6 h-6"
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
      ),
    },
    {
      id: "skill",
      label: "Skill",
      description: "For exceptional expertise in their field",
      icon: (
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
          <svg
            className="w-6 h-6"
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
      ),
    },
    {
      id: "professionalism",
      label: "Professionalism",
      description: "For maintaining high professional standards",
      icon: (
        <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg">
          <svg
            className="w-6 h-6"
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
      ),
    },
    {
      id: "innovation",
      label: "Innovation",
      description: "For creative and innovative approaches",
      icon: (
        <div className="bg-pink-100 text-pink-800 p-3 rounded-lg">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      ),
    },
  ];

  const commonTags = [
    "Reliable",
    "Punctual",
    "High Quality",
    "Responsive",
    "Knowledgeable",
    "Creative",
    "Efficient",
    "Detail-Oriented",
    "Friendly",
    "Professional",
    "Expert",
    "Trustworthy",
    "Helpful",
    "Innovative",
    "Cost-Effective",
  ];

  // Filter connections based on search
  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.businessName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      connection.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Reset form when connection changes
    if (selectedConnection) {
      setFormData((prev) => ({
        ...prev,
        category: selectedConnection.category,
      }));
    }
  }, [selectedConnection]);

  const handleSelectConnection = (connection: Connection) => {
    setSelectedConnection(connection);
    setStep(2);
  };

  const handleAddTag = () => {
    if (
      formData.currentTag.trim() &&
      !formData.tags.includes(formData.currentTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConnection) {
      setError("Please select a connection to endorse");
      return;
    }

    if (!formData.endorsementType) {
      setError("Please select an endorsement type");
      return;
    }

    if (!formData.message.trim()) {
      setError("Please write an endorsement message");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      setSuccess(true);
      setIsSubmitting(false);

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setSelectedConnection(null);
        setFormData({
          endorsementType: "",
          category: "",
          message: "",
          tags: [],
          currentTag: "",
          visibility: "public",
          allowVerification: true,
        });
        router.push("/endorsements/given");
      }, 3000);
    } catch (err) {
      setError("Failed to submit endorsement. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Give an Endorsement
          </h1>
          <p className="text-gray-600 mt-2">
            Recognize great work by endorsing businesses you've worked with
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <div className="ml-2 font-medium">Select Business</div>
            </div>

            <div
              className={`w-24 h-1 mx-4 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
            ></div>

            <div
              className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <div className="ml-2 font-medium">Write Endorsement</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-600 mr-3"
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
              <div>
                <h3 className="font-bold text-green-800">
                  Endorsement Sent Successfully!
                </h3>
                <p className="text-green-700">
                  Your endorsement has been submitted. Redirecting to
                  endorsements...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-600 mr-3"
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
              <div>
                <h3 className="font-bold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Select Connection */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Select a Business to Endorse
            </h2>
            <p className="text-gray-600 mb-6">
              Choose from your connections or search for businesses
            </p>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses by name, business, or category..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Connections List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {filteredConnections.map((connection) => (
                <button
                  key={connection.id}
                  onClick={() => handleSelectConnection(connection)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                        {connection.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {connection.name}
                        </h3>
                        <p className="text-gray-600">
                          {connection.businessName}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="text-sm text-gray-500 mr-4">
                            {connection.category}
                          </div>
                          <div className="flex items-center">
                            <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="h-2 rounded-full bg-green-500"
                                style={{ width: `${connection.trustScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {connection.trustScore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {connection.location}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Last interaction: {connection.lastInteraction}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* No Results */}
            {filteredConnections.length === 0 && (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No connections found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "Connect with more businesses to endorse them"}
                </p>
                <Link
                  href="/network/recommendations"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Find Businesses to Connect With
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Write Endorsement */}
        {step === 2 && selectedConnection && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Connection Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    {selectedConnection.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Endorsing: {selectedConnection.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedConnection.businessName} •{" "}
                      {selectedConnection.category}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="text-sm font-medium text-gray-900 mr-4">
                        Trust Score: {selectedConnection.trustScore}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Change business
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Endorsement Type */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                What are you endorsing them for?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {endorsementTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, endorsementType: type.id })
                    }
                    className={`p-4 border rounded-lg text-left transition ${formData.endorsementType === type.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-start">
                      {type.icon}
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">
                          {type.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Endorsement Message */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Write Your Endorsement
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endorsement Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Be specific about what impressed you. Mention particular projects or qualities..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40"
                  required
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <div>Be specific and detailed</div>
                  <div>{formData.message.length}/500 characters</div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.currentTag}
                    onChange={(e) =>
                      setFormData({ ...formData, currentTag: e.target.value })
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    placeholder="Add a tag (e.g., Reliable, Creative)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    Add
                  </button>
                </div>

                {/* Common Tags */}
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Common tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...prev.tags, tag],
                            }));
                          }
                        }}
                        disabled={formData.tags.includes(tag)}
                        className={`px-3 py-1 text-sm rounded-full transition ${formData.tags.includes(tag) ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visibility Options */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === "public"}
                      onChange={(e) =>
                        setFormData({ ...formData, visibility: e.target.value })
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">
                      <span className="font-medium">Public</span> - Anyone can
                      see this endorsement
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === "private"}
                      onChange={(e) =>
                        setFormData({ ...formData, visibility: e.target.value })
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">
                      <span className="font-medium">Private</span> - Only you
                      and the recipient can see this
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Verification Option */}
            <div className="bg-white rounded-xl shadow p-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.allowVerification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowVerification: e.target.checked,
                    })
                  }
                  className="h-5 w-5 text-blue-600 mt-0.5"
                />
                <span className="ml-3 text-gray-700">
                  <span className="font-medium">
                    Allow verification request
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    The business can request to verify this endorsement with
                    additional proof
                  </p>
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Endorsement"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">
            Tips for Writing Great Endorsements
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Be specific:</strong> Mention particular projects or
                situations where they excelled
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Focus on impact:</strong> Describe how their work
                benefited you or your business
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Be genuine:</strong> Write from personal experience and
                be honest
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Keep it professional:</strong> Maintain a respectful and
                professional tone
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Use tags wisely:</strong> Add relevant tags that
                highlight key strengths
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
