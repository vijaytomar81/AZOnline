// src/pageActionTools/page-action-repair/repair/rules/registry/repairActionsRootExports.ts

import fs from "node:fs";
import path from "node:path";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    toRepoRelative,
} from "@utils/paths";
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

export const repairActionsRootExports: RepairRule = {
    category: "registry",
    name: "repairActionsRootExports",
    description: "Repair src/pageActions/actions/index.ts platform exports",
    run: () => {
        const filePath = path.join(PAGE_ACTIONS_ACTIONS_DIR, "index.ts");
        const platforms = fs.existsSync(PAGE_ACTIONS_ACTIONS_DIR)
            ? fs.readdirSync(PAGE_ACTIONS_ACTIONS_DIR, { withFileTypes: true })
                .filter((entry) => entry.isDirectory())
                .map((entry) => entry.name)
                .sort()
            : [];

        const appliedFixes = platforms.flatMap((platform) => {
            const expectedLine = `export * from "./${platform}";`;
            const result = ensureLine(filePath, expectedLine);

            return result.changed
                ? [{
                    key: `${platform} -> actions index`,
                    message: "Updated actions root export.",
                    meta: {
                        filePath: toRepoRelative(filePath),
                        incorrectValueFound: result.incorrectValueFound,
                        fixReplacedValue: result.fixReplacedValue,
                    },
                }]
                : [];
        });

        return {
            category: "registry",
            name: "repairActionsRootExports",
            appliedFixes,
            issues: [],
        };
    },
};
