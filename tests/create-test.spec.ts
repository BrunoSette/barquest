import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
const TIMEOUT = 60000; // 60 seconds

test.describe("Create Test and Complete Quiz", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  async function login(email: string, password: string) {
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
      timeout: TIMEOUT,
    });
  }

  test("create a new test and complete quiz", async () => {
    console.log(`Test "${test.info().title}" initiated...`);

    await login("brunosette@gmail.com", "12345678");

    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click();
    await expect(page.getByRole("heading", { name: "Test Mode" })).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.locator('#numberOfQuestions').fill('3');
    await expect(page.locator('#numberOfQuestions')).toHaveValue('3');

    await page.getByRole("button", { name: "Create Test" }).click();

    // Answer questions
    const totalQuestions = 3; // Adjust this number
    for (let i = 1; i <= totalQuestions; i++) {
      const options = await page.getByRole("radio").all();
      if (options.length > 0) {
        await options[Math.floor(Math.random() * options.length)].click();
      }

      await page
        .locator('button[role="radio"][data-state="unchecked"]')
        .first()
        .click({ force: true });
      await page
        .getByRole("button", { name: "Submit Answer" })
        .waitFor({ state: "visible" });
      await page.getByRole("button", { name: "Submit Answer" }).click();
      if (i < totalQuestions) {
        await page.getByRole("button", { name: "Next Question" }).click();
        await expect(page.getByText(`Question ${i + 1} of`)).toBeVisible();
      }
    }

    await page.getByRole("button", { name: "Finish" }).click();
    await expect(
      page.getByRole("heading", { name: "Practice Quiz Results" })
    ).toBeVisible();
    console.log(
      `Test "${test.info().title}" successful ✅, closing browser...`
    );
  });
});
