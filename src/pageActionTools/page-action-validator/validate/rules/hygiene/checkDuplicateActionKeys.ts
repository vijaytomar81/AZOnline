// src/pageActionTools/page-action-validator/validate/rules/hygiene/checkDuplicateActionKeys.ts

import type { ValidationRule } from "../../types";

export const checkDuplicateActionKeys: ValidationRule = {
    category: "hygiene",
    name: "checkDuplicateActionKeys",
    description: "Validate there are no duplicate actionKey values in manifest entries",
    run: (context) => {
        const keyToPages = new Map<string, string[]>();

        Object.entries(context.pageActionEntries).forEach(([pageKey, entry]) => {
            const pages = keyToPages.get(entry.actionKey) ?? [];
            pages.push(pageKey);
            keyToPages.set(entry.actionKey, pages);
        });

        const issues = Array.from(keyToPages.entries()).flatMap(
            ([actionKey, pageKeys]) =>
                pageKeys.length > 1
                    ? [{
                        level: "error" as const,
                        key: actionKey,
                        message: `Duplicate actionKey detected across pages: ${pageKeys.join(", ")}`,
                    }]
                    : []
        );

        return {
            category: "hygiene",
            name: "checkDuplicateActionKeys",
            issues,
        };
    },
};
