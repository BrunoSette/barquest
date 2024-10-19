import { test, expect } from "@playwright/test";

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

test.describe("Home Page and Blog Links Tests", () => {
  test("check home page and blog links", async ({ page }) => {
    console.log(`Test "${test.info().title}" initiated...`);
    await page.goto(`${BASE_URL}/`);

    // Check main headings
    const headings = [
      "Your Ultimate Prep Tool for the",
      "BarQuest - Full",
      "BarQuest - Solicitor",
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
      { name: "Contact Us", url: null },
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
    ];

    for (const title of blogPostTitles) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await page.getByRole("heading", { name: title }).click();
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/blog/.*`));
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await page.goBack();
    }
    console.log(
      `Test "${test.info().title}" successful ✅, closing browser...`
    );
  });
});
