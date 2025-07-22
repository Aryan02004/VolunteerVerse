import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Make sure these are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',  // Use the default key for better compatibility
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',  // Use PKCE flow for better security and reliability
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
});