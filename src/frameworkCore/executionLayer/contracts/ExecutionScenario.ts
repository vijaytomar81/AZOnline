// src/frameworkCore/executionLayer/contracts/ExecutionScenario.ts

import type { ExecutionItem } from "./ExecutionItem";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";

export type ExecutionJourneyStartWith =
    | "newPolicy"
    | "existingPolicy";

export type ExecutionScenario = {
    scenarioId: string;
    scenarioName: string;

    platform: Platform;
    application: Application;
    product: Product;

    journeyStartWith: ExecutionJourneyStartWith;

    policyNumber?: string;
    loginId?: string;
    password?: string;

    description: string;
    execute: boolean;
    totalItems: number;
    items: ExecutionItem[];
};
