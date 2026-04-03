// src/pageActionTools/page-action-repair/repair/rules/registry/repairIndexExports.ts

import fs from "node:fs";
import path from "node:path";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_DIR,
    toRepoRelative,
} from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import { loadPageObjectManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import type { RepairRule } from "../../types";

function ensureLine(filePath: string, expectedLine: string): {
    changed: boolean;
    incorrectValueFound?: string;
    fixReplacedValue?: string;
} {
    const current = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf8")
        : "";

    const lines = current
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.includes(expectedLine)) {
        return { changed: false };
    }

    const incorrectValueFound = lines.join(" | ");
    const nextLines = Array.from(new Set([...lines, expectedLine])).sort();
    const nextContent = `${nextLines.join("\n")}\n`;

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, nextContent);

    return {
        changed: true,
        incorrectValueFound: incorrectValueFound || "(missing export)",
        fixReplacedValue: expectedLine,
    };
}

export const repairIndexExports: RepairRule = {
    category: "registry",
    name: "repairIndexExports",
    description: "Repair missing page action index exports",
    run: () => {
        const pageObjectIndex = loadPageObjectManifestIndex();
        const appliedFixes = [];

        const platformSet = new Set<string>();

        Object.keys(pageObjectIndex.pages).sort().forEach((pageKey) => {
            const page = loadPageObjectManifestPage(pageObjectIndex.pages[pageKey]);
            const naming = buildActionName(page);
            const paths = buildActionPath({ page, naming });
            const platform = paths.platform;

            platformSet.add(platform);

            const platformIndexExpected = `export { ${naming.actionName} } from "./${page.group}/${naming.actionFileName.replace(".ts", "")}";`;
            const platformIndexResult = ensureLine(
                paths.platformIndexFile,
                platformIndexExpected
            );

            if (platformIndexResult.changed) {
                appliedFixes.push({
                    key: `${pageKey} -> platform index`,
                    message: "Updated platform index export.",
                    meta: {
                        filePath: toRepoRelative(paths.platformIndexFile),
                        incorrectValueFound: platformIndexResult.incorrectValueFound,
                        fixReplacedValue: platformIndexResult.fixReplacedValue,
                    },
                });
            }
        });

        platformSet.forEach((platform) => {
            const rootActionsIndexFile = path.join(PAGE_ACTIONS_ACTIONS_DIR, "index.ts");
            const rootActionsExpected = `export * from "./${platform}";`;
            const rootActionsResult = ensureLine(
                rootActionsIndexFile,
                rootActionsExpected
            );

            if (rootActionsResult.changed) {
                appliedFixes.push({
                    key: `${platform} -> actions index`,
                    message: "Updated actions root export.",
                    meta: {
                        filePath: toRepoRelative(rootActionsIndexFile),
                        incorrectValueFound: rootActionsResult.incorrectValueFound,
                        fixReplacedValue: rootActionsResult.fixReplacedValue,
                    },
                });
            }
        });

        const rootIndexFile = path.join(PAGE_ACTIONS_DIR, "index.ts");

        const sharedExportResult = ensureLine(
            rootIndexFile,
            'export * from "./shared";'
        );

        if (sharedExportResult.changed) {
            appliedFixes.push({
                key: "pageActions -> root shared export",
                message: "Updated root shared export.",
                meta: {
                    filePath: toRepoRelative(rootIndexFile),
                    incorrectValueFound: sharedExportResult.incorrectValueFound,
                    fixReplacedValue: sharedExportResult.fixReplacedValue,
                },
            });
        }

        const actionsExportResult = ensureLine(
            rootIndexFile,
            'export * from "./actions";'
        );

        if (actionsExportResult.changed) {
            appliedFixes.push({
                key: "pageActions -> root actions export",
                message: "Updated root actions export.",
                meta: {
                    filePath: toRepoRelative(rootIndexFile),
                    incorrectValueFound: actionsExportResult.incorrectValueFound,
                    fixReplacedValue: actionsExportResult.fixReplacedValue,
                },
            });
        }

        return {
            category: "registry",
            name: "repairIndexExports",
            appliedFixes,
            issues: [],
        };
    },
};
