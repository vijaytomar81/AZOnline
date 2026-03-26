// src/execution/runtime/registerDefaults.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { createLogEvent, logEvent } from "@logging/log";
import { addStepExecutor, type ExecutionBootstrap } from "@execution/core/bootstrap";
import { runMta } from "../journeys/mta";
import { runMtc } from "../journeys/mtc";
import { runNewBusiness } from "../journeys/newBusiness";
import { runRenewal } from "../journeys/renewal";

type ExecutorRegistration = {
    action: string;
    journey?: string;
    portal?: string;
    subType?: string;
    executorName: string;
    executor: Parameters<typeof addStepExecutor>[0]["executor"];
};

function emitFrameworkLog(
    level: "debug" | "info" | "warn" | "error",
    message: string
): void {
    logEvent(createLogEvent({
        level,
        category: LOG_CATEGORIES.FRAMEWORK,
        message,
        scope: "execution:register-defaults",
    }));
}

function buildRoute(registration: ExecutorRegistration): string {
    return [
        `action=${registration.action}`,
        registration.journey ? `journey=${registration.journey}` : "",
        registration.portal ? `portal=${registration.portal}` : "",
        registration.subType ? `subType=${registration.subType}` : "",
    ]
        .filter(Boolean)
        .join(", ");
}

function logRegistration(registration: ExecutorRegistration): void {
    const route = buildRoute(registration);

    emitFrameworkLog(LOG_LEVELS.DEBUG, `Registered executor for ${route}`);
    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Executor mapping -> ${route}, handler=${registration.executorName}`
    );
}

function registerOne(
    bootstrap: ExecutionBootstrap,
    registration: ExecutorRegistration
): void {
    addStepExecutor({
        bootstrap,
        action: registration.action,
        journey: registration.journey,
        portal: registration.portal,
        subType: registration.subType,
        executor: registration.executor,
    });

    logRegistration(registration);
}

export function registerDefaultExecutors(
    bootstrap: ExecutionBootstrap
): void {
    emitFrameworkLog(LOG_LEVELS.DEBUG, "Registering default step executors...");

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
        registerOne(bootstrap, registration);
    });

    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Default executor registration completed. Count=${registrations.length}`
    );
    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Registered actions: ${registrations.map((r) => r.action).join(", ")}`
    );
}