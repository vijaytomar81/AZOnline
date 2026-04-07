// src/executionLayer/contracts/ResolvedExecutionItemData.ts

export type ExecutionItemDataSource = {
    action: string;
    sheetName: string;
    schemaName?: string;
    journey?: string;
    subType?: string;
};

export type ResolvedExecutionItemData = {
    testCaseRef: string;
    payload: Record<string, unknown>;
    source: ExecutionItemDataSource;
    sourceFileSheet: string;
};
