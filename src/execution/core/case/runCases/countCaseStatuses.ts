// src/execution/core/case/runCases/countCaseStatuses.ts

import type { CaseRunOutput } from "@execution/core/case/runCaseOutput";

export function countCaseStatuses(outputs: CaseRunOutput[]): {
    passed: number;
    failed: number;
} {
    let passed = 0;
    let failed = 0;

    for (const item of outputs) {
        if (item.status === "passed") {
            passed++;
        } else {
            failed++;
        }
    }

    return { passed, failed };
}
