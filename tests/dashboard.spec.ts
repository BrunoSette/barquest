import { test, expect, Page } from "@playwright/test";

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
const TIMEOUT = 60000; // 60 seconds

test.describe("Dashboard Data Tests", () => {
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

  test("test dashboard data", async () => {
    console.log(`Test "${test.info().title}" initiated...`);

    await login("teste@teste.ca", "12345678");

    // Verify initial dashboard state
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText("Total Questions0")).toBeVisible();

    // Create a new test
    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click();
    await page.locator("#numberOfQuestions").fill("2");
    await page.getByRole("button", { name: "Create Test" }).click();

    // Answer questions
    const totalQuestions = 2; // Adjust this number
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

    // Complete quiz and verify dashboard update
    await page.goto(`${BASE_URL}/dashboard`);

    await deleteTestAndVerify();
    await expect(page.getByText("Total Questions3")).toBeVisible();

    // Delete test and verify dashboard
    await deleteTestAndVerify();
  });

  async function deleteTestAndVerify() {
    const deleteButton = page
      .locator('button[aria-haspopup="dialog"]')
      .filter({ has: page.locator("svg.lucide-trash2") });
    await deleteButton.click();
    await page
      .getByLabel("Are you absolutely sure?")
      .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Total Questions0")).toBeVisible();
    console.log(
      `Test "${test.info().title}" successful ✅, closing browser...`
    );
  }
});
