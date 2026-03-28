// src/execution/runtime/defaults/registerDefaultExecutors.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import type { ExecutionBootstrap } from "@execution/core/bootstrap";
import { runMta } from "@execution/journeys/mta";
import { runMtc } from "@execution/journeys/mtc";
import { runNewBusiness } from "@execution/journeys/newBusiness";
import { runRenewal } from "@execution/journeys/renewal";
import { registerOneDefaultExecutor } from "./registerOneDefaultExecutor";
import type { ExecutorRegistration } from "./types";

export function registerDefaultExecutors(
    bootstrap: ExecutionBootstrap
): void {
    emitLog({
        scope: "execution:register-defaults",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: "Registering default step executors...",
    });

    const registrations: ExecutorRegistration[] = [
        {
            action: "NewBusiness",
            executorName: "runNewBusiness",
            executor: runNewBusiness,
        },
        {
            action: "MTA",
            executorName: "runMta",
            executor: runMta,
        },
        {
            action: "MTC",
            executorName: "runMtc",
            executor: runMtc,
        },
        {
            action: "Renewal",
            executorName: "runRenewal",
            executor: runRenewal,
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
        message: `Registered actions: ${registrations.map((r) => r.action).join(", ")}`,
    });
}
