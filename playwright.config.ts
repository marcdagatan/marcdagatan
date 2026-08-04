import { defineConfig, devices } from "@playwright/test";

/**
 * Browser smoke coverage for the V3 blog (TASKLIST Phase 7.2).
 *
 * Deterministic production server: `next start` against the already-built
 * `.next` output on an unused test port. Playwright itself never compiles;
 * `npm run test:e2e` builds first locally, and CI builds before invoking
 * `npx playwright test`, so the production bundle is never built twice.
 *
 * Artifacts (trace/screenshot/video) are retained only when a test fails, so
 * successful runs leave the repo clean.
 */

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Retries only in CI: local runs fail fast, CI tolerates transient flake.
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  timeout: 30_000,
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
