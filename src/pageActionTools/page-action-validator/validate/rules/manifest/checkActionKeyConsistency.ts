// src/pageActionTools/page-action-validator/validate/rules/manifest/checkActionKeyConsistency.ts

import path from "node:path";
import type { ValidationRule } from "../../types";

export const checkActionKeyConsistency: ValidationRule = {
    category: "manifest",
    name: "checkActionKeyConsistency",
    description: "Validate manifest actionKey matches expected naming convention",
    run: (context) => {
        const issues = Object.entries(context.pageActionEntries).flatMap(
            ([pageKey, entry]) => {
                const fileBase = path.basename(entry.paths.actionFile, ".ts");
                const [platform, group] = pageKey.split(".");
                const expected = `${platform}.${group}.${fileBase}.action`;

                return entry.actionKey === expected
                    ? []
                    : [{
                        level: "error" as const,
                        message: `Incorrect actionKey for ${pageKey}: expected ${expected}, got ${entry.actionKey}`,
                    }];
            }
        );

        return {
            category: "manifest",
            name: "checkActionKeyConsistency",
            issues,
        };
    },
};
