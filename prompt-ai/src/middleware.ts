import { NextRequest, NextResponse } from "next/server";
import api from "./api/axios";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const protectedRoutes = ["/dashboard", "/Dashboard", "/editor"];
  const authRoutes = [
    "/SignIn",
    "/SignUp",
    "/forget-password",
    "/reset-password",
  ];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing a protected route without a valid token, try to refresh
  if (isProtected && (!token || token.trim() === "")) {
    // If we have a refresh token, try to refresh
    if (refreshToken) {
      console.log("🔄 Middleware: No access token, attempting refresh...");

      try {
        const refreshResponse = await api.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Cookie: `refresh_token=${refreshToken}`,
            },
          }
        );

        if (refreshResponse.status === 200) {
          console.log("✅ Middleware: Token refresh successful");
          // Get the new cookies from the response
          const setCookieHeader = refreshResponse.headers["set-cookie"];
          if (setCookieHeader) {
            // Create response with new cookies
            const response = NextResponse.next();
            response.headers.set("set-cookie", setCookieHeader[0]);
            return response;
          }
        } else {
          console.log("❌ Middleware: Token refresh failed");
        }
      } catch (error) {
        console.log("❌ Middleware: Token refresh error:", error);
      }
    }

    // If refresh failed or no refresh token, redirect to login
    return NextResponse.redirect(new URL("/SignIn", req.url));
  }

  // If user has access token and is on main page, redirect to dashboard
  if (req.nextUrl.pathname === "/" && token && token.trim() !== "") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user has access token and tries to access auth pages, redirect to dashboard
  if (isAuthRoute && token && token.trim() !== "") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/Dashboard/:path*",
    "/editor/:path*",
    "/SignIn/:path*",
    "/SignUp/:path*",
    "/forget-password/:path*",
    "/reset-password/:path*",
  ],
};
