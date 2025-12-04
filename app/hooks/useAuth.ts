import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('backendToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Basic JWT token format validation
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        localStorage.removeItem('backendToken');
        router.push('/login');
        return;
      }

      // Check if token is expired (optional - basic check)
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem('backendToken');
          router.push('/login');
          return;
        }
      } catch (tokenParseError) {
        console.warn('Could not parse token for expiration check');
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('backendToken');
    localStorage.removeItem('firebaseToken');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleAuthError = (status: number) => {
    if (status === 401) {
      localStorage.removeItem('backendToken');
      router.push('/login');
      return true;
    }
    return false;
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
    handleAuthError,
    checkAuthentication
  };
}