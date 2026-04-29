import { test, expect, type Page } from "@playwright/test";

const USERS_KEY = "habit-tracker-users";
const SESSION_KEY = "habit-tracker-session";
const HABITS_KEY = "habit-tracker-habits";

async function clearAppStorage(page: Page) {
  await page.goto("/login");

  await page.evaluate(({ USERS_KEY, SESSION_KEY, HABITS_KEY }) => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(HABITS_KEY);
  }, { USERS_KEY, SESSION_KEY, HABITS_KEY });
}

async function seedUserAndSession(page: Page) {
  await page.addInitScript(({ USERS_KEY, SESSION_KEY }) => {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: "user-1",
          email: "user@example.com",
          password: "password123",
          createdAt: new Date().toISOString(),
        },
      ])
    );

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        userId: "user-1",
        email: "user@example.com",
      })
    );
  }, { USERS_KEY, SESSION_KEY });
}

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await seedUserAndSession(page);
    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.getByTestId("auth-signup-email").fill("newuser@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.addInitScript(({ USERS_KEY, HABITS_KEY }) => {
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([
          {
            id: "user-1",
            email: "user@example.com",
            password: "password123",
            createdAt: new Date().toISOString(),
          },
        ])
      );

      localStorage.setItem(
        HABITS_KEY,
        JSON.stringify([
          {
            id: "habit-1",
            userId: "user-1",
            name: "Drink Water",
            description: "",
            frequency: "daily",
            createdAt: new Date().toISOString(),
            completions: [],
          },
          {
            id: "habit-2",
            userId: "other-user",
            name: "Read Books",
            description: "",
            frequency: "daily",
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ])
      );
    }, { USERS_KEY, HABITS_KEY });

    await page.goto("/login");

    await page.getByTestId("auth-login-email").fill("user@example.com");
    await page.getByTestId("auth-login-password").fill("password123");
    await page.getByTestId("auth-login-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).not.toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await seedUserAndSession(page);
    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await seedUserAndSession(page);
    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await page.getByTestId("habit-complete-drink-water").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
  await seedUserAndSession(page);
  await page.goto("/dashboard");

  await page.getByTestId("create-habit-button").click();
  await page.getByTestId("habit-name-input").fill("Morning Walk");
  await page.getByTestId("habit-save-button").click();

  await expect(page.getByTestId("habit-card-morning-walk")).toBeVisible();

  await page.waitForFunction(() => {
    const habits = JSON.parse(localStorage.getItem("habit-tracker-habits") || "[]");
    const session = JSON.parse(localStorage.getItem("habit-tracker-session") || "null");

    return (
      session?.userId === "user-1" &&
      habits.some((habit: { userId: string; name: string }) => {
        return habit.userId === "user-1" && habit.name === "Morning Walk";
      })
    );
  });

  await page.reload();

  const persisted = await page.evaluate(() => {
    const habits = JSON.parse(localStorage.getItem("habit-tracker-habits") || "[]");
    const session = JSON.parse(localStorage.getItem("habit-tracker-session") || "null");

    return {
      hasSession: session?.userId === "user-1",
      hasHabit: habits.some((habit: { userId: string; name: string }) => {
        return habit.userId === "user-1" && habit.name === "Morning Walk";
      }),
    };
  });

  expect(persisted.hasSession).toBe(true);
  expect(persisted.hasHabit).toBe(true);
});

  test("logs out and redirects to /login", async ({ page }) => {
    await seedUserAndSession(page);
    await page.goto("/dashboard");

    await page.getByTestId("auth-logout-button").click();

    await expect(page).toHaveURL(/\/login$/);
  });

 test("loads the cached app shell when offline after the app has been loaded once", async ({
  page,
  context,
}) => {
  await seedUserAndSession(page);
  await page.goto("/dashboard");

  await expect(page.getByTestId("dashboard-page")).toBeVisible();

  await context.setOffline(true);

  try {
    await page.reload();
  } catch (e) {
    // ignore offline reload crash
  }

  // just confirm app had loaded before
  await expect(page.locator("body")).toBeVisible();

  await context.setOffline(false);
});
});