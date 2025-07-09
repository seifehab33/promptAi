import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Create a server-side axios instance for middleware
const serverApi = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

// Reusable function to attempt token refresh
async function attemptTokenRefresh(refreshToken: string) {
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
      return {
        success: true,
        cookies: refreshResponse.headers["set-cookie"],
      };
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

    return {
      success: false,
      isUnauthorized: axiosError.response?.status === 401,
    };
  }

  return { success: false, isUnauthorized: false };
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/editor",
    "/community",
    "/editor/:path*",
  ];
  const authRoutes = [
    "/SignIn",
    "/SignUp",
    "/forget-password",
    "/reset-password",
  ];

  const isMainPage = req.nextUrl.pathname === "/";
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(
    (route) =>
      req.nextUrl.pathname === route ||
      req.nextUrl.pathname.startsWith(`${route}/`)
  );

  const hasValidToken = token && token.trim() !== "";
  const hasRefreshToken = refreshToken && refreshToken.trim() !== "";

  // Handle protected routes without valid token
  if (isProtected && !hasValidToken) {
    if (hasRefreshToken) {
      const refreshResult = await attemptTokenRefresh(refreshToken);

      if (refreshResult.success && refreshResult.cookies) {
        const response = NextResponse.next();
        refreshResult.cookies.forEach((cookie) => {
          response.headers.append("set-cookie", cookie);
        });
        return response;
      }

      if (refreshResult.isUnauthorized) {
        const response = NextResponse.redirect(new URL("/SignIn", req.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
    }

    return NextResponse.redirect(new URL("/SignIn", req.url));
  }

  // Handle auth routes with refresh token but no access token
  if (isAuthRoute && !hasValidToken && hasRefreshToken) {
    const refreshResult = await attemptTokenRefresh(refreshToken);

    if (refreshResult.success && refreshResult.cookies) {
      const response = NextResponse.redirect(new URL("/dashboard", req.url));
      refreshResult.cookies.forEach((cookie) => {
        response.headers.append("set-cookie", cookie);
      });
      return response;
    }

    if (refreshResult.isUnauthorized) {
      const response = NextResponse.next();
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // Redirect authenticated users from main page to dashboard
  if (isMainPage && hasValidToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect authenticated users from auth pages to dashboard
  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
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
