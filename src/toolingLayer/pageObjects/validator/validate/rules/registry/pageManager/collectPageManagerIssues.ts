// src/toolingLayer/pageObjects/validator/validate/rules/registry/pageManager/collectPageManagerIssues.ts

import { toCamelFromText } from "@utils/text";
import type { ValidationIssue } from "../../../types";
import type {
    GroupedPageManagerIssues,
    PageManagerExpectedState,
} from "./pageManagerTypes";
import { formatKeyList } from "./formatKeyList";

type CollectPageManagerIssuesArgs = {
    ruleId: string;
    filePath: string;
    expectedState: PageManagerExpectedState;
    actualImports: Map<string, string>;
    actualKeyIds: Set<string>;
};

function pageMember(pageKey: string): string {
    const pageName = pageKey.split(".").slice(-1)[0] || "page";
    return toCamelFromText(pageName);
}

function pageKeyFromImportPath(importPath: string): string {
    return importPath.replace("@businessLayer/pageObjects/objects/", "").replace(/\/[^/]+$/, "").replace(/\//g, ".");
}

function pageKeyFromKeyId(keyId: string): string {
    return keyId;
}

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

        const className = importPath.split("/").slice(-1)[0] || "UnknownPage";
        pushGroupedValue(missingByPage, pageKey, className);

        issues.push({
            ruleId: args.ruleId,
            severity: "ERROR",
            issueLabel: "Missing",
            message: formatKeyList([className]),
            pageKey,
            filePath: args.filePath,
        });
    }

    for (const [pageKey, keyId] of args.expectedState.keyIdByPage.entries()) {
        if (args.actualKeyIds.has(keyId)) {
            continue;
        }

        const member = pageMember(pageKey);
        pushGroupedValue(missingByPage, pageKey, member);

        issues.push({
            ruleId: args.ruleId,
            severity: "ERROR",
            issueLabel: "Missing",
            message: formatKeyList([member]),
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
