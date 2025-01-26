import { NextResponse } from "next/server";

export function middleware(request) {
  const authCookie = request.cookies.get("auth");

  if (!authCookie) {
    // If the auth cookie is not present, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the auth cookie is present, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
