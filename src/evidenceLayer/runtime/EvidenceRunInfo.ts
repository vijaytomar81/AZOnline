// src/evidenceLayer/runtime/EvidenceRunInfo.ts

export type EvidenceRunInfo = {
    runId: string;
    workerId: string;
    testCaseId: string;
    retryIndex?: number;
    suiteName?: string;
    outputRoot?: string;
};