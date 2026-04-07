// src/tools/pageObjects/validator/validate/rules/registry/indexExports/collectIndexExportIssues.ts

import type {
    GroupedIndexExportIssues,
    IndexExportExpectedState,
} from "./indexExportTypes";
import { formatKeyList } from "./formatKeyList";
import { pageKeyFromImportPath } from "./indexExportNaming";

type CollectIndexExportIssuesArgs = {
    ruleId: string;
    filePath: string;
    actualExportPaths: Set<string>;
    expectedState: IndexExportExpectedState;
};

function pushGroupedValue(
    map: Map<string, string[]>,
    pageKey: string,
    value: string
): void {
    const current = map.get(pageKey) ?? [];
    current.push(value);
    map.set(pageKey, current);
}

export function collectIndexExportIssues(
    args: CollectIndexExportIssuesArgs
): GroupedIndexExportIssues {
    const issues = [];
    const missingByPage = new Map<string, string[]>();
    const extraByPage = new Map<string, string[]>();

    for (const [pageKey, importPath] of args.expectedState.exportPathByPageKey.entries()) {
        if (args.actualExportPaths.has(importPath)) {
            continue;
        }

        pushGroupedValue(missingByPage, pageKey, importPath);

        issues.push({
            ruleId: args.ruleId,
            severity: "ERROR" as const,
            issueLabel: "Missing",
            message: formatKeyList([importPath]),
            pageKey,
            filePath: args.filePath,
        });
    }

    for (const actualPath of args.actualExportPaths) {
        if (args.expectedState.expectedPaths.has(actualPath)) {
            continue;
        }

        const pageKey = pageKeyFromImportPath(actualPath);
        pushGroupedValue(extraByPage, pageKey, actualPath);

        issues.push({
            ruleId: args.ruleId,
            severity: "WARN" as const,
            issueLabel: "Extra",
            message: formatKeyList([actualPath]),
            pageKey,
            filePath: args.filePath,
        });
    }

    return {
        issues,
        missingByPage,
        extraByPage,
    };
}
