// src/tools/pageObjects/validator/validate/rules/registry/pageManager/collectPageManagerIssues.ts

import type { ValidationIssue } from "../../../types";
import type {
    GroupedPageManagerIssues,
    PageManagerExpectedState,
} from "./pageManagerTypes";
import { formatKeyList } from "./formatKeyList";
import {
    expectedClassName,
    expectedMember,
    pageKeyFromImportPath,
    pageKeyFromKeyId,
} from "./pageManagerNaming";

type CollectPageManagerIssuesArgs = {
    ruleId: string;
    filePath: string;
    expectedState: PageManagerExpectedState;
    actualImports: Map<string, string>;
    actualKeyIds: Set<string>;
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

export function collectPageManagerIssues(
    args: CollectPageManagerIssuesArgs
): GroupedPageManagerIssues {
    const issues: ValidationIssue[] = [];
    const missingByPage = new Map<string, string[]>();
    const extraByPage = new Map<string, string[]>();

    for (const [pageKey, importPath] of args.expectedState.importByPage.entries()) {
        if (args.actualImports.has(importPath)) {
            continue;
        }

        const value = expectedClassName(pageKey);
        pushGroupedValue(missingByPage, pageKey, value);

        issues.push({
            ruleId: args.ruleId,
            severity: "ERROR",
            issueLabel: "Missing",
            message: formatKeyList([value]),
            pageKey,
            filePath: args.filePath,
        });
    }

    for (const [pageKey, keyId] of args.expectedState.keyIdByPage.entries()) {
        if (args.actualKeyIds.has(keyId)) {
            continue;
        }

        const value = expectedMember(pageKey);
        pushGroupedValue(missingByPage, pageKey, value);

        issues.push({
            ruleId: args.ruleId,
            severity: "ERROR",
            issueLabel: "Missing",
            message: formatKeyList([value]),
            pageKey,
            filePath: args.filePath,
        });
    }

    const expectedImportPaths = new Set(args.expectedState.importByPage.values());

    for (const actualImportPath of args.actualImports.keys()) {
        if (expectedImportPaths.has(actualImportPath)) {
            continue;
        }

        const pageKey = pageKeyFromImportPath(actualImportPath);
        pushGroupedValue(extraByPage, pageKey, actualImportPath);

        issues.push({
            ruleId: args.ruleId,
            severity: "WARN",
            issueLabel: "Extra",
            message: formatKeyList([actualImportPath]),
            pageKey,
            filePath: args.filePath,
        });
    }

    const expectedKeyIds = new Set(args.expectedState.keyIdByPage.values());

    for (const actualKeyId of args.actualKeyIds) {
        if (expectedKeyIds.has(actualKeyId)) {
            continue;
        }

        const pageKey = pageKeyFromKeyId(actualKeyId);
        pushGroupedValue(extraByPage, pageKey, actualKeyId);

        issues.push({
            ruleId: args.ruleId,
            severity: "WARN",
            issueLabel: "Extra",
            message: formatKeyList([actualKeyId]),
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