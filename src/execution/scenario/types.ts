// src/execution/scenario/types.ts

export type ScenarioPolicyContext = "NewBusiness" | "ExistingPolicy";
export type ScenarioEntryPoint = "Direct" | "PCW" | "PCWTool";

export type RawScenarioRow = {
    ScenarioId: string;
    ScenarioName?: string;
    Journey?: string;
    PolicyContext?: string;
    EntryPoint?: string;
    PolicyNumber?: string;
    LoginId?: string;
    Password?: string;
    Description?: string;
    Execute?: string;
    TotalSteps?: string | number;
    [key: string]: unknown;
};

export type ScenarioStep = {
    stepNo: number;
    action: string;
    subType?: string;
    portal: string;
    testCaseId: string;
};

export type ExecutionScenario = {
    scenarioId: string;
    scenarioName: string;
    journey: string;
    policyContext: ScenarioPolicyContext;
    entryPoint?: ScenarioEntryPoint;
    policyNumber?: string;
    loginId?: string;
    password?: string;
    description: string;
    execute: boolean;
    totalSteps: number;
    steps: ScenarioStep[];
};

export type ScenarioValidationResult = {
    scenarioId: string;
    errors: string[];
};