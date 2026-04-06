// src/pageActionTools/page-action-repair/repair/rules/registry/repairRootPageActionsExports.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_DIR, toRepoRelative } from "@utils/paths";
import type { RepairAppliedFix, RepairRule } from "../../types";

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

export const repairRootPageActionsExports: RepairRule = {
    category: "registry",
    name: "repairRootPageActionsExports",
    description: "Repair src/pageActions/index.ts exports",
    run: () => {
        const filePath = path.join(PAGE_ACTIONS_DIR, "index.ts");
        const appliedFixes: RepairAppliedFix[] = [];

        [
            {
                key: "pageActions -> root shared export",
                line: 'export * from "./shared";',
                message: "Updated root shared export.",
            },
            {
                key: "pageActions -> root actions export",
                line: 'export * from "./actions";',
                message: "Updated root actions export.",
            },
        ].forEach((item) => {
            const result = ensureLine(filePath, item.line);

            if (!result.changed) {
                return;
            }

            appliedFixes.push({
                key: item.key,
                message: item.message,
                meta: {
                    filePath: toRepoRelative(filePath),
                    incorrectValueFound: result.incorrectValueFound,
                    fixReplacedValue: result.fixReplacedValue,
                },
            });
        });

        return {
            category: "registry",
            name: "repairRootPageActionsExports",
            appliedFixes,
            issues: [],
        };
    },
};
