// src/pageActionTools/page-action-validator/validate/rules/registry/checkRootPageActionsExports.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_DIR, toRepoRelative } from "@utils/paths";
import type { ValidationRule } from "../../types";

export const checkRootPageActionsExports: ValidationRule = {
    category: "registry",
    name: "checkRootPageActionsExports",
    description: "Validate src/pageActions/index.ts exports shared and actions",
    run: () => {
        const filePath = path.join(PAGE_ACTIONS_DIR, "index.ts");

        if (!fs.existsSync(filePath)) {
            return {
                category: "registry",
                name: "checkRootPageActionsExports",
                issues: [{
                    level: "error",
                    key: "pageActions root index",
                    message: "Missing src/pageActions/index.ts",
                    meta: {
                        filePath: toRepoRelative(filePath),
                        expected: 'export * from "./shared"; and export * from "./actions";',
                        actual: "(missing file)",
                    },
                }],
            };
        }

        const content = fs.readFileSync(filePath, "utf8");
        const issues = [];

        if (!content.includes('export * from "./shared";')) {
            issues.push({
                level: "error" as const,
                key: "pageActions root shared export",
                message: 'Missing export * from "./shared";',
                meta: {
                    filePath: toRepoRelative(filePath),
                    expected: 'export * from "./shared";',
                    actual: "(missing export)",
                },
            });
        }

        if (!content.includes('export * from "./actions";')) {
            issues.push({
                level: "error" as const,
                key: "pageActions root actions export",
                message: 'Missing export * from "./actions";',
                meta: {
                    filePath: toRepoRelative(filePath),
                    expected: 'export * from "./actions";',
                    actual: "(missing export)",
                },
            });
        }

        return {
            category: "registry",
            name: "checkRootPageActionsExports",
            issues,
        };
    },
};
