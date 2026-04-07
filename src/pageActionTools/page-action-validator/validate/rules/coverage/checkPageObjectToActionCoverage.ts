// src/pageActionTools/page-action-validator/validate/rules/coverage/checkPageObjectToActionCoverage.ts

import type { ValidationRule } from "../../types";

export const checkPageObjectToActionCoverage: ValidationRule = {
    category: "coverage",
    name: "checkPageObjectToActionCoverage",
    description: "Validate every page object page has a page action manifest entry",
    run: (context) => {
        const issues = Object.keys(context.pageObjectIndex)
            .filter((pageKey) => !context.pageActionIndex[pageKey])
            .map((pageKey) => ({
                level: "error" as const,
                message: `Missing page action coverage for page key: ${pageKey}`,
            }));

        return {
            category: "coverage",
            name: "checkPageObjectToActionCoverage",
            issues,
        };
    },
};
