// src/toolingLayer/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/buildManifestComparisonResult.ts

import type { ValidationIssue } from "../../../types";
import { buildManifestComparisonReportNode } from "./buildManifestComparisonReportNode";
import { collectManifestMismatchItems } from "./collectManifestMismatchItems";
import type {
    ManifestComparisonInputs,
    ManifestComparisonResult,
} from "./manifestAgainstPageMapTypes";

export function buildManifestComparisonResult(
    input: ManifestComparisonInputs
): ManifestComparisonResult {
    const pageKey = input.pageMapItem.pageMap.pageKey;

    if (!input.manifestEntry) {
        const issues: ValidationIssue[] = [
            {
                ruleId: input.ruleId,
                severity: "ERROR" as const,
                issueLabel: "Missing",
                message: "[manifestEntryKey]",
                pageKey,
                filePath: input.manifestFile,
            },
        ];

        return {
            issues,
            reportNode: buildManifestComparisonReportNode({
                pageKey,
                manifestFile: input.manifestFile,
                missingItems: ["manifestEntryKey"],
                mismatchItems: [],
            }),
        };
    }

    const mismatchItems = collectManifestMismatchItems(input);

    if (mismatchItems.length === 0) {
        return {
            issues: [],
            reportNode: undefined,
        };
    }

    const issues: ValidationIssue[] = [
        {
            ruleId: input.ruleId,
            severity: "ERROR" as const,
            issueLabel: "Mismatch",
            message: `[${mismatchItems.join(", ")}]`,
            pageKey,
            filePath: input.manifestFile,
        },
    ];

    return {
        issues,
        reportNode: buildManifestComparisonReportNode({
            pageKey,
            manifestFile: input.manifestFile,
            missingItems: [],
            mismatchItems,
        }),
    };
}
