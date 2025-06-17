import { defineConfig } from "@playwright/test";

const launchOpts = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--disk-cache-size=33554432",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
  "--single-process",
];

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
  projects: [
    {
      name: "chromium",
      use: {
        launchOptions: {
          // executablePath:
          //   "../../../node_modules/chromium/lib/chromium/chrome-linux/chrome",
          args: launchOpts,
        },
      },
    },
  ],
});
