import type { Session, User } from "../types/auth";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

export function getUsers(): User[] {
  return readStorage<User[]>(STORAGE_KEYS.users, []);
}

export function saveUsers(users: User[]): void {
  writeStorage(STORAGE_KEYS.users, users);
}

export function getSession(): Session | null {
  return readStorage<Session | null>(STORAGE_KEYS.session, null);
}

export function saveSession(session: Session): void {
  writeStorage(STORAGE_KEYS.session, session);
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function signup(email: string, password: string): {
  ok: boolean;
  error: string | null;
  session: Session | null;
} {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    return { ok: false, error: "User already exists", session: null };
  }

  const user: User = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  saveUsers([...users, user]);
  saveSession(session);

  return { ok: true, error: null, session };
}

export function login(email: string, password: string): {
  ok: boolean;
  error: string | null;
  session: Session | null;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find(
    (item) => item.email === normalizedEmail && item.password === password
  );

  if (!user) {
    return { ok: false, error: "Invalid email or password", session: null };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  saveSession(session);

  return { ok: true, error: null, session };
}

export function logout(): void {
  clearSession();
}