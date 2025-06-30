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
