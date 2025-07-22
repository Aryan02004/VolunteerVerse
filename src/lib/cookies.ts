// Simplify cookie handling to avoid conflicts with Supabase's own cookie management
import { serialize, parse } from 'cookie';

export const AUTH_COOKIE_NAME = 'volunteer-verse-auth';

export const setAuthCookie = (value: string) => {
  if (typeof window === 'undefined') return; // Skip on server
  
  // Set cookie with more secure parameters
  const cookie = serialize(AUTH_COOKIE_NAME, value, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Must be false to be accessible in middleware
  });
  
  document.cookie = cookie;
  
  // For debugging
  console.log(`Auth cookie set: ${AUTH_COOKIE_NAME}=${value.substring(0, 10)}...`);
  
  // Also store in localStorage as backup
  try {
    localStorage.setItem(AUTH_COOKIE_NAME, value);
  } catch (e) {
    console.error("Failed to store in localStorage:", e);
  }
};

export const getAuthCookie = () => {
  if (typeof window === 'undefined') return null; // Skip on server
  
  try {
    // Try from cookies first
    const cookies = parse(document.cookie);
    const fromCookie = cookies[AUTH_COOKIE_NAME];
    
    // Fall back to localStorage if not in cookies
    if (!fromCookie) {
      return localStorage.getItem(AUTH_COOKIE_NAME);
    }
    
    return fromCookie;
  } catch (e) {
    console.error("Error reading auth cookie:", e);
    return null;
  }
};

export const removeAuthCookie = () => {
  if (typeof window === 'undefined') return; // Skip on server
  
  // Remove from cookies
  const cookie = serialize(AUTH_COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });
  
  document.cookie = cookie;
  
  // Also remove from localStorage
  try {
    localStorage.removeItem(AUTH_COOKIE_NAME);
  } catch (e) {
    console.error("Failed to remove from localStorage:", e);
  }
};