// playwright.config.ts

import { defineConfig } from '@playwright/test';
import { executionConfig } from './src/configLayer/execution/execution.config';

export default defineConfig({
  testDir: './src/tests',

  timeout: executionConfig.timeouts.test,
  expect: { timeout: executionConfig.timeouts.expect },

  reporter: [
    ['html', { outputFolder: 'results/playwright/html', open: 'never' }],
    ['json', { outputFile: 'results/playwright/json/results.json' }],
    ['junit', { outputFile: 'results/playwright/junit/results.xml' }],
    ['line'],
    ['allure-playwright', { outputFolder: 'results/allure-results' }],
  ],

  use: {
    // ❌ No baseURL here — routing is handled dynamically at runtime
    headless: executionConfig.browser.headless,
    screenshot: executionConfig.artifacts.screenshot as any,
    video: executionConfig.artifacts.video as any,
    trace: executionConfig.artifacts.trace as any,
  },

  projects: [
    {
      name: executionConfig.browser.channel || executionConfig.browser.name,
      use: {
        browserName: executionConfig.browser.name,
        channel: executionConfig.browser.channel,
      },
    },
  ],
});
