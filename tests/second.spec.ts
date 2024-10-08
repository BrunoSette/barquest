import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
const TIMEOUT = 60000; // 60 seconds

test.describe("User Journey Tests", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    console.log(`Using base URL: ${BASE_URL}`);
  });

  test.afterEach(async () => {
    await page.close();
  });

  async function login(email: string, password: string) {
    console.log(`Attempting to login with email: ${email}`);
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: "networkidle" });
    console.log("Navigated to sign-in page");

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
      timeout: TIMEOUT,
    });
    console.log("Login successful");
  }

  async function expectElementVisible(selector: string, options = { timeout: TIMEOUT }) {
    await expect(page.locator(selector)).toBeVisible(options);
  }

  test("login and check website links", async () => {
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
        await expectElementVisible(
          `nav >> role=button[name="${element.name}"]`
        );
      } else {
        await expectElementVisible(
          `role=${element.role}[name="${element.name}"]`
        );
      }
    }

    // Navigate to "Create a New Test" section
    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click();

    const createTestElements = [
      { role: "heading", name: "Test Mode" },
      { role: "heading", name: "Subjects" },
      { role: "heading", name: "Max Number of Questions" },
      { role: "button", name: "Create Test" },
      { label: "Tutor" },
      { label: "Timed" },
    ];

    for (const element of createTestElements) {
      if (element.label) {
        await expectElementVisible(`label:text("${element.label}")`);
      } else {
        await expectElementVisible(
          `role=${element.role}[name="${element.name}"]`
        );
      }
    }

    // Navigate to other sections and check elements
    const sections = [
      {
        name: "User Guide",
        expectedHeading: "User Guide and Study Strategies",
      },
      {
        name: "My Subscription",
        expectedHeading: "Subscription",
        expectedButton: "Manage Subscription",
      },
      {
        name: "Settings",
        expectedHeadings: [
          "General Settings",
          "Security Settings",
          "Delete Account",
        ],
        expectedButton: "Save Changes",
      },
    ];

    for (const section of sections) {
      await page.getByRole("button", { name: section.name }).click();
      await expectElementVisible(
        `role=heading[name="${
          section.expectedHeading ||
          (section.expectedHeadings && section.expectedHeadings[0]) ||
          ""
        }"]`
      );
      if (section.expectedButton) {
        await expectElementVisible(
          `role=button[name="${section.expectedButton}"]`
        );
      }
      if (Array.isArray(section.expectedHeadings)) {
        for (const heading of section.expectedHeadings) {
          await expectElementVisible(`role=heading[name="${heading}"]`);
        }
      }
    }
  });

  test("create a new test and complete quiz", async () => {
    await login("brunosette@gmail.com", "12345678");

    // Navigate to the "Create a New Test" section from the dashboard
    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click({ timeout: TIMEOUT });
    await expect(page.getByRole("heading", { name: "Test Mode" })).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByRole("button", { name: "Create Test" }).click();

    // Verify initial quiz elements
    await expect(
      page.getByRole("heading", { name: "Practice Quiz" })
    ).toBeVisible();
    await expect(page.getByText("Question 1 of")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit Answer" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Next Question" })
    ).toBeVisible();
    await expect(page.getByRole("progressbar")).toBeVisible();

    // Answer first question
    const options = await page.getByRole("radio").all();
    if (options.length > 0) {
      await options[Math.floor(Math.random() * options.length)].click();
    }
    await page.getByRole("button", { name: "Submit Answer" }).click();
    await page.getByRole("button", { name: "Next Question" }).click();

    // Verify second question
    await expect(page.getByText("Question 2 of 2")).toBeVisible();

    // Simulate answering remaining questions
    const totalQuestions = 20; // Adjust this number based on your quiz length
    for (let i = 2; i <= totalQuestions; i++) {
      // Click a random answer option
      const options = await page.getByRole("radio").all();
      if (options.length > 0) {
        await options[Math.floor(Math.random() * options.length)].click();
      }

      await page.getByRole("button", { name: "Submit Answer" }).click();

      if (i < totalQuestions) {
        await page.getByRole("button", { name: "Next Question" }).click();
        await expect(page.getByText(`Question ${i + 1} of`)).toBeVisible();
      }
    }

    // Finish quiz
    await expect(page.getByRole("button", { name: "Finish" })).toBeVisible();
    await page.getByRole("button", { name: "Finish" }).click();

    // Verify results page
    const resultsPageHeadings = [
      "Practice Quiz Results",
      "Your Performance",
      "Performance Breakdown",
    ];
    for (const heading of resultsPageHeadings) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    await expect(
      page.getByRole("button", { name: "Start New Test" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "View Test Details" })
    ).toBeVisible();

    await page.getByRole("button", { name: "View Test Details" }).click();
    await expect(
      page.getByRole("heading", { name: "Test Details" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Question 1:/ })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Question 2:/ })
    ).toBeVisible();
  });
});
