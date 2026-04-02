// src/pageObjectTools/page-object-validator/validate/rules/manifest/manifestAgainstPageMap/buildManifestComparisonResult.ts

import {
    formatMismatchList,
} from "./manifestAgainstPageMapFormatters";
import { buildManifestComparisonReportNode } from "./buildManifestComparisonReportNode";
import { collectManifestMismatchItems } from "./collectManifestMismatchItems";
import type {
    ManifestComparisonInputs,
    ManifestComparisonResult,
} from "./manifestAgainstPageMapTypes";

export function buildManifestComparisonResult(
    input: ManifestComparisonInputs
): ManifestComparisonResult {
    const issues = [];
    const missingItems: string[] = [];
    const mismatchItems = collectManifestMismatchItems(input);
    const pageKey = input.pageMapItem.pageMap.pageKey;

    if (!input.manifestEntry) {
        missingItems.push("manifestEntryKey");
        issues.push({
            ruleId: input.ruleId,
            severity: "WARN" as const,
            issueLabel: "Missing",
            message: "[manifestEntryKey]",
            pageKey,
            filePath: input.manifestFile,
        });
    }

    if (mismatchItems.length > 0) {
        issues.push({
            ruleId: input.ruleId,
            severity: "WARN" as const,
            issueLabel: "Mismatch",
            message: formatMismatchList(mismatchItems),
            pageKey,
            filePath: input.manifestFile,
        });
    }

    return {
        issues,
        reportNode: buildManifestComparisonReportNode({
            pageKey,
            manifestFile: input.manifestFile,
            missingItems,
            mismatchItems,
        }),
    };
}
