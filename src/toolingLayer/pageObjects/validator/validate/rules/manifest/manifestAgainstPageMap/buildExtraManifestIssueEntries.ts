// src/toolingLayer/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/buildExtraManifestIssueEntries.ts

import type { TreeNode } from "@utils/cliTree";
import {
    manifestFileName,
} from "./manifestAgainstPageMapFormatters";
import type { ExtraManifestIssueEntriesResult } from "./manifestAgainstPageMapTypes";

type BuildExtraManifestIssueEntriesArgs = {
    manifestPages: Record<string, unknown>;
    validPageKeys: Set<string>;
    manifestFile: string;
    ruleId: string;
};

export function buildExtraManifestIssueEntries(
    args: BuildExtraManifestIssueEntriesArgs
): ExtraManifestIssueEntriesResult {
    const issues = [];
    const reportNodes: TreeNode[] = [];
    const extraManifestKeys = Object.keys(args.manifestPages).filter(
        (pageKey) => !args.validPageKeys.has(pageKey)
    );

    for (const pageKey of extraManifestKeys) {
        issues.push({
            ruleId: args.ruleId,
            severity: "ERROR" as const,
            issueLabel: "Extra",
            message: "[manifestEntryKey]",
            pageKey,
            filePath: args.manifestFile,
        });

        reportNodes.push({
            title: pageKey,
            children: [
                {
                    title: manifestFileName(args.manifestFile),
                    children: [
                        {
                            severity: "error",
                            title: "Extra",
                            summary: "[manifestEntryKey]",
                        },
                    ],
                },
            ],
        });
    }

    return {
        issues,
        reportNodes,
    };
}
