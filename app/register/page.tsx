"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types matching your backend schema
type RegisterFormData = {
  phone: string;
  name: string;
  businessName: string;
  role: "CUSTOMER" | "BUSINESS_OWNER";
};

type ApiResponse = {
  message?: string;
  user?: {
    id: string;
    phone: string;
    name: string;
    role: string;
  };
  business?: any;
  error?: string;
  details?: any;
};

const roleOptions = [
  {
    value: "CUSTOMER" as const,
    label: "Find and review local businesses",
    shortLabel: "Find businesses",
  },
  {
    value: "BUSINESS_OWNER" as const,
    label: "Register my business",
    shortLabel: "Register business",
  },
];

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    phone: "",
    name: "",
    businessName: "",
    role: "CUSTOMER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for API - exactly matches your backend schema
      const requestData = {
        phone: formData.phone,
        name: formData.name,
        role: formData.role,
        ...(formData.role === "BUSINESS_OWNER" && {
          businessName: formData.businessName,
        }),
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        // Handle validation errors from Zod
        if (data.details) {
          const fieldErrors = data.details
            .map((error: any) => `${error.path.join(".")}: ${error.message}`)
            .join(", ");
          throw new Error(fieldErrors);
        }
        throw new Error(data.error || "Registration failed");
      }

      // Success handling
      setSuccess("Registration successful! Redirecting to login...");

      // Store user info if needed
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role: "CUSTOMER" | "BUSINESS_OWNER") => {
    setFormData((prev) => ({
      ...prev,
      role,
      ...(role === "CUSTOMER" && { businessName: "" }),
    }));
    setIsDropdownOpen(false);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Format as Indian phone number
    if (digits.length <= 10) {
      return digits;
    } else {
      return `+${digits}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      phone: formattedPhone,
    }));
  };

  const selectedRole = roleOptions.find(
    (option) => option.value === formData.role
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">TrustNet</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Join TrustNet to build credibility for your business or discover
            trusted local businesses
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-200">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Phone Number *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-base">+91</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="block w-full pl-14 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="9876543210"
                  pattern="[\+]?[0-9]{10,13}"
                  title="Please enter a valid phone number"
                  inputMode="numeric"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                We'll use this for verification and login
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  minLength={2}
                />
              </div>
            </div>

            {/* Custom Dropdown for Role Selection */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-base font-medium text-gray-700 mb-2">
                I want to *
              </label>

              {/* Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-base text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white flex justify-between items-center"
              >
                <span className="truncate">
                  {selectedRole?.shortLabel || selectedRole?.label}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRoleSelect(option.value)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                        formData.role === option.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-900"
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      <div className="font-medium">{option.shortLabel}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Business Name (Conditional) */}
            {formData.role === "BUSINESS_OWNER" && (
              <div className="animate-fadeIn">
                <label
                  htmlFor="businessName"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Business Name *
                </label>
                <div>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required={formData.role === "BUSINESS_OWNER"}
                    value={formData.businessName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your business name"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This will be your public business name on TrustNet
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Verified Identity
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Phone-based verification
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Community Trust
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Build credibility together
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Fast Setup
            </h3>
            <p className="mt-1 text-sm text-gray-500">Get started in minutes</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
