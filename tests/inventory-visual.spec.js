// Visual regression tests for the inventory (products) page.
// Demonstrates masking dynamic content and comparing across viewports.

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { USERS } = require('../utils/testData');

test.describe('Inventory page - visual regression', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('inventory page matches baseline screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('inventory-page.png', {
      fullPage: true,
    });
  });

  test('inventory page matches baseline while masking the cart badge', async ({ page }) => {
    // The shopping cart badge shows a count that can change between runs
    // (e.g. if a previous test left items in the cart). We "mask" it so
    // visual comparisons ignore that area - it gets covered with a solid
    // box in both the baseline and the new screenshot.
    await expect(page).toHaveScreenshot('inventory-page-masked.png', {
      fullPage: true,
      mask: [page.locator('.shopping_cart_badge')],
    });
  });

  test('product sort dropdown matches baseline screenshot', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await expect(sortDropdown).toHaveScreenshot('sort-dropdown.png');
  });
});

test.describe('Visual bugs - catching CSS issues with visual regression', () => {
  test('visual_user inventory page differs from standard baseline', async ({ page }) => {
    // SauceDemo's "visual_user" intentionally has broken CSS/images.
    // This test demonstrates how visual regression catches UI issues
    // that functional tests (checking text, clicking buttons) would miss
    // entirely, since the page still "works" functionally.
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.visualGlitch.username, USERS.visualGlitch.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // This will have its OWN baseline (separate from the standard user's),
    // so it passes on repeat runs - but if you compare this baseline image
    // to inventory-page.png, you'll visually see the layout differences,
    // e.g. misaligned "Add to cart" buttons.
    await expect(page).toHaveScreenshot('inventory-page-visual-user.png', {
      fullPage: true,
    });
  });
});
