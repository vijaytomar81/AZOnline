// src/frameworkCore/executionLayer/contracts/ResolvedExecutionItemData.ts

export type ExecutionItemDataSource = {
    action: string;
    subType?: string;
};

export type ResolvedExecutionItemData = {
    testCaseRef: string;
    payload: Record<string, unknown>;
    source: ExecutionItemDataSource;
};
