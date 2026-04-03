// src/pageActionTools/page-action-repair/repair/rules/hygiene/repairGeneratedHeaderPath.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_ACTIONS_DIR, toRepoRelative } from "@utils/paths";
import type { RepairRule } from "../../types";

function walk(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(full);
        return entry.name.endsWith(".action.ts") ? [full] : [];
    });
}

export const repairGeneratedHeaderPath: RepairRule = {
    category: "hygiene",
    name: "repairGeneratedHeaderPath",
    description: "Repair incorrect generated header path comments",
    run: () => {
        const appliedFixes: string[] = [];

        walk(PAGE_ACTIONS_ACTIONS_DIR).forEach((filePath) => {
            const text = fs.readFileSync(filePath, "utf8");
            const lines = text.split("\n");
            const expected = `// ${toRepoRelative(filePath)}`;

            if (lines[0]?.trim() !== expected) {
                lines[0] = expected;
                fs.writeFileSync(filePath, lines.join("\n"));
                appliedFixes.push(`Fixed header path in ${toRepoRelative(filePath)}`);
            }
        });

        return {
            category: "hygiene",
            name: "repairGeneratedHeaderPath",
            appliedFixes,
            issues: [],
        };
    },
};
