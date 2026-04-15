// src/toolingLayer/pageObjects/validator/validate/rules/registry/pageManager/missingPageManagerResult.ts

export function buildMissingPageManagerResult(
    ruleId: string,
    filePath: string
) {
    return {
        issues: [
            {
                ruleId,
                severity: "ERROR" as const,
                issueLabel: "Missing",
                message: "[pageManager.ts]",
                filePath,
            },
        ],
        reportNodes: [
            {
                title: "registry",
                children: [
                    {
                        title: "pageManager.ts",
                        children: [
                            {
                                severity: "error" as const,
                                title: "Missing",
                                summary: "[pageManager.ts]",
                            },
                        ],
                    },
                ],
            },
        ],
    };
}