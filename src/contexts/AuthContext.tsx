"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  user_type?: "student" | "professional";
  university?: string;
  roll_number?: string;
  student_email?: string;
  industry?: string;
  occupation?: string;
  work_email?: string;
  is_approved: boolean;
  created_at?: string;
};

// Add updateSessionAndProfile to the AuthContext interface
type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateSessionAndProfile: () => Promise<void>; // Add this line
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update the fetchUserProfile function with better error handling
  const fetchUserProfile = async (userId: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Fetching user profile for ID:", userId);
      }
      
      // First try to get from volunteer_users with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const { data: volunteerData, error: volunteerError } = await supabase
        .from("volunteer_users")
        .select("*")
        .eq("id", userId)
        .single();
      
      clearTimeout(timeoutId);

      if (!volunteerError && volunteerData) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Volunteer user found");
        }
        setUserProfile(volunteerData as UserProfile);
        return;
      }

      // If not in volunteer_users, try regular users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (!userError && userData) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Regular user found");
        }
        setUserProfile(userData as UserProfile);
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("No user profile found in any table");
      }
      setUserProfile(null);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  // Add this function to directly fetch and update session and user profile
  const updateSessionAndProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error updating session:", error);
      setSession(null);
      setUser(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update the refreshProfile function to use updateSessionAndProfile
  const refreshProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      if (process.env.NODE_ENV === 'development') {
        console.log("Refreshing profile...");
      }
      
      // Use the updateSessionAndProfile function directly
      await updateSessionAndProfile();
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Profile refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      // Reset all auth state on error
      setSession(null);
      setUser(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [updateSessionAndProfile]);

  // Update the useEffect hook for session initialization
  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    const initializeAuth = async () => {
      if (!mounted) return;
      
      setIsLoading(true);
      
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setUserProfile(null);
          }
          return;
        }
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
        }
        
        if (initialSession?.user && mounted) {
          await fetchUserProfile(initialSession.user.id);
        } else if (mounted) {
          setUserProfile(null);
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!mounted) return;
            
            if (process.env.NODE_ENV === 'development') {
              console.log("Auth state change:", event, newSession?.user?.id || "No user ID");
            }
            
            setSession(newSession);
            setUser(newSession?.user || null);
            
            if (newSession?.user) {
              await fetchUserProfile(newSession.user.id);
            } else {
              setUserProfile(null);
            }
          }
        );
        
        authSubscription = subscription;
      } catch (error) {
        console.error("Error in auth initialization:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setUserProfile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Initialize
    initializeAuth();
    
    // Return cleanup function
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Memoize the signOut function to prevent unnecessary re-renders
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    session,
    user,
    userProfile,
    isLoading,
    signOut,
    refreshProfile,
    updateSessionAndProfile,
  }), [session, user, userProfile, isLoading, signOut, refreshProfile, updateSessionAndProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Add this at the end of the file

export const useAuthSafe = () => {
  try {
    const context = useContext(AuthContext);
    if (context === undefined) {
      // Return a default/placeholder state instead of throwing
      return {
        session: null,
        user: null,
        userProfile: null,
        isLoading: true,
        signOut: async () => {},
        refreshProfile: async () => {},
        updateSessionAndProfile: async () => {},
      };
    }
    return context;
  } catch (error) {
    console.error("Error using auth context:", error);
    // Return a default/placeholder state
    return {
      session: null,
      user: null,
      userProfile: null,
      isLoading: true,
      signOut: async () => {},
      refreshProfile: async () => {},
      updateSessionAndProfile: async () => {},
    };
  }
};