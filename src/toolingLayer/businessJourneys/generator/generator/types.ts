// src/toolingLayer/businessJourneys/generator/generator/types.ts

import type { JourneyEntryPoint } from "@configLayer/domain/journeyEntryPoints";
import type { JourneyStepFolder } from "@configLayer/domain/journeyStepFolders";

export type JourneyTarget = {
    application: string;
    product: string;
    journey: string;
    entryPoint: JourneyEntryPoint;
};

export type PageActionEntry = {
    actionKey: string;
    pageKey: string;
    group: string;
    actionName: string;
    actionFile: string;
};

export type JourneyGenerationInputs = {
    pageActions: PageActionEntry[];
};

export type GenerateOptions = {
    verbose: boolean;
};

export type GenerateSummary = {
    targets: number;
    filesCreated: number;
};

export type StepMapping = {
    stepName: string;
    stepFileName: string;
    stepExportName: string;
    stepFolder: JourneyStepFolder;
    actionImportName: string;
    actionImportSource: string;
    payloadExpression: string;
};