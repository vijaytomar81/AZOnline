// src/toolingLayer/pageObjects/generator/generator/report.ts

import {
    PAGE_OBJECT_FILE_STATUSES,
    PAGE_OBJECT_GENERATION_STATUSES,
    type PageObjectFileStatus,
    type PageObjectGenerationStatus,
} from "@configLayer/tooling/pageObjects";
import type { SyncPageRegistryResult } from "./registry";

export type RepairPageReport = {
    pageKey: string;
    changed: boolean;
    elementsStatus: PageObjectGenerationStatus;
    aliasesGeneratedStatus: PageObjectGenerationStatus;
    pageObjectStatus: PageObjectFileStatus;
    registryStatus:
    | "already-registered"
    | "added-to-index"
    | "added-to-page-manager"
    | "added-to-both";
};

export type RepairRunReport = {
    pagesScanned: number;
    pagesChanged: number;
    filesGenerated: number;
    registryUpdates: number;
    pageReports: RepairPageReport[];
};

function toMemberCamel(pageKey: string): string {
    const member = pageKey.split(".").slice(-1)[0] || "page";

    return member
        .replace(/[-_.]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((part, i) =>
            i === 0
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
            const m = line.match(/@pageObjectsObjects\/(.+)\/[^/]+"?;?$/);
            return m?.[1] ?? "";
        })
    );

    const addedManagerImports = new Set(
        syncRes.pageManager.addedImports.map((line) => {
            const m = line.match(/@pageObjectsObjects\/(.+)\/[^/]+"?;?$/);
            return m?.[1] ?? "";
        })
    );

    const addedManagerEntries = new Set(syncRes.pageManager.addedEntries);

    for (const report of pageReports) {
        const pagePath = report.pageKey.split(".").join("/");
        const memberCamel = toMemberCamel(report.pageKey);
        const product = report.pageKey.split(".")[0] || "common";
        const entrySnippet = `${memberCamel}: this.get("${product}.${memberCamel}"`;

        const addedToIndex = addedIndexPaths.has(pagePath);
        const addedToManager =
            addedManagerImports.has(pagePath) ||
            [...addedManagerEntries].some((line) => line.includes(entrySnippet));

        if (addedToIndex && addedToManager) {
            report.registryStatus = "added-to-both";
        } else if (addedToIndex) {
            report.registryStatus = "added-to-index";
        } else if (addedToManager) {
            report.registryStatus = "added-to-page-manager";
        } else {
            report.registryStatus = "already-registered";
        }

        if (report.registryStatus !== "already-registered") {
            report.changed = true;
        }
    }
}

export function buildRunSummary(params: {
    pagesScanned: number;
    pageReports: RepairPageReport[];
    syncRes: SyncPageRegistryResult;
}): RepairRunReport {
    const { pagesScanned, pageReports, syncRes } = params;

    const pagesChanged = pageReports.filter((r) => r.changed).length;

    const filesGenerated = pageReports.reduce((sum, r) => {
        let count = 0;
        if (r.elementsStatus === PAGE_OBJECT_GENERATION_STATUSES.GENERATED) count++;
        if (r.aliasesGeneratedStatus === PAGE_OBJECT_GENERATION_STATUSES.GENERATED) count++;
        if (r.pageObjectStatus === PAGE_OBJECT_FILE_STATUSES.GENERATED) count++;
        return sum + count;
    }, 0);

    const registryUpdates =
        syncRes.index.added.length +
        syncRes.pageManager.addedImports.length +
        syncRes.pageManager.addedEntries.length;

    return {
        pagesScanned,
        pagesChanged,
        filesGenerated,
        registryUpdates,
        pageReports,
    };
}