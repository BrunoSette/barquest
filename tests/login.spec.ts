import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
const TIMEOUT = 60000; // 60 seconds

test.describe("Login Tests", () => {
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

  test("login and check website links", async () => {
    console.log(`Test "${test.info().title}" initiated...`);
    await login("bruno.sette@gmail.com", "12345678");

    const elementsToCheck = [
      { role: "link", name: "BarQuest" },
      { role: "button", name: "Dashboard" },
      { role: "button", name: "Create a New Test", withinNavigation: true },
      { role: "button", name: "User Guide" },
      { role: "button", name: "My Subscription" },
      { role: "button", name: "Settings" },
    ];

    for (const element of elementsToCheck) {
      if (element.withinNavigation) {
        await expect(
          page.locator(`nav >> role=button[name="${element.name}"]`)
        ).toBeVisible();
      } else {
        await expect(
          page.locator(`role=${element.role}[name="${element.name}"]`)
        ).toBeVisible();
      }
    }
    console.log(
      `Test "${test.info().title}" successful ✅, closing browser...`
    );
  });
});
