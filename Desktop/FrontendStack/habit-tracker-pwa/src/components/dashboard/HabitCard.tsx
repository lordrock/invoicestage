"use client";

import type { Habit } from "../../types/habit";
import { getHabitSlug } from "../../lib/slug";
import { calculateCurrentStreak } from "../../lib/streaks";

type HabitCardProps = {
  habit: Habit;
  today: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitCard({
  habit,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl border p-5 shadow ${
        isCompletedToday
          ? "border-green-200 bg-green-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">{habit.name}</h2>
          {habit.description ? (
            <p className="mt-1 text-slate-600">{habit.description}</p>
          ) : null}

          <p
            data-testid={`habit-streak-${slug}`}
            className="mt-3 font-bold text-slate-800"
          >
            Current streak: {streak}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            data-testid={`habit-complete-${slug}`}
            type="button"
            onClick={() => onToggleComplete(habit)}
            className={`rounded-lg px-3 py-2 font-bold ${
              isCompletedToday
                ? "bg-green-700 text-white"
                : "bg-slate-950 text-white"
            }`}
          >
            {isCompletedToday ? "Completed" : "Complete today"}
          </button>

          <button
            data-testid={`habit-edit-${slug}`}
            type="button"
            onClick={() => onEdit(habit)}
            className="rounded-lg bg-slate-200 px-3 py-2 font-bold text-slate-900"
          >
            Edit
          </button>

          <button
            data-testid={`habit-delete-${slug}`}
            type="button"
            onClick={() => onDelete(habit)}
            className="rounded-lg bg-red-600 px-3 py-2 font-bold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}