// app/api/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation - TrustNet",
  description: "TrustNet API documentation and endpoints",
};

export default function ApiDocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TrustNet API
          </h1>
          <p className="text-xl text-gray-600">
            RESTful API endpoints for TrustNet platform
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Available Endpoints
          </h2>

          <div className="space-y-6">
            {/* Authentication Endpoints */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Authentication
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    POST
                  </code>
                  <code className="text-gray-700">/api/auth/register</code>
                </div>
                <div className="flex items-center gap-4">
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    POST
                  </code>
                  <code className="text-gray-700">/api/auth/login</code>
                </div>
                <div className="flex items-center gap-4">
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    POST
                  </code>
                  <code className="text-gray-700">/api/auth/verify-otp</code>
                </div>
              </div>
            </div>

            {/* Business Endpoints */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Businesses
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    GET
                  </code>
                  <code className="text-gray-700">/api/businesses</code>
                </div>
                <div className="flex items-center gap-4">
                  <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    GET
                  </code>
                  <code className="text-gray-700">/api/businesses/[id]</code>
                </div>
                <div className="flex items-center gap-4">
                  <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    GET
                  </code>
                  <code className="text-gray-700">
                    /api/businesses/[id]/reviews
                  </code>
                </div>
                <div className="flex items-center gap-4">
                  <code className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    POST
                  </code>
                  <code className="text-gray-700">/api/businesses</code>
                </div>
              </div>
            </div>

            {/* Search Endpoint */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Search
              </h3>
              <div className="flex items-center gap-4">
                <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  GET
                </code>
                <code className="text-gray-700">/api/search?q=query</code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Note</h3>
          <p className="text-yellow-700">
            This is the API documentation page. For actual API requests, use the
            endpoints listed above. All endpoints return JSON responses and
            support proper error handling.
          </p>
        </div>
      </div>
    </div>
  );
}
