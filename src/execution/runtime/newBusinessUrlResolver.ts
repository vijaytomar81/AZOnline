// src/execution/runtime/newBusinessUrlResolver.ts

import { AppError } from "../../utils/errors";
import { environments } from "../../config/environments";
import type { ExecutionScenario } from "../scenario/types";

function normalizeKey(value?: string): string {
    return String(value ?? "").trim().toLowerCase().replace(/\s+/g, "");
}

function getPcwJourneyUrl(journey: string): string {
    const key = normalizeKey(journey);

    if (key === "ctm") return environments.pcw.ctmMotorUrl;
    if (key === "cnf") return environments.pcw.cnfUrl;
    if (key === "msm") return environments.pcw.msmUrl;
    if (key === "goco") return environments.pcw.gocoUrl;

    throw new AppError({
        code: "UNSUPPORTED_PCW_JOURNEY",
        stage: "resolve-start-url",
        source: "newBusinessUrlResolver",
        message: `Unsupported PCW journey "${journey}" for NB smoke.`,
        context: {
            journey,
        },
    });
}

export function resolveNewBusinessStartUrl(scenario: ExecutionScenario): string {
    const entryPoint = normalizeKey(scenario.entryPoint);
    const journey = normalizeKey(scenario.journey);
    const env = environments.envs[environments.defaultEnv];

    if (entryPoint === "pcwtool") {
        return env.aggTestToolUrl;
    }

    if (entryPoint === "pcw") {
        return getPcwJourneyUrl(scenario.journey);
    }

    if (journey === "direct") {
        return env.customerPortalUrl;
    }

    return getPcwJourneyUrl(scenario.journey);
}