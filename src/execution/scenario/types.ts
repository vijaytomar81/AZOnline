// src/execution/scenario/types.ts

export type ScenarioStartFrom = "NewBusiness" | "ExistingPolicy";

export type ScenarioExecuteFlag = "Y" | "N";

export type RawScenarioRow = {
    ScenarioId: string;
    ScenarioName?: string;
    Journey?: string;
    StartFrom?: string;
    PolicyNumber?: string;
    Description?: string;
    Execute?: string;
    [key: string]: unknown;
};

export type ScenarioStep = {
    stepNo: number;
    action: string;
    subType?: string;
    portal?: string;
    dataRef?: string;
};

export type ExecutionScenario = {
    scenarioId: string;
    scenarioName: string;
    journey: string;
    startFrom: ScenarioStartFrom;
    policyNumber?: string;
    description?: string;
    execute: boolean;
    steps: ScenarioStep[];
};

export type ScenarioValidationResult = {
    scenarioId: string;
    errors: string[];
};