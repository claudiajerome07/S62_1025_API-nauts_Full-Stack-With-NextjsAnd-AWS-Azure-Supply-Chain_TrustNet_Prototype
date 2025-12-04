"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";

function Navbar() {
  const { theme, toggleTheme } = useUI();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { logout: authLogout } = useAuth();

  // Check authentication status
  useEffect(() => {
    console.log("Navbar: Initial mount, checking auth status");
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      console.log(
        "Navbar: Storage event detected:",
        e.key,
        e.newValue ? "token added" : "token removed"
      );
      setTimeout(() => checkAuthStatus(), 100);
    };

    // Listen for custom login event (for immediate updates)
    const handleLoginSuccess = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log("Navbar: userLoggedIn event received:", customEvent.detail);
      setTimeout(() => checkAuthStatus(), 200);
    };

    // Listen for route changes
    const handleRouteChange = () => {
      console.log("Navbar: Route change detected, checking auth");
      if (
        sessionStorage.getItem("justLoggedIn") ||
        localStorage.getItem("auth_token")
      ) {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleLoginSuccess);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleLoginSuccess);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Check for fresh login on page focus and route changes
  useEffect(() => {
    const handleFocus = () => {
      console.log("Navbar: Window focus, checking for fresh login");
      if (sessionStorage.getItem("justLoggedIn")) {
        checkAuthStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Check auth when pathname changes
  useEffect(() => {
    console.log("Navbar: Router effect triggered");
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      const justLoggedIn = sessionStorage.getItem("justLoggedIn");

      if (token || justLoggedIn) {
        console.log("Navbar: Token or login flag found, checking auth");
        checkAuthStatus();
      }
    }
  }, [router]);

  // Check auth when component mounts or after navigation
  useEffect(() => {
    console.log("Navbar: Pathname effect triggered");
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      const justLoggedIn = sessionStorage.getItem("justLoggedIn");

      if (token || justLoggedIn) {
        console.log("Navbar: Token or login flag found, checking auth");
        checkAuthStatus();
      }
    }
  }, [router]);

  const checkAuthStatus = async () => {
    try {
      console.log("Navbar: checkAuthStatus called");
      setLoading(true);

      // Check if user just logged in
      const justLoggedIn = sessionStorage.getItem("justLoggedIn");
      if (justLoggedIn) {
        console.log("Navbar: Just logged in flag found, removing it");
        sessionStorage.removeItem("justLoggedIn");
        // Force a slight delay to ensure token is properly set
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // First check if we have a token in localStorage
      const token = localStorage.getItem("auth_token");
      console.log("Navbar: Token check:", token ? "found" : "not found");

      if (!token) {
        console.log("Navbar: No token found, setting unauthenticated");
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName(null);
        return;
      }

      // Verify token with the API
      console.log("Navbar: Verifying token with API");
      const response = await fetch("/api/auth/verify");

      if (response.ok) {
        const result = await response.json();
        const userData = result.data;

        console.log(
          "Navbar: Token verified successfully, user:",
          userData.user.name,
          "role:",
          userData.user.role
        );
        setIsAuthenticated(true);
        setUserRole(userData.user.role);
        setUserName(userData.user.name);
      } else {
        // Token is invalid
        console.log("Navbar: Token verification failed, removing token");
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
    } finally {
      setLoading(false);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      // Call the logout API to clear server-side cookie
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Clear client-side data
    localStorage.removeItem("auth_token");
    setShowUserMenu(false);
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);

    // Trigger custom logout event
    window.dispatchEvent(new CustomEvent("userLoggedOut"));

    // Also call the auth context logout for any Firebase cleanup
    authLogout();
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Function to get profile URL based on user role
  const getProfileUrl = () => {
    if (userRole === "BUSINESS_OWNER") {
      return "/profile";
    } else if (userRole === "CUSTOMER") {
      return "/profile";
    } else {
      return "/profile";
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              <Link href="/">TrustNet</Link>
            </h1>
          </div>

          {/* Right Side Links */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse flex space-x-2">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-0"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-start sm:min-w-0">
                      <span className="text-sm font-medium truncate max-w-24 md:max-w-32">
                        {userName || "User"}
                      </span>
                      {userRole && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {userRole === "BUSINESS_OWNER"
                            ? "Business"
                            : userRole === "CUSTOMER"
                              ? "Customer"
                              : "Admin"}
                        </span>
                      )}
                    </div>
                    <div className="sm:hidden">
                      {userRole && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                          {userRole === "BUSINESS_OWNER"
                            ? "B"
                            : userRole === "CUSTOMER"
                              ? "C"
                              : "A"}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {userName || "User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {userRole
                            ? userRole.replace("_", " ").toLowerCase()
                            : "Customer"}
                        </p>
                      </div>
                      <div className="py-2">
                        {/* Profile Link - ADDED THIS */}
                        <Link
                          href={getProfileUrl()}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircle className="w-4 h-4 mr-2" />
                          Profile
                        </Link>

                        <Link
                          href={
                            userRole === "BUSINESS_OWNER"
                              ? "/dashboard/business"
                              : userRole === "CUSTOMER"
                                ? "/dashboard/customer"
                                : "/dashboard"
                          }
                          className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          {userRole === "BUSINESS_OWNER"
                            ? "Business Dashboard"
                            : userRole === "CUSTOMER"
                              ? "Find Businesses"
                              : "Dashboard"}
                        </Link>
                        {userRole === "CUSTOMER" && (
                          <Link
                            href="/businesses"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4 mr-2" />
                            Discover Businesses
                          </Link>
                        )}
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
