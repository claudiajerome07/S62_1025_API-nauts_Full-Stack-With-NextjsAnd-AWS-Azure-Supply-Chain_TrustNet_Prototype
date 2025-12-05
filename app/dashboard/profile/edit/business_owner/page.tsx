// app/dashboard/profile/edit/business_owner/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const businessOwnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  // Add business-specific fields here if needed
});

type BusinessOwnerFormData = z.infer<typeof businessOwnerSchema>;

export default function BusinessOwnerEditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessOwnerFormData>({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (userRole === "BUSINESS_OWNER") {
      fetchUserData();
    }
  }, [userRole]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        credentials: "include",
      });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const result = await response.json();
      const role = result.data.user.role;

      if (role !== "BUSINESS_OWNER") {
        router.push(`/dashboard/profile/edit/${role.toLowerCase()}`);
        return;
      }

      setUserRole(role);
    } catch (error) {
      router.push("/login");
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/users/me", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          email: data.user.email || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const validatedData = businessOwnerSchema.parse(formData);

      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(validatedData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard/profile");
        router.refresh();
      } else {
        setErrors({ submit: data.message || "Update failed" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || userRole !== "BUSINESS_OWNER") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Edit Business Owner Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update your personal and business information
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.submit}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.name
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.phone
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your email is optional and used for notifications
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push("/dashboard/profile")}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl mb-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              Business Management
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-500 mb-4">
              As a business owner, you can manage your businesses separately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/my-business")}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 text-sm"
              >
                View My Businesses
              </button>
              <button
                onClick={() => router.push("/my-business/create")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                + Add New Business
              </button>
            </div>
          </div>

          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
              Important Notes
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-1">
              <li>
                • Phone number is your primary identifier and may require
                re-verification if changed
              </li>
              <li>• Email is optional but recommended for account recovery</li>
              <li>• Changes will be reflected immediately across TrustNet</li>
              <li>
                • Business information is managed separately from your personal
                profile
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
