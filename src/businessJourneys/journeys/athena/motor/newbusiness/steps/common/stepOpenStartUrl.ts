// src/businessJourneys/journeys/athena/motor/newBusiness/steps/common/stepOpenStartUrl.ts

import type { JourneyStep } from "@businessJourneys/shared/types";

export const stepOpenStartUrl: JourneyStep = {
    stepKey: "openStartUrl",
    run: async ({ context, route }) => {
        await context.page.goto(route.startUrl);
    },
};
