import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
const TIMEOUT = 30000;

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
    await page.goto(`${BASE_URL}/sign-in`);
    await page.getByPlaceholder("Enter your email").fill(email);
    await page.getByPlaceholder("Enter your password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
      timeout: TIMEOUT,
    });
    console.log("Login successful");
  }

  async function expectElementVisible(
    selector: string,
    options = { timeout: TIMEOUT }
  ) {
    await expect(page.locator(selector)).toBeVisible(options);
  }

  test("should navigate to Home Page and start Sign Up process", async () => {
    await page.goto(BASE_URL);
    await expect(
      page.getByRole("heading", {
        name: "Your Ultimate Prep Tool for the Ontario Bar Exam",
      })
    ).toBeVisible({ timeout: TIMEOUT });
    await page
      .getByRole("button", { name: "Start My 7 Days Free Trial" })
      .first()
      .click();
  });

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
      const selector = element.withinNavigation
        ? `nav >> role=button[name="${element.name}"]`
        : `role=${element.role}[name="${element.name}"]`;
      await expectElementVisible(selector);
    }

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
      const selector = element.label
        ? `label:text("${element.label}")`
        : `role=${element.role}[name="${element.name}"]`;
      await expectElementVisible(selector);
    }

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
      const headingSelector = `role=heading[name="${
        section.expectedHeading || section.expectedHeadings?.[0] || ""
      }"]`;
      await expectElementVisible(headingSelector);

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
    console.log("Starting create a new test and complete quiz test");
    await login("brunosette@gmail.com", "12345678");

    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click({ timeout: TIMEOUT });
    await expect(page.getByRole("heading", { name: "Test Mode" })).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByRole("button", { name: "Create Test" }).click();

    const initialQuizElements = [
      { role: "heading", name: "Practice Quiz" },
      { text: "Question 1 of" },
      { role: "button", name: "Submit Answer" },
      { role: "button", name: "Next Question" },
      { role: "progressbar" },
    ];

    for (const element of initialQuizElements) {
      if (element.text) {
        await expect(page.getByText(element.text)).toBeVisible();
      } else {
        await expect(
          page.getByRole(element.role, { name: element.name })
        ).toBeVisible();
      }
    }

    async function answerQuestion() {
      const options = await page.getByRole("radio").all();
      if (options.length > 0) {
        await options[Math.floor(Math.random() * options.length)].click();
      }
      await page.getByRole("button", { name: "Submit Answer" }).click();
    }

    await answerQuestion();
    await page.getByRole("button", { name: "Next Question" }).click();
    await expect(page.getByText("Question 2 of")).toBeVisible();

    const totalQuestions = 20;
    for (let i = 2; i <= totalQuestions; i++) {
      await answerQuestion();
      if (i < totalQuestions) {
        await page.getByRole("button", { name: "Next Question" }).click();
        await expect(page.getByText(`Question ${i + 1} of`)).toBeVisible();
      }
    }

    await expect(page.getByRole("button", { name: "Finish" })).toBeVisible();
    await page.getByRole("button", { name: "Finish" }).click();

    const resultsPageElements = [
      { role: "heading", name: "Practice Quiz Results" },
      { role: "heading", name: "Your Performance" },
      { role: "heading", name: "Performance Breakdown" },
      { role: "button", name: "Start New Test" },
      { role: "button", name: "View Test Details" },
    ];

    for (const element of resultsPageElements) {
      await expect(
        page.getByRole(element.role, { name: element.name })
      ).toBeVisible();
    }

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
    console.log("Test completed successfully");
  });
});
