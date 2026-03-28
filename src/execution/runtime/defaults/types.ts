// src/execution/runtime/defaults/types.ts

import { addStepExecutor } from "@execution/core/bootstrap";

export type ExecutorRegistration = {
    action: string;
    journey?: string;
    portal?: string;
    subType?: string;
    executorName: string;
    executor: Parameters<typeof addStepExecutor>[0]["executor"];
};
