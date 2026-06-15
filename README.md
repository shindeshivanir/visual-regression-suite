# Visual Regression Test Suite

A Playwright + JavaScript test suite that demonstrates **visual regression testing** — catching unintended UI changes by comparing screenshots against approved baselines.

## What this project demonstrates

- Full-page and element-level screenshot comparisons with `toHaveScreenshot()`
- Masking dynamic content (e.g. badges/counters) so they don't cause false failures
- Cross-browser visual testing (Chromium desktop, Chromium mobile, Firefox)
- Responsive visual testing across multiple viewport sizes
- Catching CSS/layout bugs that functional tests would miss

## App used

- **[SauceDemo](https://www.saucedemo.com)** – a demo e-commerce site

## Project structure

```
.
├── .github/workflows/playwright.yml   # CI pipeline
├── pages/
│   └── LoginPage.js                   # Page Object Model
├── tests/
│   ├── login-visual.spec.js           # Login page screenshots
│   ├── inventory-visual.spec.js       # Inventory page screenshots + masking
│   ├── responsive-visual.spec.js      # Multi-viewport screenshots
│   └── *-snapshots/                   # Auto-generated baseline images (committed to git)
├── utils/
│   └── testData.js                    # Shared credentials/test data
├── playwright.config.js
└── package.json
```

## Getting started

### Prerequisites
- Node.js 18+

### Installation

```bash
npm install
npx playwright install
```

### First run - generate baselines

The first time you run the suite, there are no baseline images yet, so every test will fail with a message like "snapshot doesn't exist". This is expected. Generate the baselines with:

```bash
npx playwright test --update-snapshots
```

This creates `*-snapshots/` folders next to each test file containing the reference images. **Commit these to git** - they're the "source of truth" for future comparisons.

### Running tests normally

```bash
npm test
```

Each run takes a new screenshot and compares it to the committed baseline. If they differ beyond the configured threshold, the test fails and Playwright generates:
- `expected.png` - the baseline
- `actual.png` - the new screenshot
- `diff.png` - a visual highlight of what changed

These are saved in `test-results/` and shown in the HTML report.

```bash
npm run report
```

### Updating baselines after an intentional UI change

If you change the app's UI on purpose and the visual tests now correctly fail, update the baselines:

```bash
npm run test:update-snapshots
```

Review the new images, then commit them.

## Test scenarios covered

| Suite | Scenario |
|---|---|
| Login visual | Full login page matches baseline |
| Login visual | Login form (element-only) matches baseline |
| Login visual | Error state (after invalid submit) matches baseline |
| Inventory visual | Full inventory page matches baseline |
| Inventory visual | Inventory page matches baseline with cart badge masked |
| Inventory visual | Sort dropdown component matches baseline |
| Visual bugs | `visual_user` page is captured separately to highlight CSS issues |
| Responsive | Login page renders correctly on desktop, tablet, and mobile viewports |

## Key concepts

**Masking dynamic content:**
```javascript
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.shopping_cart_badge')],
});
```

**Setting a diff tolerance** (in `playwright.config.js`):
```javascript
expect: {
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.02, // allow up to 2% pixel difference
  },
},
```

## CI/CD

Every push and pull request to `main` runs the suite via GitHub Actions across multiple browser projects. On failure, diff images are uploaded as build artifacts for review.

## Tech stack

- [Playwright](https://playwright.dev/) (`@playwright/test`)
- JavaScript (Node.js)
- GitHub Actions
