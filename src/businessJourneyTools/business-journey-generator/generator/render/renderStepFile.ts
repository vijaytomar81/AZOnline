// src/businessJourneyTools/business-journey-generator/generator/render/renderStepFile.ts

import { toRepoRelative } from "@utils/paths";
import { buildStepExportName } from "../naming/buildStepExportName";

export function renderStepFile(args: {
    filePath: string;
    stepName: string;
}): string {
    const exportName = buildStepExportName(args.stepName);

    return `// ${toRepoRelative(args.filePath)}

import type { JourneyStep } from "@businessJourneys/shared/types";

export const ${exportName}: JourneyStep = {
    stepKey: "${args.stepName}",
    run: async ({ context, data }) => {
        // TODO: wire matching pageAction here
        // TODO: refine payload source path here
        void context;
        void data;
    },
};
`;
}
