import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrCreateSessionId() {
  const key = "session-id";
  let sessionId = localStorage.getItem(key);

  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(key, sessionId || "");
  }

  return sessionId;
}
export function formatDate(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0 || diffDays === 1) {
    return "Today";
  }
  return `${diffDays} days ago`;
}
// Client-side function (for Client Components)
export function GetUserNameFromCookieClient() {
  if (typeof window === "undefined") {
    return null; // Not in browser
  }

  try {
    const cookies = document.cookie.split(";");
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token=")
    );

    if (!accessTokenCookie) {
      return null;
    }

    const token = accessTokenCookie.split("=")[1];
    if (!token) {
      return null;
    }

    // Decode JWT token (client-side, no verification)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT token format");
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if necessary
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const decoded = JSON.parse(jsonPayload) as { name: string };

    // Validate that name exists
    if (!decoded.name) {
      console.error("JWT token does not contain name field");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
