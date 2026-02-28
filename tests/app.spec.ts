import { test, expect } from "@playwright/test";

// Seed settings with a test API key so the app shows the main UI
async function seedSettings(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    localStorage.setItem(
      "recover-settings",
      JSON.stringify({
        state: {
          geminiApiKey: "test-key-for-testing",
          openRouterApiKey: "",
          primaryProvider: "gemini",
          geminiModel: "gemini-2.0-flash",
          openRouterModel: "google/gemini-2.0-flash-001",
        },
        version: 0,
      })
    );
    // Clear any active session
    localStorage.removeItem("recover-active-session");
    localStorage.removeItem("recover-history");
  });
}

test.describe("Core UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await seedSettings(page);
    await page.reload();
  });

  test("shows app title in header", async ({ page }) => {
    await expect(page.getByText("recover", { exact: true })).toBeVisible();
  });

  test("shows protocol picker when no active session", async ({ page }) => {
    await expect(page.getByText("What's going on?")).toBeVisible();
    await expect(page.getByText("Just talk to me")).toBeVisible();
  });

  test("shows protocol list grouped by category", async ({ page }) => {
    await expect(page.getByText("Decision Making")).toBeVisible();
    await expect(page.getByText("Overwhelm", { exact: true })).toBeVisible();
    await expect(page.getByText("Motivation", { exact: true })).toBeVisible();
    await expect(page.getByText("Self-Inquiry", { exact: true })).toBeVisible();
  });

  test("shows specific protocols", async ({ page }) => {
    await expect(page.getByText("Decision Waffling")).toBeVisible();
    await expect(page.getByText("Overwhelm Breakdown")).toBeVisible();
    await expect(page.getByText("Gendlin's Focusing")).toBeVisible();
    await expect(page.getByText("Time Horizon / Motivation")).toBeVisible();
  });

  test("has input field for free-form typing", async ({ page }) => {
    const input = page.locator("textarea");
    await expect(input).toBeVisible();
  });

  test("shows starfield background layers", async ({ page }) => {
    // Starfield divs exist in DOM (they have pointer-events: none and aria-hidden)
    const starfield = page.locator(".starfield");
    await expect(starfield).toBeAttached();

    const stars1 = page.locator(".stars-1");
    await expect(stars1).toBeAttached();
  });
});

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await seedSettings(page);
    await page.reload();
  });

  test("opens settings panel via button", async ({ page }) => {
    await page.locator('button[title*="Settings"]').click();
    await expect(page.getByText("AI Configuration")).toBeVisible();
    await expect(page.getByText("Keyboard Shortcuts")).toBeVisible();
  });

  test("opens diagnostic panel via button", async ({ page }) => {
    await page.locator('button[title*="Diagnostic"]').click();
    await expect(page.getByText("Diagnostic Model")).toBeVisible();
    await expect(
      page.getByText("No session data yet")
    ).toBeVisible();
  });

  test("Escape returns from settings to chat", async ({ page }) => {
    await page.locator('button[title*="Settings"]').click();
    await expect(page.getByText("AI Configuration")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("What's going on?")).toBeVisible();
  });

  test("Escape returns from diagnostic to chat", async ({ page }) => {
    await page.locator('button[title*="Diagnostic"]').click();
    await expect(page.getByText("Diagnostic Model")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("What's going on?")).toBeVisible();
  });
});

test.describe("Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await seedSettings(page);
    await page.reload();
  });

  test("shows stats section", async ({ page }) => {
    await page.locator('button[title*="Settings"]').click();
    await expect(page.getByText("Your Data")).toBeVisible();
    await expect(page.getByText("Total Sessions")).toBeVisible();
    await expect(page.getByText("Follow-through Rate")).toBeVisible();
  });

  test("API key input persists across navigation", async ({ page }) => {
    await page.locator('button[title*="Settings"]').click();

    const geminiInput = page.locator('input[placeholder="AIza..."]');
    await geminiInput.fill("AIzaTest123");

    // Navigate away and back
    await page.keyboard.press("Escape");
    await page.locator('button[title*="Settings"]').click();

    await expect(geminiInput).toHaveValue("AIzaTest123");
  });
});

test.describe("No API Key State", () => {
  test("shows API key prompt when no key configured", async ({ page }) => {
    await page.goto("/");
    // Set settings with empty keys
    await page.evaluate(() => {
      localStorage.setItem(
        "recover-settings",
        JSON.stringify({
          state: {
            geminiApiKey: "",
            openRouterApiKey: "",
            primaryProvider: "gemini",
            geminiModel: "gemini-2.0-flash",
            openRouterModel: "google/gemini-2.0-flash-001",
          },
          version: 0,
        })
      );
    });
    await page.reload();

    await expect(page.getByText("Welcome to Recover")).toBeVisible();
  });
});
