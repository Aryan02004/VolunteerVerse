"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Define a type for the session info
interface SessionInfo {
  sessionExists: boolean;
  userId?: string | null;
  userEmail?: string | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  localStorageAuthExists: boolean;
  cookies: string;
  error?: string;
}

export default function AuthTest() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      try {
        // Get session from supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        // Check localStorage
        let localStorageAuth = null;
        try {
          localStorageAuth = localStorage.getItem('supabase.auth.token');
          if (localStorageAuth) {
            localStorageAuth = JSON.parse(localStorageAuth);
          }
        } catch (e) {
          console.error("Error reading from localStorage:", e);
        }
        
        // Check cookies
        const cookies = document.cookie;
        
        setSessionInfo({
          sessionExists: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          accessToken: session?.access_token ? `${session.access_token.substring(0, 10)}...` : 'None',
          refreshToken: session?.refresh_token ? 'Present' : 'None',
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A',
          localStorageAuthExists: !!localStorageAuth,
          cookies
        });
      } catch (error) {
        console.error('Error checking auth:', error);
        setSessionInfo({ 
          sessionExists: false,
          accessToken: 'None',
          refreshToken: 'None',
          expiresAt: 'N/A',
          localStorageAuthExists: false,
          cookies: '',
          error: String(error) 
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, []);
  
  const refreshSession = async () => {
    try {
      await supabase.auth.refreshSession();
      alert("Session refreshed successfully");
      window.location.reload();
    } catch (e) {
      alert("Error: " + e);
    }
  };
  
  const clearAndLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('supabase.auth.token');
      
      // Clear cookies
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
      });
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      alert("Logged out successfully");
      window.location.href = '/login';
    } catch (e) {
      alert("Error: " + e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Authentication Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-zinc-700 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Session Information</h2>
            <pre className="text-sm overflow-auto p-2 bg-gray-200 dark:bg-zinc-600 rounded text-gray-800 dark:text-gray-200">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={refreshSession}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md"
            >
              Refresh Session
            </button>
            
            <button 
              onClick={clearAndLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Clear All & Logout
            </button>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Navigation</h2>
            <div className="space-y-2">
              <Link href="/dashboard" className="block px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 rounded-md text-center">
                Go to Dashboard
              </Link>
              <Link href="/login" className="block px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 rounded-md text-center">
                Go to Login
              </Link>
              <Link href="/" className="block px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 rounded-md text-center">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}