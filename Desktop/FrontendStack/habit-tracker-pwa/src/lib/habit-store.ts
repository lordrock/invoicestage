import type { Habit } from "../types/habit";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

export function getHabits(): Habit[] {
  return readStorage<Habit[]>(STORAGE_KEYS.habits, []);
}

export function saveHabits(habits: Habit[]): void {
  writeStorage(STORAGE_KEYS.habits, habits);
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((habit) => habit.userId === userId);
}