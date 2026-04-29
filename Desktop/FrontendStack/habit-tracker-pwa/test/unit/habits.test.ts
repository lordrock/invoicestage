import { describe, expect, it } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import type { Habit } from "../../src/types/habit";

const baseHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "Drink enough water daily",
  frequency: "daily",
  createdAt: "2026-04-28T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const updatedHabit = toggleHabitCompletion(baseHabit, "2026-04-28");

    expect(updatedHabit.completions).toContain("2026-04-28");
  });

  it("removes a completion date when the date already exists", () => {
    const habit = {
      ...baseHabit,
      completions: ["2026-04-28"],
    };

    const updatedHabit = toggleHabitCompletion(habit, "2026-04-28");

    expect(updatedHabit.completions).not.toContain("2026-04-28");
  });

  it("does not mutate the original habit object", () => {
    const habit = {
      ...baseHabit,
      completions: ["2026-04-27"],
    };

    const updatedHabit = toggleHabitCompletion(habit, "2026-04-28");

    expect(habit.completions).toEqual(["2026-04-27"]);
    expect(updatedHabit.completions).toEqual(["2026-04-27", "2026-04-28"]);
  });

  it("does not return duplicate completion dates", () => {
    const habit = {
      ...baseHabit,
      completions: ["2026-04-28", "2026-04-28"],
    };

    const updatedHabit = toggleHabitCompletion(habit, "2026-04-27");

    expect(updatedHabit.completions).toEqual(["2026-04-27", "2026-04-28"]);
  });
});