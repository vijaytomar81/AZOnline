// src/toolingLayer/businessJourneys/generator/generator/types.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyType } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import type { JourneyGenerationStatus } from "@toolingLayer/businessJourneys/common";

export type JourneyTarget = {
    platform: Platform;
    application: Application;
    product: Product;
    journeyType: JourneyType;
};

export type PageActionEntry = {
    actionKey: string;
    pageKey: string;
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
    availablePageActions: number;
    created: number;
    updated: number;
    unchanged: number;
    failed: number;
    filesCreated: number;
    filesUpdated: number;
    filesSkipped: number;
    exitCode: number;
};

export type WriteTargetFilesResult = {
    status: JourneyGenerationStatus;
    filesCreated: number;
    filesUpdated: number;
    filesSkipped: number;
};

export type FrameworkFileChange = {
    fileName: string;
    status: "created" | "updated" | "unchanged";
};

export type EnsureFrameworkFilesResult = {
    filesCreated: number;
    filesUpdated: number;
    filesSkipped: number;
    changes: FrameworkFileChange[];
};
