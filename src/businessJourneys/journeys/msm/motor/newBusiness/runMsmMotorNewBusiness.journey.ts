// src/businessJourneys/journeys/msm/motor/newBusiness/runMsmMotorNewBusiness.journey.ts

import { runJourneySteps } from "@businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessJourneys/shared/types";
import { buildMsmMotorNewBusinessSteps } from "./buildMsmMotorNewBusinessSteps";

export const runMsmMotorNewBusinessJourney: BusinessJourney = {
    journeyKey: "msm.motor.newBusiness",
    matches: ({ application, product, journey }) =>
        application === "msm" &&
        product === "motor" &&
        journey === "newBusiness",

    run: async ({ context, route, data }) => {
        const steps = buildMsmMotorNewBusinessSteps({
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
