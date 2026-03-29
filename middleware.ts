import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = clerkKey && clerkKey.startsWith("pk_");

const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/projects(.*)',
  '/blogs(.*)',
  '/team(.*)',
  '/contact(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/(.*)',
  '/past-presidents(.*)',
  '/privacy(.*)',
  '/terms(.*)',
]);

export default isClerkEnabled
  ? clerkMiddleware((auth, req) => {
    if (isPublicRoute(req)) return NextResponse.next();
  })
  : function middleware(_req: NextRequest) {
    return NextResponse.next();
  };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
