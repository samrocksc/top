"use client";

import { useState, useEffect } from "react";

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple check for authentication status
    const checkAuthStatus = () => {
      // Check for the auth status in localStorage
      const hasAuthSession = typeof window !== 'undefined' && localStorage.getItem('auth0.isAuthenticated') === 'true';
      
      console.log('Auth status check:', hasAuthSession);
      if (typeof window !== 'undefined') {
        console.log('All localStorage items:', {...localStorage});
      }
      
      // Also check for access token
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('auth0.access_token');
        if (accessToken) {
          console.log('Found access token in localStorage, length:', accessToken.length);
        } else {
          console.log('No access token found in localStorage');
        }
      }
      
      setIsLoggedIn(hasAuthSession);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <div className="mb-4">Loading...</div>;
  }

  return (
    <div className="mb-4">
      {isLoggedIn ? (
        <a 
          href="/api/auth/logout" 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Log Out
        </a>
      ) : (
        <a 
          href="/api/auth/login" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </a>
      )}
    </div>
  );
}