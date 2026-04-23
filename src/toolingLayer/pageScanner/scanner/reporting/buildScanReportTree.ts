// src/toolingLayer/pageScanner/scanner/reporting/buildScanReportTree.ts

import { UI_SEVERITIES } from "@configLayer/core/uiSeverities";
import type { TreeNode } from "@utils/cliTree";
import { toRepoRelative } from "@utils/paths";
import type { ScanPageResult } from "./types";

function successNode(title: string, summary: string): TreeNode {
    return {
        severity: UI_SEVERITIES.SUCCESS,
        title,
        summary,
    };
}

function failureNode(title: string, summary: string): TreeNode {
    return {
        severity: UI_SEVERITIES.ERROR,
        title,
        summary,
    };
}

function buildScopeSummary(result: ScanPageResult): string {
    const scope = result.scope;

    if (!scope) {
        return "scope unavailable";
    }

    return [
        `platform=${scope.platform}`,
        `application=${scope.application}`,
        `product=${scope.product}`,
        `name=${scope.name}`,
    ].join(", ");
}

export function buildScanReportTree(result: ScanPageResult): TreeNode[] {
    if (result.operation === "failed") {
        return [
            {
                severity: UI_SEVERITIES.ERROR,
                title: result.pageKey,
                summary: `(operation=failed)`,
                children: [
                    failureNode("scope", buildScopeSummary(result)),
                    failureNode("scan", result.errorMessage ?? "Unknown scanner error"),
                ],
            },
        ];
    }

    const fileState = result.operation === "unchanged" ? "unchanged" : "written";

    return [
        {
            severity: UI_SEVERITIES.SUCCESS,
            title: result.pageKey,
            summary: `(operation=${result.operation})`,
            children: [
                successNode("scope", buildScopeSummary(result)),
                successNode("page-map", `elements=${result.elementsFound}`),
                successNode("file", `${fileState} (${toRepoRelative(result.outFile)})`),
                successNode(
                    "diff",
                    `added=${result.diff.added.length}, updated=${result.diff.updated.length}, removed=${result.diff.removed.length}, unchanged=${result.diff.unchanged.length}`
                ),
            ],
        },
    ];
}
