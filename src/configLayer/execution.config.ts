// src/configLayer/execution.config.ts

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
  automation: {
    selfHeal: {
      runtimeEnabled: boolean;
      writeEnabled: boolean;
    };
    diagnostics: {
      screenshotOnFailure: boolean;
      pageScanOnLocatorFailure: boolean;
      pageScanCdpUrl?: string;
      pageScanOutDir: string;
      pageScanVerbose: boolean;
      pageScanMergeIntoExistingPageMap: boolean;
    };
    waits: {
      actionTimeoutMs: number;
      pageReadyTimeoutMs: number;
      overlayTimeoutMs: number;
    };
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

  automation: {
    selfHeal: {
      runtimeEnabled: envBool("SELF_HEAL", false),
      writeEnabled: envBool("SELF_HEAL_WRITE", false),
    },
    diagnostics: {
      screenshotOnFailure: envBool("SCREENSHOT_ON_FAILURE", true),
      pageScanOnLocatorFailure: envBool(
        "PAGE_SCAN_ON_LOCATOR_FAILURE",
        true
      ),
      pageScanCdpUrl: envString("PAGE_SCAN_CDP_URL", ""),
      pageScanOutDir: envString("PAGE_SCAN_OUT_DIR", "results/evidence/page-scans"),
      pageScanVerbose: envBool("PAGE_SCAN_VERBOSE", false),
      pageScanMergeIntoExistingPageMap: envBool(
        "PAGE_SCAN_MERGE_INTO_EXISTING_PAGE_MAP",
        false
      ),
    },
    waits: {
      actionTimeoutMs: envNumber("ACTION_TIMEOUT", 10_000),
      pageReadyTimeoutMs: envNumber("PAGE_READY_TIMEOUT", 10_000),
      overlayTimeoutMs: envNumber("OVERLAY_TIMEOUT", 1_000),
    },
  },

  generatedDataArtifacts: {
    withTimestamp: envBool("ARTIFACTS_WITH_TIMESTAMP", true),
    maxToKeep: envNumber("MAX_ARTIFACTS_TO_KEEP", 30),
  },

  generatedEvidenceArtifacts: {
    enabled: envBool("EVIDENCE_ENABLED", true),
    withTimestamp: envBool("EVIDENCE_WITH_TIMESTAMP", true),
    maxToKeep: envNumber("MAX_EVIDENCE_RUNS_TO_KEEP", 5),
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