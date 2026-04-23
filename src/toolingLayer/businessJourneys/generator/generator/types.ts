// src/toolingLayer/businessJourneys/generator/generator/types.ts

import type {
    Platform,
} from "@configLayer/models/platform.config";

import type {
    Application,
} from "@configLayer/models/application.config";

import type {
    Product,
} from "@configLayer/models/product.config";

import type {
    JourneyType,
} from "@configLayer/models/journeyContext.config";

export type JourneyTarget = {
    entryPlatform: Platform;
    entryApplication: Application;
    destinationPlatform: Platform;
    destinationApplication: Application;
    product: Product;
    journeyType: JourneyType;
};

export type PageActionEntry = {
    pageKey: string;
    actionKey: string;
    actionName: string;
    scope: {
        platform: string;
        application: string;
        product: string;
        name: string;
        namespace: string;
    };
    paths: {
        actionFile: string;
    };
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

/*
Temporary compatibility only.
Can be removed later if no file imports it.
*/
export type StepMapping = {
    stepName: string;
    stepFileName: string;
    stepExportName: string;
    stepFolder: string;
    actionImportName: string;
    actionImportSource: string;
    payloadExpression: string;
};
