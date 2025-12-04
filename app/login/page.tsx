"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

type ApiResponse = {
  message?: string;
  user?: {
    id: string;
    phone: string;
    name: string;
    role: string;
  };
  token?: string;
  error?: string;
  details?: any;
};

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        // Handle validation or backend errors
        if (data.details) {
          const fieldErrors = data.details
            .map((error: any) => `${error.path.join(".")}: ${error.message}`)
            .join(", ");
          throw new Error(fieldErrors);
        }
        throw new Error(data.error || data.message || "Login failed");
      }

      // Store token in localStorage for client-side access
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('Token stored successfully:', data.token);
        
        // Verify token was stored
        const storedToken = localStorage.getItem('auth_token');
        console.log('Verified stored token:', storedToken ? 'exists' : 'NOT FOUND');
      }

      toast.success("Login successful! Redirecting...");
      
      // Use Next.js router for navigation instead of window.location
      setTimeout(() => {
        console.log('About to redirect to dashboard');
        router.push("/dashboard");
      }, 1500); // Increased delay to ensure localStorage is updated
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f8ff] dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-md w-full max-w-sm sm:max-w-md text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
          Sign in to continue to{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            TrustNet
          </span>
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              +91
            </span>
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              maxLength={10}
              className="border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-gray-100 
                         rounded-lg pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
            />
          </div>

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 
                       rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium py-2 sm:py-3 rounded-lg transition flex justify-center items-center gap-2 text-sm sm:text-base`}
          >
            {loading ? (
              <svg
                className="w-5 h-5 animate-spin text-white"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-600 dark:text-gray-400 mt-6 text-xs sm:text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register
          </a>
        </p>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
