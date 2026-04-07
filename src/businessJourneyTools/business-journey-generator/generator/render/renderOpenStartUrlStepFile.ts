// src/businessJourneyTools/business-journey-generator/generator/render/renderOpenStartUrlStepFile.ts

import { toRepoRelative } from "@utils/paths";

export function renderOpenStartUrlStepFile(filePath: string): string {
    return `// ${toRepoRelative(filePath)}

import type { JourneyStep } from "@businessJourneys/shared/types";

export const stepOpenStartUrl: JourneyStep = {
    stepKey: "openStartUrl",
    run: async ({ context, route }) => {
        await context.page.goto(route.startUrl);
    },
};
`;
}
