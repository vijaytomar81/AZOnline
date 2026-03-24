// src/execution/runtime/registerDefaults.ts

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

function logRegistration(
    bootstrap: ExecutionBootstrap,
    registration: ExecutorRegistration
): void {
    const log = bootstrap.log.child("register-defaults");
    const route = [
        `action=${registration.action}`,
        registration.journey ? `journey=${registration.journey}` : "",
        registration.portal ? `portal=${registration.portal}` : "",
        registration.subType ? `subType=${registration.subType}` : "",
    ]
        .filter(Boolean)
        .join(", ");

    log.info(`Registered executor for ${route}`);
    log.debug(
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

    logRegistration(bootstrap, registration);
}

export function registerDefaultExecutors(
    bootstrap: ExecutionBootstrap
): void {
    const log = bootstrap.log.child("register-defaults");

    log.info("Registering default step executors...");

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

    log.info(`Default executor registration completed. Count=${registrations.length}`);
    log.debug(
        `Registered actions: ${registrations.map((r) => r.action).join(", ")}`
    );
}