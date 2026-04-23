// src/businessLayer/businessJourneys/runtime/resolveNewBusinessJourney.ts

import { AppError } from "@utils/errors";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { BusinessJourney } from "@businessLayer/businessJourneys/framework";

type NewBusinessJourneyModule = {
    runNewBusinessJourney?: BusinessJourney;
};

function buildModulePath(scenario: ExecutionScenario): string {
    return [
        "@businessLayer/businessJourneys",
        scenario.platform,
        scenario.application,
        scenario.product,
        "NewBusiness",
    ].join("/");
}

export function resolveNewBusinessJourney(
    scenario: ExecutionScenario
): BusinessJourney {
    const modulePath = buildModulePath(scenario);

    try {
        const resolved = require(modulePath) as NewBusinessJourneyModule;
        const journey = resolved.runNewBusinessJourney;

        if (journey) {
            return journey;
        }

        throw new AppError({
            code: "BUSINESS_JOURNEY_EXPORT_MISSING",
            stage: "business-journey",
            source: "resolveNewBusinessJourney",
            message:
                'Generated module does not export "runNewBusinessJourney".',
            context: {
                modulePath,
            },
        });
    } catch (error) {
        const isMissingModule =
            error instanceof Error &&
            "code" in error &&
            (error as { code?: string }).code === "MODULE_NOT_FOUND" &&
            error.message.includes(modulePath);

        if (isMissingModule) {
            throw new AppError({
                code: "BUSINESS_JOURNEY_NOT_FOUND",
                stage: "business-journey",
                source: "resolveNewBusinessJourney",
                message:
                    "No generated NewBusiness journey exists for the current route.",
                context: {
                    modulePath,
                    platform: scenario.platform,
                    application: scenario.application,
                    product: scenario.product,
                },
            });
        }

        throw error;
    }
}
