"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  { value: "FOOD_RESTAURANT", label: "Food & Restaurant", icon: "🍽️" },
  { value: "RETAIL_SHOP", label: "Retail Shop", icon: "🛍️" },
  { value: "SERVICES", label: "Services", icon: "🔧" },
  { value: "HOME_BUSINESS", label: "Home Business", icon: "🏠" },
  { value: "STREET_VENDOR", label: "Street Vendor", icon: "🛒" },
  { value: "ARTISAN", label: "Artisan", icon: "🎨" },
  { value: "OTHER", label: "Other", icon: "📋" },
] as const;

export default function CreateBusinessPage() {
  const router = useRouter();
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

  const handleCategorySelect = (category: "FOOD_RESTAURANT" | "RETAIL_SHOP" | "SERVICES" | "HOME_BUSINESS" | "STREET_VENDOR" | "ARTISAN" | "OTHER") => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = businessSchema.parse(formData);

      // Create business
      const res = await fetch("/api/businesses/my-business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to the new business page
        router.push(`/my-business/${data.data.id}`);
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
          setErrors({ submit: data.error || "Failed to create business" });
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

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/my-business"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">
            Create New Business
          </h1>
        </div>
        <p className="text-gray-600">
          Set up your business profile on TrustNet. This will help customers
          find and trust your business.
        </p>
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

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Business Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleCategorySelect(option.value)}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        formData.category === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <p className="text-sm font-medium">{option.label}</p>
                    </button>
                  ))}
                </div>
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
                  Full Address (Optional)
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
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
                  Business Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Describe what your business does, products/services, etc."
                />
              </div>

              {/* UPI ID */}
              <div>
                <label
                  htmlFor="upiId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  UPI ID (Optional)
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
                href="/my-business"
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
                    Creating...
                  </>
                ) : (
                  "Create Business"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              Why Create a Business Profile?
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Build trust with customers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Get verified for credibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Receive reviews & endorsements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Track business analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Generate QR code for sharing</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Tips for Best Results
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <strong className="text-gray-700">
                  Use a clear business name
                </strong>
                <p>Customers should easily recognize your business</p>
              </li>
              <li>
                <strong className="text-gray-700">
                  Add a good description
                </strong>
                <p>Explain what makes your business unique</p>
              </li>
              <li>
                <strong className="text-gray-700">
                  Provide accurate contact info
                </strong>
                <p>Customers should be able to reach you easily</p>
              </li>
              <li>
                <strong className="text-gray-700">
                  Consider adding UPI ID
                </strong>
                <p>Enables payment features and boosts trust score</p>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-2">
              What Happens Next?
            </h3>
            <ol className="space-y-3 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Your business profile will be created</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  2
                </span>
                <span>You can add more details later</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Start the verification process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  4
                </span>
                <span>Share your profile with customers</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
