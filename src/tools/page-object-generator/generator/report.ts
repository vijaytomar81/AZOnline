// src/tools/page-object-generator/generator/report.ts

import type { SyncPageRegistryResult } from "./registry";

export type RepairPageReport = {
    pageKey: string;
    changed: boolean;
    elementsStatus: "generated" | "unchanged";
    aliasesGeneratedStatus: "generated" | "unchanged";
    pageObjectStatus: "generated" | "synced" | "unchanged";
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
    stateUpdated: boolean;
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
            const m = line.match(/@page-objects\/(.+)\/[^/]+"?;?$/);
            return m?.[1] ?? "";
        })
    );

    const addedManagerImports = new Set(
        syncRes.pageManager.addedImports.map((line) => {
            const m = line.match(/@page-objects\/(.+)\/[^/]+"?;?$/);
            return m?.[1] ?? "";
        })
    );

    const addedManagerEntries = new Set(syncRes.pageManager.addedEntries);

    for (const report of pageReports) {
        const pagePath = report.pageKey.split(".").join("/");
        const memberCamel = toMemberCamel(report.pageKey);
        const group = report.pageKey.split(".")[0] || "common";
        const entrySnippet = `${memberCamel}: this.get("${group}.${memberCamel}"`;

        const addedToIndex = addedIndexPaths.has(pagePath);
        const addedToManager =
            addedManagerImports.has(pagePath) ||
            Array.from(addedManagerEntries).some((line) => line.includes(entrySnippet));

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
}): Omit<RepairRunReport, "stateUpdated"> {
    const { pagesScanned, pageReports, syncRes } = params;

    const pagesChanged = pageReports.filter((r) => r.changed).length;

    const filesGenerated = pageReports.reduce((sum, r) => {
        let count = 0;
        if (r.elementsStatus === "generated") count++;
        if (r.aliasesGeneratedStatus === "generated") count++;
        if (r.pageObjectStatus === "generated") count++;
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