// src/frameworkCore/executionLayer/runtime/defaults/registerDefaultExecutors.ts

import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import type { ExecutionBootstrap } from "@frameworkCore/executionLayer/core/bootstrap";
import { runNewBusiness } from "@businessLayer/businessJourneys/newBusiness";
import { registerOneDefaultExecutor } from "./registerOneDefaultExecutor";
import type { ExecutorRegistration } from "./types";

export function registerDefaultExecutors(
    bootstrap: ExecutionBootstrap
): void {
    emitLog({
        scope: "execution:register-defaults",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: "Registering default execution item executors...",
    });

    const registrations: ExecutorRegistration[] = [
        {
            action: "NewBusiness",
            executorName: "runNewBusiness",
            executor: runNewBusiness,
        },
    ];

    registrations.forEach((registration) => {
        registerOneDefaultExecutor(bootstrap, registration);
    });

    emitLog({
        scope: "execution:register-defaults",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Default executor registration completed. Count=${registrations.length}`,
    });

    emitLog({
        scope: "execution:register-defaults",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Registered actions: ${registrations.map((item) => item.action).join(", ")}`,
    });
}
