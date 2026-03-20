// src/config/execution.config.ts
import { envBool, envNumber, envString } from "../utils/env";

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
    name: (envString("BROWSER_NAME", "chromium") as any),
    channel: (envString("BROWSER", "msedge") as any),
    headless: envBool("HEADLESS", true),
  },

  timeouts: {
    test: envNumber("TEST_TIMEOUT", 60_000),
    expect: envNumber("EXPECT_TIMEOUT", 10_000),
  },

  artifacts: {
    screenshot: (envString("SCREENSHOT", "only-on-failure") as any),
    video: (envString("VIDEO", "retain-on-failure") as any),
    trace: (envString("TRACE", "retain-on-failure") as any),
  },

  generatedArtifacts: {
    withTimestamp: envBool("ARTIFACTS_WITH_TIMESTAMP", true),
    maxToKeep: envNumber("MAX_ARTIFACTS_TO_KEEP", 30),
  },
};