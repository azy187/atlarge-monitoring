import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "*.spec.ts",
  testDir: "./tests",
  outputDir: "./tests/results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["json", { outputFile: "./tests/reports/playwright-report.json" }],
  ],
  use: {
    baseURL: "localhost",
    trace: "on-first-retry",
    headless: true,
    browserName: "chromium",
    channel: "chromium",
  },
});
