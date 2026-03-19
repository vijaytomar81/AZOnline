// src/config/execution.config.ts
export type ExecutionConfig = {
  browser: {
    name: 'chromium' | 'firefox' | 'webkit';
    channel?: 'msedge' | 'chrome';
    headless: boolean;
  };
  timeouts: {
    test: number;
    expect: number;
  };
  artifacts: {
    screenshot: 'on' | 'off' | 'only-on-failure';
    video: 'on' | 'off' | 'retain-on-failure';
    trace: 'on' | 'off' | 'retain-on-failure';
  };
  generatedArtifacts: {
    withTimestamp: boolean;
    maxToKeep: number;
  };
};

export const executionConfig: ExecutionConfig = {
  browser: {
    name: ((process.env.BROWSER_NAME as any) || 'chromium'),
    channel: ((process.env.BROWSER as any) || 'msedge'),
    headless: process.env.HEADLESS === 'false' ? false : true,
  },

  timeouts: {
    test: Number(process.env.TEST_TIMEOUT || 60_000),
    expect: Number(process.env.EXPECT_TIMEOUT || 10_000),
  },

  artifacts: {
    screenshot: ((process.env.SCREENSHOT as any) || 'only-on-failure'),
    video: ((process.env.VIDEO as any) || 'retain-on-failure'),
    trace: ((process.env.TRACE as any) || 'retain-on-failure'),
  },

  generatedArtifacts: {
    withTimestamp: process.env.ARTIFACTS_WITH_TIMESTAMP === 'false',
    maxToKeep: Number(process.env.MAX_ARTIFACTS_TO_KEEP || 30),
  },
};