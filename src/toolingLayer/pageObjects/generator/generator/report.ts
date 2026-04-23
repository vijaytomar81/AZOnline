// src/toolingLayer/pageObjects/generator/generator/report.ts

import {
    PAGE_OBJECT_FILE_STATUSES,
    PAGE_OBJECT_GENERATION_STATUSES,
    type PageObjectFileStatus,
    type PageObjectGenerationStatus,
} from "@configLayer/tooling/pageObjects";
import { printTree } from "@utils/cliTree";
import { printSection, printSummary } from "@utils/cliFormat";
import { buildGenerationReportTree } from "./reporting/buildGenerationReportTree";
import {
    buildGenerationResultText,
    formatGenerationResultText,
} from "./reporting/buildGenerationResultText";
import { buildGenerationSummaryRows } from "./reporting/buildGenerationSummaryRows";
import { countGenerationIssues } from "./reporting/countGenerationIssues";
import type { SyncPageRegistryResult } from "./registry";
import type { GenerationOperation, GenerationResult } from "./reporting/types";

export type InvalidPageReport = {
    pageKey: string;
    reason: string;
};

export type GenerationErrorReport = {
    pageKey: string;
    reason: string;
};

export type RepairPageReport = {
    pageKey: string;
    operation: Exclude<GenerationOperation, "failed">;
    elementsStatus: PageObjectGenerationStatus;
    aliasesGeneratedStatus: PageObjectGenerationStatus;
    aliasesHumanStatus: PageObjectGenerationStatus;
    pageObjectStatus: PageObjectFileStatus;
    registryStatus:
        | "already-registered"
        | "added-to-index"
        | "added-to-page-manager"
        | "added-to-both";
    scope?: {
        platform: string;
        application: string;
        product: string;
        name: string;
    };
};

export type RepairRunReport = {
    availablePageMaps: number;
    createdCount: number;
    updatedCount: number;
    unchangedCount: number;
    failedCount: number;
    filesGenerated: number;
    registryPagesUpdated: number;
    invalidPages: InvalidPageReport[];
    errorPages: GenerationErrorReport[];
    result: GenerationResult;
    exitCode: number;
    summaryRows: Array<[string, string | number]>;
    pageReports: RepairPageReport[];
};

function toMemberCamel(pageKey: string): string {
    const member = pageKey.split(".").slice(-1)[0] || "page";

    return member
        .replace(/[-_.]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((part, index) =>
            index === 0
                ? part.charAt(0).toLowerCase() + part.slice(1)
                : part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join("");
}

export function applyRegistryStatusToReports(
    pageReports: RepairPageReport[],
    syncRes: SyncPageRegistryResult
): void {
    const addedIndexPaths = new Set(
        syncRes.index.added.map((line) => {
            const match = line.match(/@businessLayer\/pageObjects\/objects\/(.+)\/[^/]+"?;?$/);
            return match?.[1] ?? "";
        })
    );

    const addedManagerImports = new Set(
        syncRes.pageManager.addedImports.map((line) => {
            const match = line.match(/@businessLayer\/pageObjects\/objects\/(.+)\/[^/]+"?;?$/);
            return match?.[1] ?? "";
        })
    );

    const addedManagerEntries = new Set(syncRes.pageManager.addedEntries);

    for (const report of pageReports) {
        const pagePath = report.pageKey.split(".").join("/");
        const memberCamel = toMemberCamel(report.pageKey);
        const product = report.scope?.product ?? "common";
        const entrySnippet = `${memberCamel}: this.get("${product}.${memberCamel}"`;

        const addedToIndex = addedIndexPaths.has(pagePath);
        const addedToManager =
            addedManagerImports.has(pagePath) ||
            [...addedManagerEntries].some((line) => line.includes(entrySnippet));

        report.registryStatus = addedToIndex && addedToManager
            ? "added-to-both"
            : addedToIndex
              ? "added-to-index"
              : addedToManager
                ? "added-to-page-manager"
                : "already-registered";
    }
}

function countOperations(pageReports: RepairPageReport[]) {
    return pageReports.reduce(
        (acc, item) => {
            if (item.operation === "created") acc.createdCount++;
            if (item.operation === "updated") acc.updatedCount++;
            if (item.operation === "unchanged") acc.unchangedCount++;
            return acc;
        },
        {
            createdCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        }
    );
}

export function buildRunSummary(params: {
    availablePageMaps: number;
    pageReports: RepairPageReport[];
    syncRes: SyncPageRegistryResult;
    invalidPages?: InvalidPageReport[];
    errorPages?: GenerationErrorReport[];
}): RepairRunReport {
    const invalidPages = params.invalidPages ?? [];
    const errorPages = params.errorPages ?? [];
    const { createdCount, updatedCount, unchangedCount } = countOperations(
        params.pageReports
    );

    const filesGenerated = params.pageReports.reduce((sum, item) => {
        let count = 0;
        if (item.elementsStatus === PAGE_OBJECT_GENERATION_STATUSES.GENERATED) count++;
        if (item.aliasesGeneratedStatus === PAGE_OBJECT_GENERATION_STATUSES.GENERATED) count++;
        if (item.aliasesHumanStatus === PAGE_OBJECT_GENERATION_STATUSES.GENERATED) count++;
        if (item.pageObjectStatus === PAGE_OBJECT_FILE_STATUSES.GENERATED) count++;
        return sum + count;
    }, 0);

    const registryPagesUpdated = params.pageReports.filter(
        (item) => item.registryStatus !== "already-registered"
    ).length;

    const issueCounts = countGenerationIssues({ invalidPages, errorPages });
    const result = buildGenerationResultText(issueCounts);
    const exitCode = issueCounts.errors > 0 ? 1 : 0;
    const failedCount = errorPages.length;

    return {
        availablePageMaps: params.availablePageMaps,
        createdCount,
        updatedCount,
        unchangedCount,
        failedCount,
        filesGenerated,
        registryPagesUpdated,
        invalidPages,
        errorPages,
        result,
        exitCode,
        summaryRows: buildGenerationSummaryRows({
            availablePageMaps: params.availablePageMaps,
            createdCount,
            updatedCount,
            unchangedCount,
            failedCount,
            filesGenerated,
            registryPagesUpdated,
            invalidPages: invalidPages.length,
            exitCode,
        }),
        pageReports: params.pageReports,
    };
}

export function printGenerationExecution(result: RepairRunReport): void {
    printSection("Generation");
    printTree(
        buildGenerationReportTree({
            pageReports: result.pageReports,
            invalidPages: result.invalidPages,
            errorPages: result.errorPages,
        })
    );
}

export function printGenerationSummary(result: RepairRunReport): void {
    printSummary(
        "GENERATOR SUMMARY",
        result.summaryRows,
        formatGenerationResultText(result.result)
    );
}
