"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getAuthCookie } from "@/lib/cookies";

export const SessionDebug = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        // Get session from supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        // Get cookie info
        const authCookie = getAuthCookie();
        
        // Check localStorage
        let localStorageSession = null;
        let localStorageAuth = null;
        try {
          localStorageSession = localStorage.getItem('supabase.auth.session');
          localStorageAuth = localStorage.getItem('volunteer-verse-auth');
        } catch (e) {
          console.error("Error reading localStorage:", e);
        }
        
        setSessionInfo({
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          hasCookie: !!authCookie,
          hasLocalStorage: !!localStorageAuth || !!localStorageSession
        });
      } catch (error) {
        console.error("Error checking auth:", error);
        setSessionInfo({ error: String(error) });
      }
    }
    
    checkAuth();
    
    // Set up interval to refresh every 5 seconds
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (!sessionInfo) return null;
  
  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
      <div 
        className={`bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden ${expanded ? 'w-80' : 'w-40'}`}
      >
        <div 
          className="p-3 bg-cyan-600 text-white cursor-pointer flex justify-between items-center text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Session Status</span>
          <span className={sessionInfo.hasSession ? "text-green-300" : "text-red-300"}>
            {sessionInfo.hasSession ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
        
        {expanded && (
          <div className="p-3 text-xs">
            <pre className="overflow-auto max-h-40 text-gray-800 dark:text-gray-200">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
            <div className="mt-2 flex justify-between">
              <button
                onClick={async () => {
                  await supabase.auth.refreshSession();
                  alert("Session refresh attempted");
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Refresh
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/login';
                }}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDebug;