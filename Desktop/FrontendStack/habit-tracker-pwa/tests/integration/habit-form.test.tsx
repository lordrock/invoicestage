import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../../src/app/dashboard/page";
import { getTodayDate } from "../../src/lib/dates";

const pushMock = vi.fn();
const replaceMock = vi.fn();

const routerMock = {
  push: pushMock,
  replace: replaceMock,
};

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

function seedSession() {
  localStorage.setItem(
    "habit-tracker-session",
    JSON.stringify({
      userId: "user-1",
      email: "test@example.com",
    })
  );
}

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockClear();
    replaceMock.mockClear();
    seedSession();
  });

  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    await screen.findByTestId("dashboard-page");

    await user.click(screen.getByTestId("create-habit-button"));
    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    await screen.findByTestId("dashboard-page");

    await user.click(screen.getByTestId("create-habit-button"));
    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Drink enough water daily"
    );
    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "Old description",
          frequency: "daily",
          createdAt: "2026-04-28T00:00:00.000Z",
          completions: ["2026-04-28"],
        },
      ])
    );

    render(<DashboardPage />);

    await screen.findByTestId("habit-card-drink-water");

    await user.click(screen.getByTestId("habit-edit-drink-water"));

    const nameInput = screen.getByTestId("habit-name-input");
    const descriptionInput = screen.getByTestId("habit-description-input");

    await user.clear(nameInput);
    await user.type(nameInput, "Read Books");

    await user.clear(descriptionInput);
    await user.type(descriptionInput, "New description");

    await user.click(screen.getByTestId("habit-save-button"));

    const habits = JSON.parse(localStorage.getItem("habit-tracker-habits") || "[]");

    expect(screen.getByTestId("habit-card-read-books")).toBeInTheDocument();
    expect(habits[0]).toMatchObject({
      id: "habit-1",
      userId: "user-1",
      createdAt: "2026-04-28T00:00:00.000Z",
      completions: ["2026-04-28"],
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-04-28T00:00:00.000Z",
          completions: [],
        },
      ])
    );

    render(<DashboardPage />);

    await screen.findByTestId("habit-card-drink-water");

    await user.click(screen.getByTestId("habit-delete-drink-water"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-delete-button"));

    expect(screen.queryByTestId("habit-card-drink-water")).not.toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-04-28T00:00:00.000Z",
          completions: [],
        },
      ])
    );

    render(<DashboardPage />);

    await screen.findByTestId("habit-card-drink-water");

    const streak = screen.getByTestId("habit-streak-drink-water");

    expect(streak).toHaveTextContent("Current streak: 0");

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    expect(streak).toHaveTextContent("Current streak: 1");

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    expect(streak).toHaveTextContent("Current streak: 0");
  });
});