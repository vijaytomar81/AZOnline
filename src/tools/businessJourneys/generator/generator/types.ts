// src/tools/businessJourneys/generator/generator/types.ts

export type JourneyTarget = {
    application: string;
    product: string;
    journey: string;
    entryPoint: string;
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
    stepFolder: "athena" | "partner";
    actionImportName: string;
    actionImportSource: string;
    payloadExpression: string;
};
