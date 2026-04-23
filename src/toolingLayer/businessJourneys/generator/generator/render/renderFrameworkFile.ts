// src/toolingLayer/businessJourneys/generator/generator/render/renderFrameworkFile.ts

import { toRepoRelative } from "@utils/paths";

export function renderFrameworkFile(args: {
    filePath: string;
    kind:
        | "types"
        | "runJourney"
        | "frameworkIndex"
        | "runtimeResolveNewBusiness"
        | "runtimeRunNewBusiness"
        | "runtimeIndex"
        | "rootIndex";
}): string {
    const header = `// ${toRepoRelative(args.filePath)}\n\n`;

    if (args.kind === "types") {
        return `${header}import type { PageActionContext } from "@businessLayer/pageActions";

export type BusinessJourneyContext = {
    pageActionContext: PageActionContext;
    logScope: string;
};

export type BusinessJourneyArgs<TPayload = Record<string, unknown>> = {
    context: BusinessJourneyContext;
    payload?: TPayload;
};

export type BusinessJourney<TPayload = Record<string, unknown>> = (
    args: BusinessJourneyArgs<TPayload>
) => Promise<void>;
`;
    }

    if (args.kind === "runJourney") {
        return `${header}export async function runJourney(args: {
    steps: Array<() => Promise<void>>;
}): Promise<void> {
    for (const step of args.steps) {
        await step();
    }
}
`;
    }

    if (args.kind === "frameworkIndex") {
        return `${header}export * from "./types";
export * from "./runJourney";
`;
    }

    if (args.kind === "runtimeResolveNewBusiness") {
        return `${header}import { AppError } from "@utils/errors";
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
`;
    }

    if (args.kind === "runtimeRunNewBusiness") {
        return `${header}import { createPageActionContext } from "@businessLayer/pageActions";
import type { ExecutionItemExecutor } from "@frameworkCore/executionLayer/core/registry";
import { resolveNewBusinessJourney } from "./resolveNewBusinessJourney";

export const runNewBusiness: ExecutionItemExecutor = async ({
    context,
    item,
    itemData,
}) => {
    const journey = resolveNewBusinessJourney(context.scenario);

    const logScope = [
        "businessJourney",
        context.scenario.platform,
        context.scenario.application,
        context.scenario.product,
        item.action,
    ].join(":");

    const pageActionContext = createPageActionContext({
        executionContext: context,
        source: "runNewBusiness",
        logScope,
    });

    await journey({
        context: {
            pageActionContext,
            logScope,
        },
        payload: itemData,
    });
};
`;
    }

    if (args.kind === "runtimeIndex") {
        return `${header}export * from "./resolveNewBusinessJourney";
export * from "./runNewBusiness";
`;
    }

    return `${header}export * from "./framework";
export * from "./runtime";
`;
}
