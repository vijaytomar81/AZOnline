// src/pageActionTools/page-action-validator/validate/rules/environment/checkEnvironment.ts

import fs from "node:fs";
import type { ValidationIssue, ValidationRule } from "../../types";

export const checkEnvironment: ValidationRule = {
    category: "environment",
    name: "checkEnvironment",
    description: "Validate page action validator environment and required paths",
    run: (context) => {
        const issues: ValidationIssue[] = [];

        [
            context.pageObjectManifestDir,
            context.pageActionManifestDir,
            context.pageActionActionsDir,
        ].forEach((dir) => {
            if (!fs.existsSync(dir)) {
                issues.push({
                    level: "error",
                    message: `Missing required path: ${dir}`,
                });
            }
        });

        return {
            category: "environment",
            name: "checkEnvironment",
            issues,
        };
    },
};