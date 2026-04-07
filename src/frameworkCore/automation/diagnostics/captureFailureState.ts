// src/automation/diagnostics/captureFailureState.ts

import type { Page } from "@playwright/test";
import { executionConfig } from "@configLayer/execution.config";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import {
    runPageScanOnLocatorFailure,
    type PageScanResult,
} from "./runPageScanOnLocatorFailure";

const FAILURE_STATE_LOG_SCOPE = "automation:diagnostics:failure-state";

export type FailureState = {
    message: string;
    url: string;
    title: string;
    screenshotPath?: string;
    pageScan: PageScanResult;
};

export async function captureFailureState(args: {
    page: Page;
    error: unknown;
    screenshotPath?: string;
    pageKey?: string;
}): Promise<FailureState> {
    const message =
        args.error instanceof Error ? args.error.message : String(args.error);

    emitLog({
        scope: FAILURE_STATE_LOG_SCOPE,
        level: LOG_LEVELS.ERROR,
        category: LOG_CATEGORIES.DIAGNOSTIC,
        message: `Capturing failure state -> ${message}`,
    });

    let title = "";
    let url = "";

    try {
        title = await args.page.title();
    } catch {
        title = "";
    }

    try {
        url = args.page.url();
    } catch {
        url = "";
    }

    const shouldCaptureScreenshot =
        executionConfig.automation.diagnostics.screenshotOnFailure &&
        !!args.screenshotPath;

    if (shouldCaptureScreenshot && args.screenshotPath) {
        try {
            await args.page.screenshot({
                path: args.screenshotPath,
                fullPage: true,
            });

            emitLog({
                scope: FAILURE_STATE_LOG_SCOPE,
                level: LOG_LEVELS.INFO,
                category: LOG_CATEGORIES.DIAGNOSTIC,
                message: `Failure screenshot captured: ${args.screenshotPath}`,
            });
        } catch (error) {
            const screenshotError =
                error instanceof Error ? error.message : String(error);

            emitLog({
                scope: FAILURE_STATE_LOG_SCOPE,
                level: LOG_LEVELS.WARN,
                category: LOG_CATEGORIES.DIAGNOSTIC,
                message: `Failure screenshot capture failed: ${screenshotError}`,
            });
        }
    }

    const pageScan = await runPageScanOnLocatorFailure({
        page: args.page,
        error: args.error,
        pageKey: args.pageKey,
        screenshotPath: args.screenshotPath,
    });

    emitLog({
        scope: FAILURE_STATE_LOG_SCOPE,
        level: pageScan.triggered ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.DIAGNOSTIC,
        message: pageScan.note,
    });

    return {
        message,
        url,
        title,
        screenshotPath: shouldCaptureScreenshot ? args.screenshotPath : undefined,
        pageScan,
    };
}
