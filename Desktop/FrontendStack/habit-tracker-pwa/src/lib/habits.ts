import type { Habit } from "../types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completionSet = new Set(habit.completions);

  if (completionSet.has(date)) {
    completionSet.delete(date);
  } else {
    completionSet.add(date);
  }

  return {
    ...habit,
    completions: Array.from(completionSet).sort(),
  };
}