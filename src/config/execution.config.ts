// src/config/execution.config.ts

import { envBool, envNumber, envString } from "@utils/env";

export type ExecutionConfig = {
  browser: {
    name: "chromium" | "firefox" | "webkit";
    channel?: "msedge" | "chrome";
    headless: boolean;
  };
  timeouts: {
    test: number;
    expect: number;
  };
  artifacts: {
    screenshot: "on" | "off" | "only-on-failure";
    video: "on" | "off" | "retain-on-failure";
    trace: "on" | "off" | "retain-on-failure";
  };
  generatedDataArtifacts: {
    withTimestamp: boolean;
    maxToKeep: number;
  };
  generatedEvidenceArtifacts: {
    enabled: boolean;
    withTimestamp: boolean;
    maxToKeep: number;
    keepFailedEvidenceFileOnlyWhenNeeded: boolean;
    cleanupTemporaryFilesAfterMerge: boolean;
  };
};

export const executionConfig: ExecutionConfig = {
  browser: {
    name: envString("BROWSER_NAME", "chromium") as any,
    channel: envString("BROWSER", "msedge") as any,
    headless: envBool("HEADLESS", true),
  },

  timeouts: {
    test: envNumber("TEST_TIMEOUT", 60_000),
    expect: envNumber("EXPECT_TIMEOUT", 10_000),
  },

  artifacts: {
    screenshot: envString("SCREENSHOT", "only-on-failure") as any,
    video: envString("VIDEO", "retain-on-failure") as any,
    trace: envString("TRACE", "retain-on-failure") as any,
  },

  generatedDataArtifacts: {
    withTimestamp: envBool("ARTIFACTS_WITH_TIMESTAMP", true),
    maxToKeep: envNumber("MAX_ARTIFACTS_TO_KEEP", 30),
  },

  generatedEvidenceArtifacts: {
    enabled: envBool("EVIDENCE_ENABLED", true),
    withTimestamp: envBool("EVIDENCE_WITH_TIMESTAMP", true),
    maxToKeep: envNumber("MAX_EVIDENCE_RUNS_TO_KEEP", 30),
    keepFailedEvidenceFileOnlyWhenNeeded: envBool(
      "KEEP_FAILED_EVIDENCE_FILE_ONLY_WHEN_NEEDED",
      true
    ),
    cleanupTemporaryFilesAfterMerge: envBool(
      "CLEANUP_TEMP_EVIDENCE_FILES_AFTER_MERGE",
      true
    ),
  },
};
