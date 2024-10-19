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

    // Complete quiz and verify dashboard update
    await completeQuiz(2);
    await expect(page.getByText("Total Questions3")).toBeVisible();

    // Delete test and verify dashboard
    await deleteTestAndVerify();
  });

  async function completeQuiz(numberOfQuestions: number) {
    for (let i = 1; i <= numberOfQuestions; i++) {
      await page.getByRole("radio").first().click();
      await page.getByRole("button", { name: "Submit Answer" }).click();
      if (i < numberOfQuestions) {
        await page.getByRole("button", { name: "Next Question" }).click();
      }
    }
    await page.getByRole("button", { name: "Finish" }).click();
    await page.goto(`${BASE_URL}/dashboard`);
  }

  async function deleteTestAndVerify() {
    const deleteButton = page
      .getByRole("row", { name: /1/ })
      .locator("div")
      .getByRole("button");
    await deleteButton.click();
    await expect(page.getByLabel("Are you absolutely sure?")).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Total Questions0")).toBeVisible();
    console.log(
      `Test "${test.info().title}" successful ✅, closing browser...`
    );
  }
});
