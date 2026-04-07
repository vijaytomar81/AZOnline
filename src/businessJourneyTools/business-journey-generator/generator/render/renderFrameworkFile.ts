// src/businessJourneyTools/business-journey-generator/generator/render/renderFrameworkFile.ts

import { toRepoRelative } from "@utils/paths";

export function renderFrameworkFile(args: {
    filePath: string;
    kind:
        | "shared-types"
        | "shared-logging"
        | "shared-index"
        | "runner-runJourneySteps"
        | "runner-runBusinessJourney"
        | "runner-index"
        | "registry-journeyRegistry"
        | "registry-index"
        | "root-index";
}): string {
    const header = `// ${toRepoRelative(args.filePath)}\n\n`;

    if (args.kind === "shared-types") {
        return `${header}export type BusinessJourneyRoute = {
    application: string;
    product: string;
    journey: string;
    entryPoint: string;
    startUrl: string;
};

export type BusinessJourneyContext = {
    page: any;
    pageActionContext: any;
    pageActions: typeof import("@pageActions");
    logScope: string;
};

export type JourneyStepArgs<TData = unknown> = {
    context: BusinessJourneyContext;
    route: BusinessJourneyRoute;
    data: TData;
};

export type JourneyStep<TData = unknown> = {
    stepKey: string;
    shouldRun?: (args: JourneyStepArgs<TData>) => boolean | Promise<boolean>;
    run: (args: JourneyStepArgs<TData>) => Promise<void>;
};

export type BusinessJourney<TData = unknown> = {
    journeyKey: string;
    matches: (args: {
        application: string;
        product: string;
        journey: string;
    }) => boolean;
    run: (args: {
        context: BusinessJourneyContext;
        route: BusinessJourneyRoute;
        data: TData;
    }) => Promise<void>;
};
`;
    }

    if (args.kind === "shared-logging") {
        return `${header}export function logBusinessJourneyInfo(args: {
    scope: string;
    message: string;
}) {
    console.log(\`[business-journey] [\${args.scope}] \${args.message}\`);
}
`;
    }

    if (args.kind === "shared-index") {
        return `${header}export * from "./types";
export * from "./logging";
`;
    }

    if (args.kind === "runner-runJourneySteps") {
        return `${header}import type { JourneyStep, JourneyStepArgs } from "../shared/types";

export async function runJourneySteps<TData>(args: {
    context: JourneyStepArgs<TData>["context"];
    route: JourneyStepArgs<TData>["route"];
    data: TData;
    steps: JourneyStep<TData>[];
}) {
    for (const step of args.steps) {
        const stepArgs: JourneyStepArgs<TData> = {
            context: args.context,
            route: args.route,
            data: args.data,
        };

        const shouldRun = step.shouldRun ? await step.shouldRun(stepArgs) : true;

        if (shouldRun) {
            await step.run(stepArgs);
        }
    }
}
`;
    }

    if (args.kind === "runner-runBusinessJourney") {
        return `${header}export async function runBusinessJourney() {
    // TODO: wire journey registry lookup here
}
`;
    }

    if (args.kind === "runner-index") {
        return `${header}export * from "./runJourneySteps";
export * from "./runBusinessJourney";
`;
    }

    if (args.kind === "registry-journeyRegistry") {
        return `${header}export const journeyRegistry = [];
`;
    }

    if (args.kind === "registry-index") {
        return `${header}export * from "./journeyRegistry";
`;
    }

    return `${header}export * from "./shared";
export * from "./runner";
export * from "./registry";
`;
}
