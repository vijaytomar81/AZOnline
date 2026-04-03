// src/pageActionTools/page-action-validator/validate/rules/hygiene/checkActionFunctionName.ts

import fs from "node:fs";
import type { ValidationRule } from "../../types";

export const checkActionFunctionName: ValidationRule = {
    category: "hygiene",
    name: "checkActionFunctionName",
    description: "Validate expected action export exists in each action file",
    run: (context) => {
        const issues = Object.values(context.pageActionEntries).flatMap((entry) => {
            const text = fs.readFileSync(entry.paths.actionFile, "utf8");
            const expected = `export const ${entry.actionName}`;
            return text.includes(expected)
                ? []
                : [{
                    level: "error" as const,
                    message: `Missing expected action export '${entry.actionName}' in ${entry.paths.actionFile}`,
                }];
        });

        return {
            category: "hygiene",
            name: "checkActionFunctionName",
            issues,
        };
    },
};
