// src/execution/core/case/runCaseOutput.ts

export type CaseRunOutput = {
    status: "passed" | "failed";
    block: string;
};
