// Visual regression testing with Playwright.
//
// HOW IT WORKS:
// The first time you run these tests, Playwright takes a screenshot and
// saves it as the "baseline" (golden) image in a `*-snapshots` folder next
// to the test file. On every later run, it takes a new screenshot and
// compares it pixel-by-pixel against the baseline. If they differ by more
// than the allowed threshold (set in playwright.config.js), the test fails
// and Playwright generates a diff image showing exactly what changed.
//
// To (re)generate baselines, run:
//   npx playwright test --update-snapshots

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login page - visual regression', () => {
  test('login page matches baseline screenshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Full-page screenshot comparison
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
    });
  });

  test('login form matches baseline screenshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Element-level screenshot - useful when you only care about
    // one component, not the whole page (less likely to break from
    // unrelated layout changes elsewhere on the page)
    const loginForm = page.locator('.login_wrapper');
    await expect(loginForm).toHaveScreenshot('login-form.png');
  });

  test('login page shows an error state matching baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Trigger the error state by submitting without credentials
    await loginPage.loginButton.click();

    await expect(page).toHaveScreenshot('login-page-error.png', {
      fullPage: true,
    });
  });
});
