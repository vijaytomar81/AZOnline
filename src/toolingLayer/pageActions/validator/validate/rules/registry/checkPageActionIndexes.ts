// src/toolingLayer/pageActions/validator/validate/rules/registry/checkPageActionIndexes.ts

import fs from "node:fs";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { loadPageObjectManifestIndex } from "../../../shared/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "../../../shared/loadPageObjectManifestPage";
import { buildExpectedActionState } from "../../../shared/expectedActionState";

export function checkPageActionIndexes(): ValidationCheckResult {
    try {
        const pageIndex = loadPageObjectManifestIndex();
        const byFile = new Map<string, string[]>();

        Object.values(pageIndex.pages).forEach((relativePath) => {
            const page = loadPageObjectManifestPage(relativePath);
            const expected = buildExpectedActionState(page);

            const entries: Array<[string, string]> = [
                [expected.manifestEntry.paths.rootIndexFile, 'export * from "./shared";'],
                [expected.manifestEntry.paths.rootIndexFile, 'export * from "./actions";'],
                [expected.manifestEntry.paths.actionsIndexFile, `export * from "./${page.scope.platform}";`],
                [expected.manifestEntry.paths.platformIndexFile, `export * from "./${page.scope.application}";`],
                [expected.manifestEntry.paths.applicationIndexFile, `export * from "./${page.scope.product}";`],
                [
                    expected.manifestEntry.paths.productIndexFile,
                    `export { ${expected.actionName} } from "./${expected.actionFileName.replace(".ts", "")}";`,
                ],
            ];

            entries.forEach(([filePath, line]) => {
                const list = byFile.get(filePath) ?? [];
                list.push(line);
                byFile.set(filePath, list);
            });
        });

        const issues: ValidationNode[] = [];

        byFile.forEach((lines, filePath) => {
            if (!fs.existsSync(filePath)) {
                issues.push({
                    severity: "error",
                    title: filePath,
                    summary: "missing index file",
                });
                return;
            }

            const content = fs.readFileSync(filePath, "utf8");
            const firstLine = content.split("\n")[0] ?? "";

            if (!firstLine.startsWith("// ")) {
                issues.push({
                    severity: "error",
                    title: filePath,
                    summary: "missing file header",
                });
            }

            const missingLines = [...new Set(lines)].filter(
                (line) => !content.includes(line)
            );

            if (missingLines.length > 0) {
                issues.push({
                    severity: "error",
                    title: filePath,
                    children: missingLines.map((line) => ({
                        severity: "error",
                        title: "missing export",
                        summary: line,
                    })),
                });
            }
        });

        return {
            id: "checkPageActionIndexes",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkPageActionIndexes",
            severity: "error",
            summary: "unable to inspect registry indexes",
        };
    }
}
