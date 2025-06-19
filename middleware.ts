import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/welcome(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      // Gets the current URL path and search params
      const url = new URL(req.url);
      const currentPath = url.pathname + url.search;

      // Creates a welcome URL with redirect back to the original requested page
      const welcomeUrl = new URL("/welcome", req.url);
      welcomeUrl.searchParams.set("redirect_url", currentPath);

      // Redirects to welcome page with the redirect_url
      return NextResponse.redirect(welcomeUrl);
    }
  }
});

// Configuration to match all routes except for static assets
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
