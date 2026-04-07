// src/executionLayer/contracts/ExecutionScenario.ts

import type { ExecutionItem } from "./ExecutionItem";
import type {
    Application,
    Product,
} from "@configLayer/domain/routing.config";

export type ExecutionPolicyContext = "NewBusiness" | "ExistingPolicy";
export type ExecutionEntryPoint = "Direct" | "PCW" | "PCWTool";

export type ExecutionScenario = {
    scenarioId: string;
    scenarioName: string;
    journey: string;
    policyContext: ExecutionPolicyContext;
    entryPoint?: ExecutionEntryPoint;
    application?: Application;
    product?: Product;
    policyNumber?: string;
    loginId?: string;
    password?: string;
    description: string;
    execute: boolean;
    totalItems: number;
    items: ExecutionItem[];
};
