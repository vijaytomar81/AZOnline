// src/toolingLayer/businessJourneys/generator/generator/render/renderRunJourneyFile.ts

import { toRepoRelative } from "@utils/paths";
import type { JourneyTarget } from "../types";
import type { JourneyNames } from "../naming/buildJourneyNames";

export function renderRunJourneyFile(args: {
    filePath: string;
    target: JourneyTarget;
    names: JourneyNames;
}): string {
    return `// ${toRepoRelative(args.filePath)}

import { runJourneySteps } from "@businessLayer/businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessLayer/businessJourneys/shared/types";
import { ${args.names.buildStepsExportName} } from "./${args.names.buildStepsFileName.replace(".ts", "")}";

export const ${args.names.runExportName}: BusinessJourney = {
    journeyKey: "${args.target.application}.${args.target.product}.${args.target.journey}",
    matches: ({ application, product, journey }) =>
        application === "${args.target.application}" &&
        product === "${args.target.product}" &&
        journey === "${args.target.journey}",

    run: async ({ context, route, data }) => {
        const steps = ${args.names.buildStepsExportName}({
            entryPoint: route.entryPoint,
        });

        await runJourneySteps({
            context,
            route,
            data,
            steps,
        });
    },
};
`;
}
