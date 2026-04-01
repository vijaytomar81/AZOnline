// src/pageObjectTools/page-object-validator/validate/rules/registry/indexExports/buildIndexExportReportNodes.ts

import type { TreeNode } from "@utils/cliTree";
import type { GroupedIndexExportIssues } from "./indexExportTypes";
import { formatKeyList } from "./formatKeyList";

export function buildIndexExportReportNodes(
    grouped: GroupedIndexExportIssues
): TreeNode[] {
    const reportNodes: TreeNode[] = [];
    const allPageKeys = new Set<string>([
        ...grouped.missingByPage.keys(),
        ...grouped.extraByPage.keys(),
    ]);

    for (const pageKey of [...allPageKeys].sort((a, b) => a.localeCompare(b))) {
        const children: TreeNode[] = [];
        const missing = grouped.missingByPage.get(pageKey) ?? [];
        const extra = grouped.extraByPage.get(pageKey) ?? [];

        if (missing.length > 0) {
            children.push({
                severity: "error",
                title: "Missing",
                summary: formatKeyList(missing),
            });
        }

        if (extra.length > 0) {
            children.push({
                severity: "warning",
                title: "Extra",
                summary: formatKeyList(extra),
            });
        }

        reportNodes.push({
            title: pageKey,
            children: [
                {
                    title: "index.ts",
                    children,
                },
            ],
        });
    }

    return reportNodes;
}
