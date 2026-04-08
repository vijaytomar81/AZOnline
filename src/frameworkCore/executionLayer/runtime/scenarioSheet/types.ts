// src/frameworkCore/executionLayer/runtime/scenarioSheet/types.ts

export type RawExecutionScenarioRow = {
    ScenarioId: string;
    ScenarioName?: string;

    Platform?: string;
    Application?: string;
    Product?: string;
    JourneyStartWith?: string;

    PolicyNumber?: string;
    LoginId?: string;
    Password?: string;

    Description?: string;
    Execute?: string;
    TotalItems?: string | number;

    [key: string]: unknown;
};

export type LoadScenarioSheetResult = {
    sheetName: string;
    headers: string[];
    rows: RawExecutionScenarioRow[];
};
