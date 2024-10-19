import { DashboardComponent } from "@/components/dashboard";
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
    console.log(`Test "${test.info().title}" initiated...`);
  });

  test.afterEach(async () => {
    console.log(
      `Test "${test.info().title}" successful ✅, closing browser...`
    );
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

  async function expectElementVisible(
    selector: string,
    options = { timeout: TIMEOUT }
  ) {
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
    console.log("Navigated to 'Create a New Test' section");
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
    console.log("Navigating to other sections and checking elements...");
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
    console.log("Creating a new test test initiated...");
    await login("brunosette@gmail.com", "12345678");

    // Navigate to the "Create a New Test" section from the dashboard
    console.log("Navigating to the 'Create a New Test' section...");
    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click({ timeout: TIMEOUT });
    await expect(page.getByRole("heading", { name: "Test Mode" })).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByRole("button", { name: "Create Test" }).click();

    // Verify initial quiz elements
    console.log("Verifying initial quiz elements...");
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
    console.log("Answering first question...");
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
    console.log("Finishing quiz...");
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

  test("test dashboard data", async () => {
    await login("teste@teste.ca", "12345678");
    const numberOfQuestions = 2;
    console.log("Initializing test dashboard data...");
    console.log("Login successful - test dashboard data");

    // Verify initial dashboard state
    await verifyDashboardState("Dashboard", "Total Questions0");

    // Create a new test
    await createNewTest(numberOfQuestions);

    // Complete the quiz
    await completeQuiz(numberOfQuestions);

    // Verify updated dashboard state
    await verifyDashboardState(
      "Dashboard",
      `Total Questions${numberOfQuestions + 1}`
    );

    // View and verify test details
    await viewAndVerifyTestDetails();

    // Delete the test and verify
    await deleteTestAndVerify();

    await page.close();
  });

  test("check home page and blog links", async () => {
    await page.goto(`${BASE_URL}/`);

    // Check main headings
    const headings = [
      "Your Ultimate Prep Tool for the",
      "BarQuest - Full",
      "BarQuest - Solicitor"
    ];
    for (const heading of headings) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    // Check "Play" button
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();

    // Check and navigate to footer links
    const footerLinks = [
      { name: "Terms of Use", url: "/terms-of-use" },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Contact Us", url: null }
    ];

    for (const link of footerLinks) {
      await expect(page.getByRole("link", { name: link.name })).toBeVisible();
      if (link.url) {
        await page.getByRole("link", { name: link.name }).click();
        await expect(page).toHaveURL(`${BASE_URL}${link.url}`);
        await page.goBack();
      }
    }

    // Check and navigate to blog
    await expect(page.getByRole("link", { name: "Our blog" })).toBeVisible();
    await page.getByRole("link", { name: "Our blog" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/blog`);

    // Check blog post titles and navigation
    const blogPostTitles = [
      "Tips for Studying for the Ontario Bar Exam While Working Full Time",
      "Time Management Tips for the Ontario Bar Exam",
      "Is It Too Late to Study for the Bar Exams?",
      "How to Pass the Ontario Bar Exams",
      "How long to study for the Ontario Bar Exam",
      "How to Pass the Ontario Bar Exam",
      "How to Prepare for Professional Responsibility Questions",
      "Effective Study Strategies for the Ontario Bar Exam",
      "Creating and Using a Comprehensive Exam Index",
      "Breakdown of the Barrister and Solicitor Exams",
    ];

    for (const title of blogPostTitles) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await page.getByRole("heading", { name: title }).click();
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/blog/.*`));
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      console.log(`Verified blog post: ${title}`);
      await page.goBack();
      await expect(page).toHaveURL(`${BASE_URL}/blog`);
    }
  });

  async function verifyDashboardState(
    headingText: string,
    questionsText: string
  ) {
    await expect(page.getByRole("heading", { name: headingText })).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText(questionsText)).toBeVisible();
    console.log(`Dashboard state verified: ${headingText}, ${questionsText}`);
  }

  async function createNewTest(numberOfQuestions: number) {
    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click();
    console.log("Navigated to 'Create a New Test' section");

    await page.locator("#numberOfQuestions").fill(numberOfQuestions.toString());
    await page.getByRole("button", { name: "Create Test" }).click();
    await expect(
      page.getByText(`Question 1 of ${numberOfQuestions}`)
    ).toBeVisible();
  }

  async function completeQuiz(numberOfQuestions: number) {
    for (let i = 1; i <= numberOfQuestions; i++) {
      await page.getByRole("radio").first().click();
      await page.getByRole("button", { name: "Submit Answer" }).click();
      if (i < numberOfQuestions) {
        await page.getByRole("button", { name: "Next Question" }).click();
      }
      console.log(`Answered question ${i}`);
      await page.waitForTimeout(1000);
    }

    await expect(page.getByRole("button", { name: "Finish" })).toBeVisible();
    await page.getByRole("button", { name: "Finish" }).click();
    console.log("Finished quiz");
    await page.goto(`${BASE_URL}/dashboard`);
    console.log("Navigated to dashboard");
  }

  async function viewAndVerifyTestDetails() {
    await page.getByRole("button", { name: "View Test Details" }).click();
    await expect(
      page.getByRole("heading", { name: "Test Details" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Question 1:/ })
    ).toBeVisible();
    console.log("Test details verified");
    await page.getByRole("button", { name: "Close" }).click();
  }

  async function deleteTestAndVerify() {
    const deleteButton = page
      .getByRole("row", { name: /1/ })
      .locator("div")
      .getByRole("button");
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(page.getByLabel("Are you absolutely sure?")).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();
    console.log("Test deleted");

    await page.waitForTimeout(1000);
    await expect(page.getByText("Total Questions3")).not.toBeVisible();
    await expect(page.getByText("Total Questions0")).toBeVisible();

    console.log("Dashboard data updated after deletion");
    console.log("Test dashboard data Passed! ✅");
  }
});
