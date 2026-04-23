// src/toolingLayer/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/buildManifestComparisonReportNode.ts

import type { TreeNode } from "@utils/cliTree";
import { manifestFileName } from "./manifestAgainstPageMapFormatters";

type BuildManifestComparisonReportNodeArgs = {
    pageKey: string;
    manifestFile: string;
    missingItems: string[];
    mismatchItems: string[];
};

function buildMissingNode(missingItems: string[]): TreeNode | null {
    if (missingItems.length === 0) {
        return null;
    }

    return {
        severity: "error",
        title: "Missing",
        summary: `[${missingItems.join(", ")}]`,
    };
}

function buildMismatchNode(mismatchItems: string[]): TreeNode | null {
    if (mismatchItems.length === 0) {
        return null;
    }

    return {
        severity: "error",
        title: "Mismatch",
        summary: `[${mismatchItems.join(", ")}]`,
    };
}

function buildChildren(args: BuildManifestComparisonReportNodeArgs): TreeNode[] {
    const children = [
        buildMissingNode(args.missingItems),
        buildMismatchNode(args.mismatchItems),
    ].filter((node): node is TreeNode => Boolean(node));

    return children;
}

export function buildManifestComparisonReportNode(
    args: BuildManifestComparisonReportNodeArgs
): TreeNode {
    return {
        title: args.pageKey,
        children: [
            {
                title: manifestFileName(args.manifestFile),
                children: buildChildren(args),
            },
        ],
    };
}
