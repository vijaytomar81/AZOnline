// src/pageActionTools/page-action-validator/validate/types.ts

export type PageActionManifestEntry = {
    pageKey: string;
    actionKey: string;
    group: string;
    actionName: string;
    paths: {
        actionFile: string;
        indexFile: string;
        sourcePageObjectFile: string;
    };
    generatedAt: string;
};

export type ValidationIssue = {
    level: "warning" | "error";
    message: string;
};

export type ValidationRuleResult = {
    category: string;
    name: string;
    issues: ValidationIssue[];
};

export type ValidationContext = {
    verbose: boolean;
    strict: boolean;
    pageObjectManifestDir: string;
    pageActionManifestDir: string;
    pageActionActionsDir: string;
    pageObjectIndex: Record<string, string>;
    pageActionIndex: Record<string, string>;
    pageActionEntries: Record<string, PageActionManifestEntry>;
    actionFiles: string[];
};

export type ValidationRule = {
    category: string;
    name: string;
    description: string;
    run: (context: ValidationContext) => ValidationRuleResult;
};
