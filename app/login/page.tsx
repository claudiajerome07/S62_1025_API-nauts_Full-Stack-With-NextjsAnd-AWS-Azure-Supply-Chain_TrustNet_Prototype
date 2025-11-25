"use client";
import React, { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import type { ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function LoginPage() {
  const [sendOtp, setSendOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    setupRecaptcha();

    // Cleanup on unmount
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.log("Error clearing reCAPTCHA:", error);
        }
      }
    };
  }, []);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPhoneNumber(numericValue);
  };

  const setupRecaptcha = () => {
    if (typeof window === "undefined") return;

    try {
      // Clear existing reCAPTCHA
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.log("Error clearing old reCAPTCHA:", error);
        }
      }

      console.log("Initializing invisible reCAPTCHA...");

      // Use INVISIBLE reCAPTCHA to avoid CSP issues
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible", // CHANGED: Use invisible instead of normal
          callback: (response: string) => {
            console.log("reCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            toast.info("Security check expired. Please try again.");
          },
        }
      );

      console.log("Invisible reCAPTCHA initialized successfully");
    } catch (error: any) {
      console.error("Error setting up reCAPTCHA:", error);
      toast.error(`Security verification setup failed: ${error.message}`);
    }
  };

  const sendOtpFunction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting OTP send process...");

      // Ensure reCAPTCHA is initialized
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }

      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        toast.error("Security verification failed to initialize");
        return;
      }

      const fullNumber = `+91${phoneNumber}`;
      console.log("Sending OTP to:", fullNumber);

      // Execute invisible reCAPTCHA and send OTP
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullNumber,
        appVerifier
      );

      setConfirmationResult(confirmation);
      setSendOtp(true);
      toast.success("OTP sent successfully!");
    } catch (err: any) {
      console.error("OTP send error:", {
        code: err.code,
        message: err.message,
        name: err.name,
      });

      // Reset reCAPTCHA on error
      setupRecaptcha();

      // Specific handling for app credential issues
      if (err.code === "auth/invalid-app-credential") {
        toast.error(
          "Firebase configuration error. Please check project settings."
        );
      } else {
        switch (err.code) {
          case "auth/invalid-phone-number":
            toast.error("Invalid phone number format");
            break;
          case "auth/quota-exceeded":
            toast.error("Too many attempts. Please try again later.");
            break;
          case "auth/captcha-check-failed":
            toast.error(
              "Security verification failed. Please refresh and try again."
            );
            break;
          case "auth/too-many-requests":
            toast.error("Too many requests. Please try again later.");
            break;
          default:
            toast.error(err.message || "Failed to send OTP");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpFunction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      toast.error("No OTP verification in progress. Please request a new OTP.");
      return;
    }

    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log("User authenticated:", { uid: user.uid });

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", {
        code: err.code,
        message: err.message,
      });

      if (err.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP code");
      } else if (err.code === "auth/code-expired") {
        toast.error("OTP has expired. Please request a new one.");
        setSendOtp(false);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
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

        <form
          className="flex flex-col gap-4"
          onSubmit={sendOtp ? verifyOtpFunction : sendOtpFunction}
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              +91
            </span>
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={10}
              className="border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-gray-100 
                         rounded-lg pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
            />
          </div>

          {sendOtp && (
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-gray-100 
                         rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          )}

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
              <>
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
                {sendOtp ? "Verifying..." : "Sending..."}
              </>
            ) : sendOtp ? (
              "Verify OTP"
            ) : (
              "Get OTP"
            )}
          </button>

          {/* reCAPTCHA container - hidden since we're using invisible */}
          <div id="recaptcha-container" className="hidden"></div>
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
