import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const protectedRoutes = ["/dashboard", "/Dashboard", "/editor"];
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing a protected route without a valid token, redirect to login
  if (isProtected && (!token || token.trim() === "")) {
    return NextResponse.redirect(new URL("/SignIn", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/Dashboard/:path*",
    "/editor/:path*",
    "/SignIn/:path*",
    "/SignUp/:path*",
    "/forget-password/:path*",
    "/reset-password/:path*",
  ],
};
