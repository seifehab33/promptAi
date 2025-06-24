"use client";

import { useEffect } from "react";
import { startAutoRefresh, stopAutoRefresh } from "@/api/axios";

interface AutoRefreshProviderProps {
  children: React.ReactNode;
}

export default function AutoRefreshProvider({
  children,
}: AutoRefreshProviderProps) {
  useEffect(() => {
    // Check if user has access token (indicating they're logged in)
    const checkAndStartAutoRefresh = () => {
      // Get all cookies
      const cookies = document.cookie.split(";");
      const accessToken = cookies.find((cookie) =>
        cookie.trim().startsWith("access_token=")
      );

      if (accessToken) {
        console.log(
          "🔍 AutoRefreshProvider: User has access token, starting auto-refresh"
        );
        startAutoRefresh();
      } else {
        console.log(
          "🔍 AutoRefreshProvider: No access token found, not starting auto-refresh"
        );
        stopAutoRefresh();
      }
    };

    // Check on mount
    checkAndStartAutoRefresh();

    // Listen for storage events (in case tokens are updated in another tab)
    const handleStorageChange = () => {
      checkAndStartAutoRefresh();
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      stopAutoRefresh();
    };
  }, []);

  return <>{children}</>;
}
