// src/businessJourneys/journeys/ctm/motor/newBusiness/runCtmMotorNewBusiness.journey.ts

import { runJourneySteps } from "@businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessJourneys/shared/types";
import { buildCtmMotorNewBusinessSteps } from "./buildCtmMotorNewBusinessSteps";

export const runCtmMotorNewBusinessJourney: BusinessJourney = {
    journeyKey: "ctm.motor.newBusiness",
    matches: ({ application, product, journey }) =>
        application === "ctm" &&
        product === "motor" &&
        journey === "newBusiness",

    run: async ({ context, route, data }) => {
        const steps = buildCtmMotorNewBusinessSteps({
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
