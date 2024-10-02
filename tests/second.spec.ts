import { test, expect } from "@playwright/test";

test.describe("User Journey Tests", () => {
  test("should navigate to Home Page and start Sign Up process", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await expect(
      page.getByRole("heading", {
        name: "Your Ultimate Prep Tool for the Ontario Bar Exam",
      })
    ).toBeVisible();
    await page.getByRole("button", { name: "Get Started" }).first().click();
  });

  test("should fill in Payment details", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: "Get Started" }).first().click();
    await page.getByPlaceholder("Enter your email").fill("test@gmail.com");
    await page.getByPlaceholder("Enter your password").fill("12345678");
    await page.getByRole("button", { name: "Sign up" }).click();
    await page.getByLabel("Email").click();
    await expect(
      page.getByText("Enter payment details", { exact: true })
    ).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder("1234 1234 1234").fill("4242 4242 4242 42424");
    await page.getByPlaceholder("1234 1234 1234").press("Tab");
    await page.getByPlaceholder("MM / YY").fill("09 / 29");
    await page.getByPlaceholder("MM / YY").press("Tab");
    await page.getByPlaceholder("CVC").fill("454");
    await page.getByPlaceholder("CVC").press("Tab");
    await page.getByPlaceholder("Full name on card").fill("teste ");
    await page.getByPlaceholder("Full name on card").press("Tab");
    await page.getByLabel("Country or region").selectOption("KH");
    await page.getByLabel("Country or region").selectOption("CA");
    await page.locator("body").press("Tab");
    await page.getByPlaceholder("Postal code").click();
    await page.getByPlaceholder("Postal code").fill("M2P 2P2");
    await page.getByPlaceholder("Postal code").press("Tab");
    await page.getByTestId("hosted-payment-submit-button").click();
    await page.getByLabel("Email").fill("test@gmail.com");
    await page.getByTestId("hosted-payment-submit-button").click();
    //wait for a redirection to the dashboard
    await page.waitForURL("http://localhost:3000/dashboard");
    await expect(
      page.getByRole("heading", { name: "Bar Exam Practice Dashboard" })
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole("main").getByRole("button", { name: "Create a New Test" })
    ).toBeVisible();
  });

  test("should delete account", async ({ page }) => {
    await page.goto("http://localhost:3000/sign-in");
    await page.getByPlaceholder("Enter your email").fill("test@gmail.com");
    await page.getByPlaceholder("Enter your email").press("Tab");
    await page.getByPlaceholder("Enter your password").fill("12345678");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByRole("button", { name: "Settings" }).click();
    await page.getByLabel("Confirm Password").click();
    await page.getByLabel("Confirm Password").fill("12345678");
    await page.getByRole("button", { name: "Delete Account" }).click();
    await expect(
      page.getByRole("heading", { name: "Sign in to your account" })
    ).toBeVisible();
  });
});
