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
