// src/executionLayer/runtime/scenarioSheet/types.ts

export type RawExecutionScenarioRow = {
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
    TotalItems?: string | number;
    [key: string]: unknown;
};

export type LoadScenarioSheetResult = {
    sheetName: string;
    headers: string[];
    rows: RawExecutionScenarioRow[];
};
