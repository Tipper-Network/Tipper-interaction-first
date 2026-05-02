import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role__Enum } from "@/lib/shared/enum_types";
type SessionUser = {
  id: string;
  federated_identity_user: boolean;
  email_verified: boolean;
  email: string;
  user_role: Role__Enum;
};

function isAdmin(user: SessionUser | null) {
  return user?.user_role === Role__Enum.ADMIN;
}
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is an admin route
  if (pathname.startsWith("/admin")) {
    // Check for authentication cookie
    // Backend uses 'Authentication' cookie name (see backend/src/auth/auth.controller.ts)
    const hasAuthCookie = request.cookies.has("Authentication");

    let user = null;
    if (hasAuthCookie) {
      // In middleware, we need to explicitly pass cookies to fetch
      const cookieHeader = request.headers.get("cookie") || "";
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
      });
      if (res.ok) {
        user = await res.json();
      }
    }
    // If no auth cookie, redirect to login
    if (!hasAuthCookie) {
      const landingPageUrl = new URL("/", request.url);
      landingPageUrl.searchParams.set("reason", "not_authenticated");
      landingPageUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(landingPageUrl);
    }
    if (hasAuthCookie && !isAdmin(user.user)) {
      const landingPageUrl = new URL("/", request.url);
      landingPageUrl.searchParams.set("reason", "not_admin");
      landingPageUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(landingPageUrl);
    }

    // Note: Full role verification happens on the backend API calls
    // The middleware here just checks for the presence of auth cookies
    // The actual ADMIN role check is enforced by the backend endpoints
    // which will return 403 if the user doesn't have ADMIN role

    // Allow the request to proceed - backend will handle authorization
    return NextResponse.next();
  }

  // For non-admin routes, continue normally
  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
};
