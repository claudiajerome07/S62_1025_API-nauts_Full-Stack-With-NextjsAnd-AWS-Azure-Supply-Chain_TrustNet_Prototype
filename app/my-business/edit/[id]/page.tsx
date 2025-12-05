"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

// Validation schema
const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.enum([
    "FOOD_RESTAURANT",
    "RETAIL_SHOP",
    "SERVICES",
    "HOME_BUSINESS",
    "STREET_VENDOR",
    "ARTISAN",
    "OTHER",
  ]),
  address: z.string().optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  location: z.string().optional(),
  upiId: z.string().optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

const categoryOptions = [
  { value: "FOOD_RESTAURANT", label: "Food & Restaurant" },
  { value: "RETAIL_SHOP", label: "Retail Shop" },
  { value: "SERVICES", label: "Services" },
  { value: "HOME_BUSINESS", label: "Home Business" },
  { value: "STREET_VENDOR", label: "Street Vendor" },
  { value: "ARTISAN", label: "Artisan" },
  { value: "OTHER", label: "Other" },
];

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    description: "",
    category: "OTHER",
    address: "",
    phone: "",
    location: "",
    upiId: "",
  });

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/businesses/my-business/${businessId}`);
      const data = await res.json();

      if (data.success) {
        const business = data.data;
        setFormData({
          name: business.name || "",
          description: business.description || "",
          category: business.category || "OTHER",
          address: business.address || "",
          phone: business.phone || "",
          location: business.location || "",
          upiId: business.upiId || "",
        });
      } else {
        router.push(`/my-business/${businessId}`);
      }
    } catch (error) {
      console.error("Failed to fetch business:", error);
      router.push(`/my-business/${businessId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = businessSchema.parse(formData);

      // Update business
      const res = await fetch(`/api/businesses/my-business/${businessId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/my-business/${businessId}`);
        router.refresh();
      } else {
        if (data.details) {
          // Handle validation errors from backend
          const newErrors: Record<string, string> = {};
          data.details.forEach((err: any) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(newErrors);
        } else {
          setErrors({ submit: data.error || "Failed to update business" });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle frontend validation errors
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

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="bg-gray-200 h-96 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/profile" className="hover:text-blue-600">
            Profile
          </Link>
          <span>/</span>
          <Link href="/my-business" className="hover:text-blue-600">
            My Businesses
          </Link>
          <span>/</span>
          <Link
            href={`/my-business/${businessId}`}
            className="hover:text-blue-600"
          >
            {formData.name || "Business"}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">Edit</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Business</h1>
            <p className="text-gray-600 mt-2">
              Update your business information
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/my-business/${businessId}`}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Cancel
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Business Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Joe's Coffee Shop"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., +91 9876543210"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Area / Locality
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., Koramangala, Bangalore"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Helps customers find businesses in their area
                </p>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Street address, landmark, etc."
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Business Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Describe what your business does, products/services, etc."
                />
                <p className="mt-2 text-sm text-gray-500">
                  A good description helps customers understand your business
                  better
                </p>
              </div>

              {/* UPI ID */}
              <div>
                <label
                  htmlFor="upiId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., yourname@upi"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Adding UPI ID helps with verification and enables payment
                  features
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Link
                href={`/my-business/${businessId}`}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Editing Tips</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">ℹ️</span>
                <span>Keep your business information up-to-date</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">ℹ️</span>
                <span>Accurate details build customer trust</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">ℹ️</span>
                <span>Changes appear immediately on your public profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">⚠️</span>
                <span>Some changes may require re-verification</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-semibold text-yellow-800 mb-3">
              Important Notes
            </h3>
            <ul className="space-y-3 text-sm text-yellow-700">
              <li>
                <strong className="text-yellow-800">Phone Number:</strong>
                <p className="mt-1">
                  Customers use this to contact you. Ensure it's correct.
                </p>
              </li>
              <li>
                <strong className="text-yellow-800">Category:</strong>
                <p className="mt-1">
                  Helps customers find your business in search results.
                </p>
              </li>
              <li>
                <strong className="text-yellow-800">UPI ID:</strong>
                <p className="mt-1">
                  If changed, UPI verification status will be reset.
                </p>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-3">
              What You Can Also Do
            </h3>
            <div className="space-y-3 text-sm text-green-700">
              <Link
                href={`/my-business/qr/${businessId}`}
                className="flex items-center gap-2 p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                <span className="text-lg">📱</span>
                <div>
                  <p className="font-medium">Generate QR Code</p>
                  <p className="text-xs">Share your business digitally</p>
                </div>
              </Link>
              <Link
                href={`/business/${businessId}`}
                target="_blank"
                className="flex items-center gap-2 p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                <span className="text-lg">👁️</span>
                <div>
                  <p className="font-medium">View Public Profile</p>
                  <p className="text-xs">See how customers see your business</p>
                </div>
              </Link>
              <Link
                href={`/analytics?business=${businessId}`}
                className="flex items-center gap-2 p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                <span className="text-lg">📊</span>
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-xs">Track your business performance</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you're having trouble updating your business information, check
              our help center or contact support.
            </p>
            <div className="space-y-2">
              <Link
                href="/help"
                className="text-sm text-blue-600 hover:text-blue-800 block"
              >
                📚 Visit Help Center
              </Link>
              <Link
                href="/support"
                className="text-sm text-blue-600 hover:text-blue-800 block"
              >
                💬 Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
