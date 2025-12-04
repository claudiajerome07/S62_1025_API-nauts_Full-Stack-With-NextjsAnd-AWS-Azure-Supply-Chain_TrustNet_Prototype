"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";

interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  trustScore: number;
  isVerified: boolean;
  phone: string;
  address?: string;
  location?: string;
  upiId?: string;
  upiVerified: boolean;
  createdAt: string;
}

export default function BusinessQRPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const businessUrl = `${window.location.origin}/business/${businessId}`;
  const shareableText = `Check out ${business?.name} on TrustNet! ${businessUrl}`;

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  useEffect(() => {
    if (business) {
      generateQRCode();
    }
  }, [business]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/businesses/my-business/${businessId}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setBusiness(data.data);
      } else {
        setError(data.error || "Failed to load business");
        setTimeout(() => router.push("/my-business"), 2000);
      }
    } catch (error: any) {
      console.error("Failed to fetch business:", error);
      setError(error.message || "An error occurred while fetching business");
      setTimeout(() => router.push("/my-business"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      if (!business) return;

      const qrOptions = {
        width: 400,
        margin: 2,
        color: {
          dark: "#1e40af", // Blue color
          light: "#ffffff",
        },
        errorCorrectionLevel: "H" as const, // High error correction
      };

      // Use the business URL directly - this is what QR scanners expect
      const url = businessUrl;
      const dataUrl = await QRCode.toDataURL(url, qrOptions);
      setQrDataUrl(dataUrl);

      // Also draw on canvas for better download quality
      if (qrRef.current) {
        await QRCode.toCanvas(qrRef.current, url, {
          ...qrOptions,
          width: 800, // Higher resolution for download
        });
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    setDownloading(true);
    try {
      const canvas = qrRef.current;
      const link = document.createElement("a");
      link.download = `${business?.name.replace(/\s+/g, "-").toLowerCase()}-trustnet-qr.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(businessUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${business?.name} - TrustNet`,
          text: shareableText,
          url: businessUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTestURL = () => {
    window.open(businessUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <QRPageLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchBusiness}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/my-business"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to My Businesses
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Business not found
          </h2>
          <div className="flex gap-3 justify-center">
            <Link
              href="/my-business"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to My Businesses
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
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
            {business.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">QR Code</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              QR Code for {business.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Share your business digitally with customers
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleTestURL}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Test URL
            </button>
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
              Back to Business
            </Link>
            <Link
              href="/my-business"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - QR Code Display */}
        <div className="lg:col-span-2 space-y-8">
          {/* QR Code Card */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Scan to View Business Profile
              </h2>
              <p className="text-gray-600 mb-6">
                Customers can scan this QR code to view your business profile on
                TrustNet
              </p>

              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {/* Hidden canvas for high-res download */}
                  <canvas ref={qrRef} className="hidden" />

                  {/* Display QR Code */}
                  {qrDataUrl ? (
                    <div className="relative">
                      <img
                        src={qrDataUrl}
                        alt={`QR Code for ${business.name}`}
                        className="w-72 h-72 mx-auto border-8 border-white rounded-lg shadow-lg"
                      />
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-lg animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="w-72 h-72 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )}

                  {/* TrustNet Logo Overlay */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border">
                    <span className="text-blue-600 font-bold">TrustNet</span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-sm text-gray-600 mb-2">Business URL</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-gray-100 px-4 py-2 rounded-lg text-sm truncate max-w-xs">
                      {businessUrl}
                    </code>
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    📱 Scan with your phone's camera
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
                  <button
                    onClick={handleDownloadQR}
                    disabled={downloading || !qrDataUrl}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {downloading ? (
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
                        Downloading...
                      </>
                    ) : (
                      <>
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download PNG
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
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
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How to Use This QR Code
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Print & Display
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Print the QR code and display it at your business
                      location, on products, or business cards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Digital Sharing
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Share the QR code image digitally via email, social media,
                      or messaging apps.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Marketing Materials
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Include in brochures, flyers, menus, or any promotional
                      materials.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Direct Access</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Customers can scan to instantly view your profile,
                      reviews, and contact information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Business Info & Actions */}
        <div className="space-y-6">
          {/* Business Info Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Business Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="font-medium">{business.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">
                  {business.category.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trust Score</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      business.trustScore >= 80
                        ? "bg-green-500"
                        : business.trustScore >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium">{business.trustScore}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verification Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${business.isVerified ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span
                    className={`font-medium ${business.isVerified ? "text-green-600" : "text-gray-600"}`}
                  >
                    {business.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
              {business.upiVerified && (
                <div>
                  <p className="text-sm text-gray-500">UPI Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium text-green-600">
                      UPI Verified
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href={`/my-business/${businessId}`}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-blue-600">👁️</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
                    View Business
                  </h3>
                  <p className="text-sm text-gray-600">
                    Go back to business management
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
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

              <Link
                href={`/my-business/edit/${businessId}`}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-blue-600">✏️</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
                    Edit Business
                  </h3>
                  <p className="text-sm text-gray-600">
                    Update business information
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
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

              <Link
                href={`/business/${businessId}`}
                target="_blank"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-blue-600">🌐</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
                    Public Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    View how customers see your business
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
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

          {/* Tips & Best Practices */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Best Practices</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Use high-contrast backgrounds for better scanning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Keep QR code at least 2x2 cm for easy scanning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Test the QR code before mass printing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Include instructions like "Scan to view profile"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function QRPageLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-40"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-200 h-96 rounded-xl"></div>
            <div className="bg-gray-200 h-64 rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-200 h-64 rounded-xl"></div>
            <div className="bg-gray-200 h-64 rounded-xl"></div>
            <div className="bg-gray-200 h-48 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
