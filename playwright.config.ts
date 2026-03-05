import { defineConfig } from '@playwright/test';
import { envConfig } from './src/config/env';
import { executionConfig } from './src/config/execution.config';

const baseURL =
  envConfig.startFrom === 'pcw'
    ? (envConfig.pcwUrl ?? (() => { throw new Error('START_FROM=pcw but pcwUrl is null'); })())
    : envConfig.env.customerPortalUrl;

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
    baseURL,
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
