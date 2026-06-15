// Visual regression tests across different viewport sizes.
// Useful for catching responsive design issues - elements overlapping,
// text overflowing, layout breaking on smaller screens, etc.

const { test, expect, devices } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

// Define a few common viewport sizes to test against
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

test.describe('Responsive visual regression', () => {
  for (const viewport of VIEWPORTS) {
    test(`login page renders correctly on ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(page).toHaveScreenshot(`login-page-${viewport.name}.png`, {
        fullPage: true,
      });
    });
  }
});
