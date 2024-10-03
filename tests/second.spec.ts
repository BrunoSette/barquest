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
    await page
      .getByRole("button", { name: "Start My 7 Days Free Trial" })
      .first()
      .click();
  });

  test("login and check website links", async ({ page }) => {
    // Start tracing before test execution

    await page.goto("http://localhost:3000/sign-in");

    // Fill in login credentials
    await page
      .getByPlaceholder("Enter your email")
      .fill("bruno.sette@gmail.com");
    await page.getByPlaceholder("Enter your password").fill("12345678");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Check visibility of elements after login
    await expect(
      page.getByRole("heading", { name: "Bar Exam Practice Dashboard" })
    ).toBeVisible({ timeout: 20000 });

    await expect(page.getByRole("link", { name: "BarQuest" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("button", { name: "Dashboard" })).toBeVisible({
      timeout: 10000,
    });

    await expect(
      page
        .getByRole("navigation")
        .getByRole("button", { name: "Create a New Test" })
    ).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole("button", { name: "User Guide" })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole("button", { name: "My Subscription" })
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "Settings" })).toBeVisible({
      timeout: 10000,
    });

    // Navigate to "Create a New Test" section
    await page
      .getByRole("main")
      .getByRole("button", { name: "Create a New Test" })
      .click();
    await expect(page.getByRole("heading", { name: "Test Mode" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("heading", { name: "Subjects" })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole("heading", { name: "Max Number of Questions" })
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "Create Test" })).toBeVisible(
      {
        timeout: 10000,
      }
    );
    await expect(page.getByLabel("Tutor")).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel("Timed")).toBeVisible({ timeout: 10000 });

    // Navigate to User Guide and other sections
    await page.getByRole("button", { name: "User Guide" }).click();
    await expect(
      page.getByRole("heading", { name: "User Guide and Study" })
    ).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "My Subscription" }).click();
    await expect(
      page.getByRole("heading", { name: "Subscription" })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: "Manage Subscription" })
    ).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Settings" }).click();
    await expect(
      page.getByRole("heading", { name: "General Settings" })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: "Save Changes" })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Security Settings" })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Delete Account" })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should fill in Payment details and delete account", async ({
    page,
  }) => {
    // Add event listener for Stripe responses
    page.on("response", async (response) => {
      if (response.url().includes("stripe.com") && !response.ok()) {
        console.log(`Stripe request failed with status: ${response.status()}`);
        console.log(`Response body: ${await response.text()}`);
      }
    });

    await page.goto("http://localhost:3000/");
    await page
      .getByRole("button", { name: "Start My 7 Days Free Trial" })
      .first()
      .click();
    await page.getByPlaceholder("Enter your email").fill("test@gmail.com");
    await page.getByPlaceholder("Enter your password").fill("12345678");
    await page.getByRole("button", { name: "Sign up" }).click();
    await page.waitForTimeout(3000); // Wait for 3 seconds to ensure the error message appears

    if (
      await page
        .getByText("Failed to create user. Please try again.")
        .isVisible()
    ) {
      console.log("Error message detected, navigating to login page.");
      // Navigate to the login page and log in
      await page.goto("http://localhost:3000/sign-in");
      await page.getByPlaceholder("Enter your email").fill("test@gmail.com");
      await page.getByPlaceholder("Enter your password").fill("12345678");
      await page.getByRole("button", { name: "Sign in" }).click();
    } else {
      console.log(
        "No error message detected, continuing with sign-up process."
      );
      // Continue with the sign-up process
      await page.waitForSelector("text=Enter payment details", {
        timeout: 20000,
      });
      await page.getByPlaceholder("1234 1234 1234").fill("4242 4242 4242 4242");
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
    }

    // Wait for a redirection to the dashboard
    await page.waitForURL("http://localhost:3000/dashboard", {
      timeout: 25000,
    });
    await expect(
      page.getByRole("heading", { name: "Bar Exam Practice Dashboard" })
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole("main").getByRole("button", { name: "Create a New Test" })
    ).toBeVisible({ timeout: 15000 });

    // Proceed to delete the account
    await page.goto("http://localhost:3000/sign-in");
    await page.getByPlaceholder("Enter your email").fill("test@gmail.com");
    await page.getByPlaceholder("Enter your email").press("Tab");
    await page.getByPlaceholder("Enter your password").fill("12345678");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Check if login was successful
    const loginError = page.locator("text=Invalid email or password.");
    if (await loginError.isVisible()) {
      console.log("Login failed, navigating to sign-up page.");
      // Navigate to the sign-up page and sign up
      await page.goto("http://localhost:3000/sign-up");
      await page.getByPlaceholder("Enter your email").fill("test@gmail.com");
      await page.getByPlaceholder("Enter your password").fill("12345678");
      await page.getByRole("button", { name: "Sign up" }).click();

      // Continue with the sign-up process
      // Wait for a redirection to the dashboard
      await page.waitForURL("http://localhost:3000/dashboard");
      await expect(
        page.getByRole("heading", { name: "Bar Exam Practice Dashboard" })
      ).toBeVisible({ timeout: 25000 });
      await expect(
        page
          .getByRole("main")
          .getByRole("button", { name: "Create a New Test" })
      ).toBeVisible({ timeout: 25000 });
    }

    // Proceed to delete the account
    await page.waitForURL("http://localhost:3000/dashboard");
    await page.getByRole("button", { name: "Settings" }).click();
    await page.getByLabel("Confirm Password").click();
    await page.getByLabel("Confirm Password").fill("12345678");
    await page.getByRole("button", { name: "Delete Account" }).click();
    await expect(
      page.getByRole("heading", { name: "Sign in to your account" })
    ).toBeVisible({ timeout: 15000 });
  });
});
