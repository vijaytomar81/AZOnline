// src/toolingLayer/pageActions/generator/shared/types.ts

import type { PageScope } from "../manifest/types";

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
    actionSlug: string;
};

export type ActionPathInfo = {
    platform: string;
    application: string;
    product: string;
    actionDir: string;
    actionFile: string;
    productIndexFile: string;
    applicationIndexFile: string;
    platformIndexFile: string;
    actionsIndexFile: string;
    rootIndexFile: string;
    manifestDir: string;
    manifestIndexFile: string;
    manifestEntryFile: string;
};

export type ActionRegistryEntry = {
    pageKey: string;
    scope: PageScope;
    actionName: string;
    actionFileName: string;
    paths: Pick<
        ActionPathInfo,
        | "productIndexFile"
        | "applicationIndexFile"
        | "platformIndexFile"
        | "actionsIndexFile"
        | "rootIndexFile"
    >;
};

export type PageActionOperation =
    | "created"
    | "updated"
    | "unchanged"
    | "failed";

export type GenerateSummary = {
    availablePages: number;
    existingActions: number;
    created: number;
    updated: number;
    unchanged: number;
    failed: number;
    registryFilesCreated: number;
    registryFilesUpdated: number;
    invalidPages: number;
    exitCode: number;
};
