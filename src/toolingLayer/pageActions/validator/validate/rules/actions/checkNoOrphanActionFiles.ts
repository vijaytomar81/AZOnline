// src/toolingLayer/pageActions/validator/validate/rules/actions/checkNoOrphanActionFiles.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_ACTIONS_DIR, toRepoRelative } from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { buildExpectedActionState } from "../../../shared/expectedActionState";
import { loadPageObjectManifestIndex } from "../../../shared/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "../../../shared/loadPageObjectManifestPage";

function collectActionFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files: string[] = [];

    for (const item of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...collectActionFiles(fullPath));
            continue;
        }

        if (item.endsWith(".action.ts")) {
            files.push(fullPath);
        }
    }

    return files;
}

export function checkNoOrphanActionFiles(): ValidationCheckResult {
    try {
        const pageIndex = loadPageObjectManifestIndex();
        const expectedFiles = new Set(
            Object.values(pageIndex.pages).map((relativePath) => {
                const page = loadPageObjectManifestPage(relativePath);
                return buildExpectedActionState(page).actionFilePath;
            })
        );

        const actualFiles = collectActionFiles(PAGE_ACTIONS_ACTIONS_DIR);
        const orphanFiles = actualFiles.filter((filePath) => !expectedFiles.has(filePath));

        const nodes: ValidationNode[] = orphanFiles.map((filePath) => ({
            severity: "warning",
            title: toRepoRelative(filePath),
            summary: "orphan action file",
        }));

        return {
            id: "checkNoOrphanActionFiles",
            severity: nodes.length === 0 ? "success" : "warning",
            summary: nodes.length === 0 ? "no issues" : `${nodes.length} orphan file(s)`,
            nodes,
        };
    } catch {
        return {
            id: "checkNoOrphanActionFiles",
            severity: "error",
            summary: "unable to inspect action files",
        };
    }
}
