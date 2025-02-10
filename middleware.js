import { NextResponse } from "next/server";

export function middleware(request) {
  const authCookie = request.cookies.get("auth");

  // If there's no auth cookie, redirect to login
  if (!authCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If auth cookie exists, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
