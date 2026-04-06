// src/pageActionTools/page-action-repair/repair/rules/registry/repairPlatformIndexExports.ts

import fs from "node:fs";
import path from "node:path";
import { toRepoRelative } from "@utils/paths";
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
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${nextLines.join("\n")}\n`);

    return {
        changed: true,
        incorrectValueFound: incorrectValueFound || "(missing export)",
        fixReplacedValue: expectedLine,
    };
}

export const repairPlatformIndexExports: RepairRule = {
    category: "registry",
    name: "repairPlatformIndexExports",
    description: "Repair platform index exports for page actions",
    run: () => {
        const pageObjectIndex = loadPageObjectManifestIndex();

        const appliedFixes = Object.keys(pageObjectIndex.pages).sort().flatMap((pageKey) => {
            const page = loadPageObjectManifestPage(pageObjectIndex.pages[pageKey]);
            const naming = buildActionName(page);
            const paths = buildActionPath({ page, naming });

            const expectedLine = `export { ${naming.actionName} } from "./${page.group}/${naming.actionFileName.replace(".ts", "")}";`;
            const result = ensureLine(paths.platformIndexFile, expectedLine);

            return result.changed
                ? [{
                    key: pageKey,
                    message: "Updated platform index export.",
                    meta: {
                        filePath: toRepoRelative(paths.platformIndexFile),
                        incorrectValueFound: result.incorrectValueFound,
                        fixReplacedValue: result.fixReplacedValue,
                    },
                }]
                : [];
        });

        return {
            category: "registry",
            name: "repairPlatformIndexExports",
            appliedFixes,
            issues: [],
        };
    },
};
