// src/frameworkCore/automation/diagnostics/runPageScanOnLocatorFailure.ts

import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";
import { executionConfig } from "@configLayer/execution/execution.config";
import { createScopedLogger } from "@frameworkCore/logging/adapters/createScopedLogger";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { scanPage } from "@toolingLayer/pageScanner/scanner/runner";
import { toRepoRelative } from "@utils/paths";
import { isLocatorFailure } from "./isLocatorFailure";

const PAGE_SCAN_LOG_SCOPE = "automation:diagnostics:page-scan";

export type PageScanResult = {
    triggered: boolean;
    note: string;
    outputPath?: string;
};

function resolvePageScanOutDir(screenshotPath?: string): string {
    if (screenshotPath) {
        return path.join(path.dirname(screenshotPath), "page-scans");
    }

    return executionConfig.automation.diagnostics.pageScanOutDir;
}

export async function runPageScanOnLocatorFailure(args: {
    page: Page;
    error: unknown;
    pageKey?: string;
    screenshotPath?: string;
}): Promise<PageScanResult> {
    if (!executionConfig.automation.diagnostics.pageScanOnLocatorFailure) {
        const note =
            "Skipped page scan because PAGE_SCAN_ON_LOCATOR_FAILURE is disabled.";

        emitLog({
            scope: PAGE_SCAN_LOG_SCOPE,
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.DIAGNOSTIC,
            message: note,
        });

        return {
            triggered: false,
            note,
        };
    }

    if (!isLocatorFailure(args.error)) {
        const note =
            "Skipped page scan because failure is not locator-related.";

        emitLog({
            scope: PAGE_SCAN_LOG_SCOPE,
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.DIAGNOSTIC,
            message: note,
        });

        return {
            triggered: false,
            note,
        };
    }

    if (!args.pageKey?.trim()) {
        const note = "Skipped page scan because pageKey is missing.";

        emitLog({
            scope: PAGE_SCAN_LOG_SCOPE,
            level: LOG_LEVELS.WARN,
            category: LOG_CATEGORIES.DIAGNOSTIC,
            message: note,
        });

        return {
            triggered: false,
            note,
        };
    }

    const connectCdp =
        executionConfig.automation.diagnostics.pageScanCdpUrl?.trim();

    if (!connectCdp) {
        const note =
            "Skipped page scan because PAGE_SCAN_CDP_URL is not configured.";

        emitLog({
            scope: PAGE_SCAN_LOG_SCOPE,
            level: LOG_LEVELS.WARN,
            category: LOG_CATEGORIES.DIAGNOSTIC,
            message: note,
        });

        return {
            triggered: false,
            note,
        };
    }

    const outDir = resolvePageScanOutDir(args.screenshotPath);
    const outputPath = path.join(outDir, `${args.pageKey}.json`);

    try {
        await fs.mkdir(outDir, { recursive: true });

        emitLog({
            scope: PAGE_SCAN_LOG_SCOPE,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.DIAGNOSTIC,
            message: `Starting page scan -> pageKey=${args.pageKey}, outDir=${toRepoRelative(
                outDir
            )}`,
        });

        await scanPage({
            connectCdp,
            pageKey: args.pageKey,
            outDir,
            merge:
                executionConfig.automation.diagnostics
                    .pageScanMergeIntoExistingPageMap,
            tabIndex: 0,
            verbose: executionConfig.automation.diagnostics.pageScanVerbose,
            log: createScopedLogger(
                PAGE_SCAN_LOG_SCOPE,
                LOG_CATEGORIES.DIAGNOSTIC
            ),
        });

        const note = `Page scan completed: ${toRepoRelative(outputPath)}`;

        emitLog({
            scope: PAGE_SCAN_LOG_SCOPE,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.DIAGNOSTIC,
            message: note,
        });

        return {
            triggered: true,
            note,
            outputPath,
        };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : String(error);
        const note = `Page scan failed: ${message}`;

        emitLog({
            scope: PAGE_SCAN_LOG_SCOPE,
            level: LOG_LEVELS.ERROR,
            category: LOG_CATEGORIES.DIAGNOSTIC,
            message: note,
        });

        return {
            triggered: false,
            note,
            outputPath,
        };
    }
}
