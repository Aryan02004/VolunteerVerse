import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';

export async function middleware(req: NextRequest) {
  const supabaseResponse = NextResponse.next({ request: req });
  
  // Create the Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  
  // Get current session from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get URL and pathname
  const url = req.nextUrl.clone();
  const { pathname } = url;
  
  // Parse cookies manually to check for auth token (simplified)
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const hasAuthCookie = !!cookies['volunteer-verse-auth'];
  
  // Reduced logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log("Auth check:", {
      hasSession: !!session,
      hasAuthCookie,
      pathname
    });
  }
  
  // Define route types
  const publicRoutes = ['/', '/events', '/about', '/ngos', '/auth-test'];
  const authRoutes = ['/login', '/register', '/forgot-password'];
  const protectedRoutes = ['/dashboard', '/profile', '/events/register', '/my-activities', '/settings'];
  
  // Check route types
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isPendingApprovalRoute = pathname === '/pending-approval';
  
  // Allow auth-test route for debugging
  if (pathname === '/auth-test') {
    return supabaseResponse;
  }
  
  // CRITICAL CHANGE: Alternative session check if Supabase session is not detected
  // but we see an auth cookie (prevents redirect loops)
  const isAuthenticated = !!session || hasAuthCookie;
  
  // Debug info (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log("Route analysis:", {
      pathname,
      authStatus: isAuthenticated ? "Authenticated" : "Not authenticated",
      routeType: isPublicRoute ? "Public" : isAuthRoute ? "Auth" : isProtectedRoute ? "Protected" : "Other"
    });
  }

  // 1. Allow public routes for everyone
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // 2. For authenticated users trying to access login pages
  if (isAuthenticated && isAuthRoute) {
    const redirectPath = url.searchParams.get('redirectTo') || '/dashboard';
    const redirectUrl = new URL(redirectPath, req.url);
    console.log(`Authenticated user trying to access auth route. Redirecting to: ${redirectPath}`);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. For unauthenticated users trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    console.log(`Unauthenticated user trying to access protected route: ${pathname}. Redirecting to login.`);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // 4. For unauthenticated users trying to access pending-approval
  if (!isAuthenticated && isPendingApprovalRoute) {
    console.log("Unauthenticated user trying to access pending-approval. Redirecting to login.");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // The rest of your middleware for approval checks
  // (simplified for this critical fix)
  if (isAuthenticated && (isProtectedRoute || isPendingApprovalRoute)) {
    try {
      // If we have session data, check approval status
      if (session?.user?.id) {
        // First check volunteers table
        const { data: volunteerData, error: volunteerError } = await supabase
          .from('volunteer_users')
          .select('is_approved')
          .eq('id', session.user.id)
          .single();
          
        // Handle approval logic for volunteers
        if (!volunteerError) {
          if (volunteerData?.is_approved) {
            // Approved volunteer
            if (isPendingApprovalRoute) {
              return NextResponse.redirect(new URL('/dashboard', req.url));
            }
            return supabaseResponse;
          } else {
            // Unapproved volunteer
            if (isPendingApprovalRoute) {
              return supabaseResponse;
            }
            return NextResponse.redirect(new URL('/pending-approval', req.url));
          }
        }
        
        // Check users table if not found in volunteers
        if (volunteerError) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_approved')
            .eq('id', session.user.id)
            .single();
          
          // Handle approval logic for regular users
          if (!userError) {
            if (userData?.is_approved) {
              // Approved user
              if (isPendingApprovalRoute) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
              }
              return supabaseResponse;
            } else {
              // Unapproved user
              if (isPendingApprovalRoute) {
                return supabaseResponse;
              }
              return NextResponse.redirect(new URL('/pending-approval', req.url));
            }
          }
        }
      }
      
      // If we only have cookie but no valid session data yet,
      // allow access and let client-side handle it
      if (!session && hasAuthCookie) {
        console.log("No session data but auth cookie found. Allowing access.");
        return supabaseResponse;
      }
    } catch (error) {
      console.error("Error checking approval status:", error);
      return supabaseResponse;
    }
  }
  
  // Default: allow the request
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)  
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};