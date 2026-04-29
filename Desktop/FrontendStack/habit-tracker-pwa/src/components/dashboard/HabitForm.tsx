"use client";

import { FormEvent, useState } from "react";
import type { Habit } from "../../types/habit";
import { validateHabitName } from "../../lib/validators";

type HabitFormProps = {
  initialHabit?: Habit | null;
  onCancel: () => void;
  onSave: (data: { name: string; description: string; frequency: "daily" }) => void;
};

export default function HabitForm({
  initialHabit = null,
  onCancel,
  onSave,
}: HabitFormProps) {
  const [name, setName] = useState(initialHabit?.name || "");
  const [description, setDescription] = useState(initialHabit?.description || "");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error || "Invalid habit name");
      return;
    }

    setError("");
    onSave({
      name: result.value,
      description: description.trim(),
      frequency: "daily",
    });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl bg-white p-5 shadow"
    >
      <div>
        <label htmlFor="habit-name" className="block font-medium text-slate-900">
          Habit name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        />
        {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
      </div>

      <div className="mt-4">
        <label htmlFor="habit-description" className="block font-medium text-slate-900">
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          rows={3}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="habit-frequency" className="block font-medium text-slate-900">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          disabled
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="rounded-lg bg-slate-950 px-4 py-3 font-bold text-white"
        >
          Save Habit
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-slate-200 px-4 py-3 font-bold text-slate-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}