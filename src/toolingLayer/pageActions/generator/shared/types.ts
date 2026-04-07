// src/tools/pageActions/generator/shared/types.ts

export type ExtractedMethod = {
    name: string;
    hasArguments: boolean;
};

export type ClassifiedMethods = {
    activeValueMethods: ExtractedMethod[];
    conditionalIndexedValueMethods: ExtractedMethod[];
    conditionalIndexedControlMethods: ExtractedMethod[];
    todoValueMethods: ExtractedMethod[];
    suggestionMethods: ExtractedMethod[];
};

export type ActionNaming = {
    actionName: string;
    actionFileName: string;
    actionKey: string;
};

export type ActionPathInfo = {
    platform: string;
    group: string;
    actionDir: string;
    actionFile: string;
    leafIndexFile: string;
    platformIndexFile: string;
    rootIndexFile: string;
    manifestDir: string;
    manifestIndexFile: string;
    manifestActionsDir: string;
    manifestEntryFile: string;
};

export type GenerateSummary = {
    totalPages: number;
    existingActions: number;
    generatedActions: number;
    skippedActions: number;
};
