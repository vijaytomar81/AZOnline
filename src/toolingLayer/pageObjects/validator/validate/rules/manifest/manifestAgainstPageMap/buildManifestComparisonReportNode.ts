// src/tools/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/buildManifestComparisonReportNode.ts

import type { TreeNode } from "@utils/cliTree";
import {
    formatKeyList,
    formatMismatchList,
    manifestFileName,
} from "./manifestAgainstPageMapFormatters";

export function buildManifestComparisonReportNode(args: {
    pageKey: string;
    manifestFile: string;
    missingItems: string[];
    mismatchItems: string[];
}): TreeNode | undefined {
    if (args.missingItems.length === 0 && args.mismatchItems.length === 0) {
        return undefined;
    }

    const children: TreeNode[] = [];

    if (args.missingItems.length > 0) {
        children.push({
            severity: "warning",
            title: "Missing",
            summary: formatKeyList(args.missingItems),
        });
    }

    if (args.mismatchItems.length > 0) {
        children.push({
            severity: "warning",
            title: "Mismatch",
            summary: formatMismatchList(args.mismatchItems),
        });
    }

    return {
        title: args.pageKey,
        children: [
            {
                title: manifestFileName(args.manifestFile),
                children,
            },
        ],
    };
}
