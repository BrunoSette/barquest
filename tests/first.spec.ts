import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("localhost:3000");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/BarQuest - Your Ultimate Prep Tool/);
});

test("sign up and navigate through the application", async ({ page }) => {
  await page.goto("localhost:3000");

  // Click the get started link.
  await page.getByRole("link", { name: "Sign Up" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Create your account" })
  ).toBeVisible();

  // Fill in the sign-up form
  await page.getByPlaceholder("Enter your email").click();
  await page
    .getByPlaceholder("Enter your email")
    .fill("brunoseee@gmail.com);
    await page.getByPlaceholder("Enter your email").press("Tab");

test("sign up and navigate through the application", async ({ page }) => {
  await page.goto("localhost:3000");

  // Click the get started link.
  await page.getByRole("link", { name: "Sign Up" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Create your account" })
  ).toBeVisible();

  // Fill in the sign-up form
  await page.getByPlaceholder("Enter your email").click();
  await page
    .getByPlaceholder("Enter your email")
    .fill("testeplaywrite@teste.com");
  await page.getByPlaceholder("Enter your email").press("Tab");
  await page.getByPlaceholder("Enter your password").fill("12345678");
  await page.getByRole("button", { name: "Sign up" }).click();

  // Navigate through the application
  await page.getByRole("button", { name: "User Guide" }).click();
  await page.getByRole("button", { name: "My Subscription" }).click();
  await page.getByRole("button", { name: "Dashboard" }).click();
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Dashboard" }).click();

  // Create a new test
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Create a New Test" })
    .click();
  await page.getByLabel("All Questions").check();
  await page.getByLabel("Only My Mistakes").check();
  await page.getByLabel("Only Unused Questions").check();
  await page.locator("div").filter({ hasText: "Create Test" }).nth(4).click();
  await page.getByRole("heading", { name: "Create a New Test" }).click();
});
