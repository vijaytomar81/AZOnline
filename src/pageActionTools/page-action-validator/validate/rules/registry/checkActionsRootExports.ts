// src/pageActionTools/page-action-validator/validate/rules/registry/checkActionsRootExports.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_ACTIONS_DIR, toRepoRelative } from "@utils/paths";
import type { ValidationRule } from "../../types";

export const checkActionsRootExports: ValidationRule = {
    category: "registry",
    name: "checkActionsRootExports",
    description: "Validate src/pageActions/actions/index.ts exports all platform indexes",
    run: (context) => {
        const filePath = path.join(PAGE_ACTIONS_ACTIONS_DIR, "index.ts");

        if (!fs.existsSync(filePath)) {
            return {
                category: "registry",
                name: "checkActionsRootExports",
                issues: [{
                    level: "error",
                    key: "pageActions actions root index",
                    message: "Missing src/pageActions/actions/index.ts",
                    meta: {
                        filePath: toRepoRelative(filePath),
                        expected: "(platform exports)",
                        actual: "(missing file)",
                    },
                }],
            };
        }

        const content = fs.readFileSync(filePath, "utf8");
        const platforms = Array.from(
            new Set(
                Object.values(context.pageActionEntries).map((entry) =>
                    entry.paths.actionFile.split("/actions/")[1]?.split("/")[0]
                )
            )
        ).filter(Boolean) as string[];

        const issues = platforms.flatMap((platform) => {
            const expected = `export * from "./${platform}";`;

            return content.includes(expected)
                ? []
                : [{
                    level: "error" as const,
                    key: `${platform} platform export`,
                    message: "Missing platform export in actions root index.",
                    meta: {
                        filePath: toRepoRelative(filePath),
                        expected,
                        actual: "(missing export)",
                    },
                }];
        });

        return {
            category: "registry",
            name: "checkActionsRootExports",
            issues,
        };
    },
};
