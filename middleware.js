import { NextResponse } from "next/server";

export function middleware(request) {
  const authCookie = request.cookies.get("auth");

  console.log(authCookie);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
