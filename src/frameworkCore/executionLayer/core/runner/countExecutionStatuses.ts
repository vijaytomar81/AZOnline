// src/frameworkCore/executionLayer/core/runner/countExecutionStatuses.ts

import type { RunOutput } from "./types";

export function countExecutionStatuses(outputs: RunOutput[]): {
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
