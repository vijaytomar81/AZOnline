// src/pageActionTools/page-action-validator/validate/rules/registry/checkIndexExports.ts

import fs from "node:fs";
import path from "node:path";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_DIR,
} from "@utils/paths";
import type { ValidationRule } from "../../types";

function mustContain(filePath: string, expected: string): string[] {
    if (!fs.existsSync(filePath)) return [`Missing index file: ${filePath}`];
    const text = fs.readFileSync(filePath, "utf8");
    return text.includes(expected) ? [] : [`Missing export '${expected}' in ${filePath}`];
}

export const checkIndexExports: ValidationRule = {
    category: "registry",
    name: "checkIndexExports",
    description: "Validate page action index exports",
    run: (context) => {
        const issues: Array<{ level: "error"; message: string }> = [];
        mustContain(path.join(PAGE_ACTIONS_DIR, "index.ts"), 'export * from "./actions";')
            .forEach((message) => issues.push({ level: "error", message }));
        mustContain(path.join(PAGE_ACTIONS_DIR, "index.ts"), 'export * from "./shared";')
            .forEach((message) => issues.push({ level: "error", message }));

        const platforms = new Set(
            Object.values(context.pageActionEntries).map((entry) =>
                entry.paths.actionFile.split("/actions/")[1]?.split("/")[0]
            ).filter(Boolean) as string[]
        );

        platforms.forEach((platform) => {
            mustContain(
                path.join(PAGE_ACTIONS_ACTIONS_DIR, "index.ts"),
                `export * from "./${platform}";`
            ).forEach((message) => issues.push({ level: "error", message }));
        });

        return {
            category: "registry",
            name: "checkIndexExports",
            issues,
        };
    },
};
