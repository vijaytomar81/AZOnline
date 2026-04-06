// src/pageActionTools/page-action-validator/validate/rules/hygiene/checkDuplicateActionNames.ts

import type { ValidationRule } from "../../types";

export const checkDuplicateActionNames: ValidationRule = {
    category: "hygiene",
    name: "checkDuplicateActionNames",
    description: "Validate there are no duplicate actionName values in manifest entries",
    run: (context) => {
        const nameToPages = new Map<string, string[]>();

        Object.entries(context.pageActionEntries).forEach(([pageKey, entry]) => {
            const pages = nameToPages.get(entry.actionName) ?? [];
            pages.push(pageKey);
            nameToPages.set(entry.actionName, pages);
        });

        const issues = Array.from(nameToPages.entries()).flatMap(
            ([actionName, pageKeys]) =>
                pageKeys.length > 1
                    ? [{
                        level: "error" as const,
                        key: actionName,
                        message: `Duplicate actionName detected across pages: ${pageKeys.join(", ")}`,
                    }]
                    : []
        );

        return {
            category: "hygiene",
            name: "checkDuplicateActionNames",
            issues,
        };
    },
};
