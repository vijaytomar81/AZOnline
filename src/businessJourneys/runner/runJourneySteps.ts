// src/businessJourneys/runner/runJourneySteps.ts

import type { JourneyStep, JourneyStepArgs } from "../shared/types";

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
