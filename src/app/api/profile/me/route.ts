import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getVolunteerById } from "@/models/volunteers";

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    // Properly await cookies
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );
    
    // Try to get the user ID from the Supabase client
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id) {
      userId = session.user.id;
    } 
    // If we don't have a session but have an auth header, we can try to use it
    else if (authHeader && authHeader.startsWith('Bearer ')) {
      // We have a token, but we need to verify it
      const token = authHeader.slice(7); // Remove 'Bearer ' prefix
      
      try {
        // Set the auth token and try to get the user
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          userId = user.id;
        }
      } catch (error) {
        console.error("Error getting user from token:", error);
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - not logged in" },
        { status: 401 }
      );
    }
    
    // Get volunteer profile
    const volunteerProfile = await getVolunteerById(userId);
    if (!volunteerProfile) {
      return NextResponse.json(
        { error: "No volunteer profile found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(volunteerProfile);
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: "Server error fetching profile" },
      { status: 500 }
    );
  }
}