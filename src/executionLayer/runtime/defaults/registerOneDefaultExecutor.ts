// src/executionLayer/runtime/defaults/registerOneDefaultExecutor.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import { addExecutor, type ExecutionBootstrap } from "@executionLayer/core/bootstrap";
import { buildRegistrationRoute } from "./buildRegistrationRoute";
import type { ExecutorRegistration } from "./types";

function logRegistration(
    registration: ExecutorRegistration
): void {
    const route = buildRegistrationRoute(registration);

    emitLog({
        scope: "execution:register-defaults",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Registered executor for ${route}`,
    });

    emitLog({
        scope: "execution:register-defaults",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Executor mapping -> ${route}, handler=${registration.executorName}`,
    });
}

export function registerOneDefaultExecutor(
    bootstrap: ExecutionBootstrap,
    registration: ExecutorRegistration
): void {
    addExecutor({
        bootstrap,
        action: registration.action,
        journey: registration.journey,
        portal: registration.portal,
        subType: registration.subType,
        executor: registration.executor,
    });

    logRegistration(registration);
}
