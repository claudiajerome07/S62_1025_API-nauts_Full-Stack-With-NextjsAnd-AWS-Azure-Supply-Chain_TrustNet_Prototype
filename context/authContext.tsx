"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
  uid: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  businessVerified?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseToken: string | null;
  backendToken: string | null;
  loading: boolean;

  login: (
    firebaseToken: string,
    backendToken: string | null,
    userData: AuthUser
  ) => void;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [backendToken, setBackendToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stored session
  useEffect(() => {
    const savedFirebaseToken = localStorage.getItem("firebaseToken");
    const savedBackendToken = localStorage.getItem("backendToken");
    const savedUser = localStorage.getItem("user");
    const savedAuthToken = localStorage.getItem("auth_token");

    if (savedFirebaseToken) setFirebaseToken(savedFirebaseToken);
    if (savedBackendToken) setBackendToken(savedBackendToken);
    if (savedUser) setUser(JSON.parse(savedUser));

    // If we have a JWT token but no user data, try to decode it
    if (savedAuthToken && !savedUser) {
      try {
        const tokenParts = savedAuthToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setUser({
            uid: payload.id,
            role: payload.role,
          });
          setBackendToken(savedAuthToken);
        }
      } catch (error) {
        console.error('Error decoding stored token:', error);
        localStorage.removeItem("auth_token");
      }
    }

    setLoading(false);
  }, []);

  // LOGIN FUNCTION (for Firebase OTP flow)
  const login = (
    firebaseToken: string,
    backendToken: string | null,
    userData: AuthUser
  ) => {
    setFirebaseToken(firebaseToken);
    setBackendToken(backendToken);
    setUser(userData);

    localStorage.setItem("firebaseToken", firebaseToken);
    if (backendToken) {
      localStorage.setItem("backendToken", backendToken);
    }
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call the logout API to clear server-side cookie
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    setFirebaseToken(null);
    setBackendToken(null);
    setUser(null);

    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("backendToken");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token"); // Clear JWT token

    window.location.href = "/login"; // redirect
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseToken,
        backendToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
