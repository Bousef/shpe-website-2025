import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '~/env';
import { db } from '~/server/db';
import { members } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

// Define admin roles - must match the ones in user.ts
const ADMIN_ROLES = [
  "President",
  "Internal Vice President",
  "Corporate Vice President",
  "Secretary",
  "Marketing Vice President",
  "Treasurer",
  "Technology Chair",
  "DevTeam",
] as const;

// Routes that require admin access
const ADMIN_ROUTES = ['/admin', '/manage_inv'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  let supabase = null;

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured - auth features disabled');
    return supabaseResponse;
  } else {
    supabase = createServerClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )
  }

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if this is an admin route
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute) {
    // No user - redirect to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // User exists - verify admin role from database
    try {
      const member = await db
        .select({ position: members.position })
        .from(members)
        .where(eq(members.uuid, user.id));

      const position = member[0]?.position;
      const isAdmin = position && ADMIN_ROLES.includes(position as typeof ADMIN_ROLES[number]);

      if (!isAdmin) {
        // User is logged in but not an admin - redirect to home
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      // On error, deny access to be safe
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Put unauthorized user types and paths here
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}