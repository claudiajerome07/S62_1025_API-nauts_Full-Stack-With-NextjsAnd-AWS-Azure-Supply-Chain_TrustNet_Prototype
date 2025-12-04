"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure localStorage is ready
    const timer = setTimeout(() => {
      redirectBasedOnRole();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const redirectBasedOnRole = async () => {
    try {
      console.log('Starting authentication check...');
      
      // First try to verify authentication via API (uses HTTP-only cookie)
      const response = await fetch('/api/auth/verify');
      console.log('Verify API response status:', response.status);
      
      if (!response.ok) {
        console.log('API verification failed with status:', response.status);
        
        // Fallback to localStorage check
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No token in localStorage either, redirecting to login');
          router.push('/login');
          return;
        }

        // Basic token validation
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.log('Invalid token format, removing and redirecting');
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }

        // Decode payload to get user role
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('User role from localStorage:', payload.role);
        
        redirectToRoleDashboard(payload.role);
        return;
      }

      // API verification successful, get user data
      const response_data = await response.json();
      console.log('API response data:', JSON.stringify(response_data, null, 2));
      
      // Access the nested data structure from sendSuccess response
      const data = response_data.data;
      
      if (!data || !data.user || !data.user.role) {
        console.log('Invalid user data from API:', response_data);
        console.log('data:', data);
        console.log('data.user:', data?.user);
        console.log('data.user.role:', data?.user?.role);
        
        // Fallback to localStorage check
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No token in localStorage either, redirecting to login');
          router.push('/login');
          return;
        }

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.log('Invalid token format, removing and redirecting');
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('User role from localStorage fallback:', payload.role);
        redirectToRoleDashboard(payload.role);
        return;
      }
      
      console.log('User role from API:', data.user.role);
      
      // Also store in localStorage for client-side access
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('Token stored in localStorage');
      }
      
      console.log('About to redirect to role dashboard for role:', data.user.role);
      redirectToRoleDashboard(data.user.role);
      
    } catch (error) {
      console.error('Error verifying authentication:', error);
      
      // Clear any stored tokens and redirect to login
      localStorage.removeItem('auth_token');
      router.push('/login');
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  const redirectToRoleDashboard = (role: string) => {
    console.log('redirectToRoleDashboard called with role:', role);
    
    switch (role) {
      case 'BUSINESS_OWNER':
        console.log('Redirecting to business dashboard');
        router.push('/dashboard/business');
        break;
      case 'CUSTOMER':
        console.log('Redirecting to customer dashboard');
        router.push('/dashboard/customer');
        break;
      case 'ADMIN':
        console.log('Redirecting to admin dashboard');
        router.push('/dashboard/admin');
        break;
      default:
        console.log('Unknown role, defaulting to customer dashboard');
        // Default to customer dashboard
        router.push('/dashboard/customer');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isLoading ? 'Redirecting to your dashboard...' : 'Loading...'}
        </p>
      </div>
    </div>
  );
}
