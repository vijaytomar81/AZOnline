// src/frameworkCore/executionLayer/contracts/ExecutionItem.ts

export type ExecutionItem = {
    itemNo: number;
    action: string;
    subType?: string;
    portal?: string;
    testCaseRef: string;
};
