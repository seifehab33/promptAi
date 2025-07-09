import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Create a server-side axios instance for middleware
const serverApi = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const protectedRoutes = [
    "/dashboard",
    "/editor",
    "/community",
    "/editor/:path*",
  ];
  const isMainPage = req.nextUrl.pathname === "/";
  const authRoutes = [
    "/SignIn",
    "/SignUp",
    "/forget-password",
    "/reset-password",
  ];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(
    (route) =>
      req.nextUrl.pathname === route ||
      req.nextUrl.pathname.startsWith(`${route}/`)
  );

  // If accessing a protected route without a valid token, try to refresh
  if (isProtected && (!token || token.trim() === "")) {
    // If we have a refresh token, try to refresh
    if (refreshToken) {
      console.log("🔄 Middleware: No access token, attempting refresh...");
      console.log(
        "🔄 Middleware: Refresh token exists:",
        refreshToken.substring(0, 20) + "..."
      );

      try {
        const refreshResponse = await serverApi.post(
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
            console.log(
              "✅ Middleware: Setting new cookies:",
              setCookieHeader.length
            );
            // Create response with new cookies
            const response = NextResponse.next();
            // Set both cookies from the response
            setCookieHeader.forEach((cookie) => {
              response.headers.append("set-cookie", cookie);
            });
            return response;
          }
        } else {
          console.log(
            "❌ Middleware: Token refresh failed with status:",
            refreshResponse.status
          );
        }
      } catch (error: unknown) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
        };
        console.log(
          "❌ Middleware: Token refresh error:",
          axiosError.response?.status,
          axiosError.response?.data
        );

        // If it's a 401, the refresh token is invalid/expired
        if (axiosError.response?.status === 401) {
          // Clear cookies on invalid refresh token
          const response = NextResponse.redirect(new URL("/SignIn", req.url));
          response.cookies.delete("access_token");
          response.cookies.delete("refresh_token");
          return response;
        }
      }
    } else {
      console.log("❌ Middleware: No refresh token available");
    }
    console.log("🔄 Middleware: Redirecting to login");
    // If refresh failed or no refresh token, redirect to login
    return NextResponse.redirect(new URL("/SignIn", req.url));
  }

  // // If user has access token and is on main page, redirect to dashboard
  if (isMainPage && token && token.trim() !== "") {
    console.log(
      "🔄 Middleware: Authenticated user on main page, redirecting to dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user has access token and tries to access auth pages, redirect to dashboard
  if (isAuthRoute && token && token.trim() !== "") {
    console.log(
      "🔄 Middleware: Authenticated user on auth page, redirecting to dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // // If user has valid token and is accessing protected route, allow access
  // if (isProtected && token && token.trim() !== "") {
  //   console.log(
  //     "✅ Middleware: Authenticated user accessing protected route, allowing access"
  //   );
  //   return NextResponse.next();
  // }

  // Allow access to main page for unauthenticated users
  if (isMainPage && (!token || token.trim() === "")) {
    console.log("✅ Middleware: Allowing unauthenticated access to main page");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/editor",
    "/community",
    "/dashboard/:path*",
    "/editor/:path*",
    "/SignIn/:path*",
    "/SignUp/:path*",
    "/forget-password/:path*",
    "/reset-password/:path*",
    "/community/:path*",
  ],
};
