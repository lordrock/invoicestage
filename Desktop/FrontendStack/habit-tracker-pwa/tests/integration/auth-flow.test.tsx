import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "../../src/components/auth/SignupForm";
import LoginForm from "../../src/components/auth/LoginForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockClear();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(screen.getByTestId("auth-signup-email"), "test@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") || "null"
    );

    expect(session).toMatchObject({
      email: "test@example.com",
    });
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(screen.getByTestId("auth-signup-email"), "test@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    pushMock.mockClear();

    await user.clear(screen.getByTestId("auth-signup-email"));
    await user.clear(screen.getByTestId("auth-signup-password"));

    await user.type(screen.getByTestId("auth-signup-email"), "test@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText("User already exists")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([
        {
          id: "user-1",
          email: "login@example.com",
          password: "password123",
          createdAt: "2026-04-28T00:00:00.000Z",
        },
      ])
    );

    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "login@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") || "null"
    );

    expect(session).toEqual({
      userId: "user-1",
      email: "login@example.com",
    });
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "wrong@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrongpass");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});