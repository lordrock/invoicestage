export const STORAGE_KEYS = {
  users: "habit-tracker-users",
  session: "habit-tracker-session",
  habits: "habit-tracker-habits",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const value = localStorage.getItem(key);

  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(value));
}