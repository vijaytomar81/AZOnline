// src/execution/scenario/types.ts

export type ScenarioStartFrom = "NewBusiness" | "ExistingPolicy";

export type RawScenarioRow = {
    ScenarioId: string;
    ScenarioName?: string;
    Journey?: string;
    StartFrom?: string;
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
    startFrom: ScenarioStartFrom;
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