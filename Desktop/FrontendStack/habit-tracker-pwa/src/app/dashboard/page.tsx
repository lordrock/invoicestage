"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "../../types/auth";
import type { Habit } from "../../types/habit";
import { getSession, logout } from "../../lib/auth";
import { getHabits, saveHabits } from "../../lib/habit-store";
import { toggleHabitCompletion } from "../../lib/habits";
import { getTodayDate } from "../../lib/dates";
import HabitForm from "../../components/dashboard/HabitForm";
import HabitCard from "../../components/dashboard/HabitCard";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [pendingDeleteHabit, setPendingDeleteHabit] = useState<Habit | null>(null);

  const today = getTodayDate();

  useEffect(() => {
    const activeSession = getSession();

    if (!activeSession) {
      router.replace("/login");
      return;
    }

    const allHabits = getHabits();
    const userHabits = allHabits.filter((habit) => habit.userId === activeSession.userId);

    setSession(activeSession);
    setHabits(userHabits);
    setChecking(false);
  }, [router]);

  function persistUserHabits(nextUserHabits: Habit[]) {
  if (!session) return;

  const allHabits = getHabits();
  const otherUsersHabits = allHabits.filter(
    (habit) => habit.userId !== session.userId
  );

  const nextAllHabits = [...otherUsersHabits, ...nextUserHabits];

  saveHabits(nextAllHabits);
  setHabits(nextUserHabits);
}

  function handleCreateHabit(data: {
  name: string;
  description: string;
  frequency: "daily";
}) {
  if (!session) return;

  const newHabit: Habit = {
    id: crypto.randomUUID(),
    userId: session.userId,
    name: data.name,
    description: data.description,
    frequency: "daily",
    createdAt: new Date().toISOString(),
    completions: [],
  };

  persistUserHabits([...habits, newHabit]);
  setShowForm(false);
}

  function handleUpdateHabit(data: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    if (!editingHabit) return;

    const updatedHabits: Habit[] = habits.map((habit) =>
      habit.id === editingHabit.id
        ? {
            ...habit,
            name: data.name,
            description: data.description,
            frequency: data.frequency as "daily",
          }
        : habit
    );

    persistUserHabits(updatedHabits);
    setEditingHabit(null);
  }

  function handleToggleComplete(habit: Habit) {
    const updatedHabit = toggleHabitCompletion(habit, today);
    const updatedHabits = habits.map((item) =>
      item.id === habit.id ? updatedHabit : item
    );

    persistUserHabits(updatedHabits);
  }

  function handleConfirmDelete() {
    if (!pendingDeleteHabit) return;

    const updatedHabits = habits.filter((habit) => habit.id !== pendingDeleteHabit.id);
    persistUserHabits(updatedHabits);
    setPendingDeleteHabit(null);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (checking) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100">
        <p className="font-bold text-slate-700">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main data-testid="dashboard-page" className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-3xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Habit Tracker</h1>
            <p className="mt-1 text-slate-600">Signed in as {session?.email}</p>
          </div>

          <button
            data-testid="auth-logout-button"
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-slate-950 px-4 py-2 font-bold text-white"
          >
            Logout
          </button>
        </header>

        <div className="mt-8">
          <button
            data-testid="create-habit-button"
            type="button"
            onClick={() => {
              setShowForm(true);
              setEditingHabit(null);
            }}
            className="rounded-lg bg-blue-700 px-4 py-3 font-bold text-white"
          >
            Create Habit
          </button>
        </div>

        {showForm ? (
          <HabitForm
            onCancel={() => setShowForm(false)}
            onSave={handleCreateHabit}
          />
        ) : null}

        {editingHabit ? (
          <HabitForm
            initialHabit={editingHabit}
            onCancel={() => setEditingHabit(null)}
            onSave={handleUpdateHabit}
          />
        ) : null}

        <section className="mt-8 space-y-4">
          {habits.length === 0 ? (
            <div
              data-testid="empty-state"
              className="rounded-2xl bg-white p-8 text-center shadow"
            >
              <h2 className="text-xl font-bold text-slate-950">No habits yet</h2>
              <p className="mt-2 text-slate-600">
                Create your first habit to start building a streak.
              </p>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onToggleComplete={handleToggleComplete}
                onEdit={(selectedHabit) => {
                  setEditingHabit(selectedHabit);
                  setShowForm(false);
                }}
                onDelete={setPendingDeleteHabit}
              />
            ))
          )}
        </section>
      </section>

      {pendingDeleteHabit ? (
        <div className="fixed inset-0 grid place-items-center bg-black/50 px-4">
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow"
          >
            <h2 className="text-xl font-bold text-slate-950">Delete habit?</h2>
            <p className="mt-2 text-slate-600">
              Are you sure you want to delete {pendingDeleteHabit.name}? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteHabit(null)}
                className="rounded-lg bg-slate-200 px-4 py-2 font-bold text-slate-900"
              >
                Cancel
              </button>

              <button
                data-testid="confirm-delete-button"
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}