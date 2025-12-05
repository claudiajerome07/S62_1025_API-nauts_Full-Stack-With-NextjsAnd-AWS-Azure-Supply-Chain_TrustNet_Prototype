"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Business = {
  id: string;
  name: string;
  category: string;
  ownerName: string;
  location: string;
  trustScore: number;
  description: string;
  imageColor: string;
};

type EndorsementForm = {
  relationship: string;
  message: string;
  selectedSkills: string[];
  customSkill: string;
};

type SkillOption = {
  id: string;
  name: string;
  category: string;
};

export default function GiveEndorsementPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.businessId as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EndorsementForm>({
    relationship: "",
    message: "",
    selectedSkills: [],
    customSkill: "",
  });

  // Available skill options
  const skillOptions: SkillOption[] = [
    // Service & Quality
    { id: "quality", name: "Quality Work", category: "Service & Quality" },
    { id: "reliability", name: "Reliability", category: "Service & Quality" },
    {
      id: "professionalism",
      name: "Professionalism",
      category: "Service & Quality",
    },
    {
      id: "attention",
      name: "Attention to Detail",
      category: "Service & Quality",
    },
    { id: "consistency", name: "Consistency", category: "Service & Quality" },

    // Communication
    { id: "communication", name: "Communication", category: "Communication" },
    { id: "responsiveness", name: "Responsiveness", category: "Communication" },
    { id: "clarity", name: "Clarity", category: "Communication" },
    { id: "transparency", name: "Transparency", category: "Communication" },

    // Customer Service
    {
      id: "customer_service",
      name: "Customer Service",
      category: "Customer Service",
    },
    { id: "friendliness", name: "Friendliness", category: "Customer Service" },
    { id: "helpfulness", name: "Helpfulness", category: "Customer Service" },
    { id: "patience", name: "Patience", category: "Customer Service" },

    // Business Practices
    { id: "pricing", name: "Fair Pricing", category: "Business Practices" },
    { id: "timeliness", name: "Timeliness", category: "Business Practices" },
    { id: "cleanliness", name: "Cleanliness", category: "Business Practices" },
    { id: "innovation", name: "Innovation", category: "Business Practices" },

    // Industry Specific
    { id: "technical", name: "Technical Skill", category: "Industry Specific" },
    {
      id: "knowledge",
      name: "Industry Knowledge",
      category: "Industry Specific",
    },
    { id: "creativity", name: "Creativity", category: "Industry Specific" },
    {
      id: "problem_solving",
      name: "Problem Solving",
      category: "Industry Specific",
    },
  ];

  // Relationship options
  const relationshipOptions = [
    "Customer/Client",
    "Business Partner",
    "Supplier/Vendor",
    "Industry Peer",
    "Former Employee",
    "Collaborator",
    "Service User",
    "Other",
  ];

  // Load business data
  useEffect(() => {
    const loadBusinessData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock business data - in real app, fetch from API
        const mockBusinesses: Record<string, Business> = {
          "101": {
            id: "101",
            name: "GreenLeaf Cafe",
            category: "Coffee Shop",
            ownerName: "Sarah Johnson",
            location: "Downtown",
            trustScore: 94,
            description:
              "Artisan coffee and fresh pastries in a cozy atmosphere. Family-owned since 2010.",
            imageColor: "bg-green-100",
          },
          "102": {
            id: "102",
            name: "TechFix Solutions",
            category: "Electronics Repair",
            ownerName: "Mike Chen",
            location: "Tech Park",
            trustScore: 92,
            description:
              "Expert repair for phones, laptops, and tablets with warranty on all services.",
            imageColor: "bg-purple-100",
          },
          "103": {
            id: "103",
            name: "Urban Fitness Center",
            category: "Gym",
            ownerName: "Alex Rodriguez",
            location: "City Center",
            trustScore: 89,
            description:
              "24/7 gym with personal training, group classes, and modern equipment.",
            imageColor: "bg-blue-100",
          },
        };

        const businessData = mockBusinesses[businessId];
        if (!businessData) {
          throw new Error("Business not found");
        }

        setBusiness(businessData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load business information"
        );
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      loadBusinessData();
    }
  }, [businessId]);

  const handleSkillToggle = (skillId: string) => {
    setForm((prev) => {
      if (prev.selectedSkills.includes(skillId)) {
        return {
          ...prev,
          selectedSkills: prev.selectedSkills.filter((id) => id !== skillId),
        };
      } else {
        // Limit to 5 skills
        if (prev.selectedSkills.length >= 5) {
          return prev;
        }
        return {
          ...prev,
          selectedSkills: [...prev.selectedSkills, skillId],
        };
      }
    });
  };

  const handleAddCustomSkill = () => {
    if (form.customSkill.trim() && form.selectedSkills.length < 5) {
      const customSkillId = `custom_${form.customSkill.toLowerCase().replace(/\s+/g, "_")}`;
      if (!form.selectedSkills.includes(customSkillId)) {
        setForm((prev) => ({
          ...prev,
          selectedSkills: [...prev.selectedSkills, customSkillId],
          customSkill: "",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.relationship ||
      !form.message ||
      form.selectedSkills.length === 0
    ) {
      setError(
        "Please fill in all required fields and select at least one skill"
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, submit to backend
      console.log("Endorsement submitted:", {
        businessId,
        businessName: business?.name,
        ...form,
      });

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push("/endorsements");
      }, 2000);
    } catch (err) {
      setError("Failed to submit endorsement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof EndorsementForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    // Loading state handled by loading.tsx
    return null;
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Business Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/endorsements"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
          >
            Back to Endorsements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Give an Endorsement
          </h1>
          <p className="text-purple-100 text-lg">
            Share your positive experience and help build trust in the community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900">
                  Endorsement Submitted Successfully!
                </h3>
                <p className="text-green-700">
                  Your endorsement has been sent. Redirecting to endorsements
                  page...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-red-600"
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
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900">Submission Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Business Card */}
        {business && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex items-center">
              <div
                className={`${business.imageColor} w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl mr-6`}
              >
                {getInitials(business.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {business.name}
                    </h2>
                    <p className="text-gray-600">
                      {business.category} • {business.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Owner: {business.ownerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {business.trustScore}
                    </div>
                    <div className="text-sm text-gray-500">Trust Score</div>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{business.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Endorsement Form */}
        <div className="bg-white rounded-xl shadow p-8">
          <form onSubmit={handleSubmit}>
            {/* Relationship */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Your Relationship with {business?.name} *
              </label>
              <select
                value={form.relationship}
                onChange={(e) =>
                  handleInputChange("relationship", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                required
                disabled={submitting || success}
              >
                <option value="">Select your relationship...</option>
                {relationshipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                How do you know or work with this business?
              </p>
            </div>

            {/* Endorsement Message */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Your Endorsement Message *
              </label>
              <textarea
                value={form.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                rows={6}
                placeholder="Share your experience with this business. Be specific about what makes them great..."
                required
                disabled={submitting || success}
                maxLength={500}
              />
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">
                  Be specific about your experience. What did they do well?
                </span>
                <span
                  className={`${form.message.length > 450 ? "text-red-500" : "text-gray-500"}`}
                >
                  {form.message.length}/500
                </span>
              </div>
            </div>

            {/* Skills & Qualities */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Skills & Qualities to Endorse *
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Select up to 5 - {form.selectedSkills.length}/5 selected)
                </span>
              </label>

              {/* Custom Skill Input */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.customSkill}
                    onChange={(e) =>
                      handleInputChange("customSkill", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Add a custom skill or quality..."
                    disabled={
                      submitting || success || form.selectedSkills.length >= 5
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    disabled={
                      !form.customSkill.trim() ||
                      submitting ||
                      success ||
                      form.selectedSkills.length >= 5
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Skills Preview */}
              {form.selectedSkills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Selected Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {form.selectedSkills.map((skillId) => {
                      const skill = skillOptions.find(
                        (s) => s.id === skillId
                      ) || {
                        id: skillId,
                        name: form.customSkill,
                        category: "Custom",
                      };
                      return (
                        <div
                          key={skillId}
                          className="flex items-center bg-purple-100 text-purple-800 px-3 py-2 rounded-full"
                        >
                          <span>{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => handleSkillToggle(skillId)}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                            disabled={submitting || success}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Skill Options by Category */}
              <div className="space-y-6">
                {Array.from(new Set(skillOptions.map((s) => s.category))).map(
                  (category) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillOptions
                          .filter((skill) => skill.category === category)
                          .map((skill) => (
                            <button
                              type="button"
                              key={skill.id}
                              onClick={() => handleSkillToggle(skill.id)}
                              disabled={
                                submitting ||
                                success ||
                                (!form.selectedSkills.includes(skill.id) &&
                                  form.selectedSkills.length >= 5)
                              }
                              className={`px-4 py-2 rounded-lg transition ${
                                form.selectedSkills.includes(skill.id)
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {skill.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Guidelines */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Endorsement Guidelines
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Be honest and specific about your experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Focus on skills and qualities you've personally observed
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Your endorsement will be visible on their business profile
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    You can update or remove your endorsement at any time
                  </span>
                </li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={submitting || success}
                className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </span>
                ) : success ? (
                  "Submitted Successfully!"
                ) : (
                  "Submit Endorsement"
                )}
              </button>
              <Link
                href="/endorsements"
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-center"
              >
                Cancel
              </Link>
            </div>

            {/* Form Validation Summary */}
            <div className="mt-6 text-sm text-gray-500">
              <p>
                Required fields: Relationship, Message, and at least one Skill.
              </p>
              <p>
                Your endorsement will help build trust and credibility for{" "}
                {business?.name}.
              </p>
            </div>
          </form>
        </div>

        {/* Endorsement Impact */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            The Impact of Your Endorsement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
              <h4 className="font-medium text-gray-900">Builds Trust</h4>
              <p className="text-sm text-gray-600 mt-1">
                Increases the business's credibility in the community
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">Supports Growth</h4>
              <p className="text-sm text-gray-600 mt-1">
                Helps the business attract new customers and opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">
                Strengthens Community
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Contributes to a trustworthy business ecosystem
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
